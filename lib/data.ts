// Data persistence utilities for routines and exercises

export interface Exercise {
  id: string
  name: string
  duration: number
  restTime: number
  images: string[]
  description?: string
  animationSpeed?: number
}

export interface Routine {
  id: string
  name: string
  description: string
  sets: number
  exercises: Exercise[]
  createdAt: string
  lastUsed?: string
}

export interface WorkoutLog {
  id: string
  routineId: string
  routineName: string
  date: string
  duration: string
  sets: number
  exercises: string[]
  completed: boolean
}

// Storage keys
const ROUTINES_KEY = 'animated-routines-routines'
const EXERCISES_KEY = 'animated-routines-exercises'
const LOGS_KEY = 'animated-routines-logs'

// Default exercises
const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Leg Pull at Back',
    duration: 30,
    restTime: 10,
    images: ['/exercises/1.jpg', '/exercises/11.jpg'],
    description: 'Stretching exercise for the back of the legs - perform on both sides',
    animationSpeed: 1000
  },
  {
    id: '2',
    name: 'Stretch to the Side',
    duration: 30,
    restTime: 10,
    images: ['/exercises/2.jpg', '/exercises/22.jpg'],
    description: 'Side stretching exercise for flexibility - perform on both sides',
    animationSpeed: 1000
  },
  {
    id: '3',
    name: 'Leg Up at Front',
    duration: 30,
    restTime: 10,
    images: ['/exercises/3.jpg', '/exercises/33.jpg'],
    description: 'Front leg stretching exercise - perform on both sides',
    animationSpeed: 1000
  },
  {
    id: '4',
    name: 'Down Legs Open',
    duration: 45,
    restTime: 15,
    images: ['/exercises/4.jpg', '/exercises/44.jpg'],
    description: 'Deep stretch with legs open - stretch well and hold position',
    animationSpeed: 1500
  },
  {
    id: '5',
    name: 'Calf Stretch',
    duration: 30,
    restTime: 10,
    images: ['/exercises/5.jpg', '/exercises/55.jpg'],
    description: 'Calf muscle stretching exercise - perform on both sides',
    animationSpeed: 1000
  },
  {
    id: '6',
    name: 'Touch Fingers',
    duration: 30,
    restTime: 10,
    images: ['/exercises/6.jpg', '/exercises/66.jpg'],
    description: 'Forward bend stretch - reach all the way down with your fingers',
    animationSpeed: 1000
  },
  {
    id: '7',
    name: 'Single Leg Down',
    duration: 30,
    restTime: 10,
    images: ['/exercises/7.jpg', '/exercises/77.jpg'],
    description: 'Single leg stretching exercise - perform on both sides',
    animationSpeed: 1000
  },
  {
    id: '8',
    name: 'Core Side Stretch',
    duration: 30,
    restTime: 10,
    images: ['/exercises/8.jpg', '/exercises/88.jpg'],
    description: 'Core and side stretching exercise - use weight or resistance band for added intensity',
    animationSpeed: 1000
  }
]

// Default routine
const DEFAULT_ROUTINE: Routine = {
  id: '1',
  name: 'Morning Stretch',
  description: 'A complete morning stretching routine for flexibility and mobility',
  sets: 3,
  exercises: DEFAULT_EXERCISES,
  createdAt: new Date().toISOString(),
  lastUsed: new Date().toISOString()
}

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// Routines
export function getRoutines(): Routine[] {
  const routines = getFromStorage(ROUTINES_KEY, [DEFAULT_ROUTINE])
  return routines
}

export function saveRoutine(routine: Routine): void {
  const routines = getRoutines()
  const existingIndex = routines.findIndex(r => r.id === routine.id)
  
  if (existingIndex >= 0) {
    routines[existingIndex] = routine
  } else {
    routines.push(routine)
  }
  
  saveToStorage(ROUTINES_KEY, routines)
}

export function deleteRoutine(id: string): void {
  const routines = getRoutines()
  const filtered = routines.filter(r => r.id !== id)
  saveToStorage(ROUTINES_KEY, filtered)
}

export function getRoutineById(id: string): Routine | null {
  const routines = getRoutines()
  return routines.find(r => r.id === id) || null
}

// Exercises
export function getExercises(): Exercise[] {
  return getFromStorage(EXERCISES_KEY, DEFAULT_EXERCISES)
}

export function saveExercise(exercise: Exercise): void {
  const exercises = getExercises()
  const existingIndex = exercises.findIndex(e => e.id === exercise.id)
  
  if (existingIndex >= 0) {
    exercises[existingIndex] = exercise
  } else {
    exercises.push(exercise)
  }
  
  saveToStorage(EXERCISES_KEY, exercises)
}

export function deleteExercise(id: string): void {
  const exercises = getExercises()
  const filtered = exercises.filter(e => e.id !== id)
  saveToStorage(EXERCISES_KEY, filtered)
}

export function getExerciseById(id: string): Exercise | null {
  const exercises = getExercises()
  return exercises.find(e => e.id === id) || null
}

// Workout Logs
export function getWorkoutLogs(): WorkoutLog[] {
  return getFromStorage(LOGS_KEY, [])
}

export function saveWorkoutLog(log: WorkoutLog): void {
  const logs = getWorkoutLogs()
  logs.push(log)
  saveToStorage(LOGS_KEY, logs)
}

export function updateRoutineLastUsed(routineId: string): void {
  const routines = getRoutines()
  const routine = routines.find(r => r.id === routineId)
  if (routine) {
    routine.lastUsed = new Date().toISOString()
    saveToStorage(ROUTINES_KEY, routines)
  }
}

// Utility functions
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

