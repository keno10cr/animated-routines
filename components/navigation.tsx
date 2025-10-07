"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Plus, Dumbbell, Play, BarChart3, List, Calendar } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/routines", label: "Routines", icon: Calendar },
    { href: "/exercises", label: "Exercises", icon: List },
    { href: "/create-routine", label: "Create Routine", icon: Plus },
    { href: "/create-exercise", label: "Create Exercise", icon: Dumbbell },
    { href: "/execute-routine", label: "Execute Routine", icon: Play },
    { href: "/log", label: "Log", icon: BarChart3 },
  ]

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-primary mb-1">Animated Routines</h1>
        <p className="text-sm text-muted-foreground font-medium">Discipline Frame by Frame</p>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
