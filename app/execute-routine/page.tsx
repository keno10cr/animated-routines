"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, SkipForward, RotateCcw, CheckCircle, ArrowLeft, Clock, Dumbbell, PlayCircle, PauseCircle } from "lucide-react"
import { getRoutines, getRoutineById, updateRoutineLastUsed, type Routine, type Exercise } from "@/lib/data"
import { playStartSound, playCompleteSound, playHalfwaySound, playDoneSound } from "@/lib/sounds"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function ExecuteRoutineForm() {
  const searchParams = useSearchParams()
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null)
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [routines, setRoutines] = useState<Routine[]>([])

  useEffect(() => {
    setRoutines(getRoutines())
    
    // Check if routine ID is provided in URL
    const routineParam = searchParams.get('routine')
    if (routineParam) {
      setSelectedRoutineId(routineParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (selectedRoutineId) {
      const selectedRoutine = getRoutineById(selectedRoutineId)
      setRoutine(selectedRoutine)
    }
  }, [selectedRoutineId])

  const [currentSet, setCurrentSet] = useState(1)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [animationPlaying, setAnimationPlaying] = useState(true)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [halfwaySoundPlayed, setHalfwaySoundPlayed] = useState(false)
  const [isCountdownActive, setIsCountdownActive] = useState(false)
  const [countdownNumber, setCountdownNumber] = useState(0)
  const [restImages, setRestImages] = useState<string[]>([])
  const [isWaitingForStartSound, setIsWaitingForStartSound] = useState(false)
  const [startSoundPlayed, setStartSoundPlayed] = useState(false)
  const [isHalfwayPaused, setIsHalfwayPaused] = useState(false)

  const currentExercise = routine?.exercises[currentExerciseIndex]
  const totalExercises = routine?.exercises.length || 0
  const totalSets = routine?.sets || 0

  useEffect(() => {
    if (currentExercise && !isCompleted) {
      setTimeRemaining(isResting ? currentExercise.restTime : currentExercise.duration)
      // Reset halfway sound flag when starting a new exercise (not during rest)
      if (!isResting) {
        setHalfwaySoundPlayed(false)
      }
      // Reset start sound flag when starting a new exercise
      if (!isResting) {
        setStartSoundPlayed(false)
      }
    }
    // Set rest images
    setRestImages(['/exercises/1rest.jpg', '/exercises/2rest.jpg'])
  }, [currentExerciseIndex, isResting, currentExercise, isCompleted])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeRemaining > 0 && !isHalfwayPaused) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          // Play start sound 4 seconds before exercise starts (during rest)
          if (isResting && time === 4 && !startSoundPlayed) {
            // Only play if there's a next exercise (not the last rest)
            const hasNextExercise = currentExerciseIndex < totalExercises - 1 || currentSet < totalSets
            if (hasNextExercise) {
              playStartSound()
              setStartSoundPlayed(true)
            }
          }
          
          // Play halfway sound exactly at halfway point and pause timer
          if (!isResting && currentExercise && !halfwaySoundPlayed) {
            const exerciseDuration = currentExercise.duration
            const halfwayPoint = Math.ceil(exerciseDuration / 2)
            if (time === halfwayPoint) {
              playHalfwaySound()
              setHalfwaySoundPlayed(true)
              setIsHalfwayPaused(true)
              // Resume timer after 3 seconds (assuming half.mp3 is ~3 seconds)
              setTimeout(() => {
                setIsHalfwayPaused(false)
              }, 3000)
              return time // Don't decrement this second
            }
          }
          
          if (time <= 1) {
            handleTimerComplete()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining, isResting, currentExercise, halfwaySoundPlayed, startSoundPlayed, isHalfwayPaused])

  const handleTimerComplete = () => {
    if (isResting) {
      // Rest period complete, move to next exercise
      setIsResting(false)
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setCurrentFrameIndex(0)
        setStartSoundPlayed(false) // Reset for next exercise
      } else if (currentSet < totalSets) {
        setCurrentSet(currentSet + 1)
        setCurrentExerciseIndex(0)
        setCurrentFrameIndex(0)
        setStartSoundPlayed(false) // Reset for next set
      } else {
        // Routine complete
        playCompleteSound()
        setIsCompleted(true)
        setIsActive(false)
      }
    } else {
      // Exercise complete, play done sound and start rest period
      playDoneSound()
      if (currentExerciseIndex < totalExercises - 1 || currentSet < totalSets) {
        setIsResting(true)
        setStartSoundPlayed(false) // Reset for next exercise
      } else {
        // Last exercise of last set
        playCompleteSound()
        setIsCompleted(true)
        setIsActive(false)
      }
    }
  }

  const startCountdown = () => {
    setIsCountdownActive(true)
    setCountdownNumber(3)
    
    // Play countdown with 3, 2, 1, GO!
    const countdownInterval = setInterval(() => {
      setCountdownNumber((prev) => {
        if (prev === 1) {
          // Show "GO!" for 1 second
          setTimeout(() => {
            setIsCountdownActive(false)
            // Move to next exercise or set
            if (currentExerciseIndex < totalExercises - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1)
              setCurrentFrameIndex(0)
            } else if (currentSet < totalSets) {
              setCurrentSet(currentSet + 1)
              setCurrentExerciseIndex(0)
              setCurrentFrameIndex(0)
            } else {
              playCompleteSound()
              setIsCompleted(true)
              setIsActive(false)
            }
          }, 1000)
          return 0 // GO!
        }
        return prev - 1
      })
    }, 1000)
    
    // Clear interval after countdown
    setTimeout(() => {
      clearInterval(countdownInterval)
    }, 4000)
  }

  const toggleTimer = () => {
    if (!isActive) {
      // Starting the timer
      if (currentExerciseIndex === 0 && currentSet === 1 && !isResting) {
        // First exercise - play start sound and wait for it to finish
        setIsWaitingForStartSound(true)
        playStartSound()
        setStartSoundPlayed(true)
        
        // Wait for start sound to finish (assuming ~3 seconds) then start timer
        setTimeout(() => {
          setIsWaitingForStartSound(false)
          setIsActive(true)
        }, 3000) // Adjust this duration based on your start.mp3 length
      } else {
        // Subsequent exercises or rest periods
        setIsActive(true)
      }
    } else {
      setIsActive(false)
    }
  }

  const skipCurrent = () => {
    handleTimerComplete()
  }

  const resetRoutine = () => {
    setCurrentSet(1)
    setCurrentExerciseIndex(0)
    setIsResting(false)
    setIsActive(false)
    setIsCompleted(false)
    setAnimationPlaying(true)
    setCurrentFrameIndex(0) // Reset frame index when resetting routine
    setHalfwaySoundPlayed(false) // Reset halfway sound flag
    setIsCountdownActive(false) // Reset countdown state
    setCountdownNumber(0) // Reset countdown number
    setIsWaitingForStartSound(false) // Reset start sound waiting state
    setStartSoundPlayed(false) // Reset start sound played flag
    setIsHalfwayPaused(false) // Reset halfway pause state
    if (routine?.exercises[0]) {
      setTimeRemaining(routine.exercises[0].duration)
    }
  }

  const toggleAnimation = () => {
    setAnimationPlaying(!animationPlaying)
  }

  // Handle frame cycling animation
  useEffect(() => {
    if (!isActive || !animationPlaying) {
      return;
    }

    const images = isResting ? restImages : currentExercise?.images;
    if (!images || images.length === 0) {
      return;
    }

    const frameDuration = isResting ? 1000 : (currentExercise?.animationSpeed || 700);
    const interval = setInterval(() => {
      setCurrentFrameIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      );
    }, frameDuration);

    return () => clearInterval(interval);
  }, [isActive, isResting, animationPlaying, currentExercise?.images.length, currentExercise?.animationSpeed, restImages.length]);

  const startRoutine = (routineId: string) => {
    setSelectedRoutineId(routineId)
    updateRoutineLastUsed(routineId)
  }

  const backToSelection = () => {
    setSelectedRoutineId(null)
    setRoutine(null)
    setCurrentSet(1)
    setCurrentExerciseIndex(0)
    setIsResting(false)
    setIsActive(false)
    setIsCompleted(false)
    setCurrentFrameIndex(0) // Reset frame index when going back to selection
    setIsCountdownActive(false) // Reset countdown state
    setCountdownNumber(0) // Reset countdown number
    setIsWaitingForStartSound(false) // Reset start sound waiting state
    setStartSoundPlayed(false) // Reset start sound played flag
    setIsHalfwayPaused(false) // Reset halfway pause state
  }

  // Show routine selection if no routine is selected
  if (!selectedRoutineId || !routine) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-primary mb-2">Start Workout</h1>
          <p className="text-xl text-muted-foreground font-medium">Choose a routine to begin your workout</p>
        </div>

        {routines.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Routines Available</h3>
              <p className="text-muted-foreground mb-6">Create your first routine to start working out</p>
              <Link href="/create-routine">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Routine
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <Card key={routine.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-primary font-bold text-lg">{routine.name}</CardTitle>
                  <CardDescription>{routine.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Dumbbell className="h-4 w-4" />
                      <span>{routine.exercises.length} exercises</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{routine.sets} sets</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Exercises:</p>
                      <div className="flex flex-wrap gap-1">
                        {routine.exercises.slice(0, 3).map((exercise, index) => (
                          <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                            {exercise.name}
                          </span>
                        ))}
                        {routine.exercises.length > 3 && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            +{routine.exercises.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => startRoutine(routine.id)}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/create-routine">
            <Button variant="outline">
              <Dumbbell className="h-4 w-4 mr-2" />
              Create New Routine
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalExercisesInRoutine = totalSets * totalExercises
    const completedExercises = (currentSet - 1) * totalExercises + currentExerciseIndex + (isResting ? 1 : 0)
    return (completedExercises / totalExercisesInRoutine) * 100
  }

  if (isCompleted) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-card border-border">
            <CardContent className="p-12">
              <CheckCircle className="h-24 w-24 text-accent mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-primary mb-4">Routine Complete!</h1>
              <p className="text-xl text-muted-foreground mb-6">Great job completing "{routine.name}"</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{totalSets}</p>
                  <p className="text-sm text-muted-foreground">Sets</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{totalExercises}</p>
                  <p className="text-sm text-muted-foreground">Exercises</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {Math.round((totalSets * totalExercises * 45) / 60)}
                  </p>
                  <p className="text-sm text-muted-foreground">Minutes</p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetRoutine} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Do Again
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={backToSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Routines
          </Button>
        </div>
        <h1 className="text-4xl font-black text-primary mb-2">{routine.name}</h1>
        <p className="text-xl text-muted-foreground">
          Set {currentSet} of {totalSets}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(getProgress())}%</span>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exercise Display */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isResting ? "Rest Time" : currentExercise.name}
                {!isResting && currentExercise.images.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleAnimation}
                      className="h-6 w-6 p-0"
                    >
                      {animationPlaying ? (
                        <PauseCircle className="h-4 w-4 text-accent" />
                      ) : (
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {animationPlaying ? "Playing" : "Paused"}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Exercise {currentExerciseIndex + 1} of {totalExercises}
              </span>
            </CardTitle>
            <CardDescription>
              {isResting ? "Take a break before the next exercise" : "Follow the animation guide"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isResting && currentExercise && currentExercise.images.length > 0 && (
              <div className="relative aspect-square bg-muted/20 rounded-lg overflow-hidden border border-border mb-6">
                {currentExercise.images.length === 1 ? (
                  <img
                    src={currentExercise.images[0] || "/placeholder.svg"}
                    alt={currentExercise.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full relative">
                    {currentExercise?.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${currentExercise?.name || 'Exercise'} frame ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                          isActive && !isResting && animationPlaying 
                            ? (index === currentFrameIndex ? "opacity-100" : "opacity-0")
                            : index === 0 ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {isResting && (
              <div className="relative aspect-square bg-muted/20 rounded-lg overflow-hidden border border-border mb-6">
                <div className="w-full h-full relative">
                  {restImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Rest frame ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                        isActive && isResting && animationPlaying 
                          ? (index === currentFrameIndex % restImages.length ? "opacity-100" : "opacity-0")
                          : index === 0 ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                  {isCountdownActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-8xl font-bold text-white">
                        {countdownNumber === 0 ? 'GO!' : countdownNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {isResting && !isCountdownActive && (
              <div className="text-center py-4">
                <p className="text-lg text-muted-foreground">Rest and prepare for the next exercise</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timer and Controls */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary font-bold text-lg">Timer</CardTitle>
            <CardDescription>{isResting ? "Rest period" : `${currentExercise?.duration || 0} seconds`}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-8">
              <div className="text-8xl font-bold mb-4">
                {isWaitingForStartSound ? (
                  <span className="text-primary">Get Ready!</span>
                ) : isHalfwayPaused ? (
                  <span className="text-accent">Half TIME!</span>
                ) : (
                  <span className="text-primary">{formatTime(timeRemaining)}</span>
                )}
              </div>
              <div className="text-lg text-muted-foreground">
                {isWaitingForStartSound ? "Starting soon..." : isHalfwayPaused ? "Change position" : (isResting ? "Rest Time" : "Exercise Time")}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <Button
                size="lg"
                onClick={toggleTimer}
                className={`${
                  isActive
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : "bg-accent text-accent-foreground hover:bg-accent/90"
                }`}
              >
                {isWaitingForStartSound ? (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Starting...
                  </>
                ) : isActive ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </>
                )}
              </Button>

              <Button size="lg" variant="outline" onClick={skipCurrent}>
                <SkipForward className="h-5 w-5 mr-2" />
                Skip
              </Button>
            </div>

            {/* Up Next Preview */}
            {(() => {
              const nextExercise = (currentExerciseIndex < totalExercises - 1 || currentSet < totalSets)
                ? (currentExerciseIndex < totalExercises - 1 
                    ? routine?.exercises[currentExerciseIndex + 1]
                    : routine?.exercises[0])
                : null;

              return nextExercise ? (
                <div className="mt-6 flex justify-center">
                  <div className="p-6 bg-muted/20 rounded-lg border border-border max-w-md w-full">
                    <h4 className="text-lg font-semibold text-muted-foreground mb-4 text-center">Up Next</h4>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-full aspect-square bg-muted/20 rounded-lg overflow-hidden border border-border max-w-xs">
                        {nextExercise.images.length === 1 ? (
                          <img
                            src={nextExercise.images[0] || "/placeholder.svg"}
                            alt={nextExercise.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full relative">
                            {nextExercise.images.map((image, index) => (
                              <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`${nextExercise.name} frame ${index + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                                  index === 0 ? "opacity-100" : "opacity-0"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h5 className="font-semibold text-base">{nextExercise.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {nextExercise.duration}s • {nextExercise.restTime}s rest
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Exercise List */}
      <Card className="bg-card border-border mt-8">
        <CardHeader>
          <CardTitle className="text-primary font-bold text-lg">Exercise List</CardTitle>
          <CardDescription>Today's workout routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routine.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`p-4 rounded-lg border transition-colors ${
                  index === currentExerciseIndex && !isResting
                    ? "bg-primary/20 border-primary"
                    : index < currentExerciseIndex || (index === currentExerciseIndex && isResting)
                      ? "bg-accent/20 border-accent"
                      : "bg-muted/20 border-border"
                }`}
              >
                <h4 className="font-bold mb-2 text-lg">{exercise.name}</h4>
                <div className="text-sm text-muted-foreground">
                  <p>
                    {exercise.duration}s work • {exercise.restTime}s rest
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ExecuteRoutinePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExecuteRoutineForm />
    </Suspense>
  )
}
