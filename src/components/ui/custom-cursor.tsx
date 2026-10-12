import { useState, type PointerEvent, type ReactNode } from "react"
import { AnimatePresence, motion, useMotionValue, type MotionValue } from "motion/react"

import { cn } from "@/lib/utils"

interface PointerProps {
  children: ReactNode
  className?: string
  /** label shown in the pill next to the arrow */
  name: string
}

// Replaces the mouse cursor inside its children with a Figma-style arrow and
// name tag. The follower is fixed to the viewport and fed screen coordinates,
// so it stays under the mouse however tall the wrapped content is or how far
// it has scrolled. Touch input keeps the normal behaviour, and the system
// cursor is only hidden for precise pointers (see .custom-cursor-area in CSS).
export function Pointer({ children, className, name }: PointerProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isInside, setIsInside] = useState(false)

  const track = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    x.set(e.clientX)
    y.set(e.clientY)
    if (!isInside) setIsInside(true)
  }

  return (
    <div
      className={cn("custom-cursor-area relative", className)}
      onPointerMove={track}
      onPointerEnter={track}
      onPointerLeave={() => setIsInside(false)}
    >
      <AnimatePresence>{isInside && <FollowPointer x={x} y={y} name={name} />}</AnimatePresence>
      {children}
    </div>
  )
}

interface FollowPointerProps {
  x: MotionValue<number>
  y: MotionValue<number>
  name: string
}

function FollowPointer({ x, y, name }: FollowPointerProps) {
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-4 w-4 rounded-full"
      style={{ x, y }}
      aria-hidden="true"
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform stroke-sky-600 text-sky-500"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>
      <div className="w-fit rounded-full bg-sky-500 px-2 py-1 text-sm whitespace-nowrap text-white">{name}</div>
    </motion.div>
  )
}
