import fs from "fs";
import path from "path";

export const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);

export async function getImageFiles(inputDir: string): Promise<string[]> {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }

  const imageFiles: string[] = [];

  function traverse(dir: string) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        traverse(entryPath);
      } else if (stat.isFile()) {
        const ext = path.extname(entry).toLowerCase();
        if (IMAGE_EXTS.has(ext)) {
          imageFiles.push(entryPath);
        }
      }
    }
  }

  traverse(inputDir);
  return imageFiles.sort();
}

export function getFileName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

export function getFileExt(filePath: string): string {
  return path.extname(filePath).slice(1).toLowerCase();
}
