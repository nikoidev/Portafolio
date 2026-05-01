"use client"

import { Badge } from "@/components/ui/badge"
import { experienceData } from "@/lib/data"
import { useEffect, useState } from "react"

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function formatLivePeriod(_startISO: string, now: Date): string {
  return `${MONTHS_ES[now.getMonth()]} ${now.getFullYear()} · Actualmente`
}

export function ExperienceSection() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="experiencia" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
              Experiencia
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Scrollable Timeline Container */}
          <div className="relative max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 transition-colors">
            <div className="relative pb-8">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-px bg-border" />

              <div className="space-y-12">
                {experienceData.map((experience, index) => {
                  const isCurrent = /actualidad|presente/i.test(experience.period)
                  const startDate = (experience as { startDate?: string }).startDate
                  const displayPeriod =
                    isCurrent && startDate && now
                      ? formatLivePeriod(startDate, now)
                      : experience.period
                  return (
                    <div
                      key={index}
                      className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                        }`}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 md:left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background ${isCurrent
                          ? "bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse"
                          : "bg-primary"
                          }`}
                      />

                      {/* Date */}
                      <div
                        className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0
                          ? "md:text-right md:pr-12"
                          : "md:text-left md:pl-12"
                          }`}
                      >
                        <span
                          className={`inline-flex items-center gap-2 text-sm ${isCurrent ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                            }`}
                        >
                          {isCurrent && (
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                          )}
                          {displayPeriod}
                        </span>
                      </div>

                      {/* Content */}
                      <div
                        className={`md:w-1/2 pl-8 md:pl-0 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"
                          }`}
                      >
                        <div
                          className={`flex items-center gap-2 mb-1 ${index % 2 !== 0 ? "md:justify-end" : ""
                            }`}
                        >
                          <h3 className="text-base font-medium text-foreground">
                            {experience.role}
                          </h3>
                          {isCurrent && (
                            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-0 text-[10px] uppercase tracking-wider px-2 py-0.5">
                              Actualmente
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-primary mb-3">
                          {experience.company}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {experience.description}
                        </p>
                        <div
                          className={`flex flex-wrap gap-2 ${index % 2 !== 0 ? "md:justify-end" : ""
                            }`}
                        >
                          {experience.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
