// ===========================================
// PORTFOLIO DATA - Edit this file to update your portfolio
// ===========================================

export const profileData = {
  name: "Nicolas A. Urbaez A.",
  title: "Programador Full-Stack (Python & Next.js) | Especialista en IA y Automatización",
  shortDescription:
    "Más de 3 años de experiencia construyendo soluciones web robustas y automatizando procesos con IA. Experto en transformar procesos manuales en sistemas autónomos y escalables.",
  email: "Maran.nick15@gmail.com",
  phone: "+34 608898454",
  website: "https://nikoidev.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
}

export const aboutData = {
  paragraphs: [
    "Soy un desarrollador Full-Stack apasionado por crear código limpio y arquitecturas de alta calidad. Mi enfoque está en construir soluciones escalables que resuelvan problemas reales de negocio.",
    "He integrado herramientas como n8n y Claude Code (MCP) en mis flujos de trabajo para potenciar la eficiencia y automatizar tareas repetitivas. Creo firmemente que la IA es una herramienta poderosa cuando se utiliza estratégicamente.",
    "Mi trayectoria ha evolucionado desde Soporte Técnico IT hasta el Desarrollo Backend avanzado, lo que me ha dado una perspectiva única sobre todo el ciclo de vida del software y las necesidades reales de los usuarios finales.",
  ],
}

export const skillsData = {
  backend: ["Python", "FastAPI", "Django", "SQLAlchemy", "Postgres", "SQLite"],
  frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  ai: ["n8n", "Claude Code (MCP)", "LangChain", "LangGraph", "Agentes IA"],
  devops: ["Docker", "AWS", "GCP", "GitHub Actions", "CI/CD", "Git"],
}

export const experienceData = [
  {
    company: "Empresa de Construcción e Instalaciones",
    role: "Desarrollador Full-Stack Freelance",
    period: "Oct 2025 - Feb 2026",
    description:
      "Arquitectura de un ERP/CMS personalizado con FastAPI y Next.js. Implementación de automatizaciones con n8n y agentes IA basados en LLMs para procesamiento inteligente de documentos. Integración de MCP (Model Context Protocol) para conectar herramientas externas con Claude.",
    technologies: ["FastAPI", "Next.js", "n8n", "PostgreSQL", "LLMs", "MCP"],
  },
  {
    company: "Divain Team S.L",
    role: "Programador Full-Stack",
    period: "Jun 2025 - Sep 2025",
    description:
      "Optimización del sistema de gestión de almacén con Flask y PostgreSQL. Despliegues y configuración de infraestructura en AWS. Exploración de soluciones con LLMs para automatizar reportes y análisis de datos.",
    technologies: ["Flask", "PostgreSQL", "AWS", "Python", "LLMs"],
  },
  {
    company: "Nexus Big Data",
    role: "Prácticas - Desarrollador Backend",
    period: "Feb 2025 - May 2025",
    description:
      "Desarrollo de APIs RESTful con FastAPI e interfaces de usuario con React/TypeScript. Primera experiencia profesional en entorno corporativo con enfoque en integración de datos.",
    technologies: ["FastAPI", "React", "TypeScript", "REST APIs"],
  },
  {
    company: "Pdm Score C.A",
    role: "Programador Full-Stack",
    period: "2023 - 2024",
    description:
      "Desarrollo de sistemas de gestión empresarial. Implementación robusta del lado del backend utilizando Python y el framework Django. Primeros experimentos con modelos de lenguaje (LLMs) para asistencia en código.",
    technologies: ["Python", "Django", "PostgreSQL", "REST APIs"],
  },
  {
    company: "Espacio S.R.L",
    role: "Programador Full-Stack Junior",
    period: "2021 - 2022",
    description:
      "Desarrollo de plataforma documental para el sector minero utilizando FastAPI y Next.js. Gestión de documentación técnica y reportes automatizados.",
    technologies: ["FastAPI", "Next.js", "Docker", "PostgreSQL"],
  },
]

// ===========================================
// EDUCATION & CERTIFICATIONS DATA
// ===========================================

export interface Education {
  year: string
  title: string
  institution: string
  location: string
}

export interface Course {
  title: string
  platform: string
}

export const educationData: Education[] = [
  {
    year: "2025",
    title: "Especialización en IA",
    institution: "Tokio School",
    location: "España",
  },
  {
    year: "2024 - 2025",
    title: "Programador Python",
    institution: "Tokio School",
    location: "España",
  },
  {
    year: "2013 - 2016",
    title: "T.S.U. en Informática",
    institution: "Universidad Ludovico Silva",
    location: "Venezuela",
  },
]

export const coursesData: Course[] = [
  { title: "Claude Code, Agentes IA, LangChain & LangGraph", platform: "Udemy" },
  { title: "Python & Django", platform: "Udemy" },
  { title: "Docker", platform: "DevTalles" },
  { title: "PostgreSQL", platform: "DevTalles" },
  { title: "TypeScript", platform: "DevTalles" },
  { title: "Next.js", platform: "DevTalles" },
]

// Types for projects
export interface ProjectImage {
  url: string
  description: string
}

export interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  images?: ProjectImage[]
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Sistema ERP con IA",
    description:
      "Plataforma de gestión empresarial con automatizaciones inteligentes usando n8n y agentes de IA para procesamiento de documentos.",
    technologies: ["Next.js", "FastAPI", "n8n", "PostgreSQL", "Docker"],
    githubUrl: "https://github.com",
    demoUrl: "https://demo.com",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
        description: "Dashboard principal del ERP mostrando métricas en tiempo real, gráficos de ventas y resumen de actividad reciente.",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
        description: "Módulo de automatización con n8n integrado, permitiendo crear flujos de trabajo visuales para procesar documentos.",
      },
      {
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop",
        description: "Panel de gestión de inventario con seguimiento en tiempo real y alertas automáticas de stock bajo.",
      },
    ],
  },
  {
    id: 2,
    title: "API de Automatización",
    description:
      "Backend robusto para automatizar flujos de trabajo empresariales con integración de LangChain y procesamiento de lenguaje natural.",
    technologies: ["Python", "FastAPI", "LangChain", "Redis", "AWS"],
    githubUrl: "https://github.com",
  },
  {
    id: 3,
    title: "Dashboard Analytics",
    description:
      "Panel de control interactivo para visualización de datos en tiempo real con gráficos dinámicos y reportes automatizados.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    demoUrl: "https://demo.com",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
        description: "Vista principal del dashboard con gráficos interactivos y filtros personalizables por fecha y categoría.",
      },
    ],
  },
]

export const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#sobre-mi", label: "Sobre Mí" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#formacion", label: "Formación" },
  { href: "#proyectos", label: "Proyectos" },
]
