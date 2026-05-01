import { Badge } from "@/components/ui/badge"
import { skillsData } from "@/lib/data"
import { Brain, Code2, Server, Wrench, type LucideIcon } from "lucide-react"

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
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Habilidades
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tecnologías con las que trabajo día a día para construir productos completos.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map(({ key, label, description, Icon }) => (
              <div
                key={key}
                className="group relative overflow-hidden p-6 rounded-2xl border border-blue-100 dark:border-border bg-card shadow-lg shadow-blue-900/5 dark:shadow-none hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-border transition-all duration-300"
              >
                {/* Decorative gradient blob */}
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
                    {skillsData[key].map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs font-medium px-3 py-1 bg-secondary/80 hover:bg-secondary"
                      >
                        {skill}
                      </Badge>
                    ))}
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
