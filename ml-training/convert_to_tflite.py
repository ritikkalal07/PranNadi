#!/usr/bin/env python3
"""
Convert trained Keras models to TFLite with float16 quantization.
Run after train.py completes.

Output files drop directly into the app's src/ml/models/ directory.
"""

import tensorflow as tf
import numpy as np
import os
import json
from pathlib import Path

# Paths — adjust if your training output is elsewhere
MODEL_PATHS = {
    "fast": "./models/fast_classifier_best.keras",
    "accurate": "./models/accurate_classifier_best.keras",
}

# Target sizes to verify after conversion
TARGET_SIZES = {
    "fast": 6 * 1024 * 1024,      # 6 MB max
    "accurate": 15 * 1024 * 1024, # 15 MB max
}

APP_MODEL_DIR = "../app/src/ml/models/"


def convert_to_tflite(model_path: str, output_name: str) -> bytes:
    """
    Convert a Keras model to TFLite with float16 quantization.
    
    Float16 rationale:
    - ~50% size reduction vs full float32
    - Minimal accuracy loss (unlike int8 which needs calibration dataset)
    - Supported on all Android/iOS devices we target
    """
    print(f"Loading model: {model_path}")
    model = tf.keras.models.load_model(model_path)

    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.target_spec.supported_types = [tf.float16]

    print(f"Converting {output_name} to TFLite (float16)...")
    tflite_model = converter.convert()

    return tflite_model


def validate_model(tflite_model: bytes, model_name: str, num_classes: int = 11):
    """
    Validate the converted model:
    1. Input tensor shape matches preprocess.ts expectations
    2. Output shape matches num_classes
    3. File size within target
    """
    interpreter = tf.lite.Interpreter(model_content=tflite_model)
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    input_shape = input_details[0]['shape']
    output_shape = output_details[0]['shape']

    print(f"\nValidation for {model_name}:")
    print(f"  Input shape:  {input_shape}  (expected: [1, 224, 224, 3])")
    print(f"  Output shape: {output_shape} (expected: [1, {num_classes}])")

    assert list(input_shape) == [1, 224, 224, 3], \
        f"Input shape mismatch! Got {input_shape}, expected [1, 224, 224, 3]"
    assert output_shape[1] == num_classes, \
        f"Output shape mismatch! Got {output_shape[1]} classes, expected {num_classes}"

    print(f"  ✓ Shapes validated")

    # Quick inference test
    test_input = np.random.randn(1, 224, 224, 3).astype(np.float32)
    interpreter.set_tensor(input_details[0]['index'], test_input)
    interpreter.invoke()
    output = interpreter.get_tensor(output_details[0]['index'])

    assert abs(output.sum() - 1.0) < 0.01, "Output probabilities don't sum to ~1.0"
    max_class = np.argmax(output)
    max_confidence = output[0, max_class]
    print(f"  ✓ Inference test passed (top class: {max_class}, confidence: {max_confidence:.3f})")


def check_file_size(size_bytes: int, model_name: str):
    target = TARGET_SIZES.get(model_name, float("inf"))
    size_mb = size_bytes / (1024 * 1024)
    target_mb = target / (1024 * 1024)
    status = "✓" if size_bytes <= target else "⚠ EXCEEDS TARGET"
    print(f"  Size: {size_mb:.2f} MB (target: < {target_mb:.0f} MB) {status}")


if __name__ == "__main__":
    Path(APP_MODEL_DIR).mkdir(parents=True, exist_ok=True)

    for model_key, model_path in MODEL_PATHS.items():
        if not os.path.exists(model_path):
            print(f"⚠ Model not found: {model_path} — skipping (train.py first)")
            continue

        tflite_model = convert_to_tflite(model_path, model_key)
        validate_model(tflite_model, model_key)
        check_file_size(len(tflite_model), model_key)

        output_path = os.path.join(APP_MODEL_DIR, f"{model_key}-classifier.tflite")
        with open(output_path, "wb") as f:
            f.write(tflite_model)

        print(f"  Saved to: {output_path}\n")

    print("Conversion complete. Verify models in Netron (netron.app) before committing.")
