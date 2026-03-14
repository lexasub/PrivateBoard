# client/

**Repository:** https://github.com/lexasub/PrivateBoard
**Status:** Root knowledge base applies

## OVERVIEW
React + Vite + tldraw v3 frontend

## STRUCTURE
```
client/
├── src/
│   ├── App.jsx           # 1852 lines — ALL components inline
│   ├── main.jsx          # Entry point
│   └── custom-shapes/    # .tsx custom tldraw shapes
├── package.json
└── vite.config.js
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| All UI | src/App.jsx (1852 lines) |
| Custom shapes | src/custom-shapes/ |
| Config | vite.config.js |

## ANTI-PATTERNS (THIS DIR)
- ❌ Single 1852-line App.jsx with all pages inline
- ❌ Mixed .jsx + .tsx (TypeScript imported in JS)
- ❌ Inline styles as JS objects, no CSS modules/Tailwind
- ❌ No component folder structure

## COMMANDS
```bash
bun run dev    # Port 3000
bun run build  # → dist/
```
