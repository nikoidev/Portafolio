"""
Servicio para gestión del CMS (Content Management System)
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.page_content import PageContent
from app.models.user import User
from app.schemas.cms import PageContentCreate, PageContentUpdate, PageInfo


class CMSService:
    """Servicio para gestionar contenido de páginas"""
    
    def __init__(self, db: Session):
        self.db = db
    
    # ========== CRUD Básico ==========
    
    def get_section(self, page_key: str, section_key: str) -> Optional[PageContent]:
        """Obtener una sección específica"""
        return self.db.query(PageContent).filter(
            PageContent.page_key == page_key,
            PageContent.section_key == section_key
        ).first()
    
    def get_page_sections(self, page_key: str, active_only: bool = False) -> List[PageContent]:
        """Obtener todas las secciones de una página"""
        query = self.db.query(PageContent).filter(PageContent.page_key == page_key)
        
        if active_only:
            query = query.filter(PageContent.is_active == True)
        
        return query.order_by(PageContent.order_index).all()
    
    def get_all_sections(self, active_only: bool = False) -> List[PageContent]:
        """Obtener todas las secciones de todas las páginas"""
        query = self.db.query(PageContent)
        
        if active_only:
            query = query.filter(PageContent.is_active == True)
        
        return query.order_by(PageContent.page_key, PageContent.order_index).all()
    
    def create_section(
        self,
        section_data: PageContentCreate,
        user: User
    ) -> PageContent:
        """Crear una nueva sección"""
        # Verificar si ya existe
        existing = self.get_section(section_data.page_key, section_data.section_key)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"La sección '{section_data.section_key}' ya existe en la página '{section_data.page_key}'"
            )
        
        section = PageContent(
            **section_data.model_dump(),
            last_edited_by=user.id
        )
        
        self.db.add(section)
        self.db.commit()
        self.db.refresh(section)
        
        return section
    
    def update_section(
        self,
        page_key: str,
        section_key: str,
        section_data: PageContentUpdate,
        user: User
    ) -> PageContent:
        """Actualizar una sección existente"""
        section = self.get_section(page_key, section_key)
        
        if not section:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sección '{section_key}' no encontrada en página '{page_key}'"
            )
        
        if not section.is_editable:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta sección no es editable"
            )
        
        # Actualizar campos
        update_data = section_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(section, field, value)
        
        # Incrementar versión y actualizar editor
        section.version += 1
        section.last_edited_by = user.id
        
        self.db.commit()
        self.db.refresh(section)
        
        return section
    
    def delete_section(self, page_key: str, section_key: str) -> bool:
        """Eliminar una sección"""
        section = self.get_section(page_key, section_key)
        
        if not section:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sección '{section_key}' no encontrada"
            )
        
        self.db.delete(section)
        self.db.commit()
        
        return True
    
    def reorder_section(
        self,
        page_key: str,
        section_key: str,
        direction: str
    ) -> PageContent:
        """Mover una sección arriba o abajo en el orden"""
        section = self.get_section(page_key, section_key)
        
        if not section:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sección '{section_key}' no encontrada"
            )
        
        # Obtener todas las secciones de la página ordenadas
        all_sections = self.get_page_sections(page_key, active_only=False)
        
        # Encontrar el índice actual
        current_index = None
        for i, s in enumerate(all_sections):
            if s.id == section.id:
                current_index = i
                break
        
        if current_index is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al encontrar la sección"
            )
        
        # Calcular nuevo índice
        if direction == "up":
            if current_index == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La sección ya está en la primera posición"
                )
            new_index = current_index - 1
        elif direction == "down":
            if current_index == len(all_sections) - 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La sección ya está en la última posición"
                )
            new_index = current_index + 1
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dirección inválida. Use 'up' o 'down'"
            )
        
        # Intercambiar los order_index
        section_to_swap = all_sections[new_index]
        section.order_index, section_to_swap.order_index = section_to_swap.order_index, section.order_index
        
        self.db.commit()
        self.db.refresh(section)
        
        return section
    
    # ========== Métodos de Utilidad ==========
    
    def get_available_pages(self) -> List[PageInfo]:
        """Obtener información de todas las páginas disponibles"""
        pages_config = {
            "home": {
                "label": "Inicio",
                "icon": "home",
                "description": "Página principal del portafolio"
            },
            "about": {
                "label": "Sobre Mí",
                "icon": "user",
                "description": "Información personal y profesional"
            },
            "projects": {
                "label": "Proyectos",
                "icon": "folder",
                "description": "Galería de proyectos"
            },
            "contact": {
                "label": "Contacto",
                "icon": "mail",
                "description": "Formulario de contacto"
            },
            "footer": {
                "label": "Footer",
                "icon": "layout",
                "description": "Pie de página del sitio web"
            },
            "navbar": {
                "label": "Menú Público",
                "icon": "menu",
                "description": "Barra de navegación pública"
            },
            "admin_header": {
                "label": "Menú Admin",
                "icon": "settings",
                "description": "Barra de navegación del panel admin"
            },
            "privacy": {
                "label": "Privacidad",
                "icon": "shield",
                "description": "Política de privacidad"
            },
            "terms": {
                "label": "Términos",
                "icon": "file-text",
                "description": "Términos y condiciones"
            }
        }
        
        pages_info = []
        
        for page_key, config in pages_config.items():
            sections_count = self.db.query(PageContent).filter(
                PageContent.page_key == page_key
            ).count()
            
            pages_info.append(PageInfo(
                page_key=page_key,
                label=config["label"],
                icon=config["icon"],
                description=config["description"],
                sections_count=sections_count
            ))
        
        return pages_info
    
    def get_stats(self) -> Dict[str, int]:
        """Obtener estadísticas del CMS"""
        total_sections = self.db.query(PageContent).count()
        active_sections = self.db.query(PageContent).filter(
            PageContent.is_active == True
        ).count()
        editable_sections = self.db.query(PageContent).filter(
            PageContent.is_editable == True
        ).count()
        
        # Contar páginas únicas
        unique_pages = self.db.query(PageContent.page_key).distinct().count()
        
        return {
            "total_pages": unique_pages,
            "total_sections": total_sections,
            "active_sections": active_sections,
            "editable_sections": editable_sections
        }
    
    def seed_default_content(self) -> List[PageContent]:
        """Crear contenido inicial por defecto"""
        default_sections = [
            # HOME - Hero Section
            PageContentCreate(
                page_key="home",
                section_key="hero",
                title="Sección Principal - Inicio",
                description="Texto de bienvenida y llamada a la acción principal",
                content={
                    "greeting": "👋 ¡Hola! Soy desarrollador Full Stack",
                    "title_line1": "Creando experiencias web",
                    "title_line2": "excepcionales",
                    "description": "Especializado en React, Next.js, Node.js y Python. Transformo ideas en aplicaciones web modernas, escalables y centradas en el usuario.",
                    "primary_cta_text": "Ver mis proyectos",
                    "primary_cta_link": "/projects",
                    "secondary_cta_text": "Descargar CV",
                    "secondary_cta_link": "/cv/download",
                    "social_links": [
                        {
                            "text": "GitHub",
                            "url": "https://github.com",
                            "icon": "https://cdn.simpleicons.org/github",
                            "enabled": True
                        },
                        {
                            "text": "LinkedIn",
                            "url": "https://linkedin.com",
                            "icon": "https://cdn.simpleicons.org/linkedin",
                            "enabled": True
                        },
                        {
                            "text": "Email",
                            "url": "mailto:contact@example.com",
                            "icon": "https://cdn.simpleicons.org/gmail",
                            "enabled": True
                        },
                        {
                            "text": "WhatsApp",
                            "url": "https://wa.me/34XXXXXXXXX",
                            "icon": "https://cdn.simpleicons.org/whatsapp",
                            "enabled": False
                        }
                    ]
                },
                order_index=1
            ),
            # HOME - Featured Projects Section
            PageContentCreate(
                page_key="home",
                section_key="featured_projects",
                title="Proyectos Destacados",
                description="Encabezado de la sección de proyectos destacados",
                content={
                    "title": "Proyectos Destacados",
                    "description": "Una selección de mis trabajos más recientes y significativos, donde aplico las últimas tecnologías y mejores prácticas.",
                    "button_text": "Ver todos los proyectos",
                    "button_url": "/projects",
                    "max_projects": 6
                },
                order_index=2
            ),
            # ABOUT - Hero Section
            PageContentCreate(
                page_key="about",
                section_key="hero",
                title="Encabezado - Sobre Mí",
                description="Información principal de la página Sobre Mí",
                content={
                    "initials": "JD",
                    "title": "Sobre Mí",
                    "subtitle": "Soy un desarrollador full stack apasionado por crear experiencias digitales excepcionales y soluciones tecnológicas innovadoras.",
                    "social_links": [
                        {"text": "Email", "url": "mailto:tu@email.com", "icon": "https://cdn.simpleicons.org/gmail/EA4335", "enabled": True},
                        {"text": "GitHub", "url": "https://github.com/tu-usuario", "icon": "https://cdn.simpleicons.org/github/181717", "enabled": True},
                        {"text": "LinkedIn", "url": "https://linkedin.com/in/tu-perfil", "icon": "https://cdn.simpleicons.org/linkedin/0A66C2", "enabled": True}
                    ]
                },
                order_index=1
            ),
            # ABOUT - Bio Section
            PageContentCreate(
                page_key="about",
                section_key="bio",
                title="Mi Historia",
                description="Biografía y trayectoria profesional",
                content={
                    "paragraph_1": "Mi viaje en el desarrollo de software comenzó hace más de 5 años, cuando descubrí mi pasión por resolver problemas complejos a través del código. Desde entonces, he tenido la oportunidad de trabajar en proyectos diversos, desde startups innovadoras hasta empresas establecidas.",
                    "paragraph_2": "Me especializo en el desarrollo full stack, con un enfoque particular en tecnologías modernas como React, Next.js, Node.js y Python. Mi objetivo siempre es crear soluciones que no solo funcionen bien técnicamente, sino que también proporcionen una experiencia excepcional al usuario.",
                    "paragraph_3": "Cuando no estoy programando, me gusta mantenerme actualizado con las últimas tendencias tecnológicas, contribuir a proyectos de código abierto, y compartir conocimientos con la comunidad de desarrolladores."
                },
                order_index=2
            ),
            # ABOUT - Stats Section
            PageContentCreate(
                page_key="about",
                section_key="stats",
                title="Estadísticas",
                description="Números destacados de mi carrera",
                content={
                    "stats": [
                        {"label": "Años de experiencia", "value": "5+", "icon": "calendar"},
                        {"label": "Proyectos completados", "value": "50+", "icon": "briefcase"},
                        {"label": "Clientes satisfechos", "value": "30+", "icon": "users"},
                        {"label": "Tazas de café", "value": "∞", "icon": "coffee"}
                    ]
                },
                order_index=3
            ),
            # ABOUT - Personal Info Section
            PageContentCreate(
                page_key="about",
                section_key="personal_info",
                title="Información Personal",
                description="Datos de contacto, información profesional y redes sociales",
                content={
                    "location": "Madrid, España",
                    "timezone": "GMT+1 (Madrid)",
                    "position": "Senior Full Stack Developer",
                    "experience_years": "5+ años",
                    "availability_status": "Disponible para proyectos",
                    "languages": ["Español (Nativo)", "Inglés (Avanzado)", "Francés (Intermedio)"],
                    "contact_links": [
                        {"text": "Email", "url": "mailto:tu@email.com", "icon": "https://cdn.simpleicons.org/gmail/EA4335", "enabled": True},
                        {"text": "WhatsApp", "url": "https://wa.me/1234567890", "icon": "https://cdn.simpleicons.org/whatsapp/25D366", "enabled": True},
                        {"text": "Calendly", "url": "https://calendly.com/tu-usuario", "icon": "https://cdn.simpleicons.org/calendly/006BFF", "enabled": True},
                        {"text": "GitHub", "url": "https://github.com/tu-usuario", "icon": "https://cdn.simpleicons.org/github/181717", "enabled": True},
                        {"text": "LinkedIn", "url": "https://linkedin.com/in/tu-perfil", "icon": "https://cdn.simpleicons.org/linkedin/0A66C2", "enabled": True},
                        {"text": "Twitter", "url": "https://twitter.com/tu-usuario", "icon": "https://cdn.simpleicons.org/x/000000", "enabled": True},
                        {"text": "Stack Overflow", "url": "https://stackoverflow.com/users/tu-id", "icon": "https://cdn.simpleicons.org/stackoverflow/F58025", "enabled": True},
                        {"text": "Dev.to", "url": "https://dev.to/tu-usuario", "icon": "https://cdn.simpleicons.org/devdotto/0A0A0A", "enabled": True},
                        {"text": "Discord", "url": "https://discord.com/users/tu-id", "icon": "https://cdn.simpleicons.org/discord/5865F2", "enabled": False},
                        {"text": "Telegram", "url": "https://t.me/tu-usuario", "icon": "https://cdn.simpleicons.org/telegram/26A5E4", "enabled": False}
                    ]
                },
                order_index=4
            ),
            # ABOUT - Skills Section
            PageContentCreate(
                page_key="about",
                section_key="skills",
                title="Habilidades Técnicas",
                description="Tecnologías y herramientas que domino",
                content={
                    "skills": [
                        {"name": "JavaScript/TypeScript", "level": 95, "category": "Frontend"},
                        {"name": "React/Next.js", "level": 90, "category": "Frontend"},
                        {"name": "Node.js", "level": 85, "category": "Backend"},
                        {"name": "Python", "level": 80, "category": "Backend"},
                        {"name": "PostgreSQL", "level": 75, "category": "Database"},
                        {"name": "Docker", "level": 70, "category": "DevOps"}
                    ]
                },
                order_index=5
            ),
            # ABOUT - Hobbies Section
            PageContentCreate(
                page_key="about",
                section_key="hobbies",
                title="Intereses y Hobbies",
                description="Mis pasiones fuera del código",
                content={
                    "hobbies": [
                        "Código Abierto",
                        "Inteligencia Artificial",
                        "Fotografía",
                        "Viajes",
                        "Música",
                        "Gaming",
                        "Lectura",
                        "Deportes"
                    ]
                },
                order_index=6
            ),
            # ABOUT - CTA Section
            PageContentCreate(
                page_key="about",
                section_key="cta",
                title="Call to Action",
                description="Invitación a colaborar",
                content={
                    "title": "¿Trabajamos juntos?",
                    "description": "Siempre estoy abierto a nuevas oportunidades y proyectos interesantes.",
                    "button_primary_text": "Contactar",
                    "button_primary_url": "/contact",
                    "button_secondary_text": "Ver proyectos",
                    "button_secondary_url": "/projects"
                },
                order_index=7
            ),
            # ABOUT - Experience Section
            PageContentCreate(
                page_key="about",
                section_key="experience",
                title="Experiencia Profesional",
                description="Mi trayectoria laboral",
                content={
                    "experience": [
                        {
                            "title": "Desarrollador Full Stack Senior",
                            "company": "Tech Company S.L.",
                            "period": "2022 - Presente",
                            "description": "Desarrollo de aplicaciones web modernas usando React, Next.js y Node.js. Liderazgo técnico en proyectos de gran escala.",
                            "achievements": [
                                "Mejoré el rendimiento de la aplicación principal en un 40%",
                                "Lideré un equipo de 4 desarrolladores",
                                "Implementé arquitectura de microservicios"
                            ]
                        },
                        {
                            "title": "Desarrollador Frontend",
                            "company": "Startup Innovadora",
                            "period": "2020 - 2022",
                            "description": "Especialización en interfaces de usuario modernas y experiencia de usuario optimizada.",
                            "achievements": [
                                "Desarrollé 3 aplicaciones web desde cero",
                                "Reduje el tiempo de carga en un 60%",
                                "Implementé testing automatizado"
                            ]
                        },
                        {
                            "title": "Desarrollador Junior",
                            "company": "Agencia Digital",
                            "period": "2019 - 2020",
                            "description": "Primeros pasos en el desarrollo profesional, trabajando en proyectos diversos para diferentes clientes.",
                            "achievements": [
                                "Completé más de 20 proyectos web",
                                "Aprendí múltiples tecnologías",
                                "Colaboré con equipos multidisciplinarios"
                            ]
                        }
                    ]
                },
                order_index=8
            ),
            # ABOUT - Education Section
            PageContentCreate(
                page_key="about",
                section_key="education",
                title="Educación y Certificaciones",
                description="Mi formación académica y profesional",
                content={
                    "education": [
                        {
                            "title": "Ingeniería Informática",
                            "institution": "Universidad Politécnica de Madrid",
                            "period": "2015 - 2019",
                            "description": "Especialización en Desarrollo de Software y Sistemas Distribuidos"
                        },
                        {
                            "title": "Certificación AWS Solutions Architect",
                            "institution": "Amazon Web Services",
                            "period": "2023",
                            "description": "Certificación profesional en arquitectura de soluciones en la nube"
                        }
                    ]
                },
                order_index=9
            ),
            # ABOUT - Testimonials Section
            PageContentCreate(
                page_key="about",
                section_key="testimonials",
                title="Testimonios",
                description="Lo que dicen mis clientes y colegas",
                content={
                    "title": "Lo que dicen de mi trabajo",
                    "testimonials": [
                        {
                            "message": "Excelente desarrollador, siempre entrega proyectos de alta calidad en tiempo y forma. Su atención al detalle es impresionante.",
                            "name": "María García",
                            "role": "CEO, Tech Startup",
                            "initials": "MG"
                        },
                        {
                            "message": "Trabajar con él fue una experiencia fantástica. Su conocimiento técnico y capacidad de comunicación son excepcionales.",
                            "name": "Juan López",
                            "role": "CTO, Digital Agency",
                            "initials": "JL"
                        },
                        {
                            "message": "Un profesional comprometido que siempre va más allá de lo esperado. Recomiendo su trabajo sin dudarlo.",
                            "name": "Ana Rodríguez",
                            "role": "Product Manager",
                            "initials": "AR"
                        }
                    ]
                },
                order_index=10
            ),
            # CONTACT - Header Section
            PageContentCreate(
                page_key="contact",
                section_key="header",
                title="Encabezado - Contacto",
                description="Título y descripción de la página de contacto",
                content={
                    "title": "Contacto",
                    "subtitle": "¿Tienes un proyecto en mente? ¿Quieres colaborar? Me encantaría escuchar de ti. Contacta conmigo y hablemos de tu próximo proyecto."
                },
                order_index=1
            ),
            # FOOTER - Main Section
            PageContentCreate(
                page_key="footer",
                section_key="main",
                title="Pie de Página Principal",
                description="Contenido completo del footer del sitio",
                content={
                    "brand_name": "Portafolio",
                    "brand_description": "Desarrollador Full Stack especializado en crear experiencias web modernas y escalables.",
                    "links_title": "Enlaces",
                    "links": [
                        {"text": "Proyectos", "url": "/projects"},
                        {"text": "Sobre mí", "url": "/about"},
                        {"text": "Contacto", "url": "/contact"},
                        {"text": "Descargar CV", "url": "/cv/download"}
                    ],
                    "social_title": "Sígueme",
                    "social_links": [
                        {"text": "GitHub", "url": "https://github.com", "icon": "https://cdn.simpleicons.org/github"},
                        {"text": "LinkedIn", "url": "https://linkedin.com", "icon": "https://cdn.simpleicons.org/linkedin"},
                        {"text": "Twitter", "url": "https://twitter.com", "icon": "https://cdn.simpleicons.org/twitter"}
                    ],
                    "contact_title": "Contacto",
                    "contact_text": "¿Tienes un proyecto en mente?",
                    "contact_cta": "Hablemos →",
                    "contact_url": "/contact",
                    "copyright_text": "Portafolio Personal. Todos los derechos reservados.",
                    "legal_links": [
                        {"text": "Privacidad", "url": "/privacy"},
                        {"text": "Términos", "url": "/terms"}
                    ]
                },
                order_index=1
            ),
            # PRIVACY - Header Section
            PageContentCreate(
                page_key="privacy",
                section_key="header",
                title="Encabezado - Privacidad",
                description="Título y descripción de la página de privacidad",
                content={
                    "title": "Política de Privacidad",
                    "last_updated": "1 de Enero de 2024",
                    "description": "Esta Política de Privacidad describe cómo se recopila, utiliza y comparte tu información personal cuando visitas o realizas una compra en este sitio web."
                },
                order_index=1
            ),
            # PRIVACY - Sections
            PageContentCreate(
                page_key="privacy",
                section_key="sections",
                title="Secciones - Privacidad",
                description="Contenido de las secciones de privacidad",
                content={
                    "sections": [
                        {
                            "title": "Información que Recopilamos",
                            "icon": "shield",
                            "content": "Cuando visitas el sitio, recopilamos automáticamente cierta información sobre tu dispositivo, incluyendo información sobre tu navegador web, dirección IP, zona horaria y algunas de las cookies instaladas en tu dispositivo. Además, cuando navegas por el sitio, recopilamos información sobre las páginas web individuales o productos que ves, qué sitios web o términos de búsqueda te remitieron al sitio, e información sobre cómo interactúas con el sitio."
                        },
                        {
                            "title": "Uso de tu Información",
                            "icon": "shield",
                            "content": "Utilizamos la información que recopilamos para: mejorar y optimizar nuestro sitio web, evaluar el éxito de nuestras campañas de marketing, responder a tus comentarios o consultas, y analizar las tendencias de uso del sitio. Si nos proporcionas información de contacto a través del formulario de contacto, podemos usar esa información para comunicarnos contigo."
                        },
                        {
                            "title": "Compartir tu Información",
                            "icon": "shield",
                            "content": "No vendemos, intercambiamos ni transferimos tu información personal identificable a terceros sin tu consentimiento. Esto no incluye a terceros de confianza que nos ayudan a operar nuestro sitio web, realizar nuestro negocio o atenderte, siempre que esas partes acuerden mantener esta información confidencial."
                        },
                        {
                            "title": "Cookies y Tecnologías de Seguimiento",
                            "icon": "shield",
                            "content": "Utilizamos cookies y tecnologías similares de seguimiento para rastrear la actividad en nuestro sitio web y almacenar cierta información. Las cookies son archivos con una pequeña cantidad de datos que pueden incluir un identificador único anónimo. Puedes configurar tu navegador para rechazar todas las cookies o para indicar cuándo se envía una cookie."
                        },
                        {
                            "title": "Seguridad de los Datos",
                            "icon": "shield",
                            "content": "La seguridad de tu información personal es importante para nosotros. Implementamos medidas de seguridad diseñadas para proteger tu información personal contra acceso no autorizado y uso indebido. Sin embargo, ten en cuenta que ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro."
                        },
                        {
                            "title": "Tus Derechos",
                            "icon": "shield",
                            "content": "Tienes derecho a acceder, corregir, actualizar o solicitar la eliminación de tu información personal. Si deseas ejercer estos derechos, contáctanos usando la información de contacto proporcionada en el sitio. También tienes derecho a oponerte al procesamiento de tu información personal, solicitar que restrinjamos el procesamiento de tu información personal o solicitar la portabilidad de tu información personal."
                        },
                        {
                            "title": "Cambios a esta Política",
                            "icon": "shield",
                            "content": "Podemos actualizar esta política de privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por otras razones operativas, legales o reglamentarias. Te notificaremos sobre cualquier cambio publicando la nueva política de privacidad en esta página y actualizando la fecha de última actualización."
                        },
                        {
                            "title": "Contacto",
                            "icon": "shield",
                            "content": "Si tienes preguntas sobre esta Política de Privacidad o deseas ejercer tus derechos, no dudes en contactarnos a través del formulario de contacto en el sitio web o mediante el correo electrónico proporcionado."
                        }
                    ]
                },
                order_index=2
            ),
            # TERMS - Header Section
            PageContentCreate(
                page_key="terms",
                section_key="header",
                title="Encabezado - Términos",
                description="Título y descripción de la página de términos",
                content={
                    "title": "Términos y Condiciones",
                    "last_updated": "1 de Enero de 2024",
                    "description": "Por favor, lee estos términos y condiciones cuidadosamente antes de usar nuestro sitio web."
                },
                order_index=1
            ),
            # TERMS - Sections
            PageContentCreate(
                page_key="terms",
                section_key="sections",
                title="Secciones - Términos",
                description="Contenido de las secciones de términos y condiciones",
                content={
                    "sections": [
                        {
                            "title": "Aceptación de los Términos",
                            "content": "Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso, todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de las leyes locales aplicables. Si no estás de acuerdo con alguno de estos términos, tienes prohibido usar o acceder a este sitio."
                        },
                        {
                            "title": "Uso del Sitio Web",
                            "content": "Este sitio web es un portafolio personal que muestra proyectos, habilidades y experiencia profesional. El contenido del sitio se proporciona únicamente con fines informativos. No garantizamos que el sitio esté libre de errores o que el acceso sea ininterrumpido. Nos reservamos el derecho de modificar o discontinuar el sitio en cualquier momento sin previo aviso."
                        },
                        {
                            "title": "Propiedad Intelectual",
                            "content": "El contenido de este sitio web, incluyendo pero no limitado a texto, gráficos, logotipos, imágenes, código fuente y software, es propiedad del titular del sitio web o de sus proveedores de contenido y está protegido por leyes de propiedad intelectual. No puedes reproducir, distribuir, modificar o crear trabajos derivados del contenido sin permiso expreso."
                        },
                        {
                            "title": "Enlaces a Sitios de Terceros",
                            "content": "Este sitio web puede contener enlaces a sitios web de terceros que no son propiedad ni están controlados por nosotros. No tenemos control sobre, y no asumimos ninguna responsabilidad por el contenido, políticas de privacidad o prácticas de sitios web de terceros. Al usar este sitio, liberas expresamente de cualquier responsabilidad derivada del uso de cualquier sitio web de terceros."
                        },
                        {
                            "title": "Formulario de Contacto",
                            "content": "Al usar el formulario de contacto del sitio, aceptas proporcionar información veraz y actualizada. La información que proporciones a través del formulario de contacto se utilizará únicamente para responder a tus consultas y no será compartida con terceros sin tu consentimiento, excepto según lo requerido por la ley."
                        },
                        {
                            "title": "Limitación de Responsabilidad",
                            "content": "En ningún caso seremos responsables de daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar este sitio web, incluso si hemos sido advertidos de la posibilidad de tales daños. Tu uso del sitio es bajo tu propio riesgo."
                        },
                        {
                            "title": "Proyectos Mostrados",
                            "content": "Los proyectos mostrados en este portafolio son ejemplos del trabajo realizado. Algunos proyectos pueden ser trabajos académicos, proyectos personales o trabajos realizados para clientes. Los detalles de los proyectos se proporcionan con fines demostrativos y pueden no reflejar el estado actual de los proyectos en producción."
                        },
                        {
                            "title": "Modificaciones de los Términos",
                            "content": "Nos reservamos el derecho de revisar estos términos y condiciones en cualquier momento sin previo aviso. Al continuar utilizando este sitio web después de publicar los cambios, aceptas estar sujeto a los términos revisados. Te recomendamos que revises periódicamente estos términos para estar informado de cualquier cambio."
                        },
                        {
                            "title": "Ley Aplicable",
                            "content": "Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes del país en el que reside el titular del sitio web. Cualquier disputa que surja en relación con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de dicha ubicación."
                        },
                        {
                            "title": "Contacto",
                            "content": "Si tienes alguna pregunta sobre estos Términos y Condiciones, no dudes en ponerte en contacto con nosotros a través del formulario de contacto disponible en el sitio web."
                        }
                    ]
                },
                order_index=2
            ),
            # NAVBAR (Public) - Main Section
            PageContentCreate(
                page_key="navbar",
                section_key="main",
                title="Barra de Menú Pública",
                description="Configuración de la barra de navegación pública",
                content={
                    "brand_name": "Portfolio",
                    "brand_letter": "P",
                    "navigation_links": [
                        {"text": "Inicio", "url": "/", "enabled": True},
                        {"text": "Sobre Mí", "url": "/about", "enabled": True},
                        {"text": "Proyectos", "url": "/projects", "enabled": True},
                        {"text": "Contacto", "url": "/contact", "enabled": True}
                    ],
                    "social_links": [
                        {"text": "GitHub", "url": "https://github.com/tu-usuario", "icon": "https://cdn.simpleicons.org/github/181717", "enabled": True},
                        {"text": "LinkedIn", "url": "https://linkedin.com/in/tu-perfil", "icon": "https://cdn.simpleicons.org/linkedin/0A66C2", "enabled": True},
                        {"text": "Email", "url": "mailto:tu@email.com", "icon": "https://cdn.simpleicons.org/gmail/EA4335", "enabled": True}
                    ],
                    "cv_button": {
                        "text": "CV",
                        "url": "/cv/download",
                        "enabled": True
                    },
                    "login_button": {
                        "text": "Iniciar Sesión",
                        "url": "/admin/login",
                        "enabled": True
                    }
                },
                order_index=1
            ),
            # ADMIN HEADER - Main Section
            PageContentCreate(
                page_key="admin_header",
                section_key="main",
                title="Barra de Menú Admin",
                description="Configuración de la barra de navegación del panel admin",
                content={
                    "brand_name": "Panel Admin",
                    "navigation_links": [
                        {"text": "Dashboard", "url": "/admin", "enabled": True},
                        {"text": "Proyectos", "url": "/admin/projects", "enabled": True},
                        {"text": "CV", "url": "/admin/cv", "enabled": True},
                        {"text": "Usuarios", "url": "/admin/users", "enabled": True},
                        {"text": "Gestión Web", "url": "/admin/cms", "enabled": True},
                        {"text": "Archivos", "url": "/admin/uploads", "enabled": True}
                    ]
                },
                order_index=1
            ),
            # PROJECTS - Header Section
            PageContentCreate(
                page_key="projects",
                section_key="header",
                title="Encabezado - Proyectos",
                description="Título y descripción principal de la página de proyectos",
                content={
                    "title": "Mis Proyectos",
                    "description": "Explora mi colección de proyectos de desarrollo web, aplicaciones móviles y más. Cada proyecto representa un desafío único y una oportunidad de aprendizaje."
                },
                order_index=1
            ),
            # PROJECTS - Filters Section
            PageContentCreate(
                page_key="projects",
                section_key="filters",
                title="Filtros y Búsqueda",
                description="Configuración de filtros y búsqueda de proyectos",
                content={
                    "title": "Filtros y Búsqueda",
                    "search_placeholder": "Buscar proyectos por nombre, descripción o tecnología...",
                    "show_search": True,
                    "show_technology_filter": True,
                    "show_view_toggle": True,
                    "filter_label": "Encuentra proyectos específicos usando los filtros y la búsqueda"
                },
                order_index=2
            ),
            # PROJECTS - CTA Section
            PageContentCreate(
                page_key="projects",
                section_key="cta",
                title="Llamada a la Acción",
                description="Sección de llamada a la acción al final de la página",
                content={
                    "title": "¿Interesado en trabajar juntos?",
                    "description": "Estoy siempre abierto a discutir nuevos proyectos, ideas creativas o oportunidades para formar parte de tu visión.",
                    "button_text": "Contáctame",
                    "button_url": "/contact",
                    "show_cta": True
                },
                order_index=3
            )
        ]
        
        created_sections = []
        
        for section_data in default_sections:
            # Verificar si existe
            existing = self.get_section(section_data.page_key, section_data.section_key)
            
            if not existing:
                # Solo crear si NO existe (no sobrescribir contenido existente)
                section = PageContent(**section_data.model_dump())
                self.db.add(section)
                created_sections.append(section)
        
        if created_sections:
            self.db.commit()
            for section in created_sections:
                self.db.refresh(section)
        
        return created_sections

