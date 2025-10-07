"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Dumbbell, Play, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { getRoutines, getWorkoutLogs, formatDuration, type Routine } from "@/lib/data"

export default function HomePage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    setRoutines(getRoutines())
    setLogs(getWorkoutLogs())
  }, [])

  const stats = [
    { 
      label: "Total Routines", 
      value: routines.length.toString(), 
      icon: Dumbbell, 
      color: "text-accent" 
    },
    { 
      label: "Exercises Created", 
      value: routines.reduce((acc, r) => acc + r.exercises.length, 0).toString(), 
      icon: Plus, 
      color: "text-secondary" 
    },
    { 
      label: "Workouts Completed", 
      value: logs.filter(log => log.completed).length.toString(), 
      icon: Play, 
      color: "text-primary" 
    },
    { 
      label: "This Week", 
      value: logs.filter(log => {
        const logDate = new Date(log.date)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return logDate >= weekAgo && log.completed
      }).length.toString(), 
      icon: TrendingUp, 
      color: "text-accent" 
    },
  ]

  const recentRoutines = routines
    .sort((a, b) => new Date(b.lastUsed || b.createdAt).getTime() - new Date(a.lastUsed || a.createdAt).getTime())
    .slice(0, 3)
    .map(routine => {
      const totalDuration = routine.exercises.reduce((acc, ex) => acc + ex.duration + ex.restTime, 0) * routine.sets
      const lastUsed = routine.lastUsed ? new Date(routine.lastUsed) : null
      const daysAgo = lastUsed ? Math.floor((Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24)) : null
      
      return {
        id: routine.id,
        name: routine.name,
        exercises: routine.exercises.length,
        duration: formatDuration(Math.round(totalDuration / 60)),
        lastCompleted: daysAgo === null ? "Never" : daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`
      }
    })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">Welcome Back!</h1>
        <p className="text-xl text-muted-foreground font-medium">Ready to build discipline frame by frame?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Quick Actions</CardTitle>
            <CardDescription className="font-medium">Get started with your workout routine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/routines">
              <Button className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-5 w-5" />
                Manage Routines
              </Button>
            </Link>
            <Link href="/create-exercise">
              <Button variant="secondary" className="w-full justify-start gap-3">
                <Dumbbell className="h-5 w-5" />
                Add New Exercise
              </Button>
            </Link>
            <Link href="/execute-routine">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                <Play className="h-5 w-5" />
                Start Workout
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Routines */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Recent Routines</CardTitle>
            <CardDescription className="font-medium">Your most used workout routines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRoutines.map((routine, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border"
                >
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{routine.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {routine.exercises} exercises • {routine.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{routine.lastCompleted}</p>
                    <Link href={`/execute-routine?routine=${routine.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-secondary hover:text-secondary-foreground hover:bg-secondary"
                      >
                        Start
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
