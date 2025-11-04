"""
Script para crear la configuración inicial del sitio
"""

import sys
from pathlib import Path

# Agregar el directorio raíz al path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.database import SessionLocal
from app.schemas.settings import SettingsCreate
from app.services.settings_service import SettingsService


def create_initial_settings():
    db = SessionLocal()
    try:
        service = SettingsService(db)

        # Verificar si ya existe
        existing = service.get_settings()
        if existing:
            print("✅ La configuración ya existe:")
            print(f"   - Nombre del sitio: {existing.site_name}")
            print(f"   - Email: {existing.contact_email or 'No configurado'}")
            print(f"   - Social links: {len(existing.social_links or [])} configurados")
            return

        # Crear configuración inicial
        print("📝 Creando configuración inicial...")
        initial_settings = SettingsCreate(
            # Información del Sitio
            site_name="Mi Portafolio",
            site_description="Portafolio personal de desarrollo web y proyectos",
            # Contacto Global
            contact_email="contacto@tudominio.com",
            contact_phone="+34 XXX XXX XXX",
            contact_location="Madrid, España",
            contact_availability="Disponible para proyectos freelance",
            # Social Links
            social_links=[
                {
                    "name": "GitHub",
                    "url": "https://github.com/tu-usuario",
                    "icon": "https://cdn.simpleicons.org/github/181717",
                    "enabled": True,
                },
                {
                    "name": "LinkedIn",
                    "url": "https://linkedin.com/in/tu-perfil",
                    "icon": "https://cdn.simpleicons.org/linkedin/0A66C2",
                    "enabled": True,
                },
                {
                    "name": "Twitter",
                    "url": "https://twitter.com/tu-usuario",
                    "icon": "https://cdn.simpleicons.org/x/000000",
                    "enabled": True,
                },
                {
                    "name": "Email",
                    "url": "mailto:contacto@tudominio.com",
                    "icon": "https://cdn.simpleicons.org/gmail/EA4335",
                    "enabled": True,
                },
            ],
            # SEO
            seo_title="Mi Portafolio | Desarrollador Full Stack",
            seo_description="Portafolio profesional de desarrollo web, aplicaciones móviles y soluciones tecnológicas.",
            seo_keywords="desarrollo web, full stack, react, nextjs, python, fastapi, django, postgresql, docker",
            # Apariencia
            theme_mode="auto",
            primary_color="#3B82F6",
            # Avisos
            maintenance_mode=False,
            banner_enabled=False,
            banner_type="info",
            # Newsletter
            newsletter_enabled=False,
        )

        settings = service.create_settings(initial_settings)

        print("✅ Configuración inicial creada exitosamente!")
        print(f"   - ID: {settings.id}")
        print(f"   - Nombre del sitio: {settings.site_name}")
        print(f"   - Social links configurados: {len(settings.social_links)}")
        print("\n💡 Puedes editar estos valores desde /admin/settings")

    except Exception as e:
        print(f"❌ Error al crear configuración: {e}")
        import traceback

        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    create_initial_settings()
