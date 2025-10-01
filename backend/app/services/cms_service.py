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
                title="Hero Principal",
                description="Sección principal de bienvenida",
                content={
                    "badge": "¡Hola! Soy desarrollador Full Stack",
                    "title": "Creando experiencias web",
                    "titleHighlight": "excepcionales",
                    "description": "Especializado en React, Next.js, Node.js y Python. Transformo ideas en aplicaciones web modernas, escalables y centradas en el usuario.",
                    "ctaPrimary": {
                        "text": "Ver mis proyectos",
                        "url": "/projects"
                    },
                    "ctaSecondary": {
                        "text": "Descargar CV",
                        "url": "/cv/download"
                    }
                },
                styles={
                    "background": "gradient",
                    "particles": True
                },
                order_index=1
            ),
            # HOME - Featured Projects
            PageContentCreate(
                page_key="home",
                section_key="featured-projects",
                title="Proyectos Destacados",
                description="Sección de proyectos destacados en la home",
                content={
                    "title": "Proyectos Destacados",
                    "description": "Una selección de mis trabajos más recientes y significativos",
                    "showCount": 6
                },
                order_index=2
            ),
            # ABOUT - Main Info
            PageContentCreate(
                page_key="about",
                section_key="main-info",
                title="Información Principal",
                description="Biografía y presentación",
                content={
                    "title": "Sobre Mí",
                    "subtitle": "Desarrollador Full Stack",
                    "bio": "Soy un desarrollador apasionado por crear soluciones web innovadoras y eficientes...",
                    "image": "/images/profile.jpg"
                },
                order_index=1
            ),
            # CONTACT - Form
            PageContentCreate(
                page_key="contact",
                section_key="contact-form",
                title="Formulario de Contacto",
                description="Configuración del formulario de contacto",
                content={
                    "title": "¡Hablemos!",
                    "description": "¿Tienes un proyecto en mente? Contáctame",
                    "email": "contact@example.com",
                    "showSocialLinks": True
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

