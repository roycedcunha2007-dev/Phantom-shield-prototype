"""Add AI engine tables

Revision ID: add_ai_engine_tables
Revises: 97658a94c438
Create Date: 2026-05-29 00:01:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "add_ai_engine_tables"
down_revision: Union[str, None] = "97658a94c438"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "ai_analyses",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("device_id", sa.String(), nullable=True),
        sa.Column("anomaly_score", sa.Float(), nullable=False),
        sa.Column("risk_score", sa.Float(), nullable=False),
        sa.Column("classification", sa.String(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("features", sa.JSON(), nullable=True),
        sa.Column("user_risk_score", sa.Float(), nullable=False),
        sa.Column("organization_risk_score", sa.Float(), nullable=False),
        sa.Column("insider_risk_score", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["device_id"], ["devices.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_ai_analyses_device_id"), "ai_analyses", ["device_id"], unique=False)
    op.create_table(
        "ai_recommendations",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("device_id", sa.String(), nullable=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("reason", sa.String(), nullable=True),
        sa.Column("contributing_factors", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["device_id"], ["devices.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_ai_recommendations_device_id"), "ai_recommendations", ["device_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_ai_recommendations_device_id"), table_name="ai_recommendations")
    op.drop_table("ai_recommendations")
    op.drop_index(op.f("ix_ai_analyses_device_id"), table_name="ai_analyses")
    op.drop_table("ai_analyses")
