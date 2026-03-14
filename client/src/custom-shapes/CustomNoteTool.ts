/**
 * Uses tldraw components (https://github.com/tldraw/tldraw)
 * License: see LICENSE-tldraw
 * Restrictions: production use requires a license from tldraw Inc.
 */
import { StateNode, createShapeId } from 'tldraw'

export class CustomNoteTool extends StateNode {
  static override id = 'customNote'
  
  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }
  
  override onPointerDown() {
    const currentPagePoint = this.editor.inputs.currentPagePoint
    const shapeId = createShapeId()
    
    this.editor.markHistoryStoppingPoint()
    this.editor.createShape({
      id: shapeId,
      type: 'customNote',
      x: currentPagePoint.x,
      y: currentPagePoint.y,
    })
    
    this.editor.setSelectedShapes([shapeId])
    
    // Переходим в режим перетаскивания для изменения размера
    this.editor.setCurrentTool('select.translating', {
      target: 'shape',
      shape: this.editor.getShape(shapeId),
      isCreating: true,
      onInteractionEnd: 'customNote',
      onCreate: () => {
        this.editor.setCurrentTool('customNote')
      },
    })
  }
}
