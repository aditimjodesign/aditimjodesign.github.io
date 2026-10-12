import React, { useEffect, useRef } from "react"

interface GlowCursorProps {
  color?: string
  secondaryColor?: string
  trailLength?: number
  trailWidth?: number
  trailTaper?: number
  followSpeed?: number
  glowIntensity?: number
  glowSpread?: number
  hotspot?: number
  brightness?: number
  opacity?: number
  pulseSpeed?: number
  noiseStrength?: number
  idleFade?: boolean
  idleTimeout?: number
  fadeDuration?: number
  blendMode?: React.CSSProperties["mixBlendMode"]
  children: React.ReactNode
}

interface TrailPoint {
  x: number
  y: number
}

export default function GlowCursor({
  color = "#7C3AED",
  secondaryColor = "#A78BFA",
  trailLength = 22,
  trailWidth = 8,
  trailTaper = 0.8,
  followSpeed = 0.16,
  glowIntensity = 1.9,
  glowSpread = 1.2,
  hotspot = 0.65,
  brightness = 1.25,
  opacity = 1,
  pulseSpeed = 1.1,
  noiseStrength = 0.035,
  idleFade = true,
  idleTimeout = 700,
  fadeDuration = 900,
  blendMode = "plus-lighter",
  children,
}: GlowCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...pointer }
    const trail: TrailPoint[] = []
    let lastMove = performance.now()
    let previousFrame = lastMove
    let idleOpacity = 0
    let animationFrame = 0

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const updatePointer = (x: number, y: number) => {
      pointer.x = x
      pointer.y = y
      lastMove = performance.now()
    }

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY)
    }

    const render = (time: number) => {
      const elapsed = time - previousFrame
      previousFrame = time
      current.x += (pointer.x - current.x) * followSpeed
      current.y += (pointer.y - current.y) * followSpeed

      const jitter = trailWidth * noiseStrength
      trail.push({
        x: current.x + (Math.random() - 0.5) * jitter,
        y: current.y + (Math.random() - 0.5) * jitter,
      })
      while (trail.length > trailLength) trail.shift()

      if (!idleFade || time - lastMove < idleTimeout) {
        idleOpacity = Math.min(1, idleOpacity + elapsed / 180)
      } else {
        idleOpacity = Math.max(0, idleOpacity - elapsed / fadeDuration)
      }

      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      context.save()
      context.globalCompositeOperation = "lighter"
      context.filter = `brightness(${brightness})`

      trail.forEach((point, index) => {
        const progress = (index + 1) / trail.length
        const taperedOpacity = Math.pow(progress, trailTaper) * opacity * idleOpacity
        const pulse = 1 + Math.sin(time * 0.001 * pulseSpeed + progress * 2) * 0.08
        const radius =
          trailWidth * glowIntensity * glowSpread * (0.45 + progress * 1.55) * pulse
        const gradient = context.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          radius,
        )
        gradient.addColorStop(0, color)
        gradient.addColorStop(0.3, secondaryColor)
        gradient.addColorStop(1, "transparent")
        context.globalAlpha = taperedOpacity * 0.28
        context.fillStyle = gradient
        context.beginPath()
        context.arc(point.x, point.y, radius, 0, Math.PI * 2)
        context.fill()
      })

      const hotspotRadius = trailWidth * (1 + hotspot)
      const hotspotGradient = context.createRadialGradient(
        current.x,
        current.y,
        0,
        current.x,
        current.y,
        hotspotRadius,
      )
      hotspotGradient.addColorStop(0, "#FFFFFF")
      hotspotGradient.addColorStop(0.18, secondaryColor)
      hotspotGradient.addColorStop(0.58, color)
      hotspotGradient.addColorStop(1, "transparent")
      context.globalAlpha = opacity * idleOpacity * 0.82
      context.fillStyle = hotspotGradient
      context.beginPath()
      context.arc(current.x, current.y, hotspotRadius, 0, Math.PI * 2)
      context.fill()
      context.restore()

      animationFrame = window.requestAnimationFrame(render)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    animationFrame = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [
    brightness,
    color,
    fadeDuration,
    followSpeed,
    glowIntensity,
    glowSpread,
    hotspot,
    idleFade,
    idleTimeout,
    noiseStrength,
    opacity,
    pulseSpeed,
    secondaryColor,
    trailLength,
    trailTaper,
    trailWidth,
  ])

  return (
    <div className="glow-cursor-shell">
      <canvas
        ref={canvasRef}
        className="glow-cursor-canvas"
        style={{ mixBlendMode: blendMode }}
        aria-hidden="true"
      />
      <div className="glow-cursor-content">{children}</div>
    </div>
  )
}
