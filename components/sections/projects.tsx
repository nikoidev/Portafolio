"use client"

import { useState } from "react"
import { Github, ExternalLink, Images } from "lucide-react"
import { projectsData, type Project } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageGalleryModal } from "@/components/image-gallery-modal"

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const openGallery = (project: Project) => {
    setSelectedProject(project)
  }

  const closeGallery = () => {
    setSelectedProject(null)
  }

  return (
    <section id="proyectos" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
              Proyectos
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => {
              const hasGithub = !!project.githubUrl
              const hasDemo = !!project.demoUrl
              const hasImages = project.images && project.images.length > 0
              const hasAnyButton = hasGithub || hasDemo || hasImages

              return (
                <article
                  key={project.id}
                  className="group rounded-lg border border-blue-100 dark:border-border bg-card overflow-hidden shadow-lg shadow-blue-900/5 dark:shadow-none hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 dark:hover:border-primary/20 transition-all duration-300"
                >
                  {/* Project Image */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/20">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-5">
                    <h3 className="text-base font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs font-normal px-2 py-0.5"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal px-2 py-0.5"
                        >
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Conditional Buttons */}
                    {hasAnyButton && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {hasGithub && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1 min-w-fit"
                          >
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4 mr-2" />
                              Código
                            </a>
                          </Button>
                        )}
                        {hasDemo && (
                          <Button
                            variant="default"
                            size="sm"
                            asChild
                            className="flex-1 min-w-fit"
                          >
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Demo
                            </a>
                          </Button>
                        )}
                        {hasImages && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openGallery(project)}
                            className="flex-1 min-w-fit"
                          >
                            <Images className="h-4 w-4 mr-2" />
                            Capturas
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {selectedProject && selectedProject.images && (
        <ImageGalleryModal
          images={selectedProject.images}
          projectTitle={selectedProject.title}
          isOpen={!!selectedProject}
          onClose={closeGallery}
        />
      )}
    </section>
  )
}
