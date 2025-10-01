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
                    "github_url": "https://github.com",
                    "linkedin_url": "https://linkedin.com",
                    "email": "contact@example.com"
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
                    "contact_email": "mailto:tu@email.com",
                    "github_url": "https://github.com/tu-usuario",
                    "linkedin_url": "https://linkedin.com/in/tu-perfil"
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
                description="Datos de contacto y redes sociales",
                content={
                    "location": "Madrid, España",
                    "email": "tu@email.com",
                    "github": "https://github.com/tu-usuario",
                    "linkedin": "https://linkedin.com/in/tu-perfil"
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
            )
        ]
        
        created_sections = []
        
        for section_data in default_sections:
            # Solo crear si no existe
            existing = self.get_section(section_data.page_key, section_data.section_key)
            if not existing:
                section = PageContent(**section_data.model_dump())
                self.db.add(section)
                created_sections.append(section)
        
        if created_sections:
            self.db.commit()
            for section in created_sections:
                self.db.refresh(section)
        
        return created_sections

