"""merge cv and settings migrations

Revision ID: 654c733ae38e
Revises: 4342489fe923, update_cv_binary
Create Date: 2025-10-05 11:28:23.872859

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '654c733ae38e'
down_revision: Union[str, Sequence[str], None] = ('4342489fe923', 'update_cv_binary')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
