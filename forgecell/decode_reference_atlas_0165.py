#!/usr/bin/env python3
"""Recreate the Android FCE X atlas from compact reference artwork."""
from pathlib import Path
import base64
import hashlib
import struct
import zlib

root = Path(__file__).resolve().parent.parent
source = root / "forgecell" / "reference_atlas_0165.b85"
packed = base64.b85decode("".join(source.read_text().splitlines()))
assert hashlib.sha256(packed).hexdigest() == "c026c21f440884ef09000edf5de807a382012a1009817caf1eecfd178c7011ff", "reference art payload altered"
assert packed[:4] == b"FCP8"
width, height, n_colors, len_indices, len_alpha = struct.unpack_from("<HHHII", packed, 4)
assert (width, height, n_colors) == (1024, 1024, 64)
palette_start = 18
palette = packed[palette_start:palette_start + n_colors * 3]
compressed_start = palette_start + n_colors * 3
indices = zlib.decompress(packed[compressed_start:compressed_start + len_indices])
alpha = zlib.decompress(packed[compressed_start + len_indices:compressed_start + len_indices + len_alpha])
assert len(indices) == len(alpha) == width * height
colors = [(*palette[3*i:3*i+3], 0) for i in range(n_colors)]
rgba = bytearray(width * height * 4)
for j, (index, a) in enumerate(zip(indices, alpha)):
    pos = j * 4
    rgba[pos:pos + 4] = bytes(palette[3*index:3*index+3]) + bytes([a])
destination = root / "ForgeCell_Engine" / "android" / "app" / "src" / "main" / "assets" / "environment.fcex"
destination.write_bytes(b"FCEX" + struct.pack("<HHI", width, height, len(rgba)) + zlib.compress(rgba, 9))
print("Reference atlas for APK:", destination.stat().st_size, "bytes")
