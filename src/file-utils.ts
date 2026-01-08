import fs from "fs";
import path from "path";

export const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);

export async function getImageFiles(inputDir: string): Promise<string[]> {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }

  const files = fs.readdirSync(inputDir);
  const imageFiles: string[] = [];

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTS.has(ext)) {
        imageFiles.push(filePath);
      }
    }
  }

  return imageFiles.sort();
}

export function getFileName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

export function getFileExt(filePath: string): string {
  return path.extname(filePath).slice(1).toLowerCase();
}
