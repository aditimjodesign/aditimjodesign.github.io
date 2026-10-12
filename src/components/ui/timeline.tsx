import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TimelineItem {
  date: string
  dateLabel: string
  title: string
  description?: string
  metadata?: string
  tags?: string[]
}

interface TimelineProps {
  items: TimelineItem[]
  initialCount?: number
  className?: string
  showMoreText?: string
  showLessText?: string
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  return (
    <li className="timeline-entry">
      <div className="timeline-date">
        <time dateTime={item.date}>{item.dateLabel}</time>
      </div>
      <div className="timeline-marker" aria-hidden="true">
        <span />
      </div>
      <div className="timeline-content">
        <h3>{item.title}</h3>
        {item.description && <p className="timeline-role">{item.description}</p>}
        {item.metadata && <p className="timeline-metadata">{item.metadata}</p>}
        {item.tags && item.tags.length > 0 && (
          <div className="domain-list" aria-label="Industry domains">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

export function Timeline({
  items,
  initialCount = 5,
  className,
  showMoreText = "Show More",
  showLessText = "Show Less",
}: TimelineProps) {
  const [showAll, setShowAll] = useState(false)
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [items],
  )
  const visibleItems = showAll ? sortedItems : sortedItems.slice(0, initialCount)
  const hasMore = sortedItems.length > initialCount

  return (
    <div className={cn("timeline", className)}>
      <ol>
        {visibleItems.map((item) => (
          <TimelineEntry item={item} key={`${item.date}-${item.title}`} />
        ))}
      </ol>

      {hasMore && (
        <div className="timeline-action">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={showAll}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? showLessText : showMoreText}
            <svg
              className={cn("timeline-chevron", showAll && "timeline-chevron--open")}
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  )
}
