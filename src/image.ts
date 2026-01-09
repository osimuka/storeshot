import sharp from "sharp";
import { Preset } from "./presets";

export type ResizeMode = "fill" | "fit";

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
  let pipeline = sharp(inputPath);

  if (options.mode === "fill") {
    // Fill mode: resize and crop to exact dimensions
    pipeline = pipeline.resize(preset.width, preset.height, {
      fit: "cover",
      position: "center",
    });
  } else if (options.mode === "fit") {
    // Fit mode: resize to fit inside dimensions, keep aspect ratio
    pipeline = pipeline.resize(preset.width, preset.height, {
      fit: "inside",
      withoutEnlargement: true,
    });

    // Add transparent or colored background if needed
    const bg = options.backgroundColor || "transparent";
    pipeline = pipeline.extend({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: bg,
    });
  }

  // Convert to sRGB color space and remove alpha channel for App Store compliance
  pipeline = pipeline.toColorspace("srgb").removeAlpha();

  // Preserve original format (jpg/jpeg/png) based on output extension
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
