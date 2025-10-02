"""create_settings_table

Revision ID: 4342489fe923
Revises: remove_live_demo
Create Date: 2025-10-02 13:30:52.263942

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4342489fe923'
down_revision: Union[str, Sequence[str], None] = 'remove_live_demo'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        
        # Información del Sitio
        sa.Column('site_name', sa.String(length=100), nullable=False, server_default='Mi Portafolio'),
        sa.Column('site_description', sa.Text(), nullable=True),
        sa.Column('site_logo_url', sa.String(length=500), nullable=True),
        sa.Column('site_favicon_url', sa.String(length=500), nullable=True),
        
        # Contacto Global
        sa.Column('contact_email', sa.String(length=255), nullable=True),
        sa.Column('contact_phone', sa.String(length=50), nullable=True),
        sa.Column('contact_location', sa.String(length=255), nullable=True),
        sa.Column('contact_availability', sa.String(length=255), nullable=True),
        
        # Social Links Global
        sa.Column('social_links', sa.JSON(), nullable=True),
        
        # SEO y Marketing
        sa.Column('seo_title', sa.String(length=255), nullable=True),
        sa.Column('seo_description', sa.Text(), nullable=True),
        sa.Column('seo_keywords', sa.Text(), nullable=True),
        sa.Column('seo_og_image', sa.String(length=500), nullable=True),
        sa.Column('google_analytics_id', sa.String(length=50), nullable=True),
        sa.Column('google_search_console', sa.String(length=100), nullable=True),
        
        # Apariencia
        sa.Column('theme_mode', sa.String(length=20), nullable=False, server_default='auto'),
        sa.Column('primary_color', sa.String(length=20), nullable=True, server_default='#3B82F6'),
        sa.Column('font_family', sa.String(length=100), nullable=True),
        
        # Avisos y Notificaciones
        sa.Column('maintenance_mode', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('maintenance_message', sa.Text(), nullable=True),
        sa.Column('global_banner', sa.Text(), nullable=True),
        sa.Column('banner_enabled', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('banner_type', sa.String(length=20), nullable=True, server_default='info'),
        
        # Newsletter
        sa.Column('newsletter_enabled', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('newsletter_provider', sa.String(length=50), nullable=True),
        sa.Column('newsletter_api_key', sa.String(length=255), nullable=True),
        
        # Integraciones
        sa.Column('facebook_pixel', sa.String(length=50), nullable=True),
        sa.Column('hotjar_id', sa.String(length=50), nullable=True),
        
        # Configuración adicional
        sa.Column('extra_config', sa.JSON(), nullable=True),
        
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('settings')
