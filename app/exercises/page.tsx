"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Plus, Trash2, Edit, Clock, Dumbbell, ArrowLeft } from "lucide-react"
import { getExercises, deleteExercise, type Exercise } from "@/lib/data"
import Link from "next/link"

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isAnimating, setIsAnimating] = useState<string | null>(null)

  useEffect(() => {
    setExercises(getExercises())
  }, [])

  const handleDeleteExercise = (id: string) => {
    if (confirm("Are you sure you want to delete this exercise?")) {
      deleteExercise(id)
      setExercises(getExercises())
    }
  }

  const toggleAnimation = (exerciseId: string) => {
    setIsAnimating(isAnimating === exerciseId ? null : exerciseId)
  }

  const refreshExercises = () => {
    setExercises(getExercises())
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">Exercise Library</h1>
        <p className="text-xl text-muted-foreground font-medium">Manage your exercise collection</p>
      </div>

      {exercises.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Exercises Available</h3>
            <p className="text-muted-foreground mb-6">Create your first exercise to start building your library</p>
            <Link href="/create-exercise">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Exercise
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {exercises.length} exercises
              </Badge>
            </div>
            <Link href="/create-exercise">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-primary mb-1 font-bold text-lg">{exercise.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {exercise.description || "No description available"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Exercise Preview */}
                    <div className="relative aspect-square bg-muted/20 rounded-lg overflow-hidden border border-border">
                      {exercise.images.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Dumbbell className="h-8 w-8 opacity-50" />
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
                                isAnimating === exercise.id ? "frame-animation" : index === 0 ? "opacity-100" : "opacity-0"
                              }`}
                              style={
                                {
                                  animationDelay: `${index * (exercise.animationSpeed || 700)}ms`,
                                  "--frame-duration": `${exercise.animationSpeed || 700}ms`,
                                } as React.CSSProperties
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Exercise Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {exercise.duration}s</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Dumbbell className="h-4 w-4" />
                          <span>Rest: {exercise.restTime}s</span>
                        </div>
                      </div>
                      
                      {exercise.images.length > 1 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {exercise.images.length} frames
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleAnimation(exercise.id)}
                            className="text-xs"
                          >
                            {isAnimating === exercise.id ? (
                              <>
                                <Pause className="h-3 w-3 mr-1" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Preview
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/create-exercise?edit=${exercise.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 flex justify-center">
        <Link href="/create-exercise">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create New Exercise
          </Button>
        </Link>
      </div>
    </div>
  )
}

