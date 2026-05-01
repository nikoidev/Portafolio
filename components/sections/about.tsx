import { aboutData } from "@/lib/data"
import { Briefcase, Code2, Sparkles } from "lucide-react"

const stats = [
  { icon: Briefcase, value: "+3", label: "Años de experiencia" },
  { icon: Code2, value: "+15", label: "Proyectos entregados" },
  { icon: Sparkles, value: "AI", label: "First mindset" },
]

export function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-3">
              Sobre Mí
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-foreground dark:via-foreground dark:to-foreground">
                Conoce un poco más de mi historia
              </span>
            </h2>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Left: paragraphs */}
            <div className="lg:col-span-3 space-y-5">
              {aboutData.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base sm:text-lg leading-relaxed text-pretty text-foreground/85"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Right: stats card */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-blue-100 dark:border-border bg-card p-6 shadow-lg shadow-blue-900/5 dark:shadow-none">
                <ul className="space-y-5">
                  {stats.map(({ icon: Icon, value, label }) => (
                    <li key={label} className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 dark:from-primary dark:to-primary dark:shadow-none">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold leading-none">
                          {value}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {label}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
