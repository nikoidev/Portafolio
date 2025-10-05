"""fix_cv_timestamps_defaults

Revision ID: c5314f873b8c
Revises: 654c733ae38e
Create Date: 2025-10-05 13:32:33.511878

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c5314f873b8c'
down_revision: Union[str, Sequence[str], None] = '654c733ae38e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add default values for created_at and updated_at columns in cv table."""
    # Set default values for existing NULL columns
    op.execute("""
        UPDATE cv 
        SET created_at = NOW() 
        WHERE created_at IS NULL
    """)
    
    op.execute("""
        UPDATE cv 
        SET updated_at = NOW() 
        WHERE updated_at IS NULL
    """)
    
    # Alter columns to add server defaults
    op.execute("""
        ALTER TABLE cv 
        ALTER COLUMN created_at SET DEFAULT NOW(),
        ALTER COLUMN updated_at SET DEFAULT NOW()
    """)


def downgrade() -> None:
    """Remove default values for created_at and updated_at columns."""
    op.execute("""
        ALTER TABLE cv 
        ALTER COLUMN created_at DROP DEFAULT,
        ALTER COLUMN updated_at DROP DEFAULT
    """)
