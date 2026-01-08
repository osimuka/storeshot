# storeshot

CLI to resize screenshots for App Store and paywalls.

## Installation

```bash
npm install -g storeshot
```

Or use directly with `npx`:

```bash
npx storeshot -i ./screenshots -p appstore_all
```

## Quick Start

```bash
# Resize screenshots for App Store
storeshot -i ./screenshots -p appstore_all -m fill

# Resize for in-app paywalls
storeshot -i ./screenshots -p paywall -m fit

# Preview without saving (dry-run)
storeshot -i ./screenshots -p appstore_all --dry-run
```

## Commands & Options

### Basic Syntax

```bash
storeshot [options]
```

### Options

| Option            | Short | Description                                     | Default    |
| ----------------- | ----- | ----------------------------------------------- | ---------- |
| `--input <dir>`   | `-i`  | **Required.** Input directory containing images | -          |
| `--output <dir>`  | `-o`  | Output directory for resized images             | `./output` |
| `--preset <name>` | `-p`  | Preset to use (see presets below)               | `all`      |
| `--mode <mode>`   | `-m`  | Resize mode: `fill` or `fit`                    | `fill`     |
| `--dry-run`       | -     | Preview without saving files                    | `false`    |

## Available Presets

### 📱 App Store Presets

#### `appstore`

Single size for iPhone 6.5" (most common):

- **1242 × 2688 px** (iPhone 6.5", 6.7")

```bash
storeshot -i ./screenshots -p appstore
```

#### `appstore_all`

Multiple device sizes (recommended):

- **1125 × 2436 px** (iPhone 5.5")
- **1242 × 2688 px** (iPhone 6.5")
- **2048 × 2732 px** (iPad Pro)

```bash
storeshot -i ./screenshots -p appstore_all -m fill
```

### 🎨 In-App Presets

#### `paywall`

Perfect for in-app paywall screens, onboarding:

- **640 × 1136 px** (Generic paywall size)

```bash
storeshot -i ./screenshots -p paywall -m fit
```

#### `iphone_6_5`

Single iPhone 6.5" size:

- **1242 × 2688 px**

```bash
storeshot -i ./screenshots -p iphone_6_5
```

#### `all`

Combination of paywall + iPhone 6.5":

- **640 × 1136 px** (paywall)
- **1242 × 2688 px** (iPhone 6.5")

```bash
storeshot -i ./screenshots -p all
```

## Resize Modes

### `fill` (Default)

Crops image to exact dimensions, fills the entire frame.

- ✅ Best for: **App Store screenshots**
- No transparency/padding
- Image covers the full dimensions

```bash
storeshot -i ./screenshots -p appstore_all -m fill
```

### `fit`

Preserves aspect ratio, adds transparent padding if needed.

- ✅ Best for: **In-app screens, paywalls, onboarding**
- Maintains original proportions
- Transparent background for padding

```bash
storeshot -i ./screenshots -p paywall -m fit
```

## Examples

### 📊 Common Use Cases

**Upload to App Store (all device sizes):**

```bash
storeshot -i ./screenshots -p appstore_all -m fill -o ./appstore_output
```

**Create paywall assets:**

```bash
storeshot -i ./screenshots -p paywall -m fit -o ./paywall_assets
```

**iPhone 6.5" only:**

```bash
storeshot -i ./screenshots -p iphone_6_5 -m fill
```

**Test before saving:**

```bash
storeshot -i ./screenshots -p appstore_all --dry-run
```

**Custom output folder:**

```bash
storeshot -i ./raw_screenshots -o ./resized -p appstore_all
```

**In-app full set:**

```bash
storeshot -i ./screenshots -p all -m fit
```

## Output Format

Output filenames follow this pattern:

```
{original_name}_{preset}_{width}x{height}.{extension}
```

### Example

Input: `home.png`

With `appstore_all` preset:

```
home_iphone_5_5_1125x2436.png
home_iphone_6_5_1242x2688.png
home_ipad_pro_2048x2732.png
```

With `paywall` preset:

```
home_paywall_640x1136.png
```

## Dev & Build

### Development

Run directly with ts-node:

```bash
npx ts-node src/index.ts -i ./screenshots -p appstore_all
```

### Build to JavaScript

```bash
npm run build
```

### Run Compiled Version

```bash
node dist/index.js -i ./screenshots -p appstore_all
```

## Supported Formats

✅ **Input:** PNG, JPG, JPEG  
✅ **Output:** PNG (preserves transparency for fit mode)

## Recommended Defaults

| Use Case               | Preset         | Mode   | Why                                      |
| ---------------------- | -------------- | ------ | ---------------------------------------- |
| **App Store**          | `appstore_all` | `fill` | Official Apple dimensions, full coverage |
| **In-app paywalls**    | `paywall`      | `fit`  | Preserves design, allows transparency    |
| **Onboarding screens** | `paywall`      | `fit`  | Maintains aspect ratio, clean padding    |
| **Generic resizing**   | `all`          | `fill` | Covers multiple screen sizes             |

## Tips & Best Practices

✅ **Use `--dry-run` first** to preview output before processing:

```bash
storeshot -i ./screenshots -p appstore_all --dry-run
```

✅ **For App Store**: Always use `appstore_all` to support all iPhones and iPads

✅ **For in-app screens**: Use `fit` mode to preserve design and avoid cropping

✅ **Keep source files**: Always keep original screenshots as backup

✅ **Check output folder**: Default is `./output`, customize with `-o` flag

✅ **Batch process**: Process all your screenshots in one command

## Troubleshooting

**"Cannot find module commander"**

```bash
npm install
```

**Permission denied on output folder**

```bash
# Ensure write permissions
chmod -R 755 ./output
```

**Images look stretched**

- Use `fit` mode instead of `fill` to maintain aspect ratio
- Check image resolution is at least as large as target dimensions

**Output dimensions incorrect**

- Verify the preset with: `storeshot --help`
- Check filename to confirm which size was generated

## Project Structure

```
storeshot/
├─ package.json              # NPM configuration
├─ tsconfig.json             # TypeScript settings
├─ README.md                 # This file
├─ LICENSE                   # MIT License
├─ .gitignore                # Git exclusions
│
├─ src/
│  ├─ index.ts               # CLI entry point (commander)
│  ├─ presets.ts             # Screenshot size definitions
│  ├─ file-utils.ts          # File scanning & filtering
│  └─ image.ts               # Sharp image resizing logic
│
├─ dist/                     # Compiled JavaScript (auto-generated)
│
└─ examples/
   └─ screenshots/           # Sample input directory
```

## Future Enhancements

- 🌍 Homebrew / npm publishing
- ⚙️ Config file (`storeshot.config.json`)
- 🔄 Auto-rotate portrait/landscape
- 🤖 Google Play sizes
- 🚀 GitHub Actions workflow template
- 🎨 Background color customization
- 📦 Batch config files

## License

MIT
