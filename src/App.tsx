import { useEffect, useState } from "react"

import aboutPortrait from "@/assets/about-portrait.webp"
import catThinkingSticker from "@/assets/cat-thinking.webp"
import bankingPlatformImage from "@/assets/work-banking-laptop.webp"
import enterpriseAiImage from "@/assets/work-ai-agent-ui.webp"
import transitPassesImage from "@/assets/work-transit-passes.webp"
import infosysLogo from "@/assets/logos/infosys.svg"
import infovisionLogo from "@/assets/logos/infovision-labs.svg"
import initiaLogo from "@/assets/logos/initia.webp"
import tcsLogo from "@/assets/logos/tcs.svg"
import wongdoodyLogo from "@/assets/logos/wongdoody.webp"
import { Dock, DockIcon } from "@/components/ui/dock"
import { Footerdemo } from "@/components/ui/footer-section"
import { Pointer } from "@/components/ui/custom-cursor"
import HoverHero from "@/components/hover-hero/HoverHero"
import ModalCards, { type CardData } from "@/components/ui/modal-cards"
import ChecklistCard, { type ChecklistItem } from "@/components/ui/checklist-card"
import SkillCard from "@/components/ui/skill-card"
import TeamShowcase from "@/components/ui/team-showcase"
import StickerCluster, { type Sticker } from "@/components/ui/sticker-cluster"
import ToolPile, { type Tool } from "@/components/ui/tool-pile"
import { AntigravityLogo, GeminiLogo, SimpleIconLogo } from "@/components/ui/tool-logos"
import {
  siClaude,
  siClaudecode,
  siFigma,
  siGooglecolab,
  siMiro,
  siNotion,
} from "simple-icons"

const selectedWork: CardData[] = [
  {
    id: 1,
    title: "Enterprise AI Coding Agent",
    description: "Making an enterprise AI coding agent understandable.",
    role: "UX Researcher & Designer",
    context: "MSc capstone with IBM",
    imageUrl: enterpriseAiImage,
    textPanel: true,
    gradientColor: "#D6336C",
    href: "/case-studies/ai-coding-agent.html",
  },
  {
    id: 2,
    title: "Scaling an Enterprise Banking Platform",
    description: "Extending a banking platform built for 300+ employee enterprises to companies of 100 or fewer.",
    role: "UX Designer",
    context: "Corporate banking platform provider",
    imageUrl: bankingPlatformImage,
    gradientColor: "#2563EB",
    href: "/case-studies/fintech-platform.html",
  },
  {
    id: 3,
    title: "Bulk Travel Passes for Organisations",
    description: "Bulk purchasing and distribution of travel passes for a public transit network.",
    role: "Designer, B2B track",
    context: "Public transit agency in Canada",
    imageUrl: transitPassesImage,
    gradientColor: "#059669",
    href: "/case-studies/transit-passes.html",
  },
]

// Dock theme button: shows the mode you'd switch to
const themeIcons = {
  sun: "M12 4V2M12 22v-2M4.9 4.9 3.5 3.5M20.5 20.5l-1.4-1.4M4 12H2M22 12h-2M4.9 19.1l-1.4 1.4M20.5 3.5l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  moon: "M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z",
}

const navigation = [
  {
    label: "Home",
    href: "#home",
    path: "M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9 21v-7h6v7",
  },
  {
    label: "About",
    href: "#about",
    path: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
  },
  {
    label: "Work",
    href: "#work",
    path: "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 8h18v12H3V8Zm0 5h18M10 13v2h4v-2",
  },
  {
    label: "Beyond",
    href: "/beyond.html",
    path: "m8 3 4 8 5-5 5 15H2L8 3z",
  },
]

// "open" drops the box behind each card so the folders sit on the page; "boxed" keeps it.
const toolkitLayout: "open" | "boxed" = "open"

// Craft and research skills in one pile, alternating the two colour families
const skills: Sticker[] = [
  { label: "user research & interviews", color: "#FFC83D", ink: "#4D3300", rotate: -4 },
  { label: "interaction design", color: "#8FC8FF", ink: "#0A2E52", rotate: 3 },
  { label: "synthesis & insight", color: "#FF9E8A", ink: "#4A1308", rotate: -2 },
  { label: "AI interaction design", color: "#5FB0F5", ink: "#062B4D", rotate: -6 },
  { label: "stakeholder workshops", color: "#FFE07A", ink: "#473600", rotate: 4 },
  { label: "design systems", color: "#B9A2EF", ink: "#2A1260", rotate: -3 },
  { label: "accessibility (WCAG)", color: "#D7C8FA", ink: "#2E1566", rotate: -2 },
  { label: "front-end handoff (HTML/CSS)", color: "#A9BFFF", ink: "#14245C", rotate: 3 },
]

const domains: ChecklistItem[] = [
  { label: "Fintech", done: true },
  { label: "Human-centred AI", done: true },
  { label: "Logistics", done: true },
  { label: "Education", done: true },
  { label: "Enterprise SaaS", done: true },
  { label: "Tourism", done: true },
  { label: "AR/VR", done: true },
  {
    label: "thinking…",
    sticker: (
      <img
        className="checklist-sticker"
        src={catThinkingSticker}
        alt="Cat in glasses reading a sheet of paper"
        width={96}
        height={89}
        draggable={false}
      />
    ),
  },
]

const aiTools: Tool[] = [
  { name: "Claude", logo: <SimpleIconLogo icon={siClaude} /> },
  { name: "Gemini", logo: <GeminiLogo /> },
  { name: "Antigravity", logo: <AntigravityLogo /> },
  { name: "Colab", logo: <SimpleIconLogo icon={siGooglecolab} /> },
  { name: "Claude Code", logo: <SimpleIconLogo icon={siClaudecode} /> },
]

// Figma, Miro and Notion are placeholders; swap in the tools you actually use.
const designTools: Tool[] = [
  { name: "Figma", logo: <SimpleIconLogo icon={siFigma} /> },
  { name: "Miro", logo: <SimpleIconLogo icon={siMiro} /> },
  { name: "Notion", logo: <SimpleIconLogo icon={siNotion} /> },
]

// "August 2022 – October 2024" → "2022 – 2024"; a single year when both match.
function yearRange(dates: string) {
  const [start, end] = dates.match(/\d{4}/g) ?? []
  return !end || start === end ? (start ?? dates) : `${start} – ${end}`
}

const experience: {
  date: string
  company: string
  image?: string
  imageAlt?: string
  role: string
  dates: string
  duration: string
  location?: string
  domains: string[]
  /** dates left off the page */
  hideDates?: boolean
}[] = [
  {
    date: "2026-06-01",
    company: "University College Dublin",
    role: "MSc Human-Computer Interaction",
    dates: "2025 – 2026",
    duration: "",
    domains: ["Human-centred AI", "Accessibility"],
  },
  {
    date: "2024-10-01",
    company: "WONGDOODY",
    hideDates: true,
    image: wongdoodyLogo,
    imageAlt: "WONGDOODY logo",
    role: "Lead Experience Designer",
    dates: "August 2022 – October 2024",
    duration: "2 years 3 months",
    location: "Pune District",
    domains: ["Fintech", "Education", "Logistics"],
  },
  {
    date: "2024-09-30",
    company: "Infosys",
    hideDates: true,
    image: infosysLogo,
    imageAlt: "Infosys logo",
    role: "Lead Experience Designer",
    dates: "August 2022 – October 2024",
    duration: "2 years 3 months",
    domains: ["Fintech", "Education", "Logistics"],
  },
  {
    date: "2022-06-01",
    company: "TCS Research and Innovation (R&I)",
    image: tcsLogo,
    imageAlt: "TCS Research logo",
    role: "User Experience Designer",
    dates: "January 2022 – June 2022",
    duration: "6 months",
    location: "Mumbai",
    domains: ["Tourism", "AR/VR"],
  },
  {
    date: "2021-11-01",
    company: "INITIA",
    image: initiaLogo,
    imageAlt: "INITIA logo",
    role: "User Experience Designer",
    dates: "August 2021 – November 2021",
    duration: "4 months",
    domains: ["Automobile", "HMI"],
  },
  {
    date: "2021-08-01",
    company: "IVL | InfoVision Labs",
    image: infovisionLogo,
    imageAlt: "InfoVision logo",
    role: "UX Designer",
    dates: "May 2021 – August 2021",
    duration: "4 months",
    domains: ["Healthcare"],
  },
]

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme")
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  // Arriving with a #section link (e.g. "Back" from a case study): the browser
  // looks for the anchor before React renders it, so jump there once mounted.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" })
  }, [])

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light"
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem("portfolio-theme", theme)
  }, [isDarkMode])

  return (
    <div className={`portfolio-page${isDarkMode ? " portfolio-page--dark" : ""}`}>
      <Pointer name="You">
        <a className="site-logo" href="#home" aria-label="Aditi Manish Joshi, back to top">
          <span className="site-logo__mark" aria-hidden="true" />
          <span className="site-logo__label">Aditi Manish Joshi</span>
        </a>
        <header className="site-header">
        <nav aria-label="Main navigation">
          <Dock className="portfolio-dock !mt-0" direction="middle">
            {navigation.map((item) => (
              <DockIcon className="dock-nav-icon" key={item.label}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  aria-current={item.href === "#home" ? "page" : undefined}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.path} />
                  </svg>
                  <span className="dock-label">{item.label}</span>
                </a>
              </DockIcon>
            ))}
            <DockIcon className="dock-nav-icon">
              <button
                type="button"
                aria-label="Dark mode"
                aria-pressed={isDarkMode}
                onClick={() => setIsDarkMode((current) => !current)}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={isDarkMode ? themeIcons.sun : themeIcons.moon} />
                </svg>
                <span className="dock-label">{isDarkMode ? "Switch to light mode" : "Switch to dark mode"}</span>
              </button>
            </DockIcon>
          </Dock>
        </nav>
      </header>

      <main>
        <HoverHero />

        <section className="about-section" id="about">
          <div className="about-aside">
            <h2>A little about me</h2>
            <img
              className="about-sticker"
              src={aboutPortrait}
              alt="Portrait of Aditi Manish Joshi, smiling and looking over one shoulder"
              width={480}
              height={600}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
          <div className="about-copy">
            <p>
              The problems I like best are the messy ones: dense data, lots of user roles,
              rules that can&apos;t be broken. I ask the inconvenient questions early, so the
              final design doesn&apos;t need a manual.
            </p>
            <p className="about-lead">
              I&apos;m obsessed with one thing: people. AI just happens to be the newest
              playground.
            </p>
            <p>
              I explore how humans and technology can work better together. For 5+ years
              that&apos;s meant enterprise products in fintech, logistics and education.
              More recently it meant an MSc in
              Human-Computer Interaction at University College Dublin, focused on
              human-centred AI and accessibility.
            </p>
          </div>
        </section>

        <section className="selected-work" id="work">
          <h2>Selected work</h2>
          <ModalCards
            cards={selectedWork}
            gradientColor="#D6336C"
            animationVariant="scale"
            animationSpeed="normal"
          />
        </section>

        <section className="toolkit-section" id="toolkit">
          <h2>Skills, tools &amp; domains</h2>
          <div className={`toolkit-grid toolkit-grid--${toolkitLayout}`}>
            <SkillCard title="Skills" tone="blue">
              <StickerCluster stickers={skills} aria-label="Skills" />
            </SkillCard>
            <SkillCard title="Tools" tone="purple">
              <div className="tool-piles">
                <figure className="tool-pile-group">
                  <figcaption>AI tools</figcaption>
                  <ToolPile tools={aiTools} className="tool-stage--ai" />
                </figure>
                <figure className="tool-pile-group">
                  <figcaption>Design tools</figcaption>
                  <ToolPile tools={designTools} className="tool-stage--design" />
                </figure>
              </div>
            </SkillCard>
            <SkillCard>
              <ChecklistCard title="Domains" items={domains} />
            </SkillCard>
          </div>
        </section>

        <section className="work-history" id="resume">
          <h2>Experience</h2>
          <TeamShowcase
            members={experience.map((job) => ({
              id: job.company,
              name: job.company,
              role: job.role,
              meta: job.hideDates ? undefined : yearRange(job.dates),
              tags: job.domains,
              image: job.image,
              imageAlt: job.imageAlt,
            }))}
            initialCount={3}
            showMoreText="View earlier roles"
            showLessText="Show fewer roles"
          />
        </section>
      </main>
        <Footerdemo />
      </Pointer>
    </div>
  )
}
