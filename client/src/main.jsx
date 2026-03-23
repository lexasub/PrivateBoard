import React from 'react'
import ReactDOM from 'react-dom/client'
import { setDefaultEditorAssetUrls, setDefaultUiAssetUrls } from 'tldraw'
import App from './App.jsx'
import './index.css'

// Override default CDN URLs with local assets
const LOCAL_BASE_URL = '/tldraw-assets'

// Full list from tldraw/src/lib/ui/icon-types.ts
const ICON_TYPES = [
  'align-bottom', 'align-center-horizontal', 'align-center-vertical', 'align-left',
  'align-right', 'align-top', 'alt', 'arrow-arc', 'arrow-cycle', 'arrow-elbow',
  'arrow-left', 'arrowhead-arrow', 'arrowhead-bar', 'arrowhead-diamond', 'arrowhead-dot',
  'arrowhead-none', 'arrowhead-square', 'arrowhead-triangle-inverted', 'arrowhead-triangle',
  'blob', 'bold', 'bookmark', 'bring-forward', 'bring-to-front', 'broken', 'bulletList',
  'check-circle', 'check', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up',
  'chevrons-ne', 'chevrons-sw', 'clipboard-copied', 'clipboard-copy', 'code', 'color',
  'comment', 'corners', 'crop', 'cross-2', 'cross-circle', 'dash-dashed', 'dash-dotted',
  'dash-draw', 'dash-solid', 'disconnected', 'discord', 'distribute-horizontal',
  'distribute-vertical', 'dot', 'dots-horizontal', 'dots-vertical', 'download',
  'drag-handle-dots', 'duplicate', 'edit', 'external-link', 'fill-fill', 'fill-none',
  'fill-pattern', 'fill-semi', 'fill-solid', 'follow', 'following', 'font-draw', 'font-mono',
  'font-sans', 'font-serif', 'geo-arrow-down', 'geo-arrow-left', 'geo-arrow-right',
  'geo-arrow-up', 'geo-check-box', 'geo-cloud', 'geo-diamond', 'geo-ellipse', 'geo-heart',
  'geo-hexagon', 'geo-octagon', 'geo-oval', 'geo-pentagon', 'geo-rectangle', 'geo-rhombus-2',
  'geo-rhombus', 'geo-star', 'geo-trapezoid', 'geo-triangle', 'geo-x-box', 'github', 'group',
  'heading', 'help-circle', 'highlight', 'horizontal-align-end', 'horizontal-align-middle',
  'horizontal-align-start', 'info-circle', 'italic', 'leading', 'link', 'list', 'lock',
  'manual', 'menu', 'minus', 'mixed', 'pack', 'plus', 'question-mark-circle', 'question-mark',
  'redo', 'reset-zoom', 'rotate-ccw', 'rotate-cw', 'send-backward', 'send-to-back', 'share-1',
  'size-extra-large', 'size-large', 'size-medium', 'size-small', 'spline-cubic', 'spline-line',
  'stack-horizontal', 'stack-vertical', 'status-offline', 'stretch-horizontal', 'stretch-vertical',
  'strike', 'text-align-center', 'text-align-left', 'text-align-right', 'toggle-off', 'toggle-on',
  'tool-arrow', 'tool-eraser', 'tool-frame', 'tool-hand', 'tool-highlight', 'tool-laser',
  'tool-line', 'tool-media', 'tool-note', 'tool-pencil', 'tool-pointer', 'tool-screenshot',
  'tool-text', 'trash', 'twitter', 'underline', 'undo', 'ungroup', 'unlock', 'vertical-align-end',
  'vertical-align-middle', 'vertical-align-start', 'warning-triangle', 'zoom-in', 'zoom-out'
]
const LANGUAGES = [
  'ar', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'fa', 'fi', 'fr',
  'gl', 'he', 'hr', 'hu', 'id', 'it', 'ja', 'ms', 'nl',
  'pl', 'ro', 'ru', 'sl', 'sv', 'th', 'tr', 'uk', 'vi'
]
const EMBED_ICON_TYPES = [
  'figma', 'youtube', 'excalidraw', 'codepen', 'codesandbox', 'vimeo',
  'tldraw', 'github_gist', 'google_calendar', 'google_slides', 'google_maps',
  'replit', 'felt', 'spotify', 'observable', 'desmos', 'scratch', 'val_town'
]

const localEditorAssetUrls = {
  fonts: {
    tldraw_mono: `${LOCAL_BASE_URL}/fonts/IBMPlexMono-Medium.woff2`,
    tldraw_mono_italic: `${LOCAL_BASE_URL}/fonts/IBMPlexMono-MediumItalic.woff2`,
    tldraw_mono_bold: `${LOCAL_BASE_URL}/fonts/IBMPlexMono-Bold.woff2`,
    tldraw_mono_italic_bold: `${LOCAL_BASE_URL}/fonts/IBMPlexMono-BoldItalic.woff2`,
    tldraw_serif: `${LOCAL_BASE_URL}/fonts/IBMPlexSerif-Medium.woff2`,
    tldraw_serif_italic: `${LOCAL_BASE_URL}/fonts/IBMPlexSerif-MediumItalic.woff2`,
    tldraw_serif_bold: `${LOCAL_BASE_URL}/fonts/IBMPlexSerif-Bold.woff2`,
    tldraw_serif_italic_bold: `${LOCAL_BASE_URL}/fonts/IBMPlexSerif-BoldItalic.woff2`,
    tldraw_sans: `${LOCAL_BASE_URL}/fonts/IBMPlexSans-Medium.woff2`,
    tldraw_sans_italic: `${LOCAL_BASE_URL}/fonts/IBMPlexSans-MediumItalic.woff2`,
    tldraw_sans_bold: `${LOCAL_BASE_URL}/fonts/IBMPlexSans-Bold.woff2`,
    tldraw_sans_italic_bold: `${LOCAL_BASE_URL}/fonts/IBMPlexSans-BoldItalic.woff2`,
    tldraw_draw: `${LOCAL_BASE_URL}/fonts/Shantell_Sans-Informal_Regular.woff2`,
    tldraw_draw_italic: `${LOCAL_BASE_URL}/fonts/Shantell_Sans-Informal_Regular_Italic.woff2`,
    tldraw_draw_bold: `${LOCAL_BASE_URL}/fonts/Shantell_Sans-Informal_Bold.woff2`,
    tldraw_draw_italic_bold: `${LOCAL_BASE_URL}/fonts/Shantell_Sans-Informal_Bold_Italic.woff2`,
  },
}

const localUiAssetUrls = {
  ...localEditorAssetUrls,
  icons: Object.fromEntries(
    ICON_TYPES.map((name) => [name, `${LOCAL_BASE_URL}/icons/icon/0_merged.svg#${name}`])
  ),
  translations: Object.fromEntries(
    LANGUAGES.map((locale) => [locale, `${LOCAL_BASE_URL}/translations/${locale}.json`])
  ),
  embedIcons: Object.fromEntries(
    EMBED_ICON_TYPES.map((type) => [type, `${LOCAL_BASE_URL}/embed-icons/${type}.png`])
  ),
}

setDefaultEditorAssetUrls(localEditorAssetUrls)
setDefaultUiAssetUrls(localUiAssetUrls)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
