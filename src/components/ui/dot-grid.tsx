"use client"

import { createContext, useContext } from "react"

type Theme = "light" | "dark"

const ThemeContext = createContext<Theme>("light")

export const ThemeProvider = ThemeContext.Provider

export function useThemeContext() {
  return useContext(ThemeContext)
}

interface DotGridProps {
  theme?: Theme
  spacing?: number
}

export default function DotGrid({ theme: themeProp, spacing = 20 }: DotGridProps) {
  const ctx = useThemeContext()
  const theme = themeProp || ctx
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(circle, ${theme === "light" ? "#d4d4d4" : "#333"} 1px, transparent 1px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
    />
  )
}
