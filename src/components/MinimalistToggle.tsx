"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function MinimalistToggle() {
  const { minimalist, toggleMinimalist } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMinimalist}
      title={minimalist ? "Modo normal" : "Modo minimalista"}
    >
      {minimalist ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
