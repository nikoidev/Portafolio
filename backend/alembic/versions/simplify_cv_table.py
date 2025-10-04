"""Simplify CV table - remove complex fields and keep only cv_url

Revision ID: simplify_cv_table
Revises: remove_live_demo_fields
Create Date: 2025-10-04 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'simplify_cv_table'
down_revision: Union[str, Sequence[str], None] = 'remove_live_demo'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Simplify CV table to only store a URL to external CV."""
    # Drop all the complex CV fields, keep only essential info
    op.drop_column('cv', 'work_experience')
    op.drop_column('cv', 'education')
    op.drop_column('cv', 'technical_skills')
    op.drop_column('cv', 'languages')
    op.drop_column('cv', 'certifications')
    op.drop_column('cv', 'featured_projects')
    op.drop_column('cv', 'pdf_template')
    op.drop_column('cv', 'pdf_color_scheme')
    op.drop_column('cv', 'pdf_url')
    op.drop_column('cv', 'pdf_generated_at')
    op.drop_column('cv', 'full_name')
    op.drop_column('cv', 'title')
    op.drop_column('cv', 'email')
    op.drop_column('cv', 'phone')
    op.drop_column('cv', 'location')
    op.drop_column('cv', 'summary')
    
    # Add the simple cv_url field
    op.add_column('cv', sa.Column('cv_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    """Restore the complex CV structure."""
    # Remove the simple field
    op.drop_column('cv', 'cv_url')
    
    # Restore all the complex fields
    op.add_column('cv', sa.Column('full_name', sa.String(length=200), nullable=False, server_default=''))
    op.add_column('cv', sa.Column('title', sa.String(length=200), nullable=False, server_default=''))
    op.add_column('cv', sa.Column('email', sa.String(length=255), nullable=False, server_default=''))
    op.add_column('cv', sa.Column('phone', sa.String(length=50), nullable=True))
    op.add_column('cv', sa.Column('location', sa.String(length=200), nullable=True))
    op.add_column('cv', sa.Column('summary', sa.Text(), nullable=True))
    op.add_column('cv', sa.Column('work_experience', sa.JSON(), nullable=True))
    op.add_column('cv', sa.Column('education', sa.JSON(), nullable=True))
    op.add_column('cv', sa.Column('technical_skills', sa.JSON(), nullable=True))
    op.add_column('cv', sa.Column('languages', sa.JSON(), nullable=True))
    op.add_column('cv', sa.Column('certifications', sa.JSON(), nullable=True))
    op.add_column('cv', sa.Column('featured_projects', sa.JSON(), nullable=True))
    op.add_column('cv', sa.Column('pdf_template', sa.String(length=50), nullable=False, server_default='modern'))
    op.add_column('cv', sa.Column('pdf_color_scheme', sa.String(length=50), nullable=False, server_default='blue'))
    op.add_column('cv', sa.Column('pdf_url', sa.String(length=500), nullable=True))
    op.add_column('cv', sa.Column('pdf_generated_at', sa.Date(), nullable=True))

