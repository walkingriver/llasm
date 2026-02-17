#!/usr/bin/env node

/**
 * LLuMe Skill Installer
 * Copies the LLuMe skill to ~/.cursor/skills/llume/
 */

import { existsSync, mkdirSync, cpSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..');
const destDir = join(homedir(), '.cursor', 'skills', 'llume');

// Files and directories to copy
const items = [
  'SKILL.md',
  'llume.js',
  'reference',
  'examples'
];

console.log('Installing LLuMe skill...\n');

// Create destination directory
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
  console.log(`Created: ${destDir}`);
}

// Copy files
for (const item of items) {
  const src = join(srcDir, item);
  const dest = join(destDir, item);
  
  if (!existsSync(src)) {
    console.log(`Skipping: ${item} (not found)`);
    continue;
  }
  
  cpSync(src, dest, { recursive: true });
  console.log(`Copied: ${item}`);
}

console.log(`
LLuMe skill installed to: ${destDir}

Usage:
1. Open Cursor
2. Ask: "Build me a todo app" (or any web page)
3. The agent will use the LLuMe skill to generate a complete HTML file
4. Save the output and open in browser

The generated HTML references ./llume.js - the agent will copy it alongside your page.
`);
