import sharp from "sharp";
import { Preset } from "./presets";

export type ResizeMode = "fill" | "fit" | "fit-blur" | "fit-edge";

export interface ResizeOptions {
  mode: ResizeMode;
  backgroundColor?: string;
}

export async function resizeImage(
  inputPath: string,
  outputPath: string,
  preset: Preset,
  options: ResizeOptions
): Promise<void> {
  const backgroundColor = options.backgroundColor || "#ffffff";
  let pipeline = sharp(inputPath).rotate();

  if (options.mode === "fill") {
    pipeline = pipeline.resize(preset.width, preset.height, {
      fit: "cover",
      position: "center",
    });
  } else if (options.mode === "fit") {
    pipeline = pipeline.resize(preset.width, preset.height, {
      fit: "contain",
      position: "center",
      background: backgroundColor,
    });
  } else if (options.mode === "fit-blur") {
    const foreground = await sharp(inputPath)
      .rotate()
      .resize(preset.width, preset.height, {
        fit: "contain",
        position: "center",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    pipeline = sharp(inputPath)
      .rotate()
      .resize(preset.width, preset.height, {
        fit: "cover",
        position: "center",
      })
      .blur(24)
      .composite([{ input: foreground }]);
  } else if (options.mode === "fit-edge") {
    const metadata = await sharp(inputPath).rotate().metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error(`Could not determine dimensions for ${inputPath}`);
    }

    const scale = Math.min(
      preset.width / metadata.width,
      preset.height / metadata.height
    );
    const foregroundWidth = Math.max(1, Math.round(metadata.width * scale));
    const foregroundHeight = Math.max(1, Math.round(metadata.height * scale));
    const offsetLeft = Math.floor((preset.width - foregroundWidth) / 2);
    const offsetTop = Math.floor((preset.height - foregroundHeight) / 2);
    const padRight = preset.width - foregroundWidth - offsetLeft;
    const padBottom = preset.height - foregroundHeight - offsetTop;

    const foreground = await sharp(inputPath)
      .rotate()
      .resize(foregroundWidth, foregroundHeight, {
        fit: "fill",
      })
      .png()
      .toBuffer();

    const composites: sharp.OverlayOptions[] = [];

    if (offsetTop > 0) {
      const topSlice = await sharp(foreground)
        .extract({ left: 0, top: 0, width: foregroundWidth, height: 1 })
        .resize(foregroundWidth, offsetTop, { fit: "fill" })
        .png()
        .toBuffer();
      composites.push({ input: topSlice, left: offsetLeft, top: 0 });
    }

    if (padBottom > 0) {
      const bottomSlice = await sharp(foreground)
        .extract({
          left: 0,
          top: foregroundHeight - 1,
          width: foregroundWidth,
          height: 1,
        })
        .resize(foregroundWidth, padBottom, { fit: "fill" })
        .png()
        .toBuffer();
      composites.push({
        input: bottomSlice,
        left: offsetLeft,
        top: offsetTop + foregroundHeight,
      });
    }

    if (offsetLeft > 0) {
      const leftSlice = await sharp(foreground)
        .extract({ left: 0, top: 0, width: 1, height: foregroundHeight })
        .resize(offsetLeft, foregroundHeight, { fit: "fill" })
        .png()
        .toBuffer();
      composites.push({ input: leftSlice, left: 0, top: offsetTop });
    }

    if (padRight > 0) {
      const rightSlice = await sharp(foreground)
        .extract({
          left: foregroundWidth - 1,
          top: 0,
          width: 1,
          height: foregroundHeight,
        })
        .resize(padRight, foregroundHeight, { fit: "fill" })
        .png()
        .toBuffer();
      composites.push({
        input: rightSlice,
        left: offsetLeft + foregroundWidth,
        top: offsetTop,
      });
    }

    composites.push({ input: foreground, left: offsetLeft, top: offsetTop });

    pipeline = sharp({
      create: {
        width: preset.width,
        height: preset.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    }).composite(composites);
  }

  pipeline = pipeline
    .flatten({ background: backgroundColor })
    .toColorspace("srgb");

  const ext = outputPath.toLowerCase();
  if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) {
    await pipeline
      .jpeg({
        quality: 95,
        chromaSubsampling: "4:4:4",
      })
      .toFile(outputPath);
  } else {
    await pipeline
      .png({
        quality: 100,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: false,
      })
      .toFile(outputPath);
  }
}

export async function getImageDimensions(
  inputPath: string
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(inputPath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not determine dimensions for ${inputPath}`);
  }
  return { width: metadata.width, height: metadata.height };
}
