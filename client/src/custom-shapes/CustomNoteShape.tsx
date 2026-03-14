/**
 * Uses tldraw components (https://github.com/tldraw/tldraw)
 * License: see LICENSE-tldraw
 * Restrictions: production use requires a license from tldraw Inc.
 */
import { ShapeUtil, TLBaseShape, RecordProps, T, Rectangle2d, ZERO_INDEX_KEY, createShapeId, DefaultColorStyle } from 'tldraw'

export type CustomNoteShape = TLBaseShape<'customNote', {
  w: number
  h: number
  color: string
  text: string
  scale: number
}>

export class CustomNoteShapeUtil extends ShapeUtil<CustomNoteShape> {
  static override type = 'customNote' as const

  static override props: RecordProps = {
    w: T.number,
    h: T.number,
    color: DefaultColorStyle,
    text: T.string,
    scale: T.number,
  }

  getDefaultProps(): CustomNoteShape['props'] {
    return {
      w: 200,
      h: 200,
      color: 'yellow',
      text: '',
      scale: 1,
    }
  }

  // Разрешаем привязку стрелок к этой фигуре
  override canBind() {
    return true
  }

  // Отключаем встроенный editing mode - используем свой contentEditable
  override canEdit() {
    return false
  }

  getGeometry(shape: CustomNoteShape) {
    return new Rectangle2d({
      width: shape.props.w * shape.props.scale,
      height: shape.props.h * shape.props.scale,
      isFilled: true,
    })
  }

  override getHandles(shape: CustomNoteShape) {
    const w = shape.props.w * shape.props.scale
    const h = shape.props.h * shape.props.scale
    
    return [
      {
        type: 'clone',
        id: 'right',
        index: ZERO_INDEX_KEY,
        x: w,
        y: h / 2,
      },
      {
        type: 'clone',
        id: 'bottom',
        index: 'a' as any,
        x: w / 2,
        y: h,
      },
      {
        type: 'clone',
        id: 'left',
        index: 'b' as any,
        x: 0,
        y: h / 2,
      },
      {
        type: 'clone',
        id: 'top',
        index: 'c' as any,
        x: w / 2,
        y: 0,
      },
    ]
  }

  override onHandleDrag(shape: CustomNoteShape, { handle }: any) {
    // При перетаскивании clone handle создаем стрелку и новый note
    const pagePoint = this.editor.getShapePageTransform(shape.id)!.applyToPoint({ x: handle.x, y: handle.y })

    // Создаем новый note в точке отпускания (центрируем относительно точки отпускания)
    const newNoteId = createShapeId()
    const newNoteX = pagePoint.x - 100
    const newNoteY = pagePoint.y - 100

    this.editor.createShape({
      id: newNoteId,
      type: 'customNote',
      x: newNoteX,
      y: newNoteY,
      props: {
        w: 200,
        h: 200,
        color: shape.props.color,
        text: '',
        scale: 1,
      },
    })

    // Создаем стрелку от центра первого стикера к центру второго
    const arrowId = createShapeId()
    const fromShapeCenter = {
      x: shape.x + (shape.props.w * shape.props.scale) / 2,
      y: shape.y + (shape.props.h * shape.props.scale) / 2,
    }
    const toShapeCenter = {
      x: newNoteX + 100,
      y: newNoteY + 100,
    }

    this.editor.createShape({
      id: arrowId,
      type: 'arrow',
      x: 0,
      y: 0,
      props: {
        start: { x: fromShapeCenter.x, y: fromShapeCenter.y },
        end: { x: toShapeCenter.x, y: toShapeCenter.y },
      },
    })

    // Привязываем стрелку к новому note
    this.editor.createBinding({
      type: 'customArrow',
      fromId: arrowId,
      toId: newNoteId,
      props: {
        terminal: 'end',
        anchorX: 0.5,
        anchorY: 0.5,
        isPrecise: false,
        isExact: false,
        snap: 'none',
      },
    })

    // Выделяем новый note
    this.editor.setSelectedShapes([newNoteId])

    // Переходим в режим перетаскивания нового note
    this.editor.setCurrentTool('select.translating', {
      target: 'shape',
      shape: this.editor.getShape(newNoteId),
      isCreating: true,
      onInteractionEnd: 'customNote',
      onCreate: () => {
        this.editor.setCurrentTool('customNote')
      },
    })

    return shape
  }

  override onHandleDragEnd(shape: CustomNoteShape) {
    // Возвращаемся в режим customNote после завершения перетаскивания
    this.editor.setCurrentTool('customNote')
    return shape
  }

  component(shape: CustomNoteShape) {
    const colors: Record<string, string> = {
      yellow: '#fef68a',
      green: '#bbf7d0',
      blue: '#bfdbfe',
      red: '#fca5a5',
      violet: '#e9d5ff',
      orange: '#fed7aa',
    }

    const bgColor = colors[shape.props.color] || colors.yellow

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          boxSizing: 'border-box',
        }}
      >
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            const text = e.currentTarget.textContent || ''
            this.editor.updateShape({
              ...shape,
              props: { text },
            })
          }}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            resize: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            color: '#000',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {shape.props.text}
        </div>
      </div>
    )
  }

  indicator(shape: CustomNoteShape) {
    return (
      <rect
        width={shape.props.w * shape.props.scale}
        height={shape.props.h * shape.props.scale}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    )
  }
}
