#!/usr/bin/env python3
"""
ML Model Training Script — Crop Disease Diagnostician
Architecture: EfficientNet-Lite0 (fast) / EfficientNet-B1 (accurate)
Dataset: PlantVillage + PlantDoc + PlantWild
Framework: TensorFlow/Keras

This script is NOT part of the mobile app — it runs in Python (Google Colab recommended).
Its only contract with the app is the .tflite files it produces landing in src/ml/models/.
"""

import tensorflow as tf
import numpy as np
import json
import os
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────

CONFIG = {
    "img_size": 224,         # EfficientNet standard input size
    "batch_size": 32,
    "epochs_head": 10,       # Phase 1: train head only (backbone frozen)
    "epochs_finetune": 20,   # Phase 2: fine-tune top layers
    "learning_rate_head": 1e-3,
    "learning_rate_finetune": 1e-5,
    "num_classes": 11,       # 10 diseases + "not_a_plant" rejection class
    "dataset_dir": "./datasets/combined/",
    "output_dir": "./models/",
    "fast_model_confidence_threshold": 0.75,
}

LABEL_MAP = {
    0: "tomato_early_blight",
    1: "tomato_late_blight",
    2: "rice_blast",
    3: "wheat_stem_rust",
    4: "maize_northern_leaf_blight",
    5: "cotton_leaf_curl",
    6: "potato_late_blight",
    7: "chilli_anthracnose",
    8: "groundnut_early_leaf_spot",
    9: "sugarcane_red_rot",
    10: "not_a_plant",
}


# ─── Data loading ─────────────────────────────────────────────────────────────

def build_datasets():
    """
    Load train/val datasets from combined PlantVillage + PlantDoc + PlantWild directory.
    
    Expected structure:
    datasets/combined/
        train/
            tomato_early_blight/   (images)
            rice_blast/            (images)
            ...
        val/
            ... (same structure, using PlantDoc+PlantWild images for real-world accuracy)
    
    Key: validation set uses ONLY PlantDoc/PlantWild images — PlantVillage val accuracy
    is not a trustworthy proxy for real-world performance.
    """
    augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal_and_vertical"),
        tf.keras.layers.RandomRotation(0.3),
        tf.keras.layers.RandomZoom(0.15),
        tf.keras.layers.RandomBrightness(0.2),
        tf.keras.layers.RandomContrast(0.2),
    ])

    def preprocess(image, label):
        image = tf.cast(image, tf.float32) / 255.0
        # ImageNet normalization (EfficientNet expects this)
        mean = tf.constant([0.485, 0.456, 0.406])
        std = tf.constant([0.229, 0.224, 0.225])
        image = (image - mean) / std
        return image, label

    train_ds = tf.keras.utils.image_dataset_from_directory(
        os.path.join(CONFIG["dataset_dir"], "train"),
        image_size=(CONFIG["img_size"], CONFIG["img_size"]),
        batch_size=CONFIG["batch_size"],
        label_mode="categorical",
        shuffle=True,
    ).map(lambda x, y: (augmentation(x), y)).map(preprocess).prefetch(tf.data.AUTOTUNE)

    val_ds = tf.keras.utils.image_dataset_from_directory(
        os.path.join(CONFIG["dataset_dir"], "val"),
        image_size=(CONFIG["img_size"], CONFIG["img_size"]),
        batch_size=CONFIG["batch_size"],
        label_mode="categorical",
        shuffle=False,
    ).map(preprocess).prefetch(tf.data.AUTOTUNE)

    return train_ds, val_ds


# ─── Model building ───────────────────────────────────────────────────────────

def build_fast_model() -> tf.keras.Model:
    """
    Fast model: EfficientNet-Lite0 equivalent via EfficientNetB0.
    Optimized for size/latency — target < 6MB after float16 quantization.
    """
    backbone = tf.keras.applications.EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_shape=(CONFIG["img_size"], CONFIG["img_size"], 3),
    )
    backbone.trainable = False  # Freeze for Phase 1

    inputs = tf.keras.Input(shape=(CONFIG["img_size"], CONFIG["img_size"], 3))
    x = backbone(inputs, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(CONFIG["num_classes"], activation="softmax")(x)

    return tf.keras.Model(inputs, outputs, name="fast_classifier")


def build_accurate_model() -> tf.keras.Model:
    """
    Accurate model: EfficientNetB1.
    Used for ambiguous cases (confidence below threshold) — target < 15MB.
    """
    backbone = tf.keras.applications.EfficientNetB1(
        include_top=False,
        weights="imagenet",
        input_shape=(CONFIG["img_size"], CONFIG["img_size"], 3),
    )
    backbone.trainable = False  # Freeze for Phase 1

    inputs = tf.keras.Input(shape=(CONFIG["img_size"], CONFIG["img_size"], 3))
    x = backbone(inputs, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    outputs = tf.keras.layers.Dense(CONFIG["num_classes"], activation="softmax")(x)

    return tf.keras.Model(inputs, outputs, name="accurate_classifier")


# ─── Two-phase fine-tuning ────────────────────────────────────────────────────

def train_model(model: tf.keras.Model, train_ds, val_ds, model_name: str):
    """
    Two-phase fine-tuning:
    Phase 1 — freeze backbone, train classification head
    Phase 2 — unfreeze top layers, fine-tune at lower LR
    """
    print(f"\n{'='*60}")
    print(f"Training: {model_name}")
    print(f"{'='*60}\n")

    # Phase 1: Head only
    model.compile(
        optimizer=tf.keras.optimizers.Adam(CONFIG["learning_rate_head"]),
        loss="categorical_crossentropy",
        metrics=["accuracy", tf.keras.metrics.TopKCategoricalAccuracy(k=3, name="top3_acc")],
    )

    callbacks_phase1 = [
        tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(patience=2, factor=0.5),
    ]

    print("Phase 1: Training classification head (backbone frozen)...")
    model.fit(
        train_ds,
        epochs=CONFIG["epochs_head"],
        validation_data=val_ds,
        callbacks=callbacks_phase1,
        verbose=1,
    )

    # Phase 2: Unfreeze top layers
    backbone = model.layers[1]
    backbone.trainable = True
    for layer in backbone.layers[:-30]:  # Freeze all but last 30 layers
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(CONFIG["learning_rate_finetune"]),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    callbacks_phase2 = [
        tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(
            f"./models/{model_name}_best.keras",
            save_best_only=True,
            monitor="val_accuracy",
        ),
    ]

    print("Phase 2: Fine-tuning top layers...")
    model.fit(
        train_ds,
        epochs=CONFIG["epochs_finetune"],
        validation_data=val_ds,
        callbacks=callbacks_phase2,
        verbose=1,
    )

    return model


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    Path(CONFIG["output_dir"]).mkdir(parents=True, exist_ok=True)

    print(f"TensorFlow version: {tf.__version__}")
    print(f"GPU available: {len(tf.config.list_physical_devices('GPU')) > 0}")
    print(f"Training {CONFIG['num_classes']} classes: {list(LABEL_MAP.values())}\n")

    # Save label map alongside models
    with open(os.path.join(CONFIG["output_dir"], "labels.json"), "w") as f:
        json.dump({str(k): v for k, v in LABEL_MAP.items()}, f, indent=2)

    train_ds, val_ds = build_datasets()
    
    # Train fast model first (unblocks app-side ML integration)
    fast_model = build_fast_model()
    fast_model = train_model(fast_model, train_ds, val_ds, "fast_classifier")
    
    # Evaluate on val set
    val_loss, val_acc, val_top3 = fast_model.evaluate(val_ds, verbose=0)
    print(f"\nFast model val accuracy: {val_acc:.3f}, top-3: {val_top3:.3f}")

    # Train accurate model (can run in parallel session)
    accurate_model = build_accurate_model()
    accurate_model = train_model(accurate_model, train_ds, val_ds, "accurate_classifier")

    print("\nTraining complete. Run convert_to_tflite.py to export .tflite files.")
