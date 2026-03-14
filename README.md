# Tldraw Boards with Real-time Collaboration

Multi-user drawing board based on **tldraw** with authentication and **real-time synchronization**.

## Features

- ✅ User registration/login
- ✅ Create and manage boards
- ✅ **Real-time collaboration** via WebSocket
- ✅ Display connected users
- ✅ Collaborative board editing
- ✅ Share via links
- ✅ Roles: admin / user
- ✅ SQLite for data storage
- ✅ 📝 **Custom stickers** with clone handles
- ✅ 🔗 **Arrows follow** moved stickers
- ✅ 🎨 **Color picker** for stickers

## Quick Start

### Development

```bash
# Terminal 1 - Server
cd server
bun install
bun run start

# Terminal 2 - Client
cd client
bun install
bun run dev
```

**Access:**
- Client: http://localhost:3000
- Server: http://localhost:3001

### Production Build

```bash
# Build and export rootfs to tar.gz
./export-images.sh

# Or step by step:
./build.sh                          # Build to prod/
docker build --output ./server-rootfs ./prod/server
docker build --output ./client-rootfs ./prod/client
```

**Run:**
```bash
# Run via docker (import from rootfs)
docker import tlrdraw-auth-server.tar tlrdraw-auth-server:latest
docker import tlrdraw-auth-client.tar tlrdraw-auth-client:latest

docker run -d --name tlrdraw-server -p 3001:3001 -v tlrdraw_data:/app/data -e JWT_SECRET=your-secret tlrdraw-auth-server
docker run -d --name tlrdraw-client -p 80:80 --link tlrdraw-server:server tlrdraw-auth-client
```

**Or run without Docker (from rootfs):**
```bash
# Extract
tar -xzf tlrdraw-auth-server.tar.gz
cd server-rootfs

# Run server (bun required)
bun run start

# Client needs nginx
# Copy files from client-rootfs to /usr/share/nginx/html
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite + tldraw v3 |
| Backend | Node.js + Express + Bun runtime |
| Database | SQLite |
| Real-time | WebSocket (ws) |
| Auth | JWT |
| Docker | Alpine + nginx |

## How to use custom stickers

### Creating a sticker

1. Click the **Note** button in the left toolbar
2. Click on the canvas — a yellow 200x200 sticker appears
3. Click on the text to edit

### 🎨 Changing color

1. Select the sticker
2. A **Color picker** will appear in the top right panel
3. Choose a color (yellow, green, blue, red, violet, orange)

### 🔗 Creating linked stickers (clone handles)

1. Create a sticker and select it
2. 4 handle dots will appear on the edges (right, bottom, left, top)
3. **Pull any dot** — the following will be automatically created:
   - Arrow from the center of the first sticker
   - New sticker of the same color
   - Binding: arrow is bound to the new sticker
4. After releasing, **the create mode for a new sticker will automatically activate**
5. When moving the sticker, **the arrow follows** it

### Standard tldraw arrows

You can also use the built-in arrow:

1. Press **A** or select Arrow in the bottom panel
2. Drag from one object to another
3. Arrow will bind to the edges of shapes

## WebSocket synchronization

The application uses WebSocket for instant synchronization of changes between users:

- When opening a board, the client connects to the WebSocket server
- All changes (drawing, moving objects, stickers) are broadcast to other users
- Connected user names are displayed in the editor header

### Debugging WebSocket

To enable WebSocket logs, change in `client/src/App.jsx`:

```javascript
const DEBUG_WS = true  // was: false
```

After this, the browser console will show:
- WebSocket connect/disconnect
- User join/leave

## API

### Authentication
- `POST /api/auth/login` — login
- `POST /api/auth/register` — registration
- `GET /api/auth/me` — current user

### Boards
- `GET /api/boards` — list boards
- `POST /api/boards` — create board
- `GET /api/boards/:id` — get board
- `PUT /api/boards/:id` — save board
- `DELETE /api/boards/:id` — delete board

### WebSocket
- `ws://localhost:3001/ws` — WebSocket endpoint

Messages:
- `join` — join board room
- `leave` — leave room
- `change` — send snapshot changes
- `users-list` — list of users in room
- `user-joined` — user joined
- `user-left` — user left

## Technology Stack

**Frontend:**
- React 18
- tldraw 3
- React Router
- Axios
- WebSocket API

**Backend:**
- Node.js + Express
- SQLite3
- JWT for authentication
- WebSocket (ws)

## Default Credentials

```
Admin: admin / admin
```

## 🗺️ Roadmap

### Backend

- [ ] **Rust migration** — rewrite server in Rust (Axum/Actix + Tokio)
  - Performance and memory safety
  - Lower resource consumption
  - Type-safe APIs
- [ ] **Switch from SQLite to PostgreSQL**
  - Scalability
  - Concurrent access
  - Advanced features (triggers, views)
- [ ] **Redis for sessions and caching**
- [ ] **gRPC for internal communication**

### Frontend

- [ ] **More graphic components**
  - [ ] Tables / data grids
  - [ ] Diagrams (flowchart, mind map)
  - [ ] Frames with collaboration
  - [ ] Text documents
  - [ ] Code blocks with syntax highlighting
- [ ] **Refactor App.jsx** — split 1852 lines into components
- [ ] **TypeScript** — full migration from .jsx to .tsx
- [ ] **CSS Modules / Tailwind** — replace inline styles
- [ ] **Tests** — Vitest + React Testing Library

### Features

- [x] **Board sharing** — public/private, link access
- [ ] **Comments** — discuss board elements
- [ ] **Change history** — rollback to previous versions
- [ ] **Export** — PNG, SVG, PDF
- [ ] **Templates** — ready-made board layouts

---
## License

* **PrivateBoard** code is distributed under the [GNU Lesser General Public License v3.0](LICENSE) (LGPL‑3.0).
* The project uses [tldraw](https://github.com/tldraw/tldraw) components, which are distributed under the [tldraw license](LICENSE-tldraw).

### Important Restrictions

Using tldraw components in **Production Environments** (public services, commercial products) requires obtaining a separate commercial license from [tldraw Inc.](https://tldraw.dev).

This repository is intended for:
* internal use in organizations;
* development and testing;
* local deployment.

For commercial use of PrivateBoard with tldraw components, contact [tldraw Sales](mailto:sales@tldraw.com).


