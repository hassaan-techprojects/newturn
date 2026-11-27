# NewTurn image assets

Put the original image files in these folders. Keep filenames lowercase and use the exact names below so the website can load them without code changes.

## Brand identity

- `public/images/brand/newturn-logo.svg` — your exact NewTurn logo. SVG is preferred.

## Manufacturer logos

Save one SVG (preferred) or PNG for each manufacturer in `public/images/brands/`:

- `apple.svg`
- `samsung.svg`
- `realme.svg`
- `redmi.svg`
- `xiaomi.svg`
- `oneplus.svg`
- `motorola.svg`
- `poco.svg`
- `oppo.svg`
- `vivo.svg`
- `iqoo.svg`
- `nothing.svg`
- `cmf.svg`
- `asus.svg`
- `google.svg`

## Phone product images

Save one image per phone model in its manufacturer's folder. Use WebP where possible, with a clean front or three-quarter product image on a transparent or white background.

Examples:

- `public/images/phones/apple/iphone-16-pro-max.webp`
- `public/images/phones/samsung/galaxy-s25-ultra.webp`
- `public/images/phones/oneplus/oneplus-13.webp`
- `public/images/phones/google/pixel-9-pro-xl.webp`

Use the model slug shown in the admin catalogue. Recommended image size: 900 × 1100 px or larger, portrait orientation, with the phone fully visible and no watermark.

## Uploading through the dashboard

The admin Phone Catalogue section supports uploading brand logos and model images. Those uploads are stored in the NewTurn Neon Object Storage `photos` bucket. The local `public/images` folders are an alternative for assets you want committed to GitHub.

Do not put images in `src/app`. Keep website assets under `public/images` so Next.js serves them directly. Only upload images you own or are licensed to use.
