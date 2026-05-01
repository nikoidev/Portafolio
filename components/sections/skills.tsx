import { skillsData } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  { key: "backend" as const, label: "Backend" },
  { key: "frontend" as const, label: "Frontend" },
  { key: "ai" as const, label: "IA & Automatización" },
  { key: "devops" as const, label: "DevOps & Tools" },
]

export function SkillsSection() {
  return (
    <section id="habilidades" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
              Habilidades
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillCategories.map((category) => (
              <div
                key={category.key}
                className="p-6 rounded-lg border border-blue-100 dark:border-border bg-card shadow-lg shadow-blue-900/5 dark:shadow-none hover:shadow-xl hover:shadow-blue-900/10 dark:hover:shadow-none transition-all duration-300"
              >
                <h3 className="text-sm font-medium text-foreground mb-4">
                  {category.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillsData[category.key].map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
