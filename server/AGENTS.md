# server/

**Repository:** https://github.com/lexasub/PrivateBoard
**Status:** Root knowledge base applies

## OVERVIEW
Express + SQLite + WebSocket backend

## STRUCTURE
```
server/
├── index.js         # 1013 lines — ALL server logic
├── data/            # SQLite database
└── package.json
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| All logic | index.js (1013 lines) |
| Auth | JWT middleware, login/register |
| WebSocket | Real-time board sync |
| DB | SQLite setup + queries |

## ANTI-PATTERNS (THIS DIR)
- ❌ Single 1013-line index.js (no routes/middleware/services)
- ❌ ESM package.json + CommonJS code (`require` instead of `import`)
- ❌ No separation: DB, auth, routes all in one file

## COMMANDS
```bash
npm start      # Port 3001
npm run dev    # nodemon
```

## NOTES
- ESM/CommonJS mismatch: `"type": "module"` in package.json but uses `require()`
- Works with Bun runtime, fails with plain Node
