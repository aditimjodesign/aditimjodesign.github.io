import React from "react"

import { cn } from "@/lib/utils"

const DEFAULT_MAGNIFICATION = 60
const DEFAULT_DISTANCE = 140
const DEFAULT_SIZE = 44

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  magnification?: number
  distance?: number
  direction?: "top" | "middle" | "bottom"
}

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      magnification = DEFAULT_MAGNIFICATION,
      distance = DEFAULT_DISTANCE,
      direction = "bottom",
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resizeIcons = (container: HTMLDivElement, pointerX?: number) => {
      if (reduceMotion) return
      container.querySelectorAll<HTMLElement>("[data-dock-icon]").forEach((icon) => {
        const baseSize = Number(icon.dataset.baseSize ?? DEFAULT_SIZE)
        let nextSize = baseSize

        if (pointerX !== undefined) {
          const bounds = icon.getBoundingClientRect()
          const distanceFromCenter = Math.abs(pointerX - bounds.left - bounds.width / 2)
          const influence = Math.max(0, 1 - distanceFromCenter / distance)
          nextSize = baseSize + (magnification - baseSize) * influence
        }

        icon.style.setProperty("--dock-size", `${nextSize}px`)
      })
    }

    return (
      <div
        ref={ref}
        onMouseMove={(event) => {
          resizeIcons(event.currentTarget, event.clientX)
          onMouseMove?.(event)
        }}
        onMouseLeave={(event) => {
          resizeIcons(event.currentTarget)
          onMouseLeave?.(event)
        }}
        className={cn(
          "mx-auto mt-8 flex h-[60px] w-max gap-2 rounded-2xl border border-white/70 bg-white/70 p-2 shadow-[0_8px_30px_rgb(17_17_17/0.08)] backdrop-blur-md",
          direction === "top" && "items-start",
          direction === "middle" && "items-center",
          direction === "bottom" && "items-end",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Dock.displayName = "Dock"

export interface DockIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

const DockIcon = React.forwardRef<HTMLDivElement, DockIconProps>(
  ({ size = DEFAULT_SIZE, className, children, style, ...props }, ref) => (
    <div
      ref={ref}
      data-dock-icon
      data-base-size={size}
      style={
        {
          "--dock-size": `${size}px`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full transition-[width] duration-150 ease-out",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)

DockIcon.displayName = "DockIcon"

export { Dock, DockIcon }
