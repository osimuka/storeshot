#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import fs from "fs";
import { PRESETS, DEFAULT_MODE } from "./presets";
import { getImageFiles, getFileName, getFileExt } from "./file-utils";
import { resizeImage, ResizeMode } from "./image";

const program = new Command();

program
  .name("storeshot")
  .description("CLI to resize screenshots for App Store and paywalls")
  .version("0.1.0")
  .option("-i, --input <dir>", "Input directory containing screenshots")
  .option("-o, --output <dir>", "Output directory (default: ./output)")
  .option(
    "-p, --preset <name>",
    "Preset: paywall, iphone_6_5, all (default: all)"
  )
  .option("-m, --mode <mode>", "Resize mode: fill, fit (default: fill)")
  .option("--dry-run", "Preview without saving")
  .action(async (options: any) => {
    try {
      const inputDir = options.input || "./screenshots";
      const outputDir = options.output || "./output";
      const presetName = options.preset || "all";
      const mode: ResizeMode = (options.mode || DEFAULT_MODE) as ResizeMode;
      const isDryRun = options.dryRun || false;

      // Validate inputs
      if (!inputDir) {
        console.error("❌ Error: --input directory is required");
        process.exit(1);
      }

      if (!PRESETS[presetName]) {
        console.error(
          `❌ Error: Unknown preset "${presetName}". Available: ${Object.keys(PRESETS).join(", ")}`
        );
        process.exit(1);
      }

      if (!["fill", "fit"].includes(mode)) {
        console.error(`❌ Error: Unknown mode "${mode}". Use: fill or fit`);
        process.exit(1);
      }

      // Get image files
      const imageFiles = await getImageFiles(inputDir);
      if (imageFiles.length === 0) {
        console.log("⚠️  No image files found in", inputDir);
        return;
      }

      console.log(`📸 Found ${imageFiles.length} image(s)`);
      console.log(`🎯 Preset: ${presetName}`);
      console.log(`📏 Mode: ${mode}`);

      if (isDryRun) {
        console.log("🏃 DRY RUN MODE - No files will be saved\n");
      }

      // Create output directory
      if (!isDryRun && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const presets = PRESETS[presetName];
      let processedCount = 0;

      // Process each image
      for (const imagePath of imageFiles) {
        const fileName = getFileName(imagePath);
        const fileExt = getFileExt(imagePath);

        // Resize for each preset dimension
        for (const preset of presets) {
          const outputFileName = `${fileName}_${preset.name}_${preset.width}x${preset.height}.${fileExt}`;
          const outputPath = path.join(outputDir, outputFileName);

          try {
            if (!isDryRun) {
              await resizeImage(imagePath, outputPath, preset, { mode });
              console.log(`✅ ${outputFileName}`);
            } else {
              console.log(`📋 ${outputFileName} (not saved in dry-run)`);
            }
            processedCount++;
          } catch (err) {
            console.error(`❌ Failed to process ${outputFileName}:`, err);
          }
        }
      }

      console.log(`\n✨ Processed ${processedCount} file(s)`);
      if (!isDryRun) {
        console.log(`📁 Output: ${outputDir}`);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      process.exit(1);
    }
  });

// Help
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
