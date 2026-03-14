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
