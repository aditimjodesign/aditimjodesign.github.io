import { memo, useEffect, useRef } from "react"

import { COPIED_MESSAGE, HERO_EMAIL, RESUME_URL } from "@/lib/site-config"

import heroMarkup from "./hero.html?raw"
import "./hero.css"
import "./hero.js"

declare global {
  interface Window {
    initHeroSections?: () => void
  }
}

// The hover-reveal hero recreated from the Figma community file: hovering a
// highlighted phrase springs a set of objects out of it. The markup, styles
// and interaction are kept as authored (hero.html / hero.css / hero.js).
// React only owns the empty wrapper; the markup is inserted here once, so a
// re-render (e.g. the theme switch) can never replace it and drop the wiring.
function HoverHero() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    if (!host.firstElementChild) host.innerHTML = heroMarkup
    window.initHeroSections?.()
    return wireActions(host)
  }, [])

  return <div ref={ref} className="hover-hero" />
}

// Email button copies the address and confirms it; résumé link comes from config
function wireActions(host: HTMLElement) {
  const email = host.querySelector<HTMLButtonElement>(".hx-email")
  const status = host.querySelector<HTMLElement>(".hx-copy-status")
  const resume = host.querySelector<HTMLAnchorElement>(".hx-resume")
  let timer: number | undefined

  if (resume) {
    if (RESUME_URL) {
      resume.href = RESUME_URL
      // a file on this site downloads; an external link (Drive) opens in a new tab
      if (RESUME_URL.startsWith("/")) {
        resume.setAttribute("download", "")
        resume.removeAttribute("target")
      }
    } else {
      // no link yet: a plain disabled button, not an anchor without a destination
      const placeholder = document.createElement("button")
      placeholder.type = "button"
      placeholder.disabled = true
      placeholder.className = resume.className
      placeholder.title = "Résumé link coming soon"
      placeholder.innerHTML = resume.innerHTML
      placeholder.setAttribute("aria-disabled", "true")
      resume.replaceWith(placeholder)
    }
  }

  if (!email || !status) return
  email.querySelector(".hx-email__address")!.textContent = HERO_EMAIL
  email.setAttribute("aria-label", `Copy email address ${HERO_EMAIL}`)

  const onClick = async () => {
    const copied = await copyText(HERO_EMAIL)
    status.textContent = copied ? COPIED_MESSAGE : `Couldn't copy. ${COPIED_MESSAGE.replace(/^Copied\. /, "")}`
    email.classList.toggle("hx-is-copied", copied)
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      email.classList.remove("hx-is-copied")
      status.textContent = ""
    }, 5000)
  }
  email.addEventListener("click", onClick)
  return () => {
    email.removeEventListener("click", onClick)
    window.clearTimeout(timer)
  }
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers, or no clipboard permission: fall back to a hidden textarea
    const area = document.createElement("textarea")
    area.value = text
    area.style.position = "fixed"
    area.style.opacity = "0"
    document.body.append(area)
    area.select()
    const ok = document.execCommand("copy")
    area.remove()
    return ok
  }
}

export default memo(HoverHero)
