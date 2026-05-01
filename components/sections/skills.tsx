import { Brain, Code2, Server, Wrench, type LucideIcon } from "lucide-react"
import type { ComponentType, SVGProps } from "react"
import { FaAws } from "react-icons/fa"
import {
  SiClaude,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiGit,
  SiGithubactions,
  SiGooglecloud,
  SiLangchain,
  SiLanggraph,
  SiN8N,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSqlalchemy,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si"

import { Badge } from "@/components/ui/badge"
import { skillsData } from "@/lib/data"

type IconType = ComponentType<SVGProps<SVGSVGElement>>

const skillIcons: Record<string, { Icon: IconType; color: string }> = {
  // Backend
  Python: { Icon: SiPython, color: "#3776AB" },
  FastAPI: { Icon: SiFastapi, color: "#009688" },
  Django: { Icon: SiDjango, color: "#092E20" },
  SQLAlchemy: { Icon: SiSqlalchemy, color: "#D71F00" },
  Postgres: { Icon: SiPostgresql, color: "#4169E1" },
  SQLite: { Icon: SiSqlite, color: "#003B57" },

  // Frontend
  "Next.js": { Icon: SiNextdotjs, color: "#000000" },
  React: { Icon: SiReact, color: "#61DAFB" },
  TypeScript: { Icon: SiTypescript, color: "#3178C6" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#06B6D4" },

  // AI
  n8n: { Icon: SiN8N, color: "#EA4B71" },
  "Claude Code (MCP)": { Icon: SiClaude, color: "#D97757" },
  LangChain: { Icon: SiLangchain, color: "#1C3C3C" },
  LangGraph: { Icon: SiLanggraph, color: "#FF6F61" },
  "Agentes IA": { Icon: Brain as unknown as IconType, color: "#7C3AED" },

  // DevOps
  Docker: { Icon: SiDocker, color: "#2496ED" },
  AWS: { Icon: FaAws, color: "#FF9900" },
  GCP: { Icon: SiGooglecloud, color: "#4285F4" },
  "GitHub Actions": { Icon: SiGithubactions, color: "#2088FF" },
  "CI/CD": { Icon: Wrench as unknown as IconType, color: "#0EA5E9" },
  Git: { Icon: SiGit, color: "#F05032" },
}

const skillCategories: {
  key: keyof typeof skillsData
  label: string
  description: string
  Icon: LucideIcon
}[] = [
    {
      key: "backend",
      label: "Backend",
      description: "APIs robustas y servicios escalables",
      Icon: Server,
    },
    {
      key: "frontend",
      label: "Frontend",
      description: "Interfaces modernas y reactivas",
      Icon: Code2,
    },
    {
      key: "ai",
      label: "IA & Automatización",
      description: "Agentes y flujos inteligentes",
      Icon: Brain,
    },
    {
      key: "devops",
      label: "DevOps & Tools",
      description: "Despliegue y operación continua",
      Icon: Wrench,
    },
  ]

export function SkillsSection() {
  return (
    <section id="habilidades" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Habilidades
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tecnologías con las que trabajo día a día para construir productos completos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map(({ key, label, description, Icon }) => (
              <div
                key={key}
                className="group relative overflow-hidden p-6 rounded-2xl border border-blue-100 dark:border-border bg-card shadow-lg shadow-blue-900/5 dark:shadow-none hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-border transition-all duration-300"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-2xl dark:from-primary/10 dark:to-primary/5"
                />

                <div className="relative">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 dark:from-primary dark:to-primary dark:shadow-none">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold leading-none">
                        {label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1.5">
                        {description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skillsData[key].map((skill) => {
                      const meta = skillIcons[skill]
                      const SkillIcon = meta?.Icon
                      return (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs font-medium px-3 py-1.5 bg-secondary/80 hover:bg-secondary inline-flex items-center gap-1.5"
                        >
                          {SkillIcon ? (
                            <SkillIcon
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: meta.color }}
                              aria-hidden
                            />
                          ) : null}
                          <span>{skill}</span>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
