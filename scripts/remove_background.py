#!/usr/bin/env python3
"""
High-Precision Studio Portrait Background Removal & Alpha Matting Engine.
Removes white background from Simon Munyambu's high-res portrait with:
- Connected component flood-fill from boundaries
- Enclosed hole preservation (eyes, teeth, highlights)
- Subpixel hair strand alpha matting
- White backlight decontamination (defringing)
- High-fidelity 32-bit RGBA output
"""

import os
import sys
from PIL import Image
import numpy as np
from scipy import ndimage

INPUT_PATH = "/home/lion/Pictures/IMG-20260518-WA0008.jpg"
OUTPUT_PATH = "/home/lion/portfolio/assets/simon-munyambu.png"


def process_portrait(input_path: str, output_path: str):
    print(f"[*] Loading source image from {input_path}...")
    img = Image.open(input_path).convert("RGB")
    rgb = np.array(img, dtype=np.float32)
    h, w, _ = rgb.shape
    print(f"[*] Dimensions: {w}x{h} (Truecolor RGB)")

    # 1. Identify pure background color reference
    # Top edge is reference studio white [254, 254, 254]
    bg_ref = np.median(rgb[:10, :10], axis=(0, 1))
    print(f"[*] Studio background reference: RGB={bg_ref.round(1).tolist()}")

    # Distance to background
    color_dist = np.max(np.abs(rgb - bg_ref), axis=-1)

    # 2. Seed flood-fill connected components from exterior boundary
    bg_seed = (color_dist < 10.0)
    labeled, num_features = ndimage.label(bg_seed)
    bg_mask = (labeled == labeled[0, 0])

    # Ensure all four corner regions connected to exterior are included
    for corner in [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]:
        corner_label = labeled[corner[0], corner[1]]
        if corner_label != 0:
            bg_mask |= (labeled == corner_label)

    # 3. Subject mask with strict hole filling to preserve teeth, eyes, and clothing
    raw_subject = ~bg_mask
    subject_filled = ndimage.binary_fill_holes(raw_subject)

    # Distance transform from background into subject
    dist_from_bg = ndimage.distance_transform_edt(subject_filled)

    # 4. Alpha channel generation
    alpha = np.zeros((h, w), dtype=np.float32)
    # Core subject (interior) is 100% opaque
    alpha[dist_from_bg > 5.0] = 255.0

    # Transition zone (subpixel hair and garment boundaries: 0 < dist <= 5)
    trans_zone = (dist_from_bg > 0) & (dist_from_bg <= 5.0)

    # Calculate subpixel transparency based on color divergence from white
    # Hair foreground baseline brightness is ~40-50
    luminance = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    bg_luminance = 0.299 * bg_ref[0] + 0.587 * bg_ref[1] + 0.114 * bg_ref[2]

    alpha_ratio = np.clip((bg_luminance - luminance) / np.maximum(bg_luminance - 45.0, 1.0), 0.0, 1.0) * 255.0

    # Distance-weighted blend across the 5-pixel boundary
    dist_weight = dist_from_bg[trans_zone] / 5.0
    alpha[trans_zone] = np.clip(alpha_ratio[trans_zone] * dist_weight + (1.0 - dist_weight) * alpha_ratio[trans_zone] * 0.4, 0.0, 255.0)

    # 5. Defringe & decontaminate white studio spill from semi-transparent hair edges
    a_norm = (alpha / 255.0)[..., np.newaxis]
    safe_a = np.maximum(a_norm, 0.08)

    # Unmix: F = (C - (1 - a)*B) / a
    decontam_rgb = (rgb - (1.0 - a_norm) * bg_ref) / safe_a
    decontam_rgb = np.clip(decontam_rgb, 0.0, 255.0)

    # Keep original RGB where fully opaque, decontaminate transition, zero out background
    final_rgb = np.where(a_norm == 0.0, 0.0, np.where(a_norm >= 0.98, rgb, decontam_rgb))

    # 6. Assemble 32-bit RGBA PNG
    rgba = np.dstack([final_rgb.astype(np.uint8), alpha.astype(np.uint8)])
    out_img = Image.fromarray(rgba, mode="RGBA")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    out_img.save(output_path, "PNG", optimize=True)
    print(f"[✓] Successfully saved transparent portrait to {output_path}")
    print(f"[✓] File size: {os.path.getsize(output_path) / 1024:.1f} KB (32-bit RGBA)")


if __name__ == "__main__":
    process_portrait(INPUT_PATH, OUTPUT_PATH)
