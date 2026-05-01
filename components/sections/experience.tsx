import { experienceData } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export function ExperienceSection() {
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
                {experienceData.map((experience, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col md:flex-row gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                    {/* Date */}
                    <div
                      className={`md:w-1/2 pl-8 md:pl-0 ${
                        index % 2 === 0
                          ? "md:text-right md:pr-12"
                          : "md:text-left md:pl-12"
                      }`}
                    >
                      <span className="text-sm text-muted-foreground">
                        {experience.period}
                      </span>
                    </div>

                    {/* Content */}
                    <div
                      className={`md:w-1/2 pl-8 md:pl-0 ${
                        index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"
                      }`}
                    >
                      <h3 className="text-base font-medium text-foreground mb-1">
                        {experience.role}
                      </h3>
                      <p className="text-sm text-primary mb-3">
                        {experience.company}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {experience.description}
                      </p>
                      <div
                        className={`flex flex-wrap gap-2 ${
                          index % 2 !== 0 ? "md:justify-end" : ""
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
