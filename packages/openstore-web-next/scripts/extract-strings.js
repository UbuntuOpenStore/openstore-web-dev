import fs from "fs/promises";
import path from "path";
import { i18nextToPot } from "i18next-conv";

const directoryPath = "./src";
const fileExtensions = [".ts", ".tsx", ".astro"];
const pattern = /[{ ]t\(\s*["'](.*?)["']\s*\)/g; // Pattern to match t("example") or t('example')

const extractedStrings = {};

async function walkDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await walkDirectory(fullPath);
      }
      else if (entry.isFile() && fileExtensions.includes(path.extname(entry.name))) {
        await processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
}

async function processFile(filePath) {
  try {
    const content = (await fs.readFile(filePath, "utf8")).replaceAll('\n', ''); // Collapse everything to one line to find stuff split into multiple lines
    const relativePath = path.relative(directoryPath, filePath);

    let match;
    while ((match = pattern.exec(content)) !== null) {
      const value = match[1];

      if (!extractedStrings[value]) {
        extractedStrings[value] = [];
      }

      extractedStrings[value].push({
        file: relativePath,
        position: match.index,
      });
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

async function main() {
  await walkDirectory(directoryPath);

  const totalKeys = Object.keys(extractedStrings).length;
  if (totalKeys > 0) {
    const i18nextJson = {};
    for (const str in extractedStrings) {
      i18nextJson[str] = str;
    }

    const pot = await i18nextToPot(
      'en_US',
      i18nextJson,
    );
    await fs.writeFile('./po/openstore.pot', pot);
    console.log('Wrote openstore.pot file');
  } else {
    console.error("Did not find any strings for translation");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
