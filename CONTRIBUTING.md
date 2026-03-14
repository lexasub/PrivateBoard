# Contributing to tlrdraw-auth

Thank you for considering contributing to tlrdraw-auth! This document provides guidelines and instructions for contributing.

## 🎯 How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (Node.js version, browser, OS)
- **Logs or error messages**

**Example:**
```markdown
### Bug Report

**Description:** WebSocket disconnects when switching boards

**Steps to Reproduce:**
1. Open board A
2. Click to switch to board B
3. WebSocket connection drops

**Expected:** Seamless reconnection to new board room

**Environment:**
- Browser: Chrome 120
- Node.js: 18.x
- Server: localhost:3001

**Logs:** [Attach relevant console logs]
```

### Suggesting Features

Feature suggestions are welcome! Please include:

- **Use case** — why this feature is needed
- **Proposed solution** — how it should work
- **Alternatives considered** — other approaches

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `master`:
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Make changes** following code style
4. **Test manually** — ensure app runs without errors
5. **Commit** with clear messages (see below)
6. **Push** and create a Pull Request

## 📝 Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

**Examples:**
```
feat(stickers): add color picker for custom notes
fix(server): resolve WebSocket race condition on disconnect
docs: update README with Docker run instructions
refactor(client): extract BoardEditor component from App.jsx
```

## 🧪 Testing

### Manual Testing

Currently the project uses manual testing:

1. **Start server:**
   ```bash
cd server
bun install
bun run start
```

2. **Start client:**
   ```bash
   cd client
bun install
bun run dev
   ```

3. **Test scenarios:**
   - Register/login
   - Create board
   - Draw and add stickers
   - Open same board in another browser (real-time sync)

### Future: Adding Tests

When adding tests, consider:

1. **Unit tests** for server routes (`server/routes/`)
2. **Component tests** for React components
3. **E2E tests** for critical flows (login, board sync)

## 📚 Documentation

When contributing:

1. **Update README.md** if changing user-facing functionality
2. **Update AGENTS.md** if changing project structure or conventions
3. **Add JSDoc comments** to new functions/components

## 🔧 Development Setup

```bash
# Clone fork
git clone https://github.com/lexasub/tlrdraw-auth.git
cd tlrdraw-auth

# Install server dependencies
cd server
bun install

# Install client dependencies
cd ../client
bun install

# Run server (terminal 1)
cd server
bun run start

# Run client (terminal 2)
cd client
bun run dev
```

**Access:**
- Client: http://localhost:3000
- Server: http://localhost:3001

## 📋 Code Style

- **JavaScript:** ES modules (`import`/`export`)
- **React:** Functional components with hooks
- **TypeScript:** Used in custom-shapes (`.tsx`), JS elsewhere
- **Styling:** Inline styles as JS objects (current pattern)
- **Line length:** 100 characters

## 🎯 Areas Needing Contribution

- [ ] **Refactor:** Split monolithic files (App.jsx 1852 lines, index.js 1013 lines)
- [ ] **Tests:** Add unit/integration tests
- [ ] **Linting:** Add ESLint + Prettier
- [ ] **CSS:** Migrate to CSS modules or Tailwind
- [ ] **TypeScript:** Full migration from .jsx to .tsx
- [ ] **Docker:** Improve Dockerfile and multi-container setup
- [ ] **Features:** More tldraw shapes, templates, export

## 📞 Questions?

- **General questions:** Open a [Discussion](https://github.com/lexasub/tlrdraw-auth/discussions)
- **Bug reports:** Open an [Issue](https://github.com/lexasub/tlrdraw-auth/issues)
- **Security issues:** Open a [Security Advisory](https://github.com/lexasub/tlrdraw-auth/security/advisories/new)

## 🙏 Thank You!

All contributions are appreciated, no matter how small. tlrdraw-auth is built by the community, for the community.
