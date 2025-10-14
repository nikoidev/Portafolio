"""add_roadmap_skills_tables

Revision ID: d6a918be551d
Revises: c5314f873b8c
Create Date: 2025-10-14 13:37:53.576660

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd6a918be551d'
down_revision: Union[str, Sequence[str], None] = 'c5314f873b8c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create skill_categories table
    op.create_table(
        'skill_categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(length=500), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=True),
        sa.Column('is_visible', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_skill_categories_id'), 'skill_categories', ['id'], unique=False)
    
    # Create skills table
    op.create_table(
        'skills',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('icon', sa.String(length=500), nullable=True),
        sa.Column('proficiency', sa.Float(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=True),
        sa.Column('is_visible', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['skill_categories.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_skills_id'), 'skills', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_skills_id'), table_name='skills')
    op.drop_table('skills')
    op.drop_index(op.f('ix_skill_categories_id'), table_name='skill_categories')
    op.drop_table('skill_categories')
