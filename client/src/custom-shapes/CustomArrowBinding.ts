/**
 * Uses tldraw components (https://github.com/tldraw/tldraw)
 * License: see LICENSE-tldraw
 * Restrictions: production use requires a license from tldraw Inc.
 */
import { BindingUtil, TLBaseBinding, T, RecordProps } from 'tldraw'

export type CustomArrowBinding = TLBaseBinding<'customArrow', {
  terminal: 'start' | 'end'
  anchorX: number
  anchorY: number
  isPrecise: boolean
  isExact: boolean
  snap: 'none' | 'midpoint' | 'intersection'
}>

export class CustomArrowBindingUtil extends BindingUtil<CustomArrowBinding> {
  static override type = 'customArrow' as const

  static override props: RecordProps = {
    terminal: T.string,
    anchorX: T.number,
    anchorY: T.number,
    isPrecise: T.boolean,
    isExact: T.boolean,
    snap: T.string,
  }

  override getDefaultProps(): CustomArrowBinding['props'] {
    return {
      terminal: 'end',
      anchorX: 0.5,
      anchorY: 0.5,
      isPrecise: false,
      isExact: false,
      snap: 'none',
    }
  }

  // Вызывается при перемещении целевой фигуры (к которой прикреплена стрелка)
  override onAfterChangeToShape({ binding, shapeAfter }: any) {
    const arrow = this.editor.getShape(binding.fromId)
    if (!arrow || arrow.type !== 'arrow') return

    const target = shapeAfter
    const targetBounds = this.editor.getShapeGeometry(target)?.bounds
    if (!targetBounds) return

    // Вычисляем новую позицию конца стрелки на основе anchor
    const shapeAnchor = {
      x: this.lerp(targetBounds.minX, targetBounds.maxX, binding.props.anchorX),
      y: this.lerp(targetBounds.minY, targetBounds.maxY, binding.props.anchorY),
    }

    const pageAnchor = this.editor
      .getShapePageTransform(target)
      .applyToPoint(shapeAnchor)

    const arrowParentAnchor = this.editor
      .getShapeParentTransform(arrow)
      .invert()
      .applyToPoint(pageAnchor)

    // Обновляем конец стрелки
    const isEnd = binding.props.terminal === 'end'
    this.editor.updateShape({
      ...arrow,
      props: {
        ...arrow.props,
        [isEnd ? 'end' : 'start']: {
          x: arrowParentAnchor.x,
          y: arrowParentAnchor.y,
        },
      },
    })
  }

  // Вызывается при перемещении стрелки
  override onAfterChangeFromShape({ binding, shapeAfter }: any) {
    // Можно добавить логику для обновления при перемещении стрелки
  }

  // Вызывается перед удалением привязки
  override onBeforeIsolateFromShape({ binding }: any) {
    // "Запекаем" текущую позицию конца стрелки
  }

  private lerp(min: number, max: number, t: number) {
    return min + (max - min) * t
  }
}
