import { profileData } from "@/lib/data"
import { SocialIcons } from "@/components/social-icons"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contacto" className="py-16 border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-lg font-medium text-foreground mb-2">
              {"¿Tienes un proyecto en mente?"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {"Estoy disponible para nuevas oportunidades y colaboraciones."}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <a
              href={`mailto:${profileData.email}`}
              className="hover:text-foreground transition-colors"
            >
              {profileData.email}
            </a>
            <span className="hidden sm:block">•</span>
            <a
              href={`tel:${profileData.phone.replace(/\s/g, "")}`}
              className="hover:text-foreground transition-colors"
            >
              {profileData.phone}
            </a>
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <SocialIcons />
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} {profileData.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
