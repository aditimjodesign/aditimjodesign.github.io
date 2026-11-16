import { useEffect, useState } from "react"

import aboutPortrait from "@/assets/about-portrait.webp"
import catThinkingSticker from "@/assets/cat-thinking.webp"
import bankingPlatformImage from "@/assets/work-banking-laptop.webp"
import enterpriseAiImage from "@/assets/work-ai-agent-ui.jpg"
import transitPassesImage from "@/assets/work-transit-passes.webp"
import infovisionLogo from "@/assets/logos/infovision-labs.svg"
import initiaLogo from "@/assets/logos/initia.webp"
import tcsLogo from "@/assets/logos/tcs.svg"
import wongdoodyLogo from "@/assets/logos/wongdoody.webp"
import { Dock, DockIcon } from "@/components/ui/dock"
import { Footerdemo } from "@/components/ui/footer-section"
import { Pointer } from "@/components/ui/custom-cursor"
import HoverHero from "@/components/hover-hero/HoverHero"
import DotGrid from "@/components/ui/dot-grid"
import ModalCards, { type CardData } from "@/components/ui/modal-cards"
import ChecklistCard, { type ChecklistItem } from "@/components/ui/checklist-card"
import SkillCard from "@/components/ui/skill-card"
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
    title: "Making an Enterprise AI Coding Agent Understandable",
    description: "Making an enterprise AI coding agent understandable.",
    outcome: "Three reusable frameworks for designing around an agent that isn't always right.",
    role: "UX Researcher & Designer",
    context: "MSc capstone with IBM",
    imageUrl: enterpriseAiImage,
    textPanel: true,
    gradientColor: "#010c36",
    href: "/case-studies/ai-coding-agent.html",
  },
  {
    id: 2,
    title: "Scaling an Enterprise Banking Platform",
    description: "Extending a banking platform built for 300+ employee enterprises to companies of 100 or fewer.",
    role: "UX Designer",
    context: "Corporate banking platform provider",
    outcome: "Shipped early 2024: onboarding that skips role selection for small companies.",
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
    outcome: "Three platform pillars designed into a B2B platform, in development when I left.",
    imageUrl: transitPassesImage,
    gradientColor: "#059669",
    href: "/case-studies/transit-passes.html",
  },
]

// Dock theme button: shows the mode you'd switch to
const themeIcons = {
  sun: "M3 17h18M7 17a5 5 0 0 1 10 0M12 6v3M5.6 9.6l1.8 1.8M18.4 9.6l-1.8 1.8",
  moon: "M18.5 15.2A7.2 7.2 0 0 1 8.8 5.5a7.2 7.2 0 1 0 9.7 9.7ZM16.5 5.5h.01",
}

const navigation = [
  {
    label: "Home",
    href: "#home",
    path: "M4 20V10.5L12 4l8 6.5V20H4ZM9.5 20v-6h5v6M16.5 7V4.5",
  },
  {
    label: "Work",
    href: "#work",
    path: "M4 20l1-5L16 4l4 4L9 19l-5 1ZM14 6l4 4",
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

// "August 2022 – October 2024" → "Aug 2022 – Oct 2024"; plain years stay as they are.
function shortDates(dates: string) {
  return dates.replace(/\b([A-Z][a-z]{2})[a-z]+(?= \d{4})/g, "$1")
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
    company: "Freelance",
    role: "Freelance designer",
    dates: "October 2024 – 2026",
    duration: "",
    domains: [],
  },
  {
    date: "2024-09-30",
    // WONGDOODY is Infosys's design studio: one job, one entry
    company: "WONGDOODY (an Infosys company)",
    image: wongdoodyLogo,
    imageAlt: "WONGDOODY logo",
    role: "Lead Experience Designer",
    dates: "August 2022 – September 2024",
    duration: "2 years 2 months",
    location: "Pune District",
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
    // browser chrome and status bar take the page colour
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDarkMode ? "#080b0c" : "#ffffff")
    window.localStorage.setItem("portfolio-theme", theme)
  }, [isDarkMode])

  return (
    <div className={`portfolio-page${isDarkMode ? " portfolio-page--dark" : ""}`}>
      <div className="page-dots" aria-hidden="true">
        <DotGrid theme={isDarkMode ? "dark" : "light"} />
      </div>
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
              I like messy problems best: dense data, lots of user roles, rules that
              can&apos;t be broken. I ask the awkward questions early, so the final design
              doesn&apos;t need a manual.
            </p>
            <p className="about-lead">
              People are what I care about most. AI is the newest place I get to design
              for them.
            </p>
            <p>
              I&apos;ve been a designer since 2021, most of that on enterprise products in
              fintech, logistics and education. From late 2024 I freelanced alongside an
              MSc in Human-Computer Interaction at University College Dublin, where I
              focused on human-centred AI and accessibility.
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
          <ul className="exp-list">
            {experience.slice(0, 3).map((job) => (
              <li className="exp-item" key={job.company}>
                <div className="exp-head">
                  <h3 className="exp-company">{job.company}</h3>
                  {!job.hideDates && <p className="exp-dates">{shortDates(job.dates)}</p>}
                </div>
                <p className="exp-role">{job.role}</p>
                {job.domains.length > 0 && (
                  <ul className="exp-domains" aria-label="Domains">
                    {job.domains.map((domain) => (
                      <li key={domain}>{domain}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <details className="exp-more">
            <summary>
              <span className="exp-more__closed">View earlier roles</span>
              <span className="exp-more__open">Show fewer roles</span>
            </summary>
            <ul className="exp-list">
              {experience.slice(3).map((job) => (
                  <li className="exp-item" key={job.company}>
                    <div className="exp-head">
                      <h3 className="exp-company">{job.company}</h3>
                      {!job.hideDates && <p className="exp-dates">{shortDates(job.dates)}</p>}
                    </div>
                    <p className="exp-role">{job.role}</p>
                    {job.domains.length > 0 && (
                      <ul className="exp-domains" aria-label="Domains">
                        {job.domains.map((domain) => (
                          <li key={domain}>{domain}</li>
                        ))}
                      </ul>
                    )}
                  </li>
              ))}
            </ul>
          </details>
        </section>
      </main>
        <Footerdemo />
      </Pointer>
    </div>
  )
}
