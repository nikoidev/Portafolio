"""add user roles and permissions system

Revision ID: add_user_roles_permissions
Revises: ff05db15c907
Create Date: 2025-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_user_roles_permissions'
down_revision = 'ff05db15c907'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Crear enum para UserRole
    user_role_enum = postgresql.ENUM(
        'super_admin', 'admin', 'editor', 'viewer',
        name='user_role',
        create_type=True
    )
    user_role_enum.create(op.get_bind(), checkfirst=True)
    
    # Agregar columna role (nullable primero para migración)
    op.add_column('users', sa.Column('role', sa.Enum('super_admin', 'admin', 'editor', 'viewer', name='user_role'), nullable=True))
    
    # Actualizar registros existentes: is_admin=True → role='super_admin', is_admin=False → role='editor'
    op.execute("""
        UPDATE users 
        SET role = CASE 
            WHEN is_admin = true THEN 'super_admin'::user_role
            ELSE 'editor'::user_role
        END
    """)
    
    # Ahora hacerlo NOT NULL
    op.alter_column('users', 'role', nullable=False)
    
    # Crear índice en role
    op.create_index('ix_users_role', 'users', ['role'])


def downgrade() -> None:
    # Eliminar índice
    op.drop_index('ix_users_role', table_name='users')
    
    # Eliminar columna role
    op.drop_column('users', 'role')
    
    # Eliminar enum
    user_role_enum = postgresql.ENUM('super_admin', 'admin', 'editor', 'viewer', name='user_role')
    user_role_enum.drop(op.get_bind(), checkfirst=True)
