"""remove live demo fields

Revision ID: remove_live_demo
Revises: add_demo_system
Create Date: 2025-01-01 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'remove_live_demo'
down_revision = 'add_demo_system'
branch_labels = None
depends_on = None


def upgrade():
    # Eliminar campos que ya no se usan (demo_type, live_demo_url, live_demo_type)
    op.drop_column('projects', 'demo_type')
    op.drop_column('projects', 'live_demo_url')
    op.drop_column('projects', 'live_demo_type')


def downgrade():
    # Restaurar los campos en caso de rollback
    op.add_column('projects', sa.Column('demo_type', sa.String(length=50), nullable=True))
    op.add_column('projects', sa.Column('live_demo_url', sa.String(length=500), nullable=True))
    op.add_column('projects', sa.Column('live_demo_type', sa.String(length=20), nullable=True))

