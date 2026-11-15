from pathlib import Path
from PIL import Image, ImageDraw
import random

OUT_DIR = Path(r"c:\Users\jacks\OneDrive\Documentos\AresGrid\public\assets\sprites\mission1")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def draw_solar_panel_array(dusty: bool) -> Image.Image:
    """Desenha painel solar 16-bit sobre estrutura metálica (limpo ou com poeira)."""
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    outline = (20, 24, 38, 255)
    metal_hi = (212, 222, 236, 255)
    metal_mid = (138, 154, 176, 255)
    metal_sh = (78, 90, 112, 255)
    orange_hi = (249, 115, 22, 255)
    orange_sh = (180, 68, 18, 255)

    # Sapatas e tripé de suporte metálico marciano
    d.rectangle([16, 48, 25, 53], fill=metal_mid, outline=outline)
    d.rectangle([38, 48, 47, 53], fill=metal_mid, outline=outline)
    d.rectangle([28, 50, 35, 55], fill=orange_hi, outline=outline)

    # Hastes inclinadas e eixo central
    d.line([21, 50, 26, 33], fill=outline, width=4)
    d.line([21, 50, 26, 33], fill=metal_hi, width=2)
    d.line([42, 50, 37, 33], fill=outline, width=4)
    d.line([42, 50, 37, 33], fill=metal_hi, width=2)
    d.rectangle([28, 30, 35, 48], fill=metal_sh, outline=outline)
    d.rectangle([30, 32, 33, 46], fill=metal_mid)

    # Caixa de inversor / conector de energia
    d.rectangle([27, 42, 36, 49], fill=orange_hi, outline=outline)
    d.point((30, 45), fill=(74, 222, 128, 255) if not dusty else (250, 204, 21, 255))
    d.point((33, 45), fill=(56, 189, 248, 255))

    # Moldura do conjunto de painéis inclinados (vista 3/4 16-bit)
    panel_poly = [(10, 14), (56, 14), (49, 36), (5, 36)]
    d.polygon(panel_poly, fill=metal_hi, outline=outline)

    # Área interna das células fotovoltaicas
    cell_poly = [(12, 16), (53, 16), (47, 34), (8, 34)]
    cell_base = (24, 78, 168, 255) if not dusty else (78, 86, 118, 255)
    cell_hi = (56, 152, 240, 255) if not dusty else (112, 118, 146, 255)
    grid_col = (186, 230, 253, 255) if not dusty else (210, 168, 128, 255)

    d.polygon(cell_poly, fill=cell_base, outline=outline)

    # Reflexos de luz solar na metade superior das células
    d.polygon([(12, 16), (53, 16), (51, 22), (10, 22)], fill=cell_hi)

    # Grade prateada das células fotovoltaicas
    for col_t in [0.25, 0.5, 0.75]:
        x_top = int(12 + (53 - 12) * col_t)
        x_bot = int(8 + (47 - 8) * col_t)
        d.line([x_top, 16, x_bot, 34], fill=grid_col, width=1)
    for row_y in [21, 27]:
        x_left = int(12 - (row_y - 16) * (4 / 18))
        x_right = int(53 - (row_y - 16) * (6 / 18))
        d.line([x_left, row_y, x_right, row_y], fill=grid_col, width=1)

    # Reflexo diagonal brilhante (apenas no painel limpo)
    if not dusty:
        d.line([16, 18, 13, 24], fill=(224, 248, 255, 255), width=2)
        d.line([36, 18, 33, 24], fill=(224, 248, 255, 255), width=1)
    else:
        # Poeira marciana alaranjada acumulada em pixel art
        rng = random.Random(101)
        dust_colors = [
            (217, 119, 64, 255),
            (194, 88, 44, 255),
            (234, 154, 98, 255),
        ]
        for py in range(17, 34):
            row_frac = (py - 16) / 18.0
            x_min = int(12 - 4 * row_frac) + 1
            x_max = int(53 - 6 * row_frac) - 1
            for px in range(x_min, x_max):
                # Maior acúmulo na borda inferior e manchas irregulares
                chance = 0.28 + 0.35 * row_frac
                if rng.random() < chance:
                    d.point((px, py), fill=rng.choice(dust_colors))

    # Borda inferior metálica grossa para profundidade 16-bit
    d.polygon([(5, 36), (49, 36), (48, 39), (6, 39)], fill=metal_sh, outline=outline)

    return img.resize((256, 256), Image.Resampling.NEAREST)


def draw_terrain_spot_rocky() -> Image.Image:
    """Marcador de terreno inclinado com pedregulhos marcianos."""
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    outline = (28, 18, 22, 255)
    soil_hi = (218, 108, 62, 255)
    soil_mid = (178, 72, 38, 255)
    soil_sh = (126, 44, 24, 255)
    rock_hi = (164, 128, 114, 255)
    rock_mid = (118, 84, 76, 255)
    rock_sh = (78, 52, 48, 255)

    # Plataforma inclinada de solo irregular
    d.polygon([(6, 44), (56, 30), (58, 48), (10, 56)], fill=soil_mid, outline=outline)
    d.polygon([(6, 44), (56, 30), (52, 36), (10, 48)], fill=soil_hi)
    d.polygon([(10, 48), (58, 42), (58, 48), (10, 56)], fill=soil_sh)

    # Pedregulhos irregulares em pixel art
    rocks = [
        [(14, 44), (21, 34), (29, 43)],
        [(30, 39), (38, 27), (46, 37)],
        [(43, 35), (49, 28), (55, 34)],
        [(22, 49), (28, 43), (35, 49)],
    ]
    for pts in rocks:
        d.polygon(pts, fill=rock_mid, outline=outline)
        mid_x = pts[1][0]
        d.polygon([pts[0], pts[1], (mid_x, pts[2][1])], fill=rock_hi)
        d.polygon([pts[1], pts[2], (mid_x, pts[2][1])], fill=rock_sh)

    # Bandeira / marcador de alerta laranja-amarelo
    d.line([14, 38, 14, 18], fill=outline, width=2)
    d.polygon([(15, 18), (27, 22), (15, 26)], fill=(250, 204, 21, 255), outline=outline)
    d.point((18, 22), fill=(220, 38, 38, 255))

    return img.resize((256, 256), Image.Resampling.NEAREST)


def draw_terrain_spot_shadow() -> Image.Image:
    """Marcador de terreno com elevação rochosa projetando sombra."""
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    outline = (28, 18, 22, 255)
    soil_lit = (224, 126, 76, 255)
    soil_shadow = (74, 34, 34, 255)
    cliff_hi = (176, 86, 52, 255)
    cliff_mid = (134, 56, 36, 255)
    cliff_dark = (86, 34, 26, 255)

    # Base do terreno (metade iluminada, metade sob sombra)
    d.polygon([(6, 46), (56, 46), (58, 56), (4, 56)], fill=soil_lit, outline=outline)
    # Faixa escura de sombra projetada pela rocha alta
    d.polygon([(14, 46), (50, 46), (54, 55), (18, 55)], fill=soil_shadow)

    # Elevação rochosa alta à esquerda bloqueando o Sol
    d.polygon([(6, 46), (10, 20), (19, 12), (27, 24), (29, 46)], fill=cliff_mid, outline=outline)
    d.polygon([(10, 20), (19, 12), (20, 46), (6, 46)], fill=cliff_hi)
    d.polygon([(19, 12), (27, 24), (29, 46), (20, 46)], fill=cliff_dark)

    # Pequeno Sol no canto superior esquerdo mostrando os raios bloqueados
    d.ellipse([4, 4, 14, 14], fill=(254, 240, 138, 255), outline=(234, 179, 8, 255))
    d.line([15, 13, 21, 18], fill=(254, 240, 138, 255), width=1)
    d.line([12, 16, 16, 21], fill=(254, 240, 138, 255), width=1)

    return img.resize((256, 256), Image.Resampling.NEAREST)


if __name__ == "__main__":
    draw_solar_panel_array(dusty=False).save(OUT_DIR / "solar_panel_clean.png", format="PNG")
    draw_solar_panel_array(dusty=True).save(OUT_DIR / "solar_panel_dusty.png", format="PNG")
    draw_terrain_spot_rocky().save(OUT_DIR / "terrain_spot_rocky.png", format="PNG")
    draw_terrain_spot_shadow().save(OUT_DIR / "terrain_spot_shadow.png", format="PNG")
    print("Mission 1 sprites built successfully!")
