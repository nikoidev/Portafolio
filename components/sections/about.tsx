import { aboutData } from "@/lib/data"

export function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
              Sobre Mí
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-6">
            {aboutData.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
