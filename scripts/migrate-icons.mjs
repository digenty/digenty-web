#!/usr/bin/env node
/**
 * Converts all icon imports from @/components/Icons/* and relative ../Icons/*
 * to named imports from @digenty/icons.
 *
 * Usage:
 *   node scripts/migrate-icons.mjs --dry-run   # preview changes
 *   node scripts/migrate-icons.mjs             # apply changes
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const SRC_DIR = new URL("../src", import.meta.url).pathname;
const EXTENSIONS = new Set([".tsx", ".ts"]);
const DRY_RUN = process.argv.includes("--dry-run");

// Matches all of:
//   import Foo from "@/components/Icons/Foo"
//   import { Foo } from "@/components/Icons/Foo"
//   import Foo from "../Icons/Foo"   (any depth)
//   import { Foo } from "../../../Icons/Foo"
const ICON_IMPORT_REGEX =
  /^import\s+((?:\{[^}]+\}|[A-Za-z_$][A-Za-z0-9_$]*))\s+from\s+["'](?:@\/components\/Icons\/|(?:\.\.\/)+Icons\/)([A-Za-z0-9_$]+)["']\s*;?\s*$/gm;

function transformContent(content) {
  const iconNames = new Set();
  const matchPositions = [];
  let match;

  ICON_IMPORT_REGEX.lastIndex = 0;
  while ((match = ICON_IMPORT_REGEX.exec(content)) !== null) {
    const clause = match[1].trim();
    const namedMatch = clause.match(/^\{?\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}?$/);
    iconNames.add(namedMatch ? namedMatch[1] : match[2]);
    matchPositions.push({ start: match.index, end: match.index + match[0].length });
  }

  if (matchPositions.length === 0) return null;

  // Remove matched lines from end to start to preserve offsets
  let newContent = content;
  for (const pos of [...matchPositions].sort((a, b) => b.start - a.start)) {
    newContent = newContent.slice(0, pos.start) + newContent.slice(pos.end);
  }

  const importLine = `import { ${[...iconNames].sort().join(", ")} } from "@digenty/icons";`;

  // Insert right after any "use client"/"use server" directive
  const directive = newContent.match(/^["']use (client|server)["'];?\s*\n/);
  newContent = directive
    ? newContent.slice(0, directive[0].length) + importLine + "\n" + newContent.slice(directive[0].length)
    : importLine + "\n" + newContent;

  // Collapse excess blank lines left by removed imports
  return newContent.replace(/\n{3,}/g, "\n\n");
}

function walkDir(dir, cb) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== "node_modules" && entry !== ".next") walkDir(full, cb);
    } else if (EXTENSIONS.has(extname(entry))) {
      cb(full);
    }
  }
}

let scanned = 0;
let modified = 0;

walkDir(SRC_DIR, (file) => {
  scanned++;
  const original = readFileSync(file, "utf8");
  const result = transformContent(original);
  if (result !== null) {
    modified++;
    console.log(`  patched: ${file.replace(SRC_DIR, "src")}`);
    if (!DRY_RUN) writeFileSync(file, result, "utf8");
  }
});

console.log(
  `\nDone. Scanned ${scanned} files, modified ${modified}.${DRY_RUN ? " (DRY RUN — no files written)" : ""}`,
);
