# PROJECT KNOWLEDGE BASE

**Repository:** https://github.com/lexasub/PrivateBoard
**Updated:** 2026-03-16
**Branch:** master

## OVERVIEW
Real-time collaborative whiteboard using tldraw v3 with JWT auth, WebSocket sync, and SQLite. Two-package monorepo (client + server).

## STRUCTURE
```
./
├── client/           # React + Vite + tldraw v3
│   ├── src/
│   │   ├── App.jsx           # 69 lines — router only
│   │   ├── main.jsx          # Entry point
│   │   ├── components/       # auth/, boards/, common/, layout/
│   │   ├── hooks/            # useAuth, useWebSocket, useBoard
│   │   ├── services/         # api, auth, board
│   │   ├── utils/            # websocket helpers
│   │   └── custom-shapes/    # .tsx custom tldraw shapes
│   └── package.json
├── server/           # Express + SQLite + WebSocket
│   ├── src/
│   │   ├── index.js          # Entry point (64 lines)
│   │   ├── app.js            # Express setup
│   │   ├── config/           # database, jwt
│   │   ├── entity/           # user, board models
│   │   ├── middleware/       # auth, error, validation
│   │   ├── services/         # auth, board, websocket
│   │   ├── repositories/     # user, board, shares
│   │   └── endpoints/        # routes/, websocket/
│   ├── data/                 # SQLite DB
│   └── package.json
├── prod/              # Production builds (docker rootfs)
├── exports/           # Docker rootfs tar.gz
├── build.sh           # Custom build script
└── export-images.sh  # Docker export script
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Auth flow | server/src/endpoints/routes/auth.js | JWT middleware, login/register |
| Board sync | server/src/endpoints/websocket/ | Real-time collaboration |
| UI components | client/src/components/ | Split by feature |
| Custom shapes | client/src/custom-shapes/ | Note + ArrowBinding |
| WebSocket client | client/src/utils/websocket.js | Connection logic |

## CONVENTIONS
- **Module system**: ESM (`import`/`export`)
- **Runtime**: Node.js (scripts), Bun (production)
- **Package manager**: npm scripts
- **No linting/formatting**: No ESLint, Prettier, or editorconfig
- **No tests**: Zero test infrastructure

## UNIQUE STYLES
- Custom tldraw shapes with clone handles (drag to create linked stickers)
- Arrows follow moved stickers (binding system)
- Color picker for custom notes
- WebSocket user presence in header

## COMMANDS
```bash
# Dev
cd server && bun install && bun run start    # Port 3001
cd client && bun install && bun run dev       # Port 3000

# Build
bun run build  # Client → dist/
./build.sh     # Client + Server → prod/

# Docker
./export-images.sh  # Build + export to .tar.gz
```

## NOTES
- Default credentials: admin / admin
- DEBUG_WS = true in websocket.js enables logs
- API proxy: Vite proxies /api and /ws → localhost:3001
- Production uses Bun runtime in Alpine Docker
