"""add init project + seed (Qualiopi compliant)

Revision ID: 14b726631fac
Revises:
Create Date: 2025-07-30 12:34:53.583681
"""
from datetime import datetime
from alembic import op
import sqlalchemy as sa
import uuid
from decimal import Decimal
import bcrypt

revision = "14b726631fac"
down_revision = None
branch_labels = None
depends_on = None
password = "password"
hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def upgrade() -> None:
    conn = op.get_bind()

    # ---------- 1. Création des tables ----------
    # formation
    formation_tbl = op.create_table(
        "formation",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("slug", sa.String, unique=True, nullable=False),
        sa.Column("description", sa.String, nullable=False),
        sa.Column("objectives", sa.String, nullable=False),
        sa.Column("prerequisites", sa.String, nullable=False),
        sa.Column("duration_hours", sa.Integer, nullable=False),
        sa.Column("pedagogy_methods", sa.String, nullable=False),
        sa.Column("evaluation_methods", sa.String, nullable=False),
        sa.Column("qualiopi_certificate_number", sa.String, nullable=False),
        sa.Column("qualiopi_certificate_date", sa.DateTime, nullable=False),
        sa.Column("prefecture_registration_number", sa.String, nullable=False),
        sa.Column("qualiopi_scope", sa.String, nullable=False),
        sa.Column("status", sa.String, default="draft"),
        sa.Column("order_number", sa.String),
        sa.Column("order_date", sa.DateTime),
        sa.Column("total_amount", sa.Numeric(10, 2)),
        sa.Column("classroom_student_counts", sa.Integer, default=0),
        sa.Column("rate", sa.String),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    # tag
    tag_tbl = op.create_table(
        "tag",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String, nullable=False, unique=True),
    )

    # user
    user_tbl = op.create_table(
        "user",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String, nullable=False, unique=True),
        sa.Column("username", sa.String, nullable=True),
        sa.Column("fullname", sa.String, nullable=False),
        sa.Column("password", sa.String, nullable=True),
        sa.Column("status", sa.String, nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    # session
    session_tbl = op.create_table(
        "session",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("formation_id", sa.String(36), sa.ForeignKey("formation.id"), nullable=False),
        sa.Column("start_date", sa.DateTime, nullable=False),
        sa.Column("end_date", sa.DateTime, nullable=False),
        sa.Column("location", sa.String, nullable=False),
        sa.Column("max_seats", sa.Integer, nullable=False),
        sa.Column("price", sa.Numeric(10, 2)),
    )

    # module
    module_tbl = op.create_table(
        "module",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("formation_id", sa.String(36), sa.ForeignKey("formation.id"), nullable=False),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("duration_hours", sa.Integer, nullable=False),
        sa.Column("description", sa.String, nullable=False),
        sa.Column("order_index", sa.Integer, default=0),
    )

    # ---------- table message ----------
    message_tbl = op.create_table(
        "message",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("subject", sa.String, nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("user.id")),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    # attachment
    attachment_tbl = op.create_table(
        "attachment",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("formation_id", sa.String(36), sa.ForeignKey("formation.id"), nullable=False),
        sa.Column("label", sa.String, nullable=False),
        sa.Column("file_url", sa.String, nullable=False),
        sa.Column("file_type", sa.String, default="application/pdf"),
    )
    

    # link tables
    op.create_table(
        "tag_formation_link",
        sa.Column("tag_id", sa.String(36), sa.ForeignKey("tag.id"), primary_key=True),
        sa.Column("formation_id", sa.String(36), sa.ForeignKey("formation.id"), primary_key=True),
    )
    op.create_table(
        "user_formation_link",
        sa.Column("user_id", sa.String(36), sa.ForeignKey("user.id"), primary_key=True),
        sa.Column("formation_id", sa.String(36), sa.ForeignKey("formation.id"), primary_key=True),
    )

    # ---------- 2. Seed ----------
    now = datetime.now()
    base_id = lambda: str(uuid.uuid4())

    # tags
    tag_ids = [base_id() for _ in range(3)]
    conn.execute(sa.insert(tag_tbl), [
        {"id": tag_ids[0], "name": "frontend"},
        {"id": tag_ids[1], "name": "backend"},
        {"id": tag_ids[2], "name": "devops"},
    ])

    # users
    user_ids = [base_id(), base_id()]
    conn.execute(sa.insert(user_tbl), [
        {"id": user_ids[0], "username": "alice", "email": "alice@example.com", "fullname": "Alice Martin", "status": "active", "password" : hashed},
        {"id": user_ids[1], "username": "bod", "email": "bob@example.com", "fullname": "Bob Dupont", "status": "active", "password" : hashed},
    ])

    # formation
    formation_id = base_id()
    conn.execute(sa.insert(formation_tbl), [{
        "id": formation_id,
        "title": "FastAPI & SQLModel – Qualiopi certifiée",
        "slug": "fastapi-sqlmodel-certifiee",
        "description": "Créez une API moderne en Python, certifiée Qualiopi.",
        "objectives": "Maîtriser FastAPI, SQLModel, déploiement Docker CI/CD.",
        "prerequisites": "Python intermédiaire, Git de base.",
        "duration_hours": 42,
        "pedagogy_methods": "Cours 30 %, ateliers 40 %, projets 30 %, LMS.",
        "evaluation_methods": "Quiz + projet + QCM + attestation Qualiopi.",
        "qualiopi_certificate_number": "QUALIOPI-2024-42",
        "qualiopi_certificate_date": datetime(2024, 7, 1),
        "prefecture_registration_number": "PR-75-2024-007",
        "qualiopi_scope": "actions de formation",
        "status": "published",
        "order_number": "ORD-2024-QUAL-01",
        "order_date": datetime(2024, 8, 15),
        "total_amount": Decimal("1490.00"),
        "classroom_student_counts": 12,
        "rate": "★★★★★",
    }])

    # session
    conn.execute(sa.insert(session_tbl), [{
        "id": base_id(),
        "formation_id": formation_id,
        "start_date": datetime(2024, 9, 9, 9, 0),
        "end_date": datetime(2024, 9, 13, 17, 0),
        "location": "Paris 11ᵉ – Salle Montreuil",
        "max_seats": 12,
        "price": Decimal("1490.00"),
    }])

    # modules
    conn.execute(sa.insert(module_tbl), [
        {"id": base_id(), "formation_id": formation_id, "title": "FastAPI Fundamentals", "duration_hours": 8, "description": "Installation, async, dépendances.", "order_index": 1},
        {"id": base_id(), "formation_id": formation_id, "title": "SQLModel & Databases", "duration_hours": 10, "description": "Modèles, relations, migrations.", "order_index": 2},
        {"id": base_id(), "formation_id": formation_id, "title": "Testing & CI/CD", "duration_hours": 8, "description": "Pytest, GitHub Actions, Docker.", "order_index": 3},
        {"id": base_id(), "formation_id": formation_id, "title": "Deployment on Render", "duration_hours": 6, "description": "Auto-deploy, environnements, monitoring.", "order_index": 4},
    ])

    # attachments
    conn.execute(sa.insert(attachment_tbl), [
        {"id": base_id(), "formation_id": formation_id, "label": "Référentiel Qualiopi", "file_url": "/files/qualiopi_guide.pdf"},
        {"id": base_id(), "formation_id": formation_id, "label": "Programme détaillé", "file_url": "/files/programme_fastapi.pdf"},
    ])

    # links
    conn.execute(sa.text("""
        INSERT INTO tag_formation_link (tag_id, formation_id)
        VALUES (:tag_id, :formation_id)
    """), [{"tag_id": tag_ids[1], "formation_id": formation_id}])

    conn.execute(sa.text("""
        INSERT INTO user_formation_link (user_id, formation_id)
        VALUES (:user_id, :formation_id)
    """), [
        {"user_id": user_ids[0], "formation_id": formation_id},
        {"user_id": user_ids[1], "formation_id": formation_id},
    ])
    
    # ---------- Formations supplémentaires avec leurs modules ----------
    formations_sup = [
        {
            "id": base_id(),
            "title": "Docker & Containers – Qualiopi",
            "slug": "docker-containers-qualiopi",
            "description": "Maîtrisez Docker et l’orchestration de conteneurs.",
            "objectives": "Créer, déployer et maintenir des conteneurs en production.",
            "prerequisites": "Linux de base, ligne de commande.",
            "duration_hours": 28,
            "pedagogy_methods": "Ateliers 60 %, labs 40 %.",
            "evaluation_methods": "Labs notés + QCM + attestation.",
            "qualiopi_certificate_number": "QUALIOPI-2024-43",
            "qualiopi_certificate_date": datetime(2024, 8, 1),
            "prefecture_registration_number": "PR-75-2024-008",
            "qualiopi_scope": "actions de formation",
            "status": "published",
            "order_number": "ORD-2024-DCK-01",
            "order_date": datetime(2024, 9, 1),
            "total_amount": Decimal("1290.00"),
            "classroom_student_counts": 10,
            "rate": "★★★★☆",
        },
        {
            "id": base_id(),
            "title": "Python Avancé – Qualiopi",
            "slug": "python-avance-qualiopi",
            "description": "Python avancé : async, métaclasses, C-extensions.",
            "objectives": "Écrire du code Python robuste et haute-performance.",
            "prerequisites": "Niveau intermédiaire en Python.",
            "duration_hours": 35,
            "pedagogy_methods": "Cours + TP + katas.",
            "evaluation_methods": "Mini-projet + revue de code.",
            "qualiopi_certificate_number": "QUALIOPI-2024-44",
            "qualiopi_certificate_date": datetime(2024, 7, 15),
            "prefecture_registration_number": "PR-75-2024-009",
            "qualiopi_scope": "actions de formation",
            "status": "published",
            "order_number": "ORD-2024-PY-01",
            "order_date": datetime(2024, 10, 5),
            "total_amount": Decimal("1190.00"),
            "classroom_student_counts": 8,
            "rate": "★★★★★",
        },
    ]
    conn.execute(sa.insert(formation_tbl), formations_sup)

    # Modules Docker
    docker_modules = [
        {"id": base_id(), "formation_id": formations_sup[0]["id"], "title": "Docker Fundamentals", "duration_hours": 7, "description": "Images, conteneurs, Dockerfile.", "order_index": 1},
        {"id": base_id(), "formation_id": formations_sup[0]["id"], "title": "Compose & Networks", "duration_hours": 7, "description": "Multi-conteneurs, volumes, réseaux.", "order_index": 2},
        {"id": base_id(), "formation_id": formations_sup[0]["id"], "title": "CI/CD avec Docker", "duration_hours": 7, "description": "GitHub Actions, registry, cache.", "order_index": 3},
        {"id": base_id(), "formation_id": formations_sup[0]["id"], "title": "Kubernetes Basics", "duration_hours": 7, "description": "Pods, services, déploiements.", "order_index": 4},
    ]
    conn.execute(sa.insert(module_tbl), docker_modules)

    # Modules Python
    python_modules = [
        {"id": base_id(), "formation_id": formations_sup[1]["id"], "title": "Async & Concurrency", "duration_hours": 8, "description": "asyncio, trio, concurrent.futures.", "order_index": 1},
        {"id": base_id(), "formation_id": formations_sup[1]["id"], "title": "Metaclasses & Introspection", "duration_hours": 9, "description": "Classes dynamiques, inspect.", "order_index": 2},
        {"id": base_id(), "formation_id": formations_sup[1]["id"], "title": "C-extensions & Cython", "duration_hours": 9, "description": "Boost performance via Cython.", "order_index": 3},
        {"id": base_id(), "formation_id": formations_sup[1]["id"], "title": "Profiling & Optimisation", "duration_hours": 9, "description": "cProfile, perf, optimisation CPU.", "order_index": 4},
    ]
    conn.execute(sa.insert(module_tbl), python_modules)

    # Tags & liens
   # ---------- 3. Tags & links ----------
    docker_tag_id = base_id()
    python_tag_id = base_id()
    conn.execute(sa.insert(tag_tbl), [
        {"id": docker_tag_id, "name": "docker"},
        {"id": python_tag_id, "name": "python"},
    ])

    # links — one row at a time
    conn.execute(sa.text("""
        INSERT INTO tag_formation_link (tag_id, formation_id)
        VALUES (:tag_id, :formation_id)
    """), [
        {"tag_id": docker_tag_id, "formation_id": formations_sup[0]["id"]},
        {"tag_id": python_tag_id, "formation_id": formations_sup[1]["id"]},
    ])
    
        # ---------- 4. Sessions & formateurs pour Docker & Python ----------
    docker_session_id = base_id()
    conn.execute(sa.insert(session_tbl), [{
        "id": docker_session_id,
        "formation_id": formations_sup[0]["id"],
        "start_date": datetime(2024, 10, 7, 9, 0),
        "end_date": datetime(2024, 10, 9, 17, 0),
        "location": "Paris 11ᵉ – Salle Montreuil",
        "max_seats": 10,
        "price": Decimal("1290.00"),
    }])

    python_session_id = base_id()
    conn.execute(sa.insert(session_tbl), [{
        "id": python_session_id,
        "formation_id": formations_sup[1]["id"],
        "start_date": datetime(2024, 11, 4, 9, 0),
        "end_date": datetime(2024, 11, 6, 17, 0),
        "location": "Paris 11ᵉ – Salle Charonne",
        "max_seats": 8,
        "price": Decimal("1190.00"),
    }])

    # formateurs (utilisateurs)
    teacher_ids = [base_id(), base_id()]
    conn.execute(sa.insert(user_tbl), [
        {"id": teacher_ids[0], "username" : "claire", "password" : hashed, 
         "email": "claire@example.com", "fullname": "Claire Docker", "status": "active", "role": "teacher"},
        {"id": teacher_ids[1],  "password" : hashed, "username" : "pierre", "email": "pierre@example.com", "fullname": "Pierre Python", "status": "active", "role": "teacher"},
    ])

    # liens formateur ↔ formation
    conn.execute(sa.text("""
        INSERT INTO user_formation_link (user_id, formation_id)
        VALUES (:user_id, :formation_id)
    """), [
        {"user_id": teacher_ids[0], "formation_id": formations_sup[0]["id"]},
        {"user_id": teacher_ids[1], "formation_id": formations_sup[1]["id"]},
    ])
    
        # ---------- 5. Attachments pour Docker et Python ----------
    docker_form_id = formations_sup[0]["id"]
    python_form_id = formations_sup[1]["id"]

    conn.execute(sa.insert(attachment_tbl), [
        {"id": base_id(), "formation_id": docker_form_id, "label": "Guide Docker officiel", "file_url": "/files/docker_official_guide.pdf"},
        {"id": base_id(), "formation_id": docker_form_id, "label": "Cheat-sheet docker-compose", "file_url": "/files/docker_compose_cheatsheet.pdf"},
        {"id": base_id(), "formation_id": python_form_id, "label": "Référentiel Python 3.11", "file_url": "/files/python_3_11_reference.pdf"},
        {"id": base_id(), "formation_id": python_form_id, "label": "Exemples c-extensions", "file_url": "/files/cython_examples.zip"},
    ])
    
     # ---------- 6.  Table role + user_role_link ----------
    role_tbl = op.create_table(
        "role",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(36), nullable=False, unique=True),
    )
    role_ids = [base_id(), base_id()]
    conn.execute(sa.insert(role_tbl), [
        {"id": role_ids[0], "name": "teacher"},
        {"id": role_ids[1], "name": "student"},
    ])
    
    op.create_table(
        "user_role_link",
        sa.Column("user_id", sa.String(36), sa.ForeignKey("user.id"), primary_key=True),
        sa.Column("role_id", sa.String(36), sa.ForeignKey("role.id"), primary_key=True),
    )

    # user_role_link est déjà créée plus haut (ligne 131-134)
    # on l’utilise pour attacher les rôles aux utilisateurs
    conn.execute(sa.text("""
        INSERT INTO user_role_link (user_id, role_id)
        VALUES (:user_id, :role_id)
    """), [
        {"user_id": teacher_ids[0], "role_id": role_ids[0]},
        {"user_id": teacher_ids[1], "role_id": role_ids[0]},
        {"user_id": user_ids[0], "role_id": role_ids[1]},
        {"user_id": user_ids[1], "role_id": role_ids[1]},
    ])


def downgrade() -> None:
    op.drop_table("user_formation_link")
    op.drop_table("tag_formation_link")
    op.drop_table("user_role_link")
    op.drop_table("attachment")
    op.drop_table("module")
    op.drop_table("session")
    op.drop_table("message")
    op.drop_table("user")
    op.drop_table("role")
    op.drop_table("tag")
    op.drop_table("formation")