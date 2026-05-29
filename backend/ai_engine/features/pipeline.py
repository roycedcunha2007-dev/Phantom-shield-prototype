from __future__ import annotations

from datetime import datetime, timedelta, timezone
from statistics import mean
from typing import Any

import numpy as np
import pandas as pd
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Alert, Device, DeviceEvent, TelemetrySnapshot

FEATURE_COLUMNS = [
    "failed_login_count",
    "login_frequency",
    "process_creation_rate",
    "network_connection_count",
    "outbound_traffic_volume",
    "usb_insertion_frequency",
    "file_deletion_rate",
    "alert_frequency",
    "device_risk_history",
    "excessive_file_access",
    "abnormal_working_hours",
    "large_data_movement",
    "repeated_usb_activity",
    "unusual_login_locations",
]


def _metadata_value(metadata: dict[str, Any] | None, keys: tuple[str, ...], default: float = 0.0) -> float:
    if not metadata:
        return default
    for key in keys:
        value = metadata.get(key)
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            try:
                return float(value)
            except ValueError:
                continue
    return default


def _created_hour(event: DeviceEvent) -> int:
    created_at = event.created_at or datetime.now(timezone.utc)
    return created_at.hour


async def build_device_features(db: AsyncSession, device_id: str, window_hours: int = 24) -> dict[str, float]:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=window_hours)

    device = await db.get(Device, device_id)
    events = (
        await db.execute(
            select(DeviceEvent)
            .where(DeviceEvent.device_id == device_id)
            .where(DeviceEvent.created_at >= cutoff)
        )
    ).scalars().all()
    snapshots = (
        await db.execute(
            select(TelemetrySnapshot)
            .where(TelemetrySnapshot.device_id == device_id)
            .where(TelemetrySnapshot.created_at >= cutoff)
        )
    ).scalars().all()
    alerts = (
        await db.execute(
            select(Alert)
            .where(Alert.device_id == device_id)
            .where(Alert.created_at >= cutoff)
        )
    ).scalars().all()

    event_types = [event.event_type for event in events]
    failed_logins = sum(1 for item in event_types if item in {"failed_login", "login_failed"})
    logins = sum(1 for item in event_types if "login" in item or item in {"session_start", "session_created"})
    process_events = sum(1 for item in event_types if "process" in item or item in {"process_created", "suspicious_process"})
    network_events = sum(1 for item in event_types if "network" in item or "connection" in item)
    usb_events = sum(1 for item in event_types if "usb" in item)
    file_deletions = sum(1 for item in event_types if "delete" in item or item == "file_deleted")

    outbound_volume = sum(
        _metadata_value(event.metadata_, ("outbound_bytes", "bytes_out", "network_out", "traffic_volume"))
        for event in events
    )
    if snapshots:
        outbound_volume += sum(snapshot.network_usage or 0 for snapshot in snapshots)

    file_access = sum(
        _metadata_value(event.metadata_, ("file_count", "count", "files_accessed", "files_copied"), 1.0)
        for event in events
        if "file" in event.event_type or event.event_type in {"mass_file_copy", "file_access"}
    )
    data_movement = sum(
        _metadata_value(event.metadata_, ("bytes", "bytes_copied", "data_volume", "size_mb"))
        for event in events
        if "copy" in event.event_type or "transfer" in event.event_type or "file" in event.event_type
    )
    login_locations = {
        str(event.metadata_.get("location"))
        for event in events
        if event.metadata_ and event.metadata_.get("location")
    }
    off_hours_events = sum(1 for event in events if _created_hour(event) < 6 or _created_hour(event) > 21)

    divisor = max(window_hours, 1)
    features = {
        "failed_login_count": float(failed_logins),
        "login_frequency": float(logins / divisor),
        "process_creation_rate": float(process_events / divisor),
        "network_connection_count": float(network_events),
        "outbound_traffic_volume": float(outbound_volume),
        "usb_insertion_frequency": float(usb_events / divisor),
        "file_deletion_rate": float(file_deletions / divisor),
        "alert_frequency": float(len(alerts) / divisor),
        "device_risk_history": float(device.risk if device else 0),
        "excessive_file_access": float(file_access),
        "abnormal_working_hours": float(off_hours_events),
        "large_data_movement": float(data_movement),
        "repeated_usb_activity": float(usb_events),
        "unusual_login_locations": float(max(0, len(login_locations) - 1)),
    }
    return {column: features.get(column, 0.0) for column in FEATURE_COLUMNS}


def features_to_frame(features: dict[str, float]) -> pd.DataFrame:
    return pd.DataFrame([{column: float(features.get(column, 0.0)) for column in FEATURE_COLUMNS}])


def features_to_vector(features: dict[str, float]) -> np.ndarray:
    return features_to_frame(features).to_numpy(dtype=float)


def baseline_factor(features: dict[str, float]) -> dict[str, float]:
    return {
        "login": round(features["failed_login_count"] / max(features["login_frequency"], 1.0), 2),
        "network": round(features["outbound_traffic_volume"] / max(features["network_connection_count"], 1.0), 2),
        "file": round(mean([features["excessive_file_access"], features["large_data_movement"]]) if features else 0.0, 2),
    }
