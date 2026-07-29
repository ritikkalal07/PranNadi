#!/usr/bin/env python3
"""
Model evaluation script — runs after conversion to verify quality before shipping.
Checks accuracy, confidence calibration, and rejection class behavior.
"""

import tensorflow as tf
import numpy as np
import json
import os
from pathlib import Path

MODEL_PATH = "../app/src/ml/models/fast-classifier.tflite"
LABELS_PATH = "../app/src/ml/labels.json"
VAL_DATA_DIR = "./datasets/combined/val/"
IMG_SIZE = 224

# Load labels
with open(LABELS_PATH) as f:
    LABELS = json.load(f)


def load_model(tflite_path: str):
    interpreter = tf.lite.Interpreter(model_path=tflite_path)
    interpreter.allocate_tensors()
    return interpreter


def preprocess_image(image_path: str) -> np.ndarray:
    img = tf.keras.utils.load_img(image_path, target_size=(IMG_SIZE, IMG_SIZE))
    arr = tf.keras.utils.img_to_array(img) / 255.0
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    arr = (arr - mean) / std
    return np.expand_dims(arr.astype(np.float32), axis=0)


def run_inference(interpreter, input_data):
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    return interpreter.get_tensor(output_details[0]['index'])[0]


def evaluate_accuracy(interpreter, val_dir: str):
    """Compute top-1 and top-3 accuracy on the validation set."""
    correct_top1 = 0
    correct_top3 = 0
    total = 0
    confidences = []
    correct_flags = []

    label_to_idx = {v: int(k) for k, v in LABELS.items()}

    for class_name in os.listdir(val_dir):
        class_dir = os.path.join(val_dir, class_name)
        if not os.path.isdir(class_dir):
            continue

        true_idx = label_to_idx.get(class_name)
        if true_idx is None:
            print(f"  Warning: class '{class_name}' not in labels.json — skipping")
            continue

        for img_file in os.listdir(class_dir)[:50]:  # Max 50 per class for speed
            img_path = os.path.join(class_dir, img_file)
            try:
                input_data = preprocess_image(img_path)
                output = run_inference(interpreter, input_data)
                pred_idx = np.argmax(output)
                top3_idxs = np.argsort(output)[::-1][:3]
                confidence = float(output[pred_idx])

                correct_top1 += int(pred_idx == true_idx)
                correct_top3 += int(true_idx in top3_idxs)
                confidences.append(confidence)
                correct_flags.append(int(pred_idx == true_idx))
                total += 1
            except Exception as e:
                print(f"  Error on {img_file}: {e}")

    acc_top1 = correct_top1 / total if total > 0 else 0
    acc_top3 = correct_top3 / total if total > 0 else 0

    print(f"\nAccuracy Results ({total} images):")
    print(f"  Top-1 accuracy: {acc_top1:.3f} ({correct_top1}/{total})")
    print(f"  Top-3 accuracy: {acc_top3:.3f} ({correct_top3}/{total})")

    # Basic calibration check
    if confidences:
        mean_conf = np.mean(confidences)
        print(f"\nCalibration:")
        print(f"  Mean confidence: {mean_conf:.3f}")
        print(f"  Mean accuracy:   {acc_top1:.3f}")
        gap = abs(mean_conf - acc_top1)
        if gap > 0.15:
            print(f"  ⚠ Calibration gap ({gap:.3f}) is large — consider temperature scaling")
        else:
            print(f"  ✓ Calibration looks reasonable (gap: {gap:.3f})")


def test_not_a_plant(interpreter, not_plant_dir: str):
    """Verify rejection class fires on non-plant images."""
    not_plant_idx = int(max(LABELS.keys()))
    correct = 0
    total = 0

    if not os.path.exists(not_plant_dir):
        print(f"\nNot-a-plant test: directory not found ({not_plant_dir})")
        return

    for img_file in os.listdir(not_plant_dir)[:20]:
        img_path = os.path.join(not_plant_dir, img_file)
        try:
            input_data = preprocess_image(img_path)
            output = run_inference(interpreter, input_data)
            pred_idx = np.argmax(output)
            correct += int(pred_idx == not_plant_idx)
            total += 1
        except Exception:
            pass

    print(f"\nNot-a-plant rejection ({total} images):")
    print(f"  Correctly rejected: {correct}/{total} ({correct/max(total,1):.1%})")
    if correct / max(total, 1) < 0.7:
        print("  ⚠ Low rejection rate — review 'not_a_plant' training data quality")
    else:
        print("  ✓ Rejection class is working adequately")


if __name__ == "__main__":
    if not os.path.exists(MODEL_PATH):
        print(f"Model not found: {MODEL_PATH}")
        print("Run convert_to_tflite.py first.")
        exit(1)

    print(f"Evaluating: {MODEL_PATH}")
    interpreter = load_model(MODEL_PATH)
    evaluate_accuracy(interpreter, VAL_DATA_DIR)
    test_not_a_plant(interpreter, os.path.join(VAL_DATA_DIR, "not_a_plant"))
    print("\nEvaluation complete. Review results before shipping this model version.")
