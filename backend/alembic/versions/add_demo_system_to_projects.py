"""add demo system to projects

Revision ID: add_demo_system
Revises: 81f097efca04
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_demo_system'
down_revision = '81f097efca04'
branch_labels = None
depends_on = None


def upgrade():
    # Agregar nuevos campos para el sistema de demos
    op.add_column('projects', sa.Column('demo_video_type', sa.String(length=20), nullable=True))
    op.add_column('projects', sa.Column('demo_video_url', sa.String(length=500), nullable=True))
    op.add_column('projects', sa.Column('demo_video_thumbnail', sa.String(length=500), nullable=True))
    op.add_column('projects', sa.Column('demo_images', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    op.add_column('projects', sa.Column('live_demo_type', sa.String(length=20), nullable=True))
    
    # Renombrar live_demo_url si no existe (ya existe en el modelo actual)
    # No hacemos nada con live_demo_url porque ya existe


def downgrade():
    # Eliminar los campos agregados
    op.drop_column('projects', 'live_demo_type')
    op.drop_column('projects', 'demo_images')
    op.drop_column('projects', 'demo_video_thumbnail')
    op.drop_column('projects', 'demo_video_url')
    op.drop_column('projects', 'demo_video_type')

