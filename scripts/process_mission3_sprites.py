from collections import deque
from pathlib import Path
from PIL import Image

BRAIN_DIR = Path(r"C:\Users\jacks\.gemini\antigravity\brain\0ae98b92-cbc7-4e58-9b1e-08dc2b5eb9b9")
OUT_DIR = Path(r"c:\Users\jacks\OneDrive\Documentos\AresGrid\public\assets\sprites\mission3")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def key_white_components(src_path: Path, dst_path: Path, min_component_size: int = 24) -> None:
    """Remove fundo branco externo e furos internos grandes mantendo brilhos pequenos."""
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]

    def is_white(r: int, g: int, b: int) -> bool:
        return r >= 236 and g >= 236 and b >= 236 and (max(r, g, b) - min(r, g, b)) <= 16

    for y in range(h):
        for x in range(w):
            if visited[y][x]:
                continue
            r, g, b, _ = px[x, y]
            if not is_white(r, g, b):
                continue

            queue = deque([(x, y)])
            visited[y][x] = True
            comp = []
            touches_border = False

            while queue:
                cx, cy = queue.popleft()
                comp.append((cx, cy))
                if cx == 0 or cy == 0 or cx == w - 1 or cy == h - 1:
                    touches_border = True
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                        nr, ng, nb, _ = px[nx, ny]
                        if is_white(nr, ng, nb):
                            visited[ny][nx] = True
                            queue.append((nx, ny))

            if touches_border or len(comp) >= min_component_size:
                for cx, cy in comp:
                    px[cx, cy] = (0, 0, 0, 0)

    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(dst_path, format="PNG")
    print(f"Saved {dst_path} ({img.size})")


def key_black_border(src_path: Path, dst_path: Path, max_luma: int = 16) -> None:
    """Remove fundo preto externo via flood-fill pelas bordas mantendo contornos escuros."""
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]

    def is_black(r: int, g: int, b: int) -> bool:
        return max(r, g, b) <= max_luma

    queue = deque()
    for x in range(w):
        for y in (0, h - 1):
            r, g, b, _ = px[x, y]
            if is_black(r, g, b) and not visited[y][x]:
                visited[y][x] = True
                queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            r, g, b, _ = px[x, y]
            if is_black(r, g, b) and not visited[y][x]:
                visited[y][x] = True
                queue.append((x, y))

    while queue:
        cx, cy = queue.popleft()
        px[cx, cy] = (0, 0, 0, 0)
        for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                nr, ng, nb, _ = px[nx, ny]
                if is_black(nr, ng, nb):
                    visited[ny][nx] = True
                    queue.append((nx, ny))

    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(dst_path, format="PNG")
    print(f"Saved {dst_path} ({img.size})")


def convert_to_png(src_path: Path, dst_path: Path) -> None:
    """Converte cenario pixel art para PNG sem perdas."""
    img = Image.open(src_path).convert("RGB")
    img.save(dst_path, format="PNG")
    print(f"Saved {dst_path} ({img.size})")


if __name__ == "__main__":
    key_white_components(
        BRAIN_DIR / "drill_rig_1794742184045.jpg",
        OUT_DIR / "drill_rig.png",
    )
    key_black_border(
        BRAIN_DIR / "ice_core_sample_1794742196134.jpg",
        OUT_DIR / "ice_core_sample.png",
    )
    convert_to_png(
        BRAIN_DIR / "water_lab_station_1794742186423.jpg",
        OUT_DIR / "water_lab_station.png",
    )
