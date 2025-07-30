"""add init project + seed data

Revision ID: 14b726631fac
Revises: 
Create Date: 2025-07-30 12:34:53.583681

"""
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '14b726631fac'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) Création des tables
    op.create_table(
        "formation",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("description", sa.String, nullable=False),
        sa.Column("status", sa.String, nullable=False),
        sa.Column("order_number", sa.String, nullable=False),
        sa.Column("order_date", sa.DateTime, nullable=False),
        sa.Column("total_amount", sa.Float, nullable=True),
        sa.Column("classroom_student_counts", sa.Integer, default=0),
        sa.Column("rate", sa.String, nullable=True),
        sa.Column("created_at", sa.DateTime, default=datetime.utcnow),
        sa.Column("updated_at", sa.DateTime, default=datetime.utcnow,
                  onupdate=datetime.utcnow),
    )

    op.create_table(
        "tag",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String, nullable=False),
    )

    op.create_table(
        "user",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("email", sa.String, nullable=False, unique=True),
        sa.Column("fullname", sa.String, nullable=False),
        sa.Column("status", sa.String, nullable=False),
        sa.Column("created_at", sa.DateTime, default=datetime.utcnow),
        sa.Column("updated_at", sa.DateTime, default=datetime.utcnow,
                  onupdate=datetime.utcnow),
    )

    op.create_table(
        "message",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("subject", sa.String, nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime, default=datetime.utcnow),
        sa.Column("updated_at", sa.DateTime, default=datetime.utcnow,
                  onupdate=datetime.utcnow),
        sa.Column("user_id", sa.Integer,
                  sa.ForeignKey("user.id"), nullable=True),
    )

    op.create_table(
        "tag_formation_link",
        sa.Column("tag_id", sa.Integer,
                  sa.ForeignKey("tag.id"), primary_key=True),
        sa.Column("formation_id", sa.Integer,
                  sa.ForeignKey("formation.id"), primary_key=True),
    )

    op.create_table(
        "user_formation_link",
        sa.Column("user_id", sa.Integer,
                  sa.ForeignKey("user.id"), primary_key=True),
        sa.Column("formation_id", sa.Integer,
                  sa.ForeignKey("formation.id"), primary_key=True),
    )

    # 2) Seed data : 3 formations d’exemple
    formations = [
        {
            "title": "React 19 & TypeScript",
            "description": "Formation intensive React 19 + hooks avancés.",
            "status": "published",
            "order_number": "ORD-0001",
            "order_date": datetime(2025, 9, 15, 9, 0),
            "total_amount": 1290.00,
            "classroom_student_counts": 12,
            "rate": "★★★★☆",
        },
        {
            "title": "FastAPI & SQLModel",
            "description": "Créer une API moderne en Python.",
            "status": "published",
            "order_number": "ORD-0002",
            "order_date": datetime(2025, 10, 5, 9, 0),
            "total_amount": 990.00,
            "classroom_student_counts": 8,
            "rate": "★★★★★",
        },
        {
            "title": "Docker & DevOps Basics",
            "description": "Conteneuriser et déployer vos applications.",
            "status": "draft",
            "order_number": "ORD-0003",
            "order_date": datetime(2025, 11, 2, 9, 0),
            "total_amount": 690.00,
            "classroom_student_counts": 0,
            "rate": None,
        },
    ]

    for f in formations:
        op.execute(
            sa.text(
                """
                INSERT INTO formation
                (title, description, status, order_number, order_date,
                 total_amount, classroom_student_counts, rate, created_at, updated_at)
                VALUES
                (:title, :description, :status, :order_number, :order_date,
                 :total_amount, :classroom_student_counts, :rate, NOW(), NOW())
                """
            ).bindparams(**f)
        )


def downgrade() -> None:
    op.drop_table("user_formation_link")
    op.drop_table("tag_formation_link")
    op.drop_table("message")
    op.drop_table("user")
    op.drop_table("tag")
    op.drop_table("formation")