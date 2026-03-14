import { useState, useEffect } from 'react'
import { boardService } from '../services/board.service.js'

export function useBoard(boardId) {
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadBoard = async () => {
    try {
      const data = await boardService.getBoard(boardId)
      setBoard(data)
      setError(null)
    } catch (err) {
      setError(err)
      console.error('Failed to load board', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (boardId) {
      loadBoard()
    }
  }, [boardId])

  const updateBoard = async (data) => {
    await boardService.updateBoard(boardId, data)
    await loadBoard()
  }

  return { board, loading, error, reload: loadBoard, updateBoard }
}
