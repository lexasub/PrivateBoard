#!/usr/bin/env node

/**
 * Script to download tldraw assets from CDN for local hosting
 * Usage: node scripts/download-tldraw-assets.js
 */

import { mkdir, writeFile, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')

// Get tldraw version from installed package (more accurate than package.json)
let tldrawVersion
try {
  const tldrawPackageJson = join(PROJECT_ROOT, 'node_modules', 'tldraw', 'package.json')
  const tldrawPackage = JSON.parse(await readFile(tldrawPackageJson, 'utf-8'))
  tldrawVersion = tldrawPackage.version
} catch {
  // Fallback to package.json
  const packageJsonPath = join(PROJECT_ROOT, 'package.json')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
  tldrawVersion = packageJson.dependencies?.tldraw?.replace('^', '') || '3.15.6'
}

const CDN_BASE = `https://cdn.tldraw.com/${tldrawVersion}`
const PUBLIC_DIR = join(PROJECT_ROOT, 'public')
const ASSETS_DIR = join(PUBLIC_DIR, 'tldraw-assets')

console.log(`📦 Downloading tldraw ${tldrawVersion} assets from ${CDN_BASE}`)
console.log(`📁 Saving to ${ASSETS_DIR}\n`)

// Create directories
for (const dir of ['icons/icon', 'translations', 'embed-icons', 'fonts']) {
  const dirPath = join(ASSETS_DIR, dir)
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true })
    console.log(`✓ Created directory: ${dir}`)
  }
}

// Helper to download file
async function download(url, outputPath) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    await writeFile(outputPath, buffer)
    return true
  } catch (error) {
    console.error(`✗ Failed to download ${url}: ${error.message}`)
    return false
  }
}

// 1. Download translations
console.log('\n🌐 Downloading translations...')
const languages = [
  'ar', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'fa', 'fi', 'fr',
  'gl', 'he', 'hr', 'hu', 'id', 'it', 'ja', 'ms', 'nl',
  'pl', 'ro', 'ru', 'sl', 'sv', 'th', 'tr', 'uk', 'vi'
]

let downloaded = 0
for (const lang of languages) {
  const url = `${CDN_BASE}/translations/${lang}.json`
  const outputPath = join(ASSETS_DIR, 'translations', `${lang}.json`)
  if (await download(url, outputPath)) {
    downloaded++
  }
}
console.log(`✓ Downloaded ${downloaded}/${languages.length} translations`)

// 2. Download icons (merged SVG)
console.log('\n🎨 Downloading icons...')
const iconsUrl = `${CDN_BASE}/icons/icon/0_merged.svg`
const iconsOutput = join(ASSETS_DIR, 'icons/icon/0_merged.svg')
if (await download(iconsUrl, iconsOutput)) {
  console.log('✓ Downloaded merged icons SVG')
}

// 3. Download embed icons (*.png format)
console.log('\n🖼️ Downloading embed icons...')
const embedIconTypes = [
  'figma', 'youtube', 'excalidraw', 'codepen', 'codesandbox', 'vimeo',
  'tldraw', 'github_gist', 'google_calendar', 'google_slides', 'google_maps',
  'replit', 'felt', 'spotify', 'observable', 'desmos', 'scratch', 'val_town'
]

downloaded = 0
for (const type of embedIconTypes) {
  const url = `${CDN_BASE}/embed-icons/${type}.png`
  const outputPath = join(ASSETS_DIR, 'embed-icons', `${type}.png`)
  if (await download(url, outputPath)) {
    downloaded++
  }
}
console.log(`✓ Downloaded ${downloaded}/${embedIconTypes.length} embed icons`)

// 4. Download fonts
console.log('\n🔤 Downloading fonts...')
const fonts = [
  // Shantell Sans (draw font)
  'Shantell_Sans-Informal_Regular.woff2',
  'Shantell_Sans-Informal_Bold.woff2',
  'Shantell_Sans-Informal_Regular_Italic.woff2',
  'Shantell_Sans-Informal_Bold_Italic.woff2',
  // IBM Plex Sans
  'IBMPlexSans-Medium.woff2',
  'IBMPlexSans-Bold.woff2',
  'IBMPlexSans-MediumItalic.woff2',
  'IBMPlexSans-BoldItalic.woff2',
  // IBM Plex Serif
  'IBMPlexSerif-Medium.woff2',
  'IBMPlexSerif-Bold.woff2',
  'IBMPlexSerif-MediumItalic.woff2',
  'IBMPlexSerif-BoldItalic.woff2',
  // IBM Plex Mono
  'IBMPlexMono-Medium.woff2',
  'IBMPlexMono-Bold.woff2',
  'IBMPlexMono-MediumItalic.woff2',
  'IBMPlexMono-BoldItalic.woff2',
]

downloaded = 0
for (const font of fonts) {
  const url = `${CDN_BASE}/fonts/${font}`
  const outputPath = join(ASSETS_DIR, 'fonts', font)
  if (await download(url, outputPath)) {
    downloaded++
  }
}
console.log(`✓ Downloaded ${downloaded}/${fonts.length} fonts`)

console.log('\n✅ Asset download complete!')
console.log('\n📝 Next steps:')
console.log('1. Assets are now available in public/tldraw-assets/')
console.log('2. BoardEditor.jsx is configured to use local assets')
console.log('3. Build: bun run build')
console.log('4. nginx will serve assets from /tldraw-assets/ with caching')
