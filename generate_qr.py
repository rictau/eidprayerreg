"""Generate a styled QR code for iduladha.kmii.jp with Eid green theme + KMII logo."""
from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
URL = "https://iduladha.kmii.jp"
OUT = ROOT / "public" / "qr-iduladha.png"
LOGO_KMII = ROOT / "public" / "logo-kmii.png"
LOGO_MIT = ROOT / "public" / "logo-mit.png"

DARK_GREEN = (12, 74, 50)
GOLD = (198, 160, 76)
WHITE = (255, 255, 255)

qr = qrcode.QRCode(
    version=None,
    error_correction=ERROR_CORRECT_H,
    box_size=22,
    border=2,
)
qr.add_data(URL)
qr.make(fit=True)

img = qr.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(radius_ratio=1),
    color_mask=SolidFillColorMask(back_color=WHITE, front_color=DARK_GREEN),
).convert("RGBA")

# Add a rounded white halo behind two embedded logos (KMII + MIT) for legibility
qr_w, qr_h = img.size
halo_w = int(qr_w * 0.34)
halo_h = int(qr_w * 0.18)
halo = Image.new("RGBA", (halo_w, halo_h), (0, 0, 0, 0))
hdraw = ImageDraw.Draw(halo)
hdraw.rounded_rectangle((0, 0, halo_w, halo_h), radius=int(halo_h * 0.22), fill=WHITE + (255,))

def fit(logo_path, max_w, max_h):
    im = Image.open(logo_path).convert("RGBA")
    scale = min(max_w / im.width, max_h / im.height)
    return im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)

slot_w = halo_w // 2
pad_y = int(halo_h * 0.12)
inner_h = halo_h - 2 * pad_y
inner_w = int(slot_w * 0.78)

kmii_img = fit(LOGO_KMII, inner_w, inner_h)
mit_img = fit(LOGO_MIT, inner_w, inner_h)

kmii_x = (slot_w - kmii_img.width) // 2
kmii_y = (halo_h - kmii_img.height) // 2
halo.paste(kmii_img, (kmii_x, kmii_y), kmii_img)

mit_x = slot_w + (slot_w - mit_img.width) // 2
mit_y = (halo_h - mit_img.height) // 2
halo.paste(mit_img, (mit_x, mit_y), mit_img)

img.paste(halo, ((qr_w - halo_w) // 2, (qr_h - halo_h) // 2), halo)

# Build a framed canvas with just the url under the QR
PAD = 24
URL_TEXT = "iduladha.kmii.jp"

def load_font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/SFNS.ttf",
    ]
    for p in candidates:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

url_font = load_font(46, bold=True)

# Measure url text height to size the canvas
tmp = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
url_bbox = tmp.textbbox((0, 0), URL_TEXT, font=url_font)
url_h = url_bbox[3] - url_bbox[1]
url_gap = 16

BOTTOM_PAD = 56
canvas_w = qr_w + PAD * 2
canvas_h = qr_h + PAD + url_gap + url_h + BOTTOM_PAD
canvas = Image.new("RGBA", (canvas_w, canvas_h), WHITE + (255,))

# Outer green border
border = 10
ImageDraw.Draw(canvas).rounded_rectangle(
    (border // 2, border // 2, canvas_w - border // 2, canvas_h - border // 2),
    radius=28,
    outline=DARK_GREEN,
    width=border,
)

qr_x = (canvas_w - qr_w) // 2
qr_y = PAD
canvas.paste(img, (qr_x, qr_y), img)

draw = ImageDraw.Draw(canvas)
url_w = url_bbox[2] - url_bbox[0]
draw.text(((canvas_w - url_w) // 2, qr_y + qr_h + url_gap), URL_TEXT, font=url_font, fill=DARK_GREEN)

canvas.convert("RGB").save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT} ({canvas.size[0]}x{canvas.size[1]})")
