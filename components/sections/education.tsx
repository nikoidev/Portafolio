"use client"

import { GraduationCap, BookOpen, MapPin, Award } from "lucide-react"
import { educationData, coursesData } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EducationSection() {
  return (
    <section id="formacion" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Formación y Certificaciones
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mi trayectoria académica y formación continua en tecnologías modernas.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column 1: Formal Education - Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  Estudios Realizados
                </h3>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

                <div className="space-y-6">
                  {educationData.map((edu, index) => (
                    <div key={index} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-primary border-2 border-background" />

                      <Card className="bg-card/50 border-blue-100 dark:border-border/50 shadow-md shadow-blue-900/5 dark:shadow-none hover:border-blue-200 dark:hover:border-primary/30 transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs font-medium">
                              {edu.year}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {edu.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-1">
                            {edu.institution}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                            <MapPin className="h-3 w-3" />
                            <span>{edu.location}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Courses - Grid of badges */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  Cursos Destacados
                </h3>
              </div>

              <Card className="bg-card/50 border-blue-100 dark:border-border/50 shadow-lg shadow-blue-900/5 dark:shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificaciones y cursos completados
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {coursesData.map((course, index) => (
                      <div
                        key={index}
                        className="group p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-transparent hover:border-primary/20"
                      >
                        <p className="text-sm font-medium text-foreground mb-1 leading-tight">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.platform}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional info card */}
              <Card className="mt-4 bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Aprendizaje continuo:</span>{" "}
                    Constantemente actualizo mis conocimientos en IA, automatización y desarrollo web moderno.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
