import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { useImageLoaded } from "@/lib/use-image-loaded"
import { cn } from "@/lib/utils"

export interface CardData {
  id: string | number
  imageUrl: string
  title: string
  description?: string
  /** what I did, e.g. "UX Designer" */
  role?: string
  /** employer, client or programme */
  context?: string
  /** the image is a UI screenshot: text sits on a solid panel instead of over it */
  textPanel?: boolean
  /** one-line result, shown under the description when set */
  outcome?: string
  gradientColor?: string
  /** case study page; clicking the card goes there instead of opening the modal */
  href?: string
}

interface ModalCardsProps {
  cards: CardData[]
  className?: string
  gradientColor?: string
  animationVariant?: "scale" | "fade" | "slide"
  animationSpeed?: "slow" | "normal" | "fast" | "none"
  springStiffness?: number
  springDamping?: number
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  ariaLabel?: string
  backdropGradientPosition?: string
  modalClassName?: string
  backdropClassName?: string
}

const DURATION: Record<string, number> = {
  slow: 0.55,
  normal: 0.38,
  fast: 0.22,
  none: 0,
}

export default function ModalCards({
  cards,
  className,
  gradientColor = "#6366f1",
  animationVariant = "scale",
  animationSpeed = "normal",
  springStiffness,
  springDamping,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  ariaLabel = "Card details modal",
  backdropGradientPosition = "50% 10%",
  modalClassName,
  backdropClassName,
}: ModalCardsProps) {
  const [activeId, setActiveId] = useState<string | number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const activeCard = cards.find((c) => c.id === activeId) ?? null

  useEffect(() => {
    if (!closeOnEscape) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [closeOnEscape])

  useEffect(() => {
    if (activeId !== null) {
      document.body.style.overflow = "hidden"
      setTimeout(() => closeRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [activeId])

  const duration = DURATION[animationSpeed] ?? DURATION.normal
  const spring = springStiffness
    ? { type: "spring" as const, stiffness: springStiffness, damping: springDamping ?? 30 }
    : { type: "tween" as const, duration }

  const variants = {
    scale: {
      initial: { opacity: 0, scale: 0.82 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.82 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 48 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 48 },
    },
  }[animationVariant]

  const cardGradient = (card: CardData) => card.gradientColor ?? gradientColor

  const openCard = (card: CardData) => {
    if (card.href) window.location.assign(card.href)
    else setActiveId(card.id)
  }

  return (
    <>
      <div
        className={cn(
          "modal-cards-grid",
          className,
        )}
      >
        {cards.map((card) => (
          <motion.article
            key={card.id}
            layoutId={animationVariant === "scale" ? `modal-card-${card.id}` : undefined}
                       tabIndex={0}
            aria-label={card.href ? `${card.title}, read case study` : card.title}
            className="modal-card"
            onClick={() => openCard(card)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                openCard(card)
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <CardImage src={card.imageUrl} tint={cardGradient(card)} />
            <div
              className="modal-card-gradient"
              style={{
                background: card.textPanel
                  ? `linear-gradient(to top, ${cardGradient(card)} 0%, ${cardGradient(card)} 52%, transparent 78%)`
                  : `linear-gradient(to top, ${cardGradient(card)}cc 0%, transparent 80%)`,
              }}
            />
            <div className="modal-card-content">
              {(card.role || card.context) && (
                <p className="modal-card-meta">{[card.role, card.context].filter(Boolean).join(" · ")}</p>
              )}
              <h3 className="modal-card-title">{card.title}</h3>
              {card.description && (
                <p className="modal-card-description">{card.description}</p>
              )}
              {card.outcome && <p className="modal-card-outcome">{card.outcome}</p>}
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {activeCard && (
          <>
            {/* Backdrop */}
            <motion.div
              key="modal-backdrop"
              className={cn("modal-cards-backdrop", backdropClassName)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration * 0.8 }}
              style={{
                background: `radial-gradient(ellipse at ${backdropGradientPosition}, ${cardGradient(activeCard)}55 0%, rgba(0,0,0,0.78) 70%)`,
              }}
              onClick={closeOnBackdropClick ? () => setActiveId(null) : undefined}
            />

            {/* Modal */}
            <motion.div
              key={`modal-${activeCard.id}`}
              layoutId={animationVariant === "scale" ? `modal-card-${activeCard.id}` : undefined}
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              className={cn("modal-cards-modal", modalClassName)}
              initial={animationVariant !== "scale" ? variants.initial : undefined}
              animate={animationVariant !== "scale" ? variants.animate : undefined}
              exit={animationVariant !== "scale" ? variants.exit : undefined}
              transition={spring}
            >
              <img
                src={activeCard.imageUrl}
                alt={activeCard.title}
                className="modal-cards-modal-image"
              />
              <div
                className="modal-cards-modal-gradient"
                style={{
                  background: `linear-gradient(to top, ${cardGradient(activeCard)}ee 0%, transparent 60%)`,
                }}
              />
              <div className="modal-cards-modal-content">
                <h2 className="modal-cards-modal-title">{activeCard.title}</h2>
                {activeCard.description && (
                  <p className="modal-cards-modal-description">{activeCard.description}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  ref={closeRef}
                  className="modal-cards-close"
                  aria-label="Close modal"
                  onClick={() => setActiveId(null)}
                >
                  ×
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Card background image with a shimmering skeleton until it has loaded
function CardImage({ src, tint }: { src: string; tint: string }) {
  const { loaded, imgProps } = useImageLoaded()

  return (
    <>
      {!loaded && <div className="modal-card-image skeleton" aria-hidden="true" />}
      <img
        {...imgProps}
        src={src}
        alt=""
        width={860}
        height={320}
        aria-hidden="true"
        className={cn("modal-card-image img-fade", !loaded && "is-loading")}
        style={{ background: `linear-gradient(135deg, ${tint}33, ${tint}11)` }}
      />
    </>
  )
}
