"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Dumbbell, TrendingUp, Filter } from "lucide-react"
import { getWorkoutLogs, type WorkoutLog } from "@/lib/data"

export default function LogPage() {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all")
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])

  useEffect(() => {
    setWorkoutLogs(getWorkoutLogs())
  }, [])

  // Mock workout log data for demo (will be replaced by actual data)
  const mockWorkoutLogs: WorkoutLog[] = [
    {
      id: "1",
      routineName: "Morning Strength",
      date: "2024-01-15",
      duration: "45 min",
      sets: 3,
      exercises: ["Push-ups", "Squats", "Plank", "Burpees"],
      completed: true,
    },
    {
      id: "2",
      routineName: "HIIT Cardio",
      date: "2024-01-14",
      duration: "30 min",
      sets: 4,
      exercises: ["Jumping Jacks", "Mountain Climbers", "High Knees"],
      completed: true,
    },
    {
      id: "3",
      routineName: "Full Body Workout",
      date: "2024-01-13",
      duration: "25 min",
      sets: 2,
      exercises: ["Push-ups", "Squats", "Lunges", "Sit-ups", "Pull-ups"],
      completed: false,
    },
    {
      id: "4",
      routineName: "Morning Strength",
      date: "2024-01-12",
      duration: "45 min",
      sets: 3,
      exercises: ["Push-ups", "Squats", "Plank", "Burpees"],
      completed: true,
    },
    {
      id: "5",
      routineName: "Quick Cardio",
      date: "2024-01-11",
      duration: "20 min",
      sets: 3,
      exercises: ["Jumping Jacks", "Burpees", "High Knees"],
      completed: true,
    },
  ]

  // Use actual logs if available, otherwise show mock data
  const displayLogs = workoutLogs.length > 0 ? workoutLogs : mockWorkoutLogs
  
  const filteredLogs = displayLogs.filter((log) => {
    if (filter === "completed") return log.completed
    if (filter === "incomplete") return !log.completed
    return true
  })

  const stats = {
    totalWorkouts: displayLogs.length,
    completedWorkouts: displayLogs.filter((log) => log.completed).length,
    totalTime: displayLogs.reduce((acc, log) => {
      const minutes = Number.parseInt(log.duration.split(" ")[0])
      return acc + minutes
    }, 0),
    thisWeek: displayLogs.filter((log) => {
      const logDate = new Date(log.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return logDate >= weekAgo
    }).length,
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">Workout Log</h1>
        <p className="text-xl text-muted-foreground font-medium">Track your fitness journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Workouts</p>
                <p className="text-3xl font-bold text-primary">{stats.totalWorkouts}</p>
              </div>
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold text-accent">{stats.completedWorkouts}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Time</p>
                <p className="text-3xl font-bold text-secondary">{Math.round(stats.totalTime / 60)}h</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Week</p>
                <p className="text-3xl font-bold text-primary">{stats.thisWeek}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Log */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary font-bold text-lg">Workout History</CardTitle>
              <CardDescription>Your complete workout log</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "bg-primary text-primary-foreground" : ""}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === "completed" ? "default" : "outline"}
                  onClick={() => setFilter("completed")}
                  className={filter === "completed" ? "bg-accent text-accent-foreground" : ""}
                >
                  Completed
                </Button>
                <Button
                  size="sm"
                  variant={filter === "incomplete" ? "default" : "outline"}
                  onClick={() => setFilter("incomplete")}
                  className={filter === "incomplete" ? "bg-destructive text-destructive-foreground" : ""}
                >
                  Incomplete
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No workouts found</p>
              <p className="text-sm">Start your first routine to see logs here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{log.routineName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(log.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {log.duration}
                        </span>
                        <span>{log.sets} sets</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={log.completed ? "default" : "destructive"}
                        className={
                          log.completed
                            ? "bg-accent text-accent-foreground"
                            : "bg-destructive text-destructive-foreground"
                        }
                      >
                        {log.completed ? "Completed" : "Incomplete"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{getTimeAgo(log.date)}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Exercises:</p>
                    <div className="flex flex-wrap gap-2">
                      {log.exercises.map((exercise, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {exercise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
