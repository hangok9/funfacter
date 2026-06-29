"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ThemeContextType = {
  minimalist: boolean
  toggleMinimalist: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [minimalist, setMinimalist] = useState(false)

  const toggleMinimalist = () => setMinimalist((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ minimalist, toggleMinimalist }}>
      <div className={minimalist ? "minimalist-mode" : ""}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
