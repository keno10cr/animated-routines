"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Clock, Dumbbell, Play, ArrowUp, ArrowDown } from "lucide-react"
import { getRoutines, deleteRoutine, type Routine } from "@/lib/data"
import Link from "next/link"

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([])

  useEffect(() => {
    setRoutines(getRoutines())
  }, [])

  const handleDeleteRoutine = (id: string) => {
    if (confirm("Are you sure you want to delete this routine?")) {
      deleteRoutine(id)
      setRoutines(getRoutines())
    }
  }

  const refreshRoutines = () => {
    setRoutines(getRoutines())
  }

  const formatDuration = (routine: Routine) => {
    const totalDuration = routine.exercises.reduce((acc, ex) => acc + ex.duration + ex.restTime, 0) * routine.sets
    const minutes = Math.round(totalDuration / 60)
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const getLastUsedText = (routine: Routine) => {
    if (!routine.lastUsed) return "Never used"
    const lastUsed = new Date(routine.lastUsed)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - lastUsed.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">Routine Library</h1>
        <p className="text-xl text-muted-foreground font-medium">Manage your workout routines</p>
      </div>

      {routines.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Routines Available</h3>
            <p className="text-muted-foreground mb-6">Create your first routine to start working out</p>
            <Link href="/create-routine">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Routine
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {routines.length} routines
              </Badge>
            </div>
            <Link href="/create-routine">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Routine
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <Card key={routine.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-primary mb-1 font-bold text-lg">{routine.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {routine.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRoutine(routine.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Routine Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Dumbbell className="h-4 w-4" />
                        <span>{routine.exercises.length} exercises</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{routine.sets} sets</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Duration: </span>
                      <span>{formatDuration(routine)}</span>
                    </div>

                    {/* Last Used */}
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Last used: </span>
                      <span>{getLastUsedText(routine)}</span>
                    </div>

                    {/* Exercise List */}
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Exercises:</p>
                      <div className="space-y-1">
                        {routine.exercises.map((exercise, index) => (
                          <div key={exercise.id} className="flex items-center justify-between text-xs bg-muted/20 px-2 py-1 rounded">
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              {exercise.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs">{exercise.duration}s</span>
                              <span className="text-xs text-muted-foreground">+{exercise.restTime}s</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/create-routine?edit=${routine.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/execute-routine?routine=${routine.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                          <Play className="h-4 w-4 mr-2" />
                          Start
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
        <Link href="/create-routine">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create New Routine
          </Button>
        </Link>
      </div>
    </div>
  )
}
