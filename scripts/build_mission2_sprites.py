from pathlib import Path
from PIL import Image, ImageDraw

OUT_DIR = Path(r"c:\Users\jacks\OneDrive\Documentos\AresGrid\public\assets\sprites\mission2")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def draw_habitat_shell(d: ImageDraw.ImageDraw, dusk: bool = False) -> None:
    """Desenha estrutura base do interior do módulo do habitat marciano em 320x180."""
    W, H = 320, 180
    wall_top = (44, 54, 78)
    wall_mid = (62, 74, 102)
    wall_trim = (249, 115, 22)
    floor_main = (52, 60, 82)
    floor_tile = (40, 48, 68)
    outline = (18, 22, 34)

    # Parede metálica do habitat
    d.rectangle([0, 0, W, 128], fill=wall_mid)
    d.rectangle([0, 0, W, 24], fill=wall_top)
    d.rectangle([0, 114, W, 126], fill=wall_trim, outline=outline)

    # Divisórias verticais da parede
    for vx in [20, 106, 214, 300]:
        d.line([vx, 24, vx, 114], fill=wall_top, width=2)

    # Chão com grade 16-bit
    d.rectangle([0, 126, W, H], fill=floor_main)
    for gy in range(132, H, 12):
        d.line([0, gy, W, gy], fill=floor_tile, width=1)
    for gx in range(0, W, 24):
        d.line([gx, 126, gx - 18, H], fill=floor_tile, width=1)

    # Janela panorâmica marciana ao centro-esquerda
    d.rounded_rectangle([120, 32, 200, 84], radius=10, fill=(28, 34, 52), outline=outline)
    if dusk:
        d.rounded_rectangle([125, 37, 195, 79], radius=7, fill=(136, 46, 36))
        d.rectangle([125, 58, 195, 79], fill=(92, 30, 26))
        d.ellipse([172, 44, 184, 56], fill=(254, 215, 170))
    else:
        d.rounded_rectangle([125, 37, 195, 79], radius=7, fill=(226, 124, 72))
        d.rectangle([125, 62, 195, 79], fill=(166, 62, 34))
        d.ellipse([172, 42, 184, 54], fill=(255, 248, 214))
    # Montanhas pixeladas na janela
    d.polygon([(125, 64), (144, 52), (164, 62), (182, 54), (195, 64)], fill=(122, 44, 28))


def build_habitat_gym() -> None:
    """Estação de exercícios espaciais (esteira, cintos de gravidade, resistência e monitor)."""
    img = Image.new("RGB", (320, 180), (44, 54, 78))
    d = ImageDraw.Draw(img)
    draw_habitat_shell(d, dusk=False)
    outline = (18, 22, 34)

    # Monitor cardíaco pixelado na parede direita
    d.rectangle([224, 34, 286, 82], fill=(14, 26, 42), outline=(56, 189, 248))
    # Linha ECG verde
    d.line([230, 58, 242, 58, 246, 44, 250, 68, 254, 52, 258, 58, 280, 58], fill=(74, 222, 128), width=2)
    d.rectangle([232, 68, 252, 75], fill=(56, 189, 248))
    d.rectangle([260, 68, 278, 75], fill=(250, 204, 21))

    # Esteira espacial com cintos de gravidade (esquerda)
    d.rectangle([34, 118, 122, 144], fill=(30, 41, 59), outline=outline)
    d.rectangle([40, 122, 116, 134], fill=(15, 23, 42))
    for stripe_x in range(46, 114, 12):
        d.line([stripe_x, 123, stripe_x - 4, 133], fill=(71, 85, 105), width=2)
    # Painel frontal da esteira
    d.rectangle([98, 76, 114, 122], fill=(203, 213, 225), outline=outline)
    d.rectangle([92, 68, 118, 82], fill=(15, 23, 42), outline=(56, 189, 248))
    # Cintos elásticos de gravidade simulada
    d.line([62, 24, 62, 92], fill=(249, 115, 22), width=3)
    d.line([86, 24, 86, 92], fill=(249, 115, 22), width=3)
    d.rectangle([58, 90, 90, 98], fill=(250, 204, 21), outline=outline)

    # Estação de resistência e equilíbrio (direita)
    d.rectangle([206, 104, 286, 146], fill=(148, 163, 184), outline=outline)
    d.rectangle([212, 108, 280, 120], fill=(56, 189, 248))
    # Elásticos azuis de resistência
    d.line([216, 48, 216, 104], fill=(34, 211, 238), width=3)
    d.line([232, 48, 232, 104], fill=(34, 211, 238), width=3)
    d.rectangle([212, 92, 222, 98], fill=(249, 115, 22), outline=outline)
    d.rectangle([228, 92, 238, 98], fill=(249, 115, 22), outline=outline)
    # Plataforma de equilíbrio
    d.ellipse([142, 134, 184, 148], fill=(249, 115, 22), outline=outline)
    d.ellipse([146, 136, 180, 144], fill=(254, 215, 170))

    img.resize((1280, 720), Image.Resampling.NEAREST).save(OUT_DIR / "habitat_gym.png", format="PNG")
    print("Saved habitat_gym.png")


def build_habitat_galley() -> None:
    """Refeitório espacial com mesa metálica, pacotes espaciais, vegetais e dispensador de água."""
    img = Image.new("RGB", (320, 180), (44, 54, 78))
    d = ImageDraw.Draw(img)
    draw_habitat_shell(d, dusk=False)
    outline = (18, 22, 34)

    # Dispensador de água na parede esquerda
    d.rectangle([34, 48, 86, 116], fill=(226, 232, 240), outline=outline)
    d.rectangle([42, 54, 78, 84], fill=(14, 165, 233), outline=outline)
    d.rectangle([48, 60, 72, 76], fill=(125, 211, 252))
    # Copo sob o bico
    d.rectangle([54, 96, 66, 110], fill=(186, 230, 253), outline=outline)
    d.line([60, 86, 60, 96], fill=(56, 189, 248), width=2)

    # Estante hidropônica pequena com vegetais frescos à direita
    d.rectangle([226, 42, 290, 114], fill=(30, 41, 59), outline=outline)
    d.rectangle([232, 48, 284, 74], fill=(15, 23, 42))
    # Luz LED rosa/violeta e folhas verdes
    d.line([234, 50, 282, 50], fill=(232, 121, 249), width=3)
    for gx in [238, 254, 270]:
        d.ellipse([gx, 60, gx + 10, 72], fill=(34, 197, 94), outline=outline)
    # Tomatinhos e cenouras na prateleira inferior
    d.rectangle([232, 82, 284, 108], fill=(15, 23, 42))
    for tx in [240, 254, 268]:
        d.ellipse([tx, 92, tx + 8, 100], fill=(239, 68, 68), outline=outline)

    # Mesa metálica central em perspectiva
    d.polygon([(76, 114), (244, 114), (266, 144), (54, 144)], fill=(203, 213, 225), outline=outline)
    d.rectangle([86, 144, 98, 166], fill=(100, 116, 139), outline=outline)
    d.rectangle([222, 144, 234, 166], fill=(100, 116, 139), outline=outline)

    # Bandejas e alimentos equilibrados sobre a mesa
    d.rectangle([104, 122, 152, 136], fill=(241, 245, 249), outline=outline)
    d.ellipse([110, 125, 122, 133], fill=(249, 115, 22))
    d.ellipse([126, 125, 138, 133], fill=(34, 197, 94))
    d.ellipse([140, 125, 148, 133], fill=(250, 204, 21))

    # Pacotes selados NASA e cantil de água
    d.rectangle([176, 120, 204, 136], fill=(56, 189, 248), outline=outline)
    d.rectangle([210, 122, 222, 136], fill=(14, 165, 233), outline=outline)

    img.resize((1280, 720), Image.Resampling.NEAREST).save(OUT_DIR / "habitat_galley.png", format="PNG")
    print("Saved habitat_galley.png")


def build_habitat_hygiene() -> None:
    """Módulo de higiene compacto com pia recicladora, kit dental e esterilizador."""
    img = Image.new("RGB", (320, 180), (44, 54, 78))
    d = ImageDraw.Draw(img)
    draw_habitat_shell(d, dusk=False)
    outline = (18, 22, 34)

    # Espelho iluminado e painel de reciclagem de água (esquerda)
    d.rectangle([32, 36, 98, 92], fill=(186, 230, 253), outline=outline)
    d.line([38, 42, 54, 42], fill=(255, 255, 255), width=2)
    d.line([38, 46, 46, 46], fill=(255, 255, 255), width=2)

    # Pia de reciclagem de água fechada
    d.rectangle([28, 96, 104, 148], fill=(226, 232, 240), outline=outline)
    d.rectangle([42, 92, 90, 102], fill=(148, 163, 184), outline=outline)
    # Torneira dosadora
    d.rectangle([62, 76, 70, 92], fill=(100, 116, 139), outline=outline)
    d.line([66, 90, 66, 98], fill=(56, 189, 248), width=2)
    # Tanque transparente de água reciclada
    d.rectangle([44, 114, 88, 138], fill=(14, 165, 233), outline=outline)
    d.rectangle([46, 116, 86, 124], fill=(125, 211, 252))

    # Kit dental e toalhas esterilizadas (centro-direita)
    d.rectangle([216, 88, 290, 148], fill=(203, 213, 225), outline=outline)
    # Escova de dentes e tubo espacial
    d.rectangle([226, 72, 232, 88], fill=(34, 211, 238), outline=outline)
    d.rectangle([224, 68, 232, 73], fill=(255, 255, 255))
    d.rectangle([240, 74, 254, 88], fill=(249, 115, 22), outline=outline)

    # Cabine esterilizadora UV para equipamentos (direita)
    d.rectangle([222, 34, 286, 68], fill=(15, 23, 42), outline=(192, 132, 252))
    d.rectangle([230, 42, 278, 60], fill=(88, 28, 135))
    d.line([234, 44, 274, 44], fill=(216, 180, 254), width=3)
    d.rectangle([246, 48, 262, 58], fill=(226, 232, 240))

    img.resize((1280, 720), Image.Resampling.NEAREST).save(OUT_DIR / "habitat_hygiene.png", format="PNG")
    print("Saved habitat_hygiene.png")


def build_habitat_quarters() -> None:
    """Cabine de descanso com cama espacial e janela mostrando o entardecer de Marte."""
    img = Image.new("RGB", (320, 180), (44, 54, 78))
    d = ImageDraw.Draw(img)
    draw_habitat_shell(d, dusk=True)
    outline = (18, 22, 34)

    # Luz suave noturna no teto
    d.rectangle([136, 10, 184, 16], fill=(129, 140, 248), outline=outline)

    # Cama espacial acolchoada com saco de dormir preso (centro-esquerda)
    d.rectangle([32, 96, 176, 148], fill=(203, 213, 225), outline=outline)
    d.rectangle([36, 90, 172, 112], fill=(79, 70, 229), outline=outline)
    # Travesseiro e manta alaranjada
    d.rectangle([40, 84, 68, 98], fill=(241, 245, 249), outline=outline)
    d.rectangle([72, 92, 168, 112], fill=(249, 115, 22), outline=outline)
    # Cintos de retenção de sono
    d.line([96, 92, 96, 112], fill=(30, 41, 59), width=3)
    d.line([138, 92, 138, 112], fill=(30, 41, 59), width=3)

    # Estação de monitoramento da Capi ao lado da cama (direita)
    d.rectangle([212, 86, 288, 148], fill=(30, 41, 59), outline=outline)
    d.rectangle([220, 46, 280, 86], fill=(8, 51, 68), outline=(34, 211, 238))
    # Ícones de sono e saúde na tela da Capi
    d.ellipse([230, 54, 244, 68], fill=(129, 140, 248))
    d.ellipse([236, 54, 248, 66], fill=(8, 51, 68))
    for i, bh in enumerate([16, 22, 14, 20]):
        d.rectangle([252 + i * 6, 78 - bh, 256 + i * 6, 78], fill=(34, 211, 238))

    img.resize((1280, 720), Image.Resampling.NEAREST).save(OUT_DIR / "habitat_quarters.png", format="PNG")
    print("Saved habitat_quarters.png")


if __name__ == "__main__":
    build_habitat_gym()
    build_habitat_galley()
    build_habitat_hygiene()
    build_habitat_quarters()
    print("Mission 2 sprites built successfully!")
