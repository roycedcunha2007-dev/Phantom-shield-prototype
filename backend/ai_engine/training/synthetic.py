from __future__ import annotations

import numpy as np
import pandas as pd

from ai_engine.features.pipeline import FEATURE_COLUMNS

CLASS_LABELS = ["Normal", "Suspicious", "High Risk", "Critical"]


def make_synthetic_training_data(samples: int = 900, seed: int = 42) -> tuple[pd.DataFrame, np.ndarray]:
    rng = np.random.default_rng(seed)
    rows: list[list[float]] = []
    labels: list[str] = []

    for _ in range(samples):
        failed_login_count = rng.poisson(1)
        login_frequency = rng.uniform(0.05, 1.2)
        process_creation_rate = rng.uniform(0.2, 7.5)
        network_connection_count = rng.poisson(12)
        outbound_traffic_volume = rng.gamma(2.0, 80.0)
        usb_insertion_frequency = rng.uniform(0, 0.25)
        file_deletion_rate = rng.uniform(0, 0.4)
        alert_frequency = rng.uniform(0, 0.25)
        device_risk_history = rng.uniform(0, 35)
        excessive_file_access = rng.gamma(1.6, 20)
        abnormal_working_hours = rng.poisson(1)
        large_data_movement = rng.gamma(1.4, 70)
        repeated_usb_activity = rng.poisson(0.5)
        unusual_login_locations = rng.poisson(0.15)

        severity_score = (
            failed_login_count * 4
            + process_creation_rate * 1.6
            + network_connection_count * 0.7
            + outbound_traffic_volume * 0.025
            + usb_insertion_frequency * 45
            + file_deletion_rate * 30
            + alert_frequency * 80
            + device_risk_history * 0.8
            + excessive_file_access * 0.25
            + abnormal_working_hours * 4
            + large_data_movement * 0.035
            + repeated_usb_activity * 8
            + unusual_login_locations * 10
        )
        if severity_score >= 105:
            label = "Critical"
        elif severity_score >= 72:
            label = "High Risk"
        elif severity_score >= 38:
            label = "Suspicious"
        else:
            label = "Normal"

        rows.append([
            failed_login_count,
            login_frequency,
            process_creation_rate,
            network_connection_count,
            outbound_traffic_volume,
            usb_insertion_frequency,
            file_deletion_rate,
            alert_frequency,
            device_risk_history,
            excessive_file_access,
            abnormal_working_hours,
            large_data_movement,
            repeated_usb_activity,
            unusual_login_locations,
        ])
        labels.append(label)

    return pd.DataFrame(rows, columns=FEATURE_COLUMNS), np.array(labels)
