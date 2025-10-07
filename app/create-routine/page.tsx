"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ChevronUp, ChevronDown, Clock, Timer, Dumbbell } from "lucide-react"
import { getExercises, saveRoutine, getRoutineById, generateId, type Exercise, type Routine } from "@/lib/data"
import { useRouter, useSearchParams } from "next/navigation"

interface RoutineExercise {
  id: string
  name: string
  duration: number
  restTime: number
  order: number
}

function CreateRoutineForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [routineName, setRoutineName] = useState("")
  const [routineDescription, setRoutineDescription] = useState("")
  const [sets, setSets] = useState(1)
  const [exercises, setExercises] = useState<RoutineExercise[]>([])
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])
  const [animatingExercise, setAnimatingExercise] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [routineId, setRoutineId] = useState<string | null>(null)

  useEffect(() => {
    setAvailableExercises(getExercises())
    
    // Check if routine ID is provided in URL for editing
    const editId = searchParams.get('edit')
    if (editId) {
      const routine = getRoutineById(editId)
      if (routine) {
        setIsEditing(true)
        setRoutineId(editId)
        setRoutineName(routine.name)
        setRoutineDescription(routine.description)
        setSets(routine.sets)
        setExercises(routine.exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          duration: ex.duration,
          restTime: ex.restTime,
          order: 0 // Will be set properly
        })))
      }
    }
  }, [searchParams])

  const addExercise = (exercise: Exercise) => {
    const newExercise: RoutineExercise = {
      id: generateId(),
      name: exercise.name,
      duration: exercise.duration,
      restTime: exercise.restTime,
      order: exercises.length,
    }
    setExercises([...exercises, newExercise])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const moveExercise = (id: string, direction: "up" | "down") => {
    const index = exercises.findIndex((ex) => ex.id === id)
    if ((direction === "up" && index > 0) || (direction === "down" && index < exercises.length - 1)) {
      const newExercises = [...exercises]
      const targetIndex = direction === "up" ? index - 1 : index + 1
      ;[newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]]
      setExercises(newExercises)
    }
  }

  const updateExercise = (id: string, field: "duration" | "restTime", value: number) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)))
  }

  const toggleExerciseAnimation = (exerciseId: string) => {
    setAnimatingExercise(animatingExercise === exerciseId ? null : exerciseId)
  }

  const handleSaveRoutine = () => {
    const routineData: Routine = {
      id: routineId || generateId(),
      name: routineName,
      description: routineDescription,
      sets,
      exercises: exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        duration: ex.duration,
        restTime: ex.restTime,
        images: availableExercises.find(ae => ae.name === ex.name)?.images || [],
        description: availableExercises.find(ae => ae.name === ex.name)?.description || "",
        animationSpeed: availableExercises.find(ae => ae.name === ex.name)?.animationSpeed || 700
      })),
      createdAt: isEditing ? getRoutineById(routineId!)?.createdAt || new Date().toISOString() : new Date().toISOString()
    }
    
    saveRoutine(routineData)
    alert(`Routine ${isEditing ? 'updated' : 'saved'} successfully!`)
    router.push("/routines")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">
          {isEditing ? 'Edit Routine' : 'Create New Routine'}
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          {isEditing ? 'Update your workout routine' : 'Build your perfect workout routine'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Routine Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Routine Details</CardTitle>
            <CardDescription className="font-medium">Basic information about your routine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="routine-name">Routine Name</Label>
              <Input
                id="routine-name"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="e.g., Morning Strength Training"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="routine-description">Description</Label>
              <Textarea
                id="routine-description"
                value={routineDescription}
                onChange={(e) => setRoutineDescription(e.target.value)}
                placeholder="Describe your routine..."
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="sets">Number of Sets</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(Number.parseInt(e.target.value) || 1)}
                className="mt-2"
              />
            </div>

            <div>
              <h4 className="font-bold mb-3 text-secondary text-lg">Add Exercises</h4>
              <div className="grid grid-cols-3 gap-3">
                {availableExercises.map((exercise) => (
                  <div key={exercise.id} className="border border-border rounded-lg p-2 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-foreground text-sm truncate">{exercise.name}</h5>
                      <div className="flex items-center gap-1">
                        {exercise.images.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleExerciseAnimation(exercise.id)}
                            className="text-xs h-5 px-1"
                          >
                            {animatingExercise === exercise.id ? "⏸" : "▶"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addExercise(exercise)}
                          className="text-xs h-5 px-1"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Exercise Preview - Square */}
                    <div className="relative aspect-square bg-muted/20 rounded border border-border overflow-hidden mb-2">
                      {exercise.images.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Dumbbell className="h-4 w-4 opacity-50" />
                        </div>
                      ) : exercise.images.length === 1 ? (
                        <img
                          src={exercise.images[0] || "/placeholder.svg"}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full relative">
                          {exercise.images.map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`${exercise.name} frame ${index + 1}`}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                                animatingExercise === exercise.id ? "exercise-animation" : index === 0 ? "opacity-100" : "opacity-0"
                              }`}
                              style={
                                {
                                  animationDelay: `${index * (exercise.animationSpeed || 700)}ms`,
                                  "--animation-duration": `${exercise.animationSpeed || 700}ms`,
                                } as React.CSSProperties
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {exercise.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {exercise.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Exercise List</CardTitle>
            <CardDescription className="font-medium">Configure your exercises</CardDescription>
          </CardHeader>
          <CardContent>
            {exercises.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No exercises added yet</p>
                <p className="text-sm">Add exercises from the left panel</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="p-4 rounded-lg bg-muted/20 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-foreground text-lg">{exercise.name}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveExercise(exercise.id, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveExercise(exercise.id, "down")}
                          disabled={index === exercises.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeExercise(exercise.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Duration (seconds)
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          value={exercise.duration}
                          onChange={(e) =>
                            updateExercise(exercise.id, "duration", Number.parseInt(e.target.value) || 30)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm flex items-center gap-2">
                          <Timer className="h-4 w-4" />
                          Rest (seconds)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={exercise.restTime}
                          onChange={(e) =>
                            updateExercise(exercise.id, "restTime", Number.parseInt(e.target.value) || 10)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveRoutine}
          disabled={!routineName || exercises.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isEditing ? 'Update Routine' : 'Save Routine'}
        </Button>
      </div>
    </div>
  )
}

export default function CreateRoutinePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateRoutineForm />
    </Suspense>
  )
}
