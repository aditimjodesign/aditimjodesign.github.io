import React from "react"

import { cn } from "@/lib/utils"

export interface CardItem {
  id: string | number
  title: string
  subtitle: string
  imageUrl: string
}

export interface HoverRevealCardsProps {
  items: CardItem[]
  className?: string
  cardClassName?: string
}

const HoverRevealCards: React.FC<HoverRevealCardsProps> = ({
  items,
  className,
  cardClassName,
}) => (
  <div role="list" className={cn("hover-reveal-cards", className)}>
    {items.map((item) => (
      <article
        key={item.id}
        role="listitem"
        aria-label={`${item.title}, ${item.subtitle}`}
        tabIndex={0}
        className={cn("hover-reveal-card", cardClassName)}
      >
        <img className="hover-reveal-image" src={item.imageUrl} alt="" aria-hidden="true" />
        <div className="hover-reveal-overlay" aria-hidden="true" />
        <div className="hover-reveal-content">
          <p>{item.subtitle}</p>
          <h3>{item.title}</h3>
        </div>
      </article>
    ))}
  </div>
)

export default HoverRevealCards
