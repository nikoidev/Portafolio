"use client"

// Tech stack slugs for Simple Icons CDN
const techStack = [
  "python",
  "fastapi",
  "django",
  "nextdotjs",
  "react",
  "typescript",
  "postgresql",
  "docker",
  "amazonaws",
  "githubactions",
  "langchain",
  "n8n",
  "anthropic",
]

// Icons that need invert in dark mode (black logos)
const darkModeInvert = ["nextdotjs", "github", "anthropic"]

export function TechMarquee() {
  return (
    <div className="w-full overflow-hidden py-10 mt-8">
      <div className="relative">
        {/* Gradient masks for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Marquee container */}
        <div className="flex animate-marquee group hover:[animation-play-state:paused]">
          {/* First set of items */}
          {techStack.map((tech, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center justify-center px-12 mx-8 transition-transform duration-300 hover:scale-110"
            >
              <img
                src={`https://cdn.simpleicons.org/${tech}`}
                alt={tech}
                className={`w-10 h-10 opacity-50 transition-opacity duration-300 hover:opacity-100 ${
                  darkModeInvert.includes(tech) ? "dark:invert" : ""
                }`}
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {techStack.map((tech, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center justify-center px-12 mx-8 transition-transform duration-300 hover:scale-110"
            >
              <img
                src={`https://cdn.simpleicons.org/${tech}`}
                alt={tech}
                className={`w-10 h-10 opacity-50 transition-opacity duration-300 hover:opacity-100 ${
                  darkModeInvert.includes(tech) ? "dark:invert" : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
