# client/src/custom-shapes/

**Repository:** https://github.com/lexasub/PrivateBoard
**Status:** Inherits from parent

## OVERVIEW
Custom tldraw v3 shapes: Note with clone handles + Arrow binding

## FILES
| File | Purpose |
|------|---------|
| CustomNoteShape.tsx | Note shape with color picker |
| CustomArrowBinding.ts | Arrow that follows moved stickers |
| CustomNoteTool.ts | Tool to create notes |
| index.ts | Exports all shapes |

## UNIQUE FEATURES
- **Clone handles**: Drag corner handles → create linked sticker + arrow
- **Arrow binding**: Arrows follow moved stickers automatically
- **Color picker**: Yellow, green, blue, red, violet, orange

## CONVENTIONS
- Uses .tsx extension (parent is .jsx)
- Imported in JS: `import ... from './custom-shapes/index.ts'`
