import { useMemo } from 'react'

// List of languages available in tldraw CDN (updated for v3.15.6)
const LANGUAGES = [
  'ar', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'fa', 'fi', 'fr',
  'gl', 'he', 'hr', 'hu', 'id', 'it', 'ja', 'ms', 'nl',
  'pl', 'ro', 'ru', 'sl', 'sv', 'th', 'tr', 'uk', 'vi'
]

// Embed icon types - available in tldraw CDN v3.15.6
const EMBED_ICON_TYPES = [
  'figma', 'youtube', 'excalidraw', 'codepen', 'codesandbox', 'vimeo',
  'tldraw', 'github_gist', 'google_calendar', 'google_slides', 'google_maps',
  'replit', 'felt', 'spotify', 'observable', 'desmos', 'scratch', 'val_town'
]

// Icon types from tldraw UI - all in merged SVG
const ICON_TYPES = [
  'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'aspect-ratio', 'avatar',
  'check', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'clipboard-check',
  'clipboard-copy', 'clipboard-x', 'code', 'collab', 'color', 'cross', 'distribute-horizontal',
  'distribute-vertical', 'dot', 'dotted-line', 'download', 'drag-handle-dots', 'duplicate',
  'edit', 'external-link', 'file', 'fill', 'follow', 'font-sans', 'font-serif', 'font-mono',
  'font-draw', 'gap-horizontal', 'gap-vertical', 'geo-check-box', 'geo-ellipse', 'geo-rectangle',
  'geo-triangle', 'geo-x-box', 'group', 'hand', 'h-align-center', 'h-align-left', 'h-align-right',
  'image', 'info-circle', 'leading', 'link', 'lock', 'menu', 'minus', 'mixed', 'move', 'note',
  'open-file', 'package', 'page', 'paste', 'pin', 'plus', 'question-mark', 'redo', 'reset',
  'rotate-ccw', 'rotate-cw', 'search', 'share-1', 'share-2', 'spline', 'sticker', 'stop',
  'stretch-horizontal', 'stretch-vertical', 'text-align-center', 'text-align-justify',
  'text-align-left', 'text-align-right', 'tool-arrow', 'tool-asset', 'tool-draw', 'tool-embed',
  'tool-eraser', 'tool-frame', 'tool-hand', 'tool-highlight', 'tool-laser', 'tool-line',
  'tool-note', 'tool-text', 'trash', 'triangle-down', 'triangle-up', 'ungroup', 'unlock',
  'unpin', 'v-align-bottom', 'v-align-middle', 'v-align-top', 'video', 'zoom-in', 'zoom-out',
  'cursor', 'snap', 'grid', 'debug', 'more-horizontal', 'more-vertical', 'horizontal-align',
  'vertical-align', 'expand', 'collapse', 'eye-open', 'eye-closed', 'microphone', 'microphone-off'
]

/**
 * Generate local asset URLs for tldraw
 * Use this with useMemo or define outside component
 * 
 * @param {string} baseUrl - Base URL for assets (default: '/tldraw-assets')
 */
export function getLocalTldrawAssetUrls(baseUrl = '/tldraw-assets') {
  return {
    // Icons - all point to the merged SVG with fragment identifiers
    // Note: path matches CDN structure /icons/icon/0_merged.svg
    icons: Object.fromEntries(
      ICON_TYPES.map((name) => [name, `${baseUrl}/icons/icon/0_merged.svg#${name}`])
    ),
    
    // Translations - local JSON files
    translations: Object.fromEntries(
      LANGUAGES.map((locale) => [locale, `${baseUrl}/translations/${locale}.json`])
    ),
    
    // Embed icons - PNG files (matching actual CDN naming: *.png)
    embedIcons: Object.fromEntries(
      EMBED_ICON_TYPES.map((type) => [type, `${baseUrl}/embed-icons/${type}.png`])
    ),
    
    // Fonts - actual filenames from tldraw CDN
    fonts: {
      // Shantell Sans (draw font)
      tldraw_draw: `${baseUrl}/fonts/Shantell_Sans-Informal_Regular.woff2`,
      tldraw_draw_bold: `${baseUrl}/fonts/Shantell_Sans-Informal_Bold.woff2`,
      tldraw_draw_italic: `${baseUrl}/fonts/Shantell_Sans-Informal_Regular_Italic.woff2`,
      tldraw_draw_italic_bold: `${baseUrl}/fonts/Shantell_Sans-Informal_Bold_Italic.woff2`,
      
      // IBM Plex Sans
      tldraw_sans: `${baseUrl}/fonts/IBMPlexSans-Medium.woff2`,
      tldraw_sans_bold: `${baseUrl}/fonts/IBMPlexSans-Bold.woff2`,
      tldraw_sans_italic: `${baseUrl}/fonts/IBMPlexSans-MediumItalic.woff2`,
      tldraw_sans_italic_bold: `${baseUrl}/fonts/IBMPlexSans-BoldItalic.woff2`,
      
      // IBM Plex Serif
      tldraw_serif: `${baseUrl}/fonts/IBMPlexSerif-Medium.woff2`,
      tldraw_serif_bold: `${baseUrl}/fonts/IBMPlexSerif-Bold.woff2`,
      tldraw_serif_italic: `${baseUrl}/fonts/IBMPlexSerif-MediumItalic.woff2`,
      tldraw_serif_italic_bold: `${baseUrl}/fonts/IBMPlexSerif-BoldItalic.woff2`,
      
      // IBM Plex Mono
      tldraw_mono: `${baseUrl}/fonts/IBMPlexMono-Medium.woff2`,
      tldraw_mono_bold: `${baseUrl}/fonts/IBMPlexMono-Bold.woff2`,
      tldraw_mono_italic: `${baseUrl}/fonts/IBMPlexMono-MediumItalic.woff2`,
      tldraw_mono_italic_bold: `${baseUrl}/fonts/IBMPlexMono-BoldItalic.woff2`,
    },
  }
}

/**
 * React hook to get local tldraw asset URLs (memoized)
 * 
 * @param {string} baseUrl - Base URL for assets (default: '/tldraw-assets')
 * @example
 * ```jsx
 * const assetUrls = useLocalTldrawAssets()
 * <Tldraw assetUrls={assetUrls} />
 * ```
 */
export function useLocalTldrawAssets(baseUrl) {
  return useMemo(() => getLocalTldrawAssetUrls(baseUrl), [baseUrl])
}
