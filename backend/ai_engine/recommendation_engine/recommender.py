from __future__ import annotations

from ai_engine.features.pipeline import baseline_factor


def generate_recommendations(
    device_id: str,
    features: dict[str, float],
    anomaly_score: float,
    risk_score: float,
    classification: str,
    insider_risk_score: float,
) -> list[dict[str, object]]:
    factors = baseline_factor(features)
    recommendations: list[dict[str, object]] = []

    if features["failed_login_count"] >= 3 or features["unusual_login_locations"] > 0:
        recommendations.append(
            {
                "device_id": device_id,
                "title": "Enforce adaptive MFA",
                "description": f"Login risk increased from {features['failed_login_count']:.0f} failed logins and {features['unusual_login_locations']:.0f} unusual location signals.",
                "confidence": min(98.0, 68.0 + anomaly_score * 0.22),
                "reason": "Authentication behavior diverged from the normal baseline.",
                "contributing_factors": ["failed_login_count", "unusual_login_locations"],
            }
        )

    if features["repeated_usb_activity"] >= 2 or insider_risk_score >= 55:
        recommendations.append(
            {
                "device_id": device_id,
                "title": "Restrict removable media",
                "description": f"Insider risk is {insider_risk_score:.0f}/100 with repeated USB activity and elevated file movement.",
                "confidence": min(97.0, 62.0 + insider_risk_score * 0.28),
                "reason": "USB activity combined with file access can indicate staged exfiltration.",
                "contributing_factors": ["repeated_usb_activity", "excessive_file_access", "large_data_movement"],
            }
        )

    if features["outbound_traffic_volume"] > 250 or features["network_connection_count"] > 35:
        recommendations.append(
            {
                "device_id": device_id,
                "title": "Investigate outbound traffic",
                "description": f"Outbound traffic volume is {factors['network']}x higher per network event than the recent baseline.",
                "confidence": min(96.0, 58.0 + anomaly_score * 0.3),
                "reason": "Network activity pattern is contributing to the AI anomaly score.",
                "contributing_factors": ["outbound_traffic_volume", "network_connection_count"],
            }
        )

    if risk_score >= 75 or classification == "Critical":
        recommendations.append(
            {
                "device_id": device_id,
                "title": "Escalate endpoint investigation",
                "description": f"Hybrid AI risk reached {risk_score:.0f}/100 and the behavior classifier returned {classification}.",
                "confidence": min(99.0, 70.0 + risk_score * 0.25),
                "reason": "Rule detections, alert history, and anomaly score are converging on a high-risk endpoint.",
                "contributing_factors": ["device_risk_history", "alert_frequency", "anomaly_score"],
            }
        )

    if not recommendations and anomaly_score >= 45:
        recommendations.append(
            {
                "device_id": device_id,
                "title": "Review anomalous behavior",
                "description": f"AI anomaly score is {anomaly_score:.0f}/100 even though no single rule dominated the signal.",
                "confidence": min(90.0, 55.0 + anomaly_score * 0.22),
                "reason": "Multiple weak telemetry signals combined into an unusual behavior profile.",
                "contributing_factors": ["process_creation_rate", "alert_frequency", "device_risk_history"],
            }
        )

    return recommendations
