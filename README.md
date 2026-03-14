# storeshot

CLI to generate App Store-ready screenshots and resize in-app artwork.

## Installation

```bash
npm install -g storeshot
```

Or use it directly:

```bash
npx storeshot -i ./screenshots -p appstore_ready
```

## Quick Start

```bash
# Generate App Store-ready screenshots
storeshot -i ./screenshots -p appstore_ready

# Resize for in-app paywalls
storeshot -i ./screenshots -p paywall -m fit

# Preview without writing files
storeshot -i ./screenshots -p appstore_ready --dry-run
```

## Commands & Options

```bash
storeshot [options]
```

| Option                 | Short | Description                                    | Default         |
| ---------------------- | ----- | ---------------------------------------------- | --------------- |
| `--input <dir>`        | `-i`  | Input directory containing images              | `./screenshots` |
| `--output <dir>`       | `-o`  | Output directory for generated screenshots     | `./output`      |
| `--preset <name>`      | `-p`  | Preset to use                                  | `appstore_all`  |
| `--mode <mode>`        | `-m`  | Resize mode: `fill` or `fit`                   | `fill`          |
| `--format <format>`    | `-f`  | Output format: `png` or `jpg`                  | `png`           |
| `--background <color>` | `-b`  | Background for `fit` mode and alpha flattening | `#ffffff`       |
| `--dry-run`            | -     | Preview without saving files                   | `false`         |

## App Store Presets

### `appstore`

Single iPhone 6.5" output:

- **1242 × 2688 px**

```bash
storeshot -i ./screenshots -p appstore
```

### `appstore_all`

Accepted App Store Connect sizes:

- **1242 × 2688 px** (iPhone 6.5")
- **1242 × 2208 px** (iPhone 5.5")
- **2048 × 2732 px** (iPad Pro 12.9")

```bash
storeshot -i ./screenshots -p appstore_all
```

### `appstore_ready`

Alias for `appstore_all` when you want the intent to be explicit:

```bash
storeshot -i ./screenshots -p appstore_ready
```

## In-App Presets

### `paywall`

Generic paywall or onboarding size:

- **640 × 1136 px**

```bash
storeshot -i ./screenshots -p paywall -m fit
```

### `iphone_6_5`

Single iPhone 6.5" output:

- **1242 × 2688 px**

```bash
storeshot -i ./screenshots -p iphone_6_5
```

### `all`

Paywall plus iPhone 6.5":

- **640 × 1136 px**
- **1242 × 2688 px**

```bash
storeshot -i ./screenshots -p all
```

## Resize Modes

### `fill`

Best for App Store submission. It crops to exact dimensions, fills the frame, and avoids borders.

```bash
storeshot -i ./screenshots -p appstore_ready -m fill
```

### `fit`

Best for in-app assets. It preserves aspect ratio and pads to the target size using a solid background color.

```bash
storeshot -i ./screenshots -p paywall -m fit -b '#ffffff'
```

## Output

Output filenames follow this pattern:

```text
{original_name}_{preset}_{width}x{height}.{extension}
```

Example for `home.png` with `appstore_ready`:

```text
home_iphone_6_5_1242x2688.png
home_iphone_5_5_1242x2208.png
home_ipad_pro_12_9_2048x2732.png
```

The generated files are flattened to a solid background, converted to sRGB, and written as exact-size PNG or JPEG outputs.

## Common Examples

```bash
# App Store screenshots to a dedicated folder
storeshot -i ./screenshots -p appstore_ready -o ./appstore_output

# Paywall assets with preserved aspect ratio
storeshot -i ./screenshots -p paywall -m fit -o ./paywall_assets

# JPEG output when needed
storeshot -i ./screenshots -p appstore_ready -f jpg
```

## Dev & Build

```bash
# Run from source
npx ts-node src/index.ts -i ./screenshots -p appstore_ready

# Build
npm run build

# Run compiled output
node dist/index.js -i ./screenshots -p appstore_ready
```

## Supported Formats

- Input: PNG, JPG, JPEG
- Output: PNG or JPG

## Notes

- Use `fill` for App Store screenshots unless you intentionally want padded artwork.
- Use `fit` for paywalls and onboarding flows where preserving the full composition matters.
- If the source image has transparency, keep the default white background or pass `--background` explicitly.

## Troubleshooting

**Permission denied on output folder**

```bash
chmod -R 755 ./output
```

**Images look stretched**

- Use `fit` instead of `fill` when preserving the full composition matters.
- Check that the source image is large enough for the target preset.

**Output dimensions look wrong**

- Run `storeshot --help` to confirm the selected preset.
- Check the generated filename to confirm the exact output size.

## License

MIT
