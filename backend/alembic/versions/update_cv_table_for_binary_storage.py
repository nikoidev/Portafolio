"""Update CV table for binary storage

Revision ID: update_cv_binary
Revises: simplify_cv_table
Create Date: 2025-10-05 11:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'update_cv_binary'
down_revision: Union[str, Sequence[str], None] = 'simplify_cv_table'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Update CV table to store PDF as binary data."""
    # Delete all existing CV records (they're outdated anyway)
    op.execute('DELETE FROM cv')
    
    # Remove cv_url field (if exists)
    try:
        op.drop_column('cv', 'cv_url')
    except Exception:
        pass  # Column might not exist
    
    # Remove user_id if exists (CV is global now, not per user)
    try:
        op.drop_column('cv', 'user_id')
    except Exception:
        pass
    
    # Add new fields for binary storage
    op.add_column('cv', sa.Column('filename', sa.String(length=255), nullable=False))
    op.add_column('cv', sa.Column('file_data', sa.LargeBinary(), nullable=False))
    op.add_column('cv', sa.Column('file_size', sa.Integer(), nullable=False))


def downgrade() -> None:
    """Restore cv_url field."""
    # Remove binary storage fields
    op.drop_column('cv', 'file_size')
    op.drop_column('cv', 'file_data')
    op.drop_column('cv', 'filename')
    
    # Restore cv_url
    op.add_column('cv', sa.Column('cv_url', sa.String(length=500), nullable=True))
    op.add_column('cv', sa.Column('user_id', sa.Integer(), nullable=False))

