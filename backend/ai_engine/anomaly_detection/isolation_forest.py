from __future__ import annotations

from pathlib import Path

import joblib
from sklearn.ensemble import IsolationForest

from ai_engine.features.pipeline import features_to_frame
from ai_engine.training.synthetic import make_synthetic_training_data

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "isolation_forest.joblib"


class IsolationForestDetector:
    def __init__(self) -> None:
        self.model: IsolationForest | None = None

    def load_or_train(self) -> None:
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        if MODEL_PATH.exists():
            self.model = joblib.load(MODEL_PATH)
            return
        x_train, _ = make_synthetic_training_data()
        self.model = IsolationForest(n_estimators=160, contamination=0.08, random_state=42)
        self.model.fit(x_train)
        joblib.dump(self.model, MODEL_PATH)

    def score(self, features: dict[str, float]) -> float:
        if self.model is None:
            self.load_or_train()
        assert self.model is not None
        frame = features_to_frame(features)
        raw_score = float(self.model.decision_function(frame)[0])
        anomaly_score = max(0.0, min(100.0, (0.18 - raw_score) / 0.36 * 100.0))
        return round(anomaly_score, 2)
