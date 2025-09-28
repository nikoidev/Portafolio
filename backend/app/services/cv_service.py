"""
Servicio para gestión de CV
"""
from typing import Optional
from datetime import date
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
    
    def generate_pdf(self, user: User, template: str = "modern", color_scheme: str = "blue") -> dict:
        """Generar PDF del CV"""
        cv = self.get_cv_by_user(user)
        
        if not cv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CV no encontrado"
            )
        
        # TODO: Implementar generación real de PDF
        # Por ahora, simular la generación
        pdf_filename = f"cv_{user.id}_{date.today().isoformat()}.pdf"
        pdf_url = f"/uploads/cv/{pdf_filename}"
        
        # Actualizar información del PDF en la base de datos
        cv.pdf_template = template
        cv.pdf_color_scheme = color_scheme
        cv.pdf_url = pdf_url
        cv.pdf_generated_at = date.today()
        
        self.db.commit()
        
        return {
            "pdf_url": pdf_url,
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
