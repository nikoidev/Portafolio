"""
Servicio para gestión de CV
"""
from typing import Optional
from datetime import date, datetime
import os
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.cv import CV
from app.models.user import User
from app.schemas.cv import CVCreate, CVUpdate, CVResponse


class CVService:
    """Servicio para manejo de CV"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_cv_by_user(self, user: User) -> Optional[CV]:
        """Obtener CV del usuario"""
        return self.db.query(CV).filter(CV.user_id == user.id).first()
    
    def create_or_update_cv(self, cv_data: CVCreate, user: User) -> CV:
        """Crear o actualizar CV del usuario"""
        existing_cv = self.get_cv_by_user(user)
        
        if existing_cv:
            # Actualizar CV existente
            return self.update_cv(existing_cv.id, CVUpdate(**cv_data.model_dump()), user)
        else:
            # Crear nuevo CV
            return self.create_cv(cv_data, user)
    
    def create_cv(self, cv_data: CVCreate, user: User) -> CV:
        """Crear nuevo CV"""
        db_cv = CV(
            **cv_data.model_dump(),
            user_id=user.id
        )
        
        self.db.add(db_cv)
        self.db.commit()
        self.db.refresh(db_cv)
        
        return db_cv
    
    def update_cv(self, cv_id: int, cv_data: CVUpdate, user: User) -> CV:
        """Actualizar CV existente"""
        cv = self.db.query(CV).filter(
            CV.id == cv_id,
            CV.user_id == user.id
        ).first()
        
        if not cv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CV no encontrado"
            )
        
        # Actualizar campos
        update_data = cv_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(cv, field, value)
        
        self.db.commit()
        self.db.refresh(cv)
        
        return cv
    
    def get_public_cv(self, user_id: Optional[int] = None) -> Optional[CV]:
        """Obtener CV público (sin datos sensibles)"""
        query = self.db.query(CV)
        
        if user_id:
            query = query.filter(CV.user_id == user_id)
        else:
            # Obtener el primer CV disponible (para portafolio público)
            query = query.join(User).filter(User.is_active == True)
        
        return query.first()
    
    def get_cv_download_url(self, user: User) -> Optional[str]:
        """Obtener URL del CV para descargar según cv_source"""
        cv = self.get_cv_by_user(user)
        
        if not cv:
            return None
        
        # Si es manual, retornar manual_cv_url
        if cv.cv_source == "manual" and cv.manual_cv_url:
            return cv.manual_cv_url
        
        # Si es generado, retornar pdf_url
        if cv.cv_source == "generated" and cv.pdf_url:
            return cv.pdf_url
        
        return None
    
    def generate_pdf(self, user: User, template: str = "modern", color_scheme: str = "blue") -> dict:
        """Generar PDF del CV"""
        cv = self.get_cv_by_user(user)
        
        if not cv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CV no encontrado"
            )
        
        # Generar PDF real usando ReportLab
        pdf_filename = f"cv_{user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = os.path.join("uploads", "cv_pdfs", pdf_filename)
        
        # Crear directorio si no existe
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
        
        # Generar PDF
        self._create_pdf(cv, pdf_path, template, color_scheme)
        
        # Actualizar información del PDF en la base de datos
        cv.pdf_template = template
        cv.pdf_color_scheme = color_scheme
        cv.pdf_url = f"/uploads/cv_pdfs/{pdf_filename}"
        cv.pdf_generated_at = datetime.now()
        
        self.db.commit()
        
        return {
            "pdf_url": cv.pdf_url,
            "generated_at": cv.pdf_generated_at,
            "template": template,
            "color_scheme": color_scheme
        }
    
    def delete_cv(self, user: User) -> bool:
        """Eliminar CV del usuario"""
        cv = self.get_cv_by_user(user)
        
        if not cv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CV no encontrado"
            )
        
        self.db.delete(cv)
        self.db.commit()
        
        return True
    
    def get_cv_templates(self) -> list:
        """Obtener plantillas disponibles para CV"""
        return [
            {
                "id": "modern",
                "name": "Moderno",
                "description": "Diseño limpio y profesional",
                "preview": "/static/templates/modern_preview.jpg"
            },
            {
                "id": "classic",
                "name": "Clásico",
                "description": "Diseño tradicional y elegante",
                "preview": "/static/templates/classic_preview.jpg"
            },
            {
                "id": "creative",
                "name": "Creativo",
                "description": "Diseño innovador para perfiles creativos",
                "preview": "/static/templates/creative_preview.jpg"
            },
            {
                "id": "minimal",
                "name": "Minimalista",
                "description": "Diseño simple y directo",
                "preview": "/static/templates/minimal_preview.jpg"
            }
        ]
    
    def get_color_schemes(self) -> list:
        """Obtener esquemas de colores disponibles"""
        return [
            {"id": "blue", "name": "Azul", "primary": "#3B82F6", "secondary": "#1E40AF"},
            {"id": "green", "name": "Verde", "primary": "#10B981", "secondary": "#047857"},
            {"id": "purple", "name": "Morado", "primary": "#8B5CF6", "secondary": "#6D28D9"},
            {"id": "red", "name": "Rojo", "primary": "#EF4444", "secondary": "#DC2626"},
            {"id": "gray", "name": "Gris", "primary": "#6B7280", "secondary": "#374151"},
            {"id": "orange", "name": "Naranja", "primary": "#F59E0B", "secondary": "#D97706"}
        ]
    
    def _create_pdf(self, cv: CV, pdf_path: str, template: str, color_scheme: str):
        """Crear PDF usando ReportLab"""
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
        
        # Configurar colores según el esquema
        color_schemes = {
            "blue": {"primary": colors.HexColor("#2563eb"), "secondary": colors.HexColor("#64748b")},
            "green": {"primary": colors.HexColor("#059669"), "secondary": colors.HexColor("#64748b")},
            "red": {"primary": colors.HexColor("#dc2626"), "secondary": colors.HexColor("#64748b")},
            "purple": {"primary": colors.HexColor("#8B5CF6"), "secondary": colors.HexColor("#64748b")},
            "gray": {"primary": colors.HexColor("#1f2937"), "secondary": colors.HexColor("#6b7280")},
        }
        
        colors_config = color_schemes.get(color_scheme, color_schemes["blue"])
        
        # Crear documento
        doc = SimpleDocTemplate(pdf_path, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
        
        # Estilos
        styles = getSampleStyleSheet()
        
        # Estilos personalizados
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors_config["primary"],
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            textColor=colors_config["primary"],
            borderWidth=1,
            borderColor=colors_config["primary"],
            borderPadding=5
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=6
        )
        
        # Contenido del PDF
        story = []
        
        # Título - Nombre completo
        story.append(Paragraph(cv.full_name, title_style))
        story.append(Spacer(1, 12))
        
        # Información de contacto
        contact_info = []
        if cv.email:
            contact_info.append(f"Email: {cv.email}")
        if cv.phone:
            contact_info.append(f"Teléfono: {cv.phone}")
        if cv.location:
            contact_info.append(f"Ubicación: {cv.location}")
        if cv.linkedin_url:
            contact_info.append(f"LinkedIn: {cv.linkedin_url}")
        if cv.github_url:
            contact_info.append(f"GitHub: {cv.github_url}")
        
        if contact_info:
            story.append(Paragraph(" | ".join(contact_info), normal_style))
            story.append(Spacer(1, 20))
        
        # Resumen profesional
        if cv.summary:
            story.append(Paragraph("RESUMEN PROFESIONAL", heading_style))
            story.append(Paragraph(cv.summary, normal_style))
            story.append(Spacer(1, 20))
        
        # Experiencia laboral
        if cv.work_experience:
            story.append(Paragraph("EXPERIENCIA LABORAL", heading_style))
            for exp in cv.work_experience:
                # Título y empresa
                job_title = f"<b>{exp.get('title', '')}</b> - {exp.get('company', '')}"
                story.append(Paragraph(job_title, normal_style))
                
                # Fechas y ubicación
                dates = f"{exp.get('start_date', '')} - {exp.get('end_date', 'Presente')}"
                if exp.get('location'):
                    dates += f" | {exp.get('location')}"
                story.append(Paragraph(dates, normal_style))
                
                # Descripción
                if exp.get('description'):
                    if isinstance(exp['description'], list):
                        for desc in exp['description']:
                            story.append(Paragraph(f"• {desc}", normal_style))
                    else:
                        story.append(Paragraph(exp['description'], normal_style))
                
                story.append(Spacer(1, 12))
        
        # Educación
        if cv.education:
            story.append(Paragraph("EDUCACIÓN", heading_style))
            for edu in cv.education:
                edu_title = f"<b>{edu.get('degree', '')}</b> - {edu.get('institution', '')}"
                story.append(Paragraph(edu_title, normal_style))
                
                dates = f"{edu.get('start_date', '')} - {edu.get('end_date', '')}"
                if edu.get('location'):
                    dates += f" | {edu.get('location')}"
                story.append(Paragraph(dates, normal_style))
                
                if edu.get('description'):
                    if isinstance(edu['description'], list):
                        for desc in edu['description']:
                            story.append(Paragraph(f"• {desc}", normal_style))
                    else:
                        story.append(Paragraph(edu['description'], normal_style))
                
                story.append(Spacer(1, 12))
        
        # Habilidades técnicas
        if cv.technical_skills:
            story.append(Paragraph("HABILIDADES TÉCNICAS", heading_style))
            for skill_cat in cv.technical_skills:
                category = skill_cat.get('category', '')
                skills = skill_cat.get('skills', [])
                if skills:
                    skills_text = f"<b>{category}:</b> {', '.join(skills)}"
                    story.append(Paragraph(skills_text, normal_style))
            story.append(Spacer(1, 12))
        
        # Idiomas
        if cv.languages:
            story.append(Paragraph("IDIOMAS", heading_style))
            for lang in cv.languages:
                lang_text = f"<b>{lang.get('name', '')}:</b> {lang.get('level', '')}"
                story.append(Paragraph(lang_text, normal_style))
            story.append(Spacer(1, 12))
        
        # Certificaciones
        if cv.certifications:
            story.append(Paragraph("CERTIFICACIONES", heading_style))
            for cert in cv.certifications:
                cert_title = f"<b>{cert.get('name', '')}</b> - {cert.get('issuer', '')}"
                story.append(Paragraph(cert_title, normal_style))
                
                cert_date = cert.get('issue_date', '')
                if cert.get('credential_url'):
                    cert_date += f" | {cert.get('credential_url')}"
                story.append(Paragraph(cert_date, normal_style))
                story.append(Spacer(1, 6))
        
        # Construir PDF
        doc.build(story)
