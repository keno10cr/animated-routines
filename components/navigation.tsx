"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home, Plus, Dumbbell, Play, BarChart3, List, Calendar, Menu, X } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/routines", label: "Routines", icon: Calendar },
    { href: "/exercises", label: "Exercises", icon: List },
    { href: "/create-routine", label: "Create Routine", icon: Plus },
    { href: "/create-exercise", label: "Create Exercise", icon: Dumbbell },
    { href: "/execute-routine", label: "Execute Routine", icon: Play },
    { href: "/log", label: "Log", icon: BarChart3 },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-button')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Hamburger Menu Button - Mobile Only */}
      <Button
        className="fixed top-4 left-4 z-50 md:hidden hamburger-button bg-primary text-primary-foreground hover:bg-primary/90 w-10 h-10"
        size="sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <nav className={`
        fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border p-4 z-40
        mobile-menu
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen
        transition-transform duration-300 ease-in-out
      `}>
        <div className="mb-8 mt-16 md:mt-0">
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
    </>
  )
}
