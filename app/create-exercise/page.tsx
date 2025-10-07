"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Play, Pause } from "lucide-react"
import { saveExercise, getExerciseById, generateId, type Exercise } from "@/lib/data"
import { useRouter, useSearchParams } from "next/navigation"

function CreateExerciseForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [exerciseName, setExerciseName] = useState("")
  const [exerciseDescription, setExerciseDescription] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [previewRate, setPreviewRate] = useState(700)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [exerciseId, setExerciseId] = useState<string | null>(null)

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId) {
      const exercise = getExerciseById(editId)
      if (exercise) {
        setIsEditing(true)
        setExerciseId(editId)
        setExerciseName(exercise.name)
        setExerciseDescription(exercise.description || "")
        setImages(exercise.images)
        setPreviewRate(exercise.animationSpeed || 700)
      }
    }
  }, [searchParams])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  const handleSaveExercise = () => {
    const exerciseData: Exercise = {
      id: exerciseId || generateId(),
      name: exerciseName,
      description: exerciseDescription,
      images,
      duration: 30, // Default duration
      restTime: 10, // Default rest time
      animationSpeed: previewRate
    }
    
    saveExercise(exerciseData)
    alert(`Exercise ${isEditing ? 'updated' : 'saved'} successfully!`)
    router.push("/exercises")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">
          {isEditing ? 'Edit Exercise' : 'Create New Exercise'}
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          {isEditing ? 'Update your exercise with visual guides' : 'Design your custom exercise with visual guides'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exercise Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Exercise Details</CardTitle>
            <CardDescription className="font-medium">Basic information about your exercise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input
                id="exercise-name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="e.g., Diamond Push-ups"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="exercise-description">Description</Label>
              <Textarea
                id="exercise-description"
                value={exerciseDescription}
                onChange={(e) => setExerciseDescription(e.target.value)}
                placeholder="Describe how to perform this exercise..."
                className="mt-2"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="preview-rate">Animation Speed (ms)</Label>
              <Input
                id="preview-rate"
                type="number"
                min="100"
                max="2000"
                step="100"
                value={previewRate}
                onChange={(e) => setPreviewRate(Number.parseInt(e.target.value) || 700)}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Lower values = faster animation (100 = super fast, 700 = ideal)
              </p>
            </div>

            <div>
              <Label htmlFor="image-upload">Exercise Images</Label>
              <div className="mt-2">
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Upload 1 image for static or 2+ images for animation</p>
            </div>
          </CardContent>
        </Card>

        {/* Image Preview */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg flex items-center justify-between">
              Exercise Preview
              {images.length > 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleAnimation}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isAnimating ? "Pause" : "Play"} Animation
                </Button>
              )}
            </CardTitle>
            <CardDescription className="font-medium">Visual guide for your exercise</CardDescription>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No images uploaded yet</p>
                <p className="text-sm">Upload images to see the preview</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main Preview */}
                <div className="relative aspect-square bg-muted/20 rounded-lg overflow-hidden border border-border">
                  {images.length === 1 ? (
                    <img
                      src={images[0] || "/placeholder.svg"}
                      alt="Exercise preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Exercise frame ${index + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                            isAnimating ? "frame-animation" : index === 0 ? "opacity-100" : "opacity-0"
                          }`}
                          style={
                            {
                              animationDelay: `${index * previewRate}ms`,
                              "--frame-duration": `${previewRate}ms`,
                            } as React.CSSProperties
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Frame ${index + 1}`}
                        className="w-full aspect-square object-cover rounded border border-border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {images.length > 1 && (
                  <div className="text-center text-sm text-muted-foreground">
                    {images.length} frames • {previewRate}ms per cycle
                  </div>
                )}
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
          onClick={handleSaveExercise}
          disabled={!exerciseName || images.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isEditing ? 'Update Exercise' : 'Save Exercise'}
        </Button>
      </div>
    </div>
  )
}

export default function CreateExercisePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateExerciseForm />
    </Suspense>
  )
}
