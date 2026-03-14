import { useRef, useEffect, useState } from 'react'
import { createWebSocket, sendMessage, leaveRoom } from '../utils/websocket.js'

export function useWebSocket(boardId, user, onMessage) {
  const wsRef = useRef(null)
  const [connectedUsers, setConnectedUsers] = useState([])

  useEffect(() => {
    if (!boardId) return

    wsRef.current = createWebSocket(boardId, user, {
      onMessage: (message) => {
        const { type, payload } = message

        switch (type) {
          case 'users-list':
            setConnectedUsers(payload)
            break
          case 'user-joined':
            setConnectedUsers(prev => {
              if (prev.includes(payload.username)) return prev
              return [...prev, payload.username]
            })
            break
          case 'user-left':
            setConnectedUsers(prev => prev.filter(u => u !== payload.username))
            break
          default:
            onMessage?.(message)
        }
      }
    })

    return () => {
      if (wsRef.current) {
        leaveRoom(wsRef.current)
        wsRef.current.close()
      }
    }
  }, [boardId])

  const sendChange = (snapshot, username) => {
    sendMessage(wsRef.current, 'change', {
      username: username || 'Anonymous',
      snapshot
    })
  }

  return { wsRef, connectedUsers, sendChange }
}
