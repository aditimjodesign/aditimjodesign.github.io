import { useId } from "react"
import type { SimpleIcon } from "simple-icons"

type LogoProps = { className?: string }

// Single-colour brand mark from the simple-icons set, in the brand's colour.
export function SimpleIconLogo({ icon, className }: LogoProps & { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={`#${icon.hex}`} aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  )
}

// Four-point sparkle with Google's gradient, after the Gemini app icon.
export function GeminiLogo({ className }: LogoProps) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EA4335" />
          <stop offset="0.3" stopColor="#FBBC04" />
          <stop offset="0.5" stopColor="#34A853" />
          <stop offset="0.72" stopColor="#4285F4" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 1.5c.4 5.6 4.9 10.1 10.5 10.5-5.6.4-10.1 4.9-10.5 10.5C11.6 16.9 7.1 12.4 1.5 12 7.1 11.6 11.6 7.1 12 1.5Z"
      />
    </svg>
  )
}

// Rounded arch with a Google-coloured crest, after the Antigravity app icon.
export function AntigravityLogo({ className }: LogoProps) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="12" y1="3.5" x2="12" y2="20.5" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EA4335" />
          <stop offset="0.14" stopColor="#FBBC04" />
          <stop offset="0.26" stopColor="#34A853" />
          <stop offset="0.42" stopColor="#4285F4" />
          <stop offset="1" stopColor="#4285F4" />
        </linearGradient>
      </defs>
      <path
        d="M3.4 20.4C6.2 20.4 8 5.2 12 5.2s5.8 15.2 8.6 15.2"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="4.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
