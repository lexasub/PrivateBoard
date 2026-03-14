// WebSocket utilities

const DEBUG_WS = false

export function createWebSocket(boardId, user, handlers) {
  // Use relative URL - WebSocket will connect to same host as the page
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = import.meta.env.VITE_WS_URL || `${protocol}//${window.location.host}/ws`
  const ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    DEBUG_WS && console.log('WebSocket connected')
    ws.send(JSON.stringify({
      type: 'join',
      payload: { boardId, user }
    }))
  }

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    handlers.onMessage?.(message)
  }

  ws.onclose = () => {
    DEBUG_WS && console.log('WebSocket disconnected')
    setTimeout(() => {
      createWebSocket(boardId, user, handlers)
    }, 2000)
  }

  ws.onerror = (err) => {
    console.error('WebSocket error:', err)
  }

  return ws
}

export function sendMessage(ws, type, payload) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }))
  }
}

export function leaveRoom(ws) {
  sendMessage(ws, 'leave', {})
}
