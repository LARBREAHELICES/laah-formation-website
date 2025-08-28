"""add registration

Revision ID: 35411b32f94b
Revises: 6e5499e7b6f0
Create Date: 2025-08-27 13:15:45.484715

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '35411b32f94b'
down_revision: Union[str, None] = '6e5499e7b6f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "registrationrequest",
        sa.Column("id", sa.String(36), primary_key=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("motivation", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="pending"),
        sa.Column("verification_token", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_registrationrequest_email", "registrationrequest", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_registrationrequest_email", table_name="registrationrequest")
    op.drop_table("registrationrequest")
