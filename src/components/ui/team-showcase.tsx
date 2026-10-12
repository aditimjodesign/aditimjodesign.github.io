import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useImageLoaded } from "@/lib/use-image-loaded"
import { cn } from "@/lib/utils"

export interface TeamMember {
  id: string
  /** bold line, e.g. a person's or company's name */
  name: string
  /** small uppercase line under the name */
  role: string
  /** quieter text after the name, e.g. years */
  meta?: string
  /** small pills under the meta line */
  tags?: string[]
  /** logo or photo; a text tile shows the name when missing */
  image?: string
  /** alt text for the photo; defaults to the name */
  imageAlt?: string
}

interface TeamShowcaseProps {
  members: TeamMember[]
  /** how many members show before the rest fold behind a toggle; shows all when left out */
  initialCount?: number
  showMoreText?: string
  showLessText?: string
  className?: string
}

// Staggered three-column photo grid beside a list of names. Hovering a photo
// or a name lights up both and dims the rest.
export default function TeamShowcase({
  members: allMembers,
  initialCount,
  showMoreText = "Show more",
  showLessText = "Show less",
  className,
}: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const hasMore = initialCount !== undefined && allMembers.length > initialCount
  const members = hasMore && !showAll ? allMembers.slice(0, initialCount) : allMembers

  const col1 = members.filter((_, i) => i % 3 === 0)
  const col2 = members.filter((_, i) => i % 3 === 1)
  const col3 = members.filter((_, i) => i % 3 === 2)

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-col items-start gap-8 select-none md:flex-row md:gap-10 lg:gap-14",
        className,
      )}
    >
      {/* Left: photo grid */}
      <div className="flex max-w-full flex-shrink-0 gap-2 overflow-x-auto pb-1 md:gap-3 md:pb-0" aria-hidden="true">
        <div className="flex flex-col gap-2 md:gap-3">
          {col1.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="size-[112px] sm:size-[132px] md:size-[150px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        <div className="mt-[48px] flex flex-col gap-2 sm:mt-[56px] md:mt-[68px] md:gap-3">
          {col2.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="size-[112px] sm:size-[132px] md:size-[150px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        <div className="mt-[22px] flex flex-col gap-2 sm:mt-[26px] md:mt-[32px] md:gap-3">
          {col3.map((member) => (
            <PhotoCard
              key={member.id}
              member={member}
              className="size-[112px] sm:size-[132px] md:size-[150px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* Right: name list */}
      <div className="w-full flex-1 pt-0 md:pt-2">
        <ul className="m-0 flex list-none flex-col gap-5 p-0 sm:grid sm:grid-cols-2 md:flex md:flex-col md:gap-6">
          {members.map((member) => (
            <MemberRow key={member.id} member={member} hoveredId={hoveredId} onHover={setHoveredId} />
          ))}
        </ul>

        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-5 -ml-3"
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
        )}
      </div>
    </div>
  )
}

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember
  className: string
  hoveredId: string | null
  onHover: (id: string | null) => void
}) {
  const isActive = hoveredId === member.id
  const isDimmed = hoveredId !== null && !isActive
  const { loaded, imgProps } = useImageLoaded()

  return (
    <div
      className={cn(
        "flex-shrink-0 cursor-pointer transition-opacity duration-400",
        isDimmed ? "opacity-60" : "opacity-100",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={cn(
          "overflow-hidden rounded-xl",
          member.image && !loaded && "skeleton",
          !member.image && "flex items-center justify-center border border-[var(--border-color)] bg-[var(--surface-subtle)] p-3",
          className,
        )}
      >
        {member.image ? (
          <img
            {...imgProps}
            src={member.image}
            alt=""
            width={300}
            height={300}
            loading="lazy"
            className={cn("img-fade h-full w-full object-cover", !loaded && "is-loading")}
            style={{
              filter: isActive ? "grayscale(0) brightness(1)" : "grayscale(1) brightness(0.77)",
            }}
          />
        ) : (
          <span className="text-center text-[15px] leading-tight font-semibold text-[var(--text-primary)]">
            {member.name}
          </span>
        )}
      </div>
      <p className="mt-1.5 mb-0 w-[112px] truncate text-[13px] text-[var(--text-secondary)] sm:w-[132px] md:w-[150px]">
        {member.name}
      </p>
    </div>
  )
}

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember
  hoveredId: string | null
  onHover: (id: string | null) => void
}) {
  const isActive = hoveredId === member.id
  const isDimmed = hoveredId !== null && !isActive

  return (
    <li
      className={cn("cursor-pointer transition-opacity duration-300", isDimmed ? "opacity-50" : "opacity-100")}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* inline, so a long name wraps and the years follow its last word */}
      <div className="leading-snug">
        <span
          className={cn(
            "text-base font-semibold tracking-tight transition-colors duration-300 md:text-[18px]",
            isActive ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]/80",
          )}
        >
          {member.name}
        </span>
        {member.meta && (
          <span className="ml-2.5 text-[14px] whitespace-nowrap text-[var(--text-tertiary)]">{member.meta}</span>
        )}
      </div>

      <p className="mt-1.5 mb-0 text-[12px] font-medium tracking-[0.16em] text-[var(--text-secondary)] uppercase md:text-[13px]">
        {member.role}
      </p>
      {member.tags && member.tags.length > 0 && (
        <ul className="mt-2 mb-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Domains">
          {member.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-[var(--border-color)] px-2.5 py-0.5 text-[13px] leading-5 text-[var(--text-secondary)]"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
