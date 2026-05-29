from __future__ import annotations

from pathlib import Path

import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from ai_engine.features.pipeline import features_to_frame
from ai_engine.training.synthetic import make_synthetic_training_data

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "random_forest_classifier.joblib"


class SuspiciousBehaviorClassifier:
    def __init__(self) -> None:
        self.model: Pipeline | None = None

    def load_or_train(self) -> None:
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        if MODEL_PATH.exists():
            self.model = joblib.load(MODEL_PATH)
            return
        x_train, y_train = make_synthetic_training_data()
        self.model = Pipeline(
            [
                ("scale", StandardScaler()),
                ("forest", RandomForestClassifier(n_estimators=180, random_state=42, class_weight="balanced")),
            ]
        )
        self.model.fit(x_train, y_train)
        joblib.dump(self.model, MODEL_PATH)

    def predict(self, features: dict[str, float]) -> tuple[str, float]:
        if self.model is None:
            self.load_or_train()
        assert self.model is not None
        frame = features_to_frame(features)
        classification = str(self.model.predict(frame)[0])
        probabilities = self.model.predict_proba(frame)[0]
        confidence = round(float(max(probabilities)) * 100.0, 2)
        return classification, confidence
