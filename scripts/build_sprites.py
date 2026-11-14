from pathlib import Path
from PIL import Image, ImageDraw
import math
import random

OUT_DIR = Path(r"c:\Users\jacks\OneDrive\Documentos\AresGrid\public\assets\sprites")
OUT_DIR.mkdir(parents=True, exist_ok=True)

CAPI_SRC = Path(
    r"C:\Users\jacks\.gemini\antigravity\brain\0ae98b92-cbc7-4e58-9b1e-08dc2b5eb9b9\capi_portrait_1794683372612.jpg"
)


def convert_capi_to_rgba() -> None:
    """Remove o fundo chroma-key verde da Capi gerada pelo Nano Banana e exporta PNG RGBA."""
    img = Image.open(CAPI_SRC).convert("RGBA")
    w, h = img.size
    pixels = img.load()

    # Remover fundo verde chroma-key com suavidade nas bordas anti-aliased de JPEG
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Verde chroma key puro ou próximo
            if g > 130 and g > r * 1.28 and g > b * 1.28:
                pixels[x, y] = (0, 0, 0, 0)
            elif g > 100 and (g - max(r, b)) > 38:
                # Limpar halo verde de compressão JPEG
                pixels[x, y] = (r, int((r + b) * 0.5), b, 120)

    # Downsample para estética pixel-art nítida (128x128) e upscale 2x NEAREST (256x256)
    small = img.resize((128, 128), Image.Resampling.NEAREST)
    # Limpar semi-transparências para pixel art nítido
    spix = small.load()
    for y in range(128):
        for x in range(128):
            r, g, b, a = spix[x, y]
            if a < 140:
                spix[x, y] = (0, 0, 0, 0)
            else:
                spix[x, y] = (r, g, b, 255)

    final_capi = small.resize((256, 256), Image.Resampling.NEAREST)
    final_capi.save(OUT_DIR / "capi_portrait.png", format="PNG")
    print("Saved capi_portrait.png")


def build_astronaut_base() -> None:
    """Gera sprite chibi 16-bit de astronauta em 64x64 RGBA escalado para 256x256."""
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    outline = (22, 24, 38, 255)
    white_hi = (245, 248, 255, 255)
    white_mid = (212, 222, 238, 255)
    white_sh = (160, 174, 198, 255)
    visor_dark = (22, 42, 72, 255)
    visor_mid = (46, 125, 194, 255)
    visor_hi = (165, 238, 255, 255)
    orange_hi = (255, 146, 62, 255)
    orange_sh = (204, 86, 28, 255)
    boot_dark = (68, 76, 98, 255)
    skin = (246, 200, 166, 255)
    cheek = (240, 138, 138, 255)

    # Mochila PLSS atrás
    d.rectangle([17, 29, 46, 46], fill=white_sh, outline=outline)
    d.rectangle([19, 31, 44, 43], fill=white_mid)
    # Antena da mochila
    d.rectangle([42, 19, 44, 29], fill=outline)
    d.rectangle([43, 20, 43, 28], fill=white_mid)
    d.rectangle([41, 17, 45, 20], fill=orange_hi, outline=outline)

    # Pernas e botas
    d.rectangle([22, 46, 30, 54], fill=white_mid, outline=outline)
    d.rectangle([33, 46, 41, 54], fill=white_mid, outline=outline)
    d.rectangle([21, 53, 30, 58], fill=boot_dark, outline=outline)
    d.rectangle([33, 53, 42, 58], fill=boot_dark, outline=outline)
    d.rectangle([22, 54, 28, 55], fill=orange_hi)
    d.rectangle([34, 54, 40, 55], fill=orange_hi)

    # Tronco do traje
    d.rectangle([21, 30, 42, 47], fill=white_hi, outline=outline)
    d.rectangle([22, 40, 41, 46], fill=white_mid)
    # Cinto laranja
    d.rectangle([22, 41, 41, 44], fill=orange_hi, outline=outline)
    d.rectangle([29, 41, 34, 44], fill=visor_hi, outline=outline)
    # Painel peitoral NASA
    d.rectangle([26, 33, 37, 39], fill=white_sh, outline=outline)
    d.point((28, 35), fill=(56, 189, 248, 255))
    d.point((30, 35), fill=(251, 191, 36, 255))
    d.point((34, 35), fill=(74, 222, 128, 255))
    d.line([28, 37, 35, 37], fill=orange_sh)

    # Braços
    d.rectangle([15, 31, 21, 42], fill=white_mid, outline=outline)
    d.rectangle([42, 31, 48, 42], fill=white_mid, outline=outline)
    d.rectangle([15, 41, 20, 45], fill=orange_hi, outline=outline)
    d.rectangle([43, 41, 48, 45], fill=orange_hi, outline=outline)

    # Capacete grande 16-bit chibi
    d.rounded_rectangle([16, 7, 47, 32], radius=8, fill=white_hi, outline=outline)
    d.rectangle([20, 29, 43, 32], fill=orange_hi, outline=outline)
    # Visor amplo com rosto amigável visível
    d.rounded_rectangle([20, 12, 43, 27], radius=5, fill=visor_dark, outline=outline)
    d.rectangle([22, 14, 41, 25], fill=visor_mid)
    # Rosto simpático dentro do visor
    d.rectangle([24, 16, 39, 24], fill=skin)
    d.rectangle([27, 19, 28, 21], fill=outline)
    d.rectangle([35, 19, 36, 21], fill=outline)
    d.point((26, 22), fill=cheek)
    d.point((37, 22), fill=cheek)
    d.line([30, 22, 33, 22], fill=outline)
    # Reflexo brilhante no visor
    d.line([22, 14, 27, 14], fill=visor_hi)
    d.line([22, 15, 24, 15], fill=visor_hi)
    d.point((39, 23), fill=visor_hi)

    out = img.resize((256, 256), Image.Resampling.NEAREST)
    out.save(OUT_DIR / "astronaut_base.png", format="PNG")
    print("Saved astronaut_base.png")


def build_bg_cockpit_launch() -> None:
    """Cenário 320x180 pixel art do cockpit olhando a Terra azul pela janela."""
    W, H = 320, 180
    img = Image.new("RGB", (W, H), (8, 12, 28))
    d = ImageDraw.Draw(img)
    rng = random.Random(42)

    # Estrelas pixeladas
    for _ in range(130):
        sx = rng.randint(10, W - 10)
        sy = rng.randint(6, 120)
        c = rng.choice([(255, 255, 255), (186, 230, 253), (254, 240, 138)])
        d.point((sx, sy), fill=c)
        if rng.random() > 0.85:
            d.point((sx + 1, sy), fill=c)

    # Curvatura da Terra vista pela janela
    # Atmosfera azul brilhante
    d.ellipse([25, 84, 295, 260], fill=(56, 189, 248))
    # Oceano
    d.ellipse([30, 88, 290, 262], fill=(14, 102, 204))
    # Continentes estilizados
    d.polygon([(80, 112), (125, 102), (146, 118), (118, 135), (86, 128)], fill=(52, 168, 83))
    d.polygon([(176, 98), (235, 105), (242, 126), (198, 132), (172, 116)], fill=(74, 186, 102))
    # Nuvens brancas pixeladas
    for cx, cy, cw in [(65, 106, 24), (118, 96, 30), (164, 114, 26), (218, 102, 28), (142, 126, 34)]:
        d.rounded_rectangle([cx, cy, cx + cw, cy + 5], radius=2, fill=(238, 246, 255))

    # Moldura do cockpit metálico
    hull_dark = (22, 28, 46)
    hull_mid = (42, 52, 82)
    hull_hi = (78, 94, 136)
    # Vigas superiores e laterais da janela
    d.polygon([(0, 0), (W, 0), (W, 20), (265, 12), (55, 12), (0, 20)], fill=hull_dark)
    d.polygon([(0, 0), (42, 0), (22, 132), (0, 132)], fill=hull_mid)
    d.polygon([(W, 0), (W - 42, 0), (W - 22, 132), (W, 132)], fill=hull_mid)
    # Hastes da janela
    d.line([92, 10, 74, 126], fill=hull_dark, width=6)
    d.line([92, 10, 74, 126], fill=hull_hi, width=2)
    d.line([228, 10, 246, 126], fill=hull_dark, width=6)
    d.line([228, 10, 246, 126], fill=hull_hi, width=2)

    # Painel de controle inferior
    d.polygon([(0, 124), (60, 116), (260, 116), (W, 124), (W, H), (0, H)], fill=hull_mid)
    d.line([0, 124, 60, 116, 260, 116, W, 124], fill=hull_hi, width=2)
    d.rectangle([0, 132, W, H], fill=hull_dark)

    # Monitores e instrumentos do painel
    # Tela esquerda (Órbita)
    d.rectangle([28, 136, 98, 170], fill=(10, 26, 44), outline=(56, 189, 248))
    d.arc([38, 142, 88, 166], 180, 360, fill=(34, 211, 238))
    d.point((80, 148), fill=(249, 115, 22))
    # Tela direita (Motores)
    d.rectangle([222, 136, 292, 170], fill=(10, 26, 44), outline=(56, 189, 248))
    for i, bar_h in enumerate([20, 24, 18, 26, 22]):
        bx = 230 + i * 11
        d.rectangle([bx, 166 - bar_h, bx + 6, 166], fill=(52, 211, 153))

    # Console central com luz de ativação da Capi
    d.rectangle([112, 128, 208, 172], fill=(28, 38, 62), outline=hull_hi)
    d.ellipse([151, 135, 169, 153], fill=(14, 116, 144), outline=(103, 232, 249))
    d.ellipse([155, 139, 165, 149], fill=(34, 211, 238))
    # Botões coloridos pixelados
    for i, col in enumerate([(249, 115, 22), (250, 204, 21), (34, 211, 238), (74, 222, 128), (248, 113, 113)]):
        d.rectangle([122 + i * 16, 158, 132 + i * 16, 165], fill=col)

    out = img.resize((1280, 720), Image.Resampling.NEAREST)
    out.save(OUT_DIR / "bg_cockpit_launch.png", format="PNG")
    print("Saved bg_cockpit_launch.png")


def build_bg_mars_landing() -> None:
    """Cenário 320x180 pixel art do pouso em Arcadia Planitia, Marte."""
    W, H = 320, 180
    img = Image.new("RGB", (W, H), (222, 120, 72))
    d = ImageDraw.Draw(img)

    # Gradiente em faixas pixeladas (céu marciano)
    bands = [
        (0, 28, (148, 68, 56)),
        (28, 56, (186, 92, 62)),
        (56, 82, (224, 124, 74)),
        (82, 106, (242, 162, 102)),
    ]
    for y0, y1, col in bands:
        d.rectangle([0, y0, W, y1], fill=col)

    # Sol pequeno distante no céu marciano
    d.ellipse([242, 28, 260, 46], fill=(255, 244, 214))
    d.ellipse([245, 31, 257, 43], fill=(255, 255, 245))

    # Montanhas distantes em Arcadia Planitia
    d.polygon([(0, 106), (34, 86), (72, 98), (118, 92), (165, 102), (218, 84), (275, 96), (320, 88), (320, 114), (0, 114)], fill=(154, 64, 42))

    # Planície extensa avermelhada
    d.rectangle([0, 106, W, 140], fill=(196, 84, 46))
    d.rectangle([0, 140, W, H], fill=(166, 62, 34))

    # Rochas e crateras em pixel art
    for rx, ry, rw in [(26, 134, 16), (78, 152, 22), (242, 144, 18), (284, 126, 14)]:
        d.polygon([(rx, ry), (rx + rw // 2, ry - 7), (rx + rw, ry)], fill=(116, 40, 24))
        d.polygon([(rx + 2, ry), (rx + rw // 2, ry - 6), (rx + rw // 2 + 2, ry)], fill=(214, 104, 62))

    # Módulo de pouso chegando em Arcadia Planitia
    # Chama de retropropulsão e poeira
    d.polygon([(142, 114), (178, 114), (198, 132), (122, 132)], fill=(246, 184, 122))
    d.polygon([(152, 112), (168, 112), (164, 126), (156, 126)], fill=(255, 240, 160))
    # Pernas de pouso
    d.line([144, 108, 132, 124], fill=(210, 220, 232), width=3)
    d.line([176, 108, 188, 124], fill=(210, 220, 232), width=3)
    d.rectangle([128, 123, 136, 126], fill=(249, 115, 22))
    d.rectangle([184, 123, 192, 126], fill=(249, 115, 22))
    # Corpo do módulo
    d.polygon([(142, 82), (178, 82), (184, 110), (136, 110)], fill=(238, 244, 252), outline=(30, 34, 52))
    d.rectangle([144, 92, 176, 100], fill=(249, 115, 22))
    # Janela iluminada
    d.rectangle([154, 86, 166, 91], fill=(56, 189, 248), outline=(22, 30, 48))

    out = img.resize((1280, 720), Image.Resampling.NEAREST)
    out.save(OUT_DIR / "bg_mars_landing.png", format="PNG")
    print("Saved bg_mars_landing.png")


def build_bg_arcadia_base() -> None:
    """Cenário 320x180 pixel art da Base Científica em Arcadia Planitia (pronta para Missão 1)."""
    W, H = 320, 180
    img = Image.new("RGB", (W, H), (222, 126, 78))
    d = ImageDraw.Draw(img)

    # Céu marciano em faixas
    for y0, y1, col in [(0, 24, (132, 66, 62)), (24, 54, (182, 94, 66)), (54, 86, (226, 132, 78)), (86, 108, (244, 172, 112))]:
        d.rectangle([0, y0, W, y1], fill=col)

    # Sol brilhante
    d.ellipse([44, 24, 62, 42], fill=(255, 248, 220))

    # Cadeia montanhosa ao fundo
    d.polygon([(0, 104), (48, 88), (112, 98), (180, 82), (242, 96), (320, 86), (320, 112), (0, 112)], fill=(150, 62, 42))

    # Solo de Arcadia Planitia
    d.rectangle([0, 104, W, 144], fill=(198, 88, 48))
    d.rectangle([0, 144, W, H], fill=(164, 62, 34))

    # Habitat principal branco e laranja (esquerda-centro)
    d.rounded_rectangle([32, 84, 134, 132], radius=14, fill=(238, 242, 248), outline=(28, 32, 48))
    d.rectangle([38, 108, 128, 116], fill=(249, 115, 22))
    # Domo de entrada e escotilha
    d.rectangle([68, 92, 98, 132], fill=(214, 224, 236), outline=(28, 32, 48))
    d.rectangle([76, 106, 90, 130], fill=(48, 62, 86), outline=(28, 32, 48))
    # Janelas iluminadas
    d.rectangle([44, 96, 58, 104], fill=(56, 189, 248), outline=(28, 32, 48))
    d.rectangle([108, 96, 122, 104], fill=(56, 189, 248), outline=(28, 32, 48))

    # Antena de comunicação com a Terra
    d.line([118, 84, 118, 56], fill=(210, 220, 232), width=3)
    d.arc([106, 44, 130, 64], 200, 340, fill=(248, 250, 252), width=3)
    d.point((118, 52), fill=(34, 211, 238))

    # Pequeno rover explorador estacionado
    d.rectangle([154, 124, 184, 135], fill=(235, 240, 248), outline=(28, 32, 48))
    d.rectangle([160, 126, 178, 131], fill=(249, 115, 22))
    d.line([174, 124, 174, 113], fill=(200, 212, 226), width=2)
    d.rectangle([170, 110, 180, 115], fill=(56, 189, 248), outline=(28, 32, 48))
    for wx in [156, 167, 178]:
        d.ellipse([wx, 133, wx + 7, 140], fill=(42, 46, 62), outline=(18, 20, 30))

    # Área demarcada aguardando instalação dos painéis solares (Missão 1)
    d.polygon([(206, 124), (294, 124), (304, 148), (196, 148)], fill=(142, 56, 36), outline=(250, 204, 21))
    # Balizas amarelas de demarcação
    for bx, by in [(206, 120), (292, 120), (198, 142), (300, 142)]:
        d.rectangle([bx, by, bx + 3, by + 7], fill=(250, 204, 21), outline=(28, 32, 48))
    # Pedestal vazio aguardando painel solar
    d.rectangle([244, 126, 254, 138], fill=(100, 116, 139), outline=(28, 32, 48))
    d.rectangle([240, 123, 258, 127], fill=(249, 115, 22), outline=(28, 32, 48))

    # Algumas rochas no primeiro plano
    d.polygon([(18, 156), (30, 148), (44, 156)], fill=(122, 44, 26))
    d.polygon([(266, 160), (278, 151), (292, 160)], fill=(122, 44, 26))

    out = img.resize((1280, 720), Image.Resampling.NEAREST)
    out.save(OUT_DIR / "bg_arcadia_base.png", format="PNG")
    print("Saved bg_arcadia_base.png")


if __name__ == "__main__":
    convert_capi_to_rgba()
    build_astronaut_base()
    build_bg_cockpit_launch()
    build_bg_mars_landing()
    build_bg_arcadia_base()
    print("All sprites built successfully!")
