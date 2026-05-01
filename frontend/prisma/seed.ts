import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // =========================================================================
  // 1. Admin user
  // =========================================================================
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME ?? 'Admin'

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required')
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, hashedPassword, name: adminName },
  })
  console.log(`Admin user ready: ${adminEmail}`)

  // =========================================================================
  // 2. CMS default sections
  // =========================================================================
  const defaultSections = [
    // HOME - Hero
    {
      pageKey: 'home', sectionKey: 'hero', orderIndex: 1,
      title: 'Sección Principal - Inicio',
      description: 'Texto de bienvenida y llamada a la acción principal',
      content: {
        greeting: '👋 ¡Hola! Soy desarrollador Full Stack',
        title_line1: 'Creando experiencias web',
        title_line2: 'excepcionales',
        description: 'Especializado en React, Next.js, Node.js y Python. Transformo ideas en aplicaciones web modernas, escalables y centradas en el usuario.',
        primary_cta_text: 'Ver mis proyectos',
        primary_cta_link: '/projects',
        secondary_cta_text: 'Contáctame',
        secondary_cta_link: '/contact',
        social_links: [
          { text: 'GitHub', url: 'https://github.com', icon: 'https://cdn.simpleicons.org/github', enabled: true },
          { text: 'LinkedIn', url: 'https://linkedin.com', icon: 'https://cdn.simpleicons.org/linkedin', enabled: true },
          { text: 'Email', url: 'mailto:contact@example.com', icon: 'https://cdn.simpleicons.org/gmail', enabled: true },
          { text: 'WhatsApp', url: 'https://wa.me/34XXXXXXXXX', icon: 'https://cdn.simpleicons.org/whatsapp', enabled: false },
        ],
      },
    },
    // HOME - Featured Projects
    {
      pageKey: 'home', sectionKey: 'featured_projects', orderIndex: 2,
      title: 'Proyectos Destacados',
      description: 'Encabezado de la sección de proyectos destacados',
      content: {
        title: 'Proyectos Destacados',
        description: 'Una selección de mis trabajos más recientes y significativos, donde aplico las últimas tecnologías y mejores prácticas.',
        button_text: 'Ver todos los proyectos',
        button_url: '/projects',
        max_projects: 6,
      },
    },
    // ABOUT - Hero
    {
      pageKey: 'about', sectionKey: 'hero', orderIndex: 1,
      title: 'Encabezado - Sobre Mí',
      description: 'Información principal de la página Sobre Mí',
      content: {
        initials: 'JD',
        title: 'Sobre Mí',
        subtitle: 'Soy un desarrollador full stack apasionado por crear experiencias digitales excepcionales y soluciones tecnológicas innovadoras.',
        social_links: [
          { text: 'Email', url: 'mailto:tu@email.com', icon: 'https://cdn.simpleicons.org/gmail/EA4335', enabled: true },
          { text: 'GitHub', url: 'https://github.com/tu-usuario', icon: 'https://cdn.simpleicons.org/github/181717', enabled: true },
          { text: 'LinkedIn', url: 'https://linkedin.com/in/tu-perfil', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2', enabled: true },
        ],
      },
    },
    // ABOUT - Bio
    {
      pageKey: 'about', sectionKey: 'bio', orderIndex: 2,
      title: 'Mi Historia',
      description: 'Biografía y trayectoria profesional',
      content: {
        paragraph_1: 'Mi viaje en el desarrollo de software comenzó hace más de 5 años, cuando descubrí mi pasión por resolver problemas complejos a través del código. Desde entonces, he tenido la oportunidad de trabajar en proyectos diversos, desde startups innovadoras hasta empresas establecidas.',
        paragraph_2: 'Me especializo en el desarrollo full stack, con un enfoque particular en tecnologías modernas como React, Next.js, Node.js y Python. Mi objetivo siempre es crear soluciones que no solo funcionen bien técnicamente, sino que también proporcionen una experiencia excepcional al usuario.',
        paragraph_3: 'Cuando no estoy programando, me gusta mantenerme actualizado con las últimas tendencias tecnológicas, contribuir a proyectos de código abierto, y compartir conocimientos con la comunidad de desarrolladores.',
      },
    },
    // ABOUT - Stats
    {
      pageKey: 'about', sectionKey: 'stats', orderIndex: 3,
      title: 'Estadísticas',
      description: 'Números destacados de mi carrera',
      content: {
        stats: [
          { label: 'Años de experiencia', value: '5+', icon: 'calendar' },
          { label: 'Proyectos completados', value: '50+', icon: 'briefcase' },
          { label: 'Clientes satisfechos', value: '30+', icon: 'users' },
          { label: 'Tazas de café', value: '∞', icon: 'coffee' },
        ],
      },
    },
    // ABOUT - Personal Info
    {
      pageKey: 'about', sectionKey: 'personal_info', orderIndex: 4,
      title: 'Información Personal',
      description: 'Datos de contacto, información profesional y redes sociales',
      content: {
        location: 'Madrid, España',
        timezone: 'GMT+1 (Madrid)',
        position: 'Senior Full Stack Developer',
        experience_years: '5+ años',
        availability_status: 'Disponible para proyectos',
        languages: ['Español (Nativo)', 'Inglés (Avanzado)', 'Francés (Intermedio)'],
        contact_links: [
          { text: 'Email', url: 'mailto:tu@email.com', icon: 'https://cdn.simpleicons.org/gmail/EA4335', enabled: true },
          { text: 'WhatsApp', url: 'https://wa.me/1234567890', icon: 'https://cdn.simpleicons.org/whatsapp/25D366', enabled: true },
          { text: 'Calendly', url: 'https://calendly.com/tu-usuario', icon: 'https://cdn.simpleicons.org/calendly/006BFF', enabled: true },
          { text: 'GitHub', url: 'https://github.com/tu-usuario', icon: 'https://cdn.simpleicons.org/github/181717', enabled: true },
          { text: 'LinkedIn', url: 'https://linkedin.com/in/tu-perfil', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2', enabled: true },
          { text: 'Twitter', url: 'https://twitter.com/tu-usuario', icon: 'https://cdn.simpleicons.org/x/000000', enabled: true },
          { text: 'Stack Overflow', url: 'https://stackoverflow.com/users/tu-id', icon: 'https://cdn.simpleicons.org/stackoverflow/F58025', enabled: true },
          { text: 'Dev.to', url: 'https://dev.to/tu-usuario', icon: 'https://cdn.simpleicons.org/devdotto/0A0A0A', enabled: true },
          { text: 'Discord', url: 'https://discord.com/users/tu-id', icon: 'https://cdn.simpleicons.org/discord/5865F2', enabled: false },
          { text: 'Telegram', url: 'https://t.me/tu-usuario', icon: 'https://cdn.simpleicons.org/telegram/26A5E4', enabled: false },
        ],
      },
    },
    // ABOUT - Skills
    {
      pageKey: 'about', sectionKey: 'skills', orderIndex: 5,
      title: 'Habilidades Técnicas',
      description: 'Tecnologías y herramientas que domino',
      content: {
        skills: [
          { name: 'JavaScript/TypeScript', level: 95, category: 'Frontend' },
          { name: 'React/Next.js', level: 90, category: 'Frontend' },
          { name: 'Node.js', level: 85, category: 'Backend' },
          { name: 'Python', level: 80, category: 'Backend' },
          { name: 'PostgreSQL', level: 75, category: 'Database' },
          { name: 'Docker', level: 70, category: 'DevOps' },
        ],
      },
    },
    // ABOUT - Hobbies
    {
      pageKey: 'about', sectionKey: 'hobbies', orderIndex: 6,
      title: 'Intereses y Hobbies',
      description: 'Mis pasiones fuera del código',
      content: {
        hobbies: ['Código Abierto', 'Inteligencia Artificial', 'Fotografía', 'Viajes', 'Música', 'Gaming', 'Lectura', 'Deportes'],
      },
    },
    // ABOUT - CTA
    {
      pageKey: 'about', sectionKey: 'cta', orderIndex: 7,
      title: 'Call to Action',
      description: 'Invitación a colaborar',
      content: {
        title: '¿Trabajamos juntos?',
        description: 'Siempre estoy abierto a nuevas oportunidades y proyectos interesantes.',
        button_primary_text: 'Contactar',
        button_primary_url: '/contact',
        button_secondary_text: 'Ver proyectos',
        button_secondary_url: '/projects',
      },
    },
    // ABOUT - Experience
    {
      pageKey: 'about', sectionKey: 'experience', orderIndex: 8,
      title: 'Experiencia Profesional',
      description: 'Mi trayectoria laboral',
      content: {
        experience: [
          {
            title: 'Desarrollador Full Stack Senior',
            company: 'Tech Company S.L.',
            period: '2022 - Presente',
            description: 'Desarrollo de aplicaciones web modernas usando React, Next.js y Node.js. Liderazgo técnico en proyectos de gran escala.',
            achievements: ['Mejoré el rendimiento de la aplicación principal en un 40%', 'Lideré un equipo de 4 desarrolladores', 'Implementé arquitectura de microservicios'],
          },
          {
            title: 'Desarrollador Frontend',
            company: 'Startup Innovadora',
            period: '2020 - 2022',
            description: 'Especialización en interfaces de usuario modernas y experiencia de usuario optimizada.',
            achievements: ['Desarrollé 3 aplicaciones web desde cero', 'Reduje el tiempo de carga en un 60%', 'Implementé testing automatizado'],
          },
          {
            title: 'Desarrollador Junior',
            company: 'Agencia Digital',
            period: '2019 - 2020',
            description: 'Primeros pasos en el desarrollo profesional, trabajando en proyectos diversos para diferentes clientes.',
            achievements: ['Completé más de 20 proyectos web', 'Aprendí múltiples tecnologías', 'Colaboré con equipos multidisciplinarios'],
          },
        ],
      },
    },
    // ABOUT - Education
    {
      pageKey: 'about', sectionKey: 'education', orderIndex: 9,
      title: 'Educación y Certificaciones',
      description: 'Mi formación académica y profesional',
      content: {
        education: [
          { title: 'Ingeniería Informática', institution: 'Universidad Politécnica de Madrid', period: '2015 - 2019', description: 'Especialización en Desarrollo de Software y Sistemas Distribuidos' },
          { title: 'Certificación AWS Solutions Architect', institution: 'Amazon Web Services', period: '2023', description: 'Certificación profesional en arquitectura de soluciones en la nube' },
        ],
      },
    },
    // ABOUT - Testimonials
    {
      pageKey: 'about', sectionKey: 'testimonials', orderIndex: 10,
      title: 'Testimonios',
      description: 'Lo que dicen mis clientes y colegas',
      content: {
        title: 'Lo que dicen de mi trabajo',
        testimonials: [
          { message: 'Excelente desarrollador, siempre entrega proyectos de alta calidad en tiempo y forma. Su atención al detalle es impresionante.', name: 'María García', role: 'CEO, Tech Startup', initials: 'MG' },
          { message: 'Trabajar con él fue una experiencia fantástica. Su conocimiento técnico y capacidad de comunicación son excepcionales.', name: 'Juan López', role: 'CTO, Digital Agency', initials: 'JL' },
          { message: 'Un profesional comprometido que siempre va más allá de lo esperado. Recomiendo su trabajo sin dudarlo.', name: 'Ana Rodríguez', role: 'Product Manager', initials: 'AR' },
        ],
      },
    },
    // CONTACT - Header
    {
      pageKey: 'contact', sectionKey: 'header', orderIndex: 1,
      title: 'Encabezado - Contacto',
      description: 'Título y descripción de la página de contacto',
      content: {
        title: 'Contacto',
        subtitle: '¿Tienes un proyecto en mente? ¿Quieres colaborar? Me encantaría escuchar de ti. Contacta conmigo y hablemos de tu próximo proyecto.',
      },
    },
    // CONTACT - Contact Info
    {
      pageKey: 'contact', sectionKey: 'contact_info', orderIndex: 2,
      title: 'Información de Contacto',
      description: 'Métodos de contacto disponibles',
      content: {
        title: 'Información de Contacto',
        description: 'Puedes contactarme a través de los siguientes medios. Respondo generalmente en 24-48 horas.',
        contact_methods: [
          { icon: 'https://cdn.simpleicons.org/gmail/EA4335', label: 'Email', value: 'tu@email.com', link: 'mailto:tu@email.com', enabled: true },
          { icon: 'https://cdn.simpleicons.org/linkedin/0A66C2', label: 'LinkedIn', value: 'Tu Perfil', link: 'https://linkedin.com/in/tu-perfil', enabled: true },
          { icon: 'https://cdn.simpleicons.org/github/181717', label: 'GitHub', value: 'tu-usuario', link: 'https://github.com/tu-usuario', enabled: true },
        ],
      },
    },
    // CONTACT - Availability
    {
      pageKey: 'contact', sectionKey: 'availability', orderIndex: 3,
      title: 'Disponibilidad',
      description: 'Horarios y disponibilidad para proyectos',
      content: {
        title: 'Disponibilidad',
        status: 'Disponible para nuevos proyectos',
        status_type: 'available',
        description: 'Actualmente estoy disponible para proyectos freelance y oportunidades de colaboración. Mi horario de respuesta es de lunes a viernes, 9:00 AM - 6:00 PM (GMT-5).',
        response_time: '24-48 horas',
        show_availability: true,
      },
    },
    // CONTACT - Call CTA
    {
      pageKey: 'contact', sectionKey: 'call_cta', orderIndex: 4,
      title: 'Llamada a la Acción',
      description: 'CTA final de la página de contacto',
      content: {
        title: '¿Listo para comenzar?',
        description: 'No dudes en contactarme si tienes alguna pregunta o si quieres discutir un proyecto. Estoy aquí para ayudarte a hacer realidad tus ideas.',
        button_text: 'Enviar Mensaje',
        button_action: 'scroll_to_top',
        show_cta: true,
      },
    },
    // CONTACT - FAQ
    {
      pageKey: 'contact', sectionKey: 'faq', orderIndex: 5,
      title: 'Preguntas Frecuentes',
      description: 'Respuestas a preguntas comunes',
      content: {
        title: 'Preguntas Frecuentes',
        description: 'Aquí encontrarás respuestas a las preguntas más comunes que recibo.',
        faqs: [
          { question: '¿Cuánto tiempo toma completar un proyecto?', answer: 'El tiempo varía según la complejidad del proyecto. Un sitio web básico puede tomar de 2-4 semanas, mientras que aplicaciones más complejas pueden tomar de 2-3 meses.' },
          { question: '¿Trabajas de forma remota?', answer: 'Sí, trabajo de forma 100% remota. Utilizo herramientas de colaboración modernas para mantener una comunicación fluida con mis clientes, sin importar la ubicación.' },
          { question: '¿Ofreces soporte post-lanzamiento?', answer: 'Sí, ofrezco soporte y mantenimiento después del lanzamiento. Podemos discutir diferentes paquetes de soporte según tus necesidades específicas.' },
          { question: '¿Cuáles son tus tecnologías principales?', answer: 'Trabajo principalmente con React, Next.js, TypeScript, Python y PostgreSQL. También tengo experiencia con otras tecnologías y siempre estoy aprendiendo nuevas herramientas.' },
        ],
        show_faq: true,
      },
    },
    // FOOTER - Main
    {
      pageKey: 'footer', sectionKey: 'main', orderIndex: 1,
      title: 'Pie de Página Principal',
      description: 'Contenido completo del footer del sitio',
      content: {
        brand_name: 'Portafolio',
        brand_description: 'Desarrollador Full Stack especializado en crear experiencias web modernas y escalables.',
        links_title: 'Enlaces',
        links: [
          { text: 'Proyectos', url: '/projects' },
          { text: 'Sobre mí', url: '/about' },
          { text: 'Contacto', url: '/contact' },
        ],
        social_title: 'Sígueme',
        social_links: [
          { text: 'GitHub', url: 'https://github.com', icon: 'https://cdn.simpleicons.org/github' },
          { text: 'LinkedIn', url: 'https://linkedin.com', icon: 'https://cdn.simpleicons.org/linkedin' },
          { text: 'Twitter', url: 'https://twitter.com', icon: 'https://cdn.simpleicons.org/twitter' },
        ],
        contact_title: 'Contacto',
        contact_text: '¿Tienes un proyecto en mente?',
        contact_cta: 'Hablemos →',
        contact_url: '/contact',
        copyright_text: 'Portafolio Personal. Todos los derechos reservados.',
        legal_links: [
          { text: 'Privacidad', url: '/privacy' },
          { text: 'Términos', url: '/terms' },
        ],
      },
    },
    // PRIVACY - Header
    {
      pageKey: 'privacy', sectionKey: 'header', orderIndex: 1,
      title: 'Encabezado - Privacidad',
      description: 'Título y descripción de la página de privacidad',
      content: {
        title: 'Política de Privacidad',
        last_updated: '1 de Enero de 2024',
        description: 'Esta Política de Privacidad describe cómo se recopila, utiliza y comparte tu información personal cuando visitas este sitio web.',
      },
    },
    // PRIVACY - Sections
    {
      pageKey: 'privacy', sectionKey: 'sections', orderIndex: 2,
      title: 'Secciones - Privacidad',
      description: 'Contenido de las secciones de privacidad',
      content: {
        sections: [
          { title: 'Información que Recopilamos', icon: 'shield', content: 'Cuando visitas el sitio, recopilamos automáticamente cierta información sobre tu dispositivo, incluyendo información sobre tu navegador web, dirección IP, zona horaria y algunas de las cookies instaladas en tu dispositivo.' },
          { title: 'Uso de tu Información', icon: 'shield', content: 'Utilizamos la información que recopilamos para mejorar y optimizar nuestro sitio web, evaluar el éxito de nuestras campañas de marketing, y responder a tus comentarios o consultas.' },
          { title: 'Compartir tu Información', icon: 'shield', content: 'No vendemos, intercambiamos ni transferimos tu información personal identificable a terceros sin tu consentimiento.' },
          { title: 'Cookies y Tecnologías de Seguimiento', icon: 'shield', content: 'Utilizamos cookies y tecnologías similares de seguimiento para rastrear la actividad en nuestro sitio web y almacenar cierta información. Puedes configurar tu navegador para rechazar todas las cookies.' },
          { title: 'Seguridad de los Datos', icon: 'shield', content: 'Implementamos medidas de seguridad diseñadas para proteger tu información personal contra acceso no autorizado y uso indebido.' },
          { title: 'Tus Derechos', icon: 'shield', content: 'Tienes derecho a acceder, corregir, actualizar o solicitar la eliminación de tu información personal. Si deseas ejercer estos derechos, contáctanos.' },
          { title: 'Cambios a esta Política', icon: 'shield', content: 'Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cualquier cambio publicando la nueva política de privacidad en esta página.' },
          { title: 'Contacto', icon: 'shield', content: 'Si tienes preguntas sobre esta Política de Privacidad, no dudes en contactarnos a través del formulario de contacto en el sitio web.' },
        ],
      },
    },
    // TERMS - Header
    {
      pageKey: 'terms', sectionKey: 'header', orderIndex: 1,
      title: 'Encabezado - Términos',
      description: 'Título y descripción de la página de términos',
      content: {
        title: 'Términos y Condiciones',
        last_updated: '1 de Enero de 2024',
        description: 'Por favor, lee estos términos y condiciones cuidadosamente antes de usar nuestro sitio web.',
      },
    },
    // TERMS - Sections
    {
      pageKey: 'terms', sectionKey: 'sections', orderIndex: 2,
      title: 'Secciones - Términos',
      description: 'Contenido de las secciones de términos y condiciones',
      content: {
        sections: [
          { title: 'Aceptación de los Términos', content: 'Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso.' },
          { title: 'Uso del Sitio Web', content: 'Este sitio web es un portafolio personal que muestra proyectos, habilidades y experiencia profesional. El contenido del sitio se proporciona únicamente con fines informativos.' },
          { title: 'Propiedad Intelectual', content: 'El contenido de este sitio web, incluyendo texto, gráficos, logotipos, imágenes y código fuente, es propiedad del titular del sitio web y está protegido por leyes de propiedad intelectual.' },
          { title: 'Enlaces a Sitios de Terceros', content: 'Este sitio web puede contener enlaces a sitios web de terceros. No tenemos control sobre el contenido de esos sitios y no asumimos responsabilidad por ellos.' },
          { title: 'Limitación de Responsabilidad', content: 'En ningún caso seremos responsables de daños directos, indirectos, incidentales o consecuentes que resulten del uso de este sitio web.' },
          { title: 'Proyectos Mostrados', content: 'Los proyectos mostrados en este portafolio son ejemplos del trabajo realizado. Los detalles se proporcionan con fines demostrativos.' },
          { title: 'Modificaciones de los Términos', content: 'Nos reservamos el derecho de revisar estos términos en cualquier momento. Al continuar usando el sitio, aceptas estar sujeto a los términos revisados.' },
          { title: 'Ley Aplicable', content: 'Estos términos y condiciones se rigen de acuerdo con las leyes del país en el que reside el titular del sitio web.' },
          { title: 'Contacto', content: 'Si tienes alguna pregunta sobre estos Términos y Condiciones, no dudes en ponerte en contacto a través del formulario de contacto.' },
        ],
      },
    },
    // NAVBAR - Main
    {
      pageKey: 'navbar', sectionKey: 'main', orderIndex: 1,
      title: 'Barra de Menú Pública',
      description: 'Configuración de la barra de navegación pública',
      content: {
        brand_name: 'Portfolio',
        brand_letter: 'P',
        navigation_links: [
          { text: 'Inicio', url: '/', enabled: true },
          { text: 'Sobre Mí', url: '/about', enabled: true },
          { text: 'Proyectos', url: '/projects', enabled: true },
          { text: 'Contacto', url: '/contact', enabled: true },
        ],
        social_links: [
          { text: 'GitHub', url: 'https://github.com/tu-usuario', icon: 'https://cdn.simpleicons.org/github/181717', enabled: true },
          { text: 'LinkedIn', url: 'https://linkedin.com/in/tu-perfil', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2', enabled: true },
          { text: 'Email', url: 'mailto:tu@email.com', icon: 'https://cdn.simpleicons.org/gmail/EA4335', enabled: true },
        ],
        login_button: { text: 'Iniciar Sesión', url: '/admin/login', enabled: true },
      },
    },
    // ADMIN HEADER - Main
    {
      pageKey: 'admin_header', sectionKey: 'main', orderIndex: 1,
      title: 'Barra de Menú Admin',
      description: 'Configuración de la barra de navegación del panel admin',
      content: {
        brand_name: 'Panel Admin',
        navigation_links: [
          { text: 'Dashboard', url: '/admin', enabled: true },
          { text: 'Proyectos', url: '/admin/projects', enabled: true },
          { text: 'Gestión Web', url: '/admin/cms', enabled: true },
          { text: 'Settings', url: '/admin/settings', enabled: true },
        ],
      },
    },
    // PROJECTS - Header
    {
      pageKey: 'projects', sectionKey: 'header', orderIndex: 1,
      title: 'Encabezado - Proyectos',
      description: 'Título y descripción principal de la página de proyectos',
      content: {
        title: 'Mis Proyectos',
        description: 'Explora mi colección de proyectos de desarrollo web, aplicaciones móviles y más. Cada proyecto representa un desafío único y una oportunidad de aprendizaje.',
      },
    },
    // PROJECTS - Filters
    {
      pageKey: 'projects', sectionKey: 'filters', orderIndex: 2,
      title: 'Filtros y Búsqueda',
      description: 'Configuración de filtros y búsqueda de proyectos',
      content: {
        title: 'Filtros y Búsqueda',
        search_placeholder: 'Buscar proyectos por nombre, descripción o tecnología...',
        show_search: true,
        show_technology_filter: true,
        show_view_toggle: true,
        filter_label: 'Encuentra proyectos específicos usando los filtros y la búsqueda',
      },
    },
    // PROJECTS - CTA
    {
      pageKey: 'projects', sectionKey: 'cta', orderIndex: 3,
      title: 'Llamada a la Acción',
      description: 'Sección de llamada a la acción al final de la página de proyectos',
      content: {
        title: '¿Interesado en trabajar juntos?',
        description: 'Estoy siempre abierto a discutir nuevos proyectos, ideas creativas o oportunidades para formar parte de tu visión.',
        button_text: 'Contáctame',
        button_url: '/contact',
        show_cta: true,
      },
    },
  ]

  for (const section of defaultSections) {
    await prisma.pageContent.upsert({
      where: { pageKey_sectionKey: { pageKey: section.pageKey, sectionKey: section.sectionKey } },
      update: {},
      create: {
        pageKey: section.pageKey,
        sectionKey: section.sectionKey,
        title: section.title,
        description: section.description,
        content: section.content,
        orderIndex: section.orderIndex,
      },
    })
  }
  console.log(`CMS sections ready: ${defaultSections.length} sections`)

  // =========================================================================
  // 3. Default settings singleton
  // =========================================================================
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      data: {
        site_name: 'Mi Portafolio',
        site_description: 'Desarrollador Full Stack — Portafolio Personal',
        contact_email: '',
        contact_phone: '',
        contact_location: '',
        contact_availability: 'Disponible para proyectos',
        social_links: [],
        seo_title: 'Mi Portafolio | Desarrollador Full Stack',
        seo_description: 'Portafolio personal de desarrollador Full Stack especializado en React, Next.js y Python.',
        seo_keywords: 'desarrollador, full stack, react, nextjs, python, portafolio',
        theme_mode: 'auto',
        primary_color: '#3b82f6',
        maintenance_mode: false,
        banner_enabled: false,
        banner_type: 'info',
        newsletter_enabled: false,
      },
    },
  })
  console.log('Settings ready')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
