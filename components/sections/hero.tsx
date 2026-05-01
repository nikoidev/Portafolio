"use client"

import { ArrowDown } from "lucide-react"
import { profileData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { TechMarquee } from "@/components/tech-marquee"
import { SocialIcons } from "@/components/social-icons"

export function HeroSection() {
  const handleScrollTo = (href: string) => {
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="inicio"
      className="min-h-[90vh] flex items-center justify-center pt-20 pb-8"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Bienvenido a mi portafolio
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:text-foreground">
              {profileData.name}
            </span>
          </h1>
          <p className="text-lg sm:text-xl font-medium mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:text-primary">
              {profileData.title}
            </span>
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto text-pretty">
            {profileData.shortDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button
              size="lg"
              onClick={() => handleScrollTo("#proyectos")}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/25 dark:shadow-none dark:bg-primary dark:hover:bg-primary/90 dark:from-primary dark:to-primary"
            >
              Ver Proyectos
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleScrollTo("#contacto")}
              className="w-full sm:w-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-border dark:hover:bg-secondary"
            >
              Contactar
            </Button>
          </div>

          {/* Tech Stack Marquee */}
          <TechMarquee />

          {/* Social Links */}
          <SocialIcons />

          {/* Scroll indicator */}
          <div className="mt-8 animate-bounce">
            <button
              onClick={() => handleScrollTo("#sobre-mi")}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Scroll down"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
