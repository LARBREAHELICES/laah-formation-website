"""Add RefreshToken table

Revision ID: 6e5499e7b6f0
Revises: 14b726631fac
Create Date: 2025-08-12 09:20:58.064349

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6e5499e7b6f0'
down_revision: Union[str, None] = '14b726631fac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'refreshtoken',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), nullable=False),
        sa.Column('token', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('expires_at', sa.DateTime, nullable=False),
        sa.Column('revoked', sa.Boolean, nullable=False, default=False),
    )
    # Optionnel : ajouter index ou contrainte FK si tu as une table users
    op.create_index(op.f('ix_refreshtoken_token'), 'refreshtoken', ['token'], unique=True)

    op.create_foreign_key(
        'fk_refreshtoken_user_id_user',
        'refreshtoken', 'user',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

def downgrade() -> None:
    op.drop_index(op.f('ix_refreshtoken_token'), table_name='refreshtoken')
    op.drop_table('refreshtoken')
