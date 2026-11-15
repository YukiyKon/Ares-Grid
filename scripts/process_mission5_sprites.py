from collections import deque
from pathlib import Path
from PIL import Image

BRAIN_DIR = Path(
    r"C:\Users\jacks\.gemini\antigravity\brain\0ae98b92-cbc7-4e58-9b1e-08dc2b5eb9b9"
)
OUT_DIR = Path(r"c:\Users\jacks\OneDrive\Documentos\AresGrid\public\assets\sprites\mission5")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def key_white_border(src_path: Path, dst_path: Path, min_luma: int = 232) -> None:
    """Remove fundo branco externo via flood-fill pelas bordas preservando brilhos internos."""
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]

    def is_white(r: int, g: int, b: int) -> bool:
        return (
            r >= min_luma
            and g >= min_luma
            and b >= min_luma
            and (max(r, g, b) - min(r, g, b)) <= 22
        )

    queue = deque()
    for x in range(w):
        for y in (0, h - 1):
            r, g, b, _ = px[x, y]
            if is_white(r, g, b) and not visited[y][x]:
                visited[y][x] = True
                queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            r, g, b, _ = px[x, y]
            if is_white(r, g, b) and not visited[y][x]:
                visited[y][x] = True
                queue.append((x, y))

    while queue:
        cx, cy = queue.popleft()
        px[cx, cy] = (0, 0, 0, 0)
        for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                nr, ng, nb, _ = px[nx, ny]
                if is_white(nr, ng, nb):
                    visited[ny][nx] = True
                    queue.append((nx, ny))

    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(dst_path, format="PNG")
    print(f"Saved {dst_path} ({img.size})")


def convert_to_png(src_path: Path, dst_path: Path) -> None:
    """Converte cenario 16:9 pixel art para PNG sem perdas."""
    img = Image.open(src_path).convert("RGB")
    img.save(dst_path, format="PNG")
    print(f"Saved {dst_path} ({img.size})")


if __name__ == "__main__":
    key_white_border(
        BRAIN_DIR / "radiation_shelter_1794748401800.jpg",
        OUT_DIR / "radiation_shelter.png",
    )
    convert_to_png(
        BRAIN_DIR / "dust_storm_scene_1794748404697.jpg",
        OUT_DIR / "dust_storm_scene.png",
    )
    convert_to_png(
        BRAIN_DIR / "earth_comms_room_empty_1794748431382.jpg",
        OUT_DIR / "earth_comms_room.png",
    )
