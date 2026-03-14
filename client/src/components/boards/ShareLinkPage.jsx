/**
 * Uses tldraw components (https://github.com/tldraw/tldraw)
 * License: see LICENSE-tldraw
 * Restrictions: production use requires a license from tldraw Inc.
 */
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tldraw, useTools, useIsToolSelected, DefaultToolbar, TldrawUiMenuItem, DefaultToolbarContent } from 'tldraw'
import 'tldraw/tldraw.css'
import { useAuth } from '../../hooks/useAuth.jsx'
import { boardService } from '../../services/board.service.js'
import { createWebSocket, sendMessage, leaveRoom } from '../../utils/websocket.js'
import { CustomNoteShapeUtil, CustomArrowBindingUtil, CustomNoteTool } from '../../custom-shapes/index.ts'
import { Button } from '../common/Button.jsx'

const DEBUG_WS = false

// Custom toolbar - uses tldraw hooks directly
const CustomToolbar = () => {
  const tools = useTools()
  const isCustomNoteSelected = useIsToolSelected(tools.customNote)

  return (
    <DefaultToolbar>
      <TldrawUiMenuItem {...tools.customNote} isSelected={isCustomNoteSelected} />
      <DefaultToolbarContent />
    </DefaultToolbar>
  )
}

const overrides = {
  tools(editor, schema) {
    schema['customNote'] = {
      id: 'customNote',
      label: 'Note',
      icon: 'tool',
      kbd: 'n',
      onSelect: () => {
        editor.setCurrentTool('customNote')
      },
    }
    return schema
  },
}

const components = {
  Toolbar: CustomToolbar,
}

export function ShareLinkPage() {
  const { token } = useParams()
  const [board, setBoard] = useState(null)
  const [permission, setPermission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [connectedUsers, setConnectedUsers] = useState([])
  const navigate = useNavigate()
  const editorRef = useRef(null)
  const wsRef = useRef(null)
  const { login, user } = useAuth()
  const isRemoteChange = useRef(false)

  useEffect(() => {
    loadBoard()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [token])

  useEffect(() => {
    if (user) {
      setLoggedIn(true)
      if (board?.id) {
        navigate(`/board/${board.id}`)
      }
    }
  }, [user, board])

  useEffect(() => {
    if (board && (permission === 'write' || permission === 'admin')) {
      connectWebSocket()
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [board, permission])

  const loadBoard = async () => {
    try {
      const data = await boardService.getShareLinkInfo(token)
      setBoard(data.board)
      setPermission(data.permission)
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid share link')
    } finally {
      setLoading(false)
    }
  }

  const connectWebSocket = () => {
    if (!board) return

    const ws = createWebSocket(board.id, user, {
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
          case 'change':
            if (editorRef.current && payload.snapshot && !isRemoteChange.current) {
              isRemoteChange.current = true
              try {
                editorRef.current.loadSnapshot(payload.snapshot)
              } catch (e) {
                console.error('Failed to load remote snapshot:', e)
              }
              setTimeout(() => { isRemoteChange.current = false }, 100)
            }
            break
        }
      }
    })

    wsRef.current = ws
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(username, password)
      setLoggedIn(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  const handleMount = (editor) => {
    editorRef.current = editor

    if (board?.data && board.data !== '{}') {
      try {
        const snapshot = JSON.parse(board.data)
        editor.loadSnapshot(snapshot)
      } catch (e) {
        console.error('Failed to load board data', e)
      }
    }

    if (permission === 'write' || permission === 'admin') {
      let lastBroadcastTime = 0
      const BROADCAST_INTERVAL = 100

      const handleChange = (info) => {
        if (isRemoteChange.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return
        }

        const now = Date.now()
        if (now - lastBroadcastTime < BROADCAST_INTERVAL) {
          return
        }
        lastBroadcastTime = now

        const snapshot = editor.getSnapshot()
        sendMessage(wsRef.current, 'change', {
          username: user?.username || 'Anonymous',
          snapshot
        })
      }

      const unsubscribe = editor.store.listen(handleChange, {
        source: 'user',
        scope: 'document'
      })

      const saveInterval = setInterval(async () => {
        if (!editorRef.current) return
        const snapshot = editorRef.current.getSnapshot()
        try {
          await boardService.saveViaShareLink(token, {
            name: board?.name,
            data: snapshot
          })
        } catch (err) {
          console.error('Auto-save failed', err)
        }
      }, 3000)

      return () => {
        clearInterval(saveInterval)
        unsubscribe()
        if (wsRef.current) {
          leaveRoom(wsRef.current)
        }
      }
    }
  }

  const containerStyles = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }

  const cardStyles = {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '400px',
  }

  const titleStyles = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  }

  const errorStyles = {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  }

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  }

  const inputStyles = {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '16px',
  }

  const editorHeaderStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '50px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 9999,
  }

  const permissionIndicatorStyles = {
    background: '#e0e0e0',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#666',
  }

  const usersIndicatorStyles = {
    background: '#e8f4ff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    color: '#0066cc',
    fontWeight: '500',
  }

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div style={containerStyles}>
        <div style={cardStyles}>
          <h2 style={titleStyles}>Share Link Error</h2>
          <p style={errorStyles}>{error}</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  if (!permission || permission === 'read') {
    return (
      <div style={containerStyles}>
        <div style={cardStyles}>
          <h2 style={titleStyles}>{board?.name}</h2>
          <p style={{ textAlign: 'center', color: '#666' }}>
            {permission === 'read' ? 'Read-only access' : 'Access denied'}
          </p>
          {!loggedIn && (
            <form onSubmit={handleLogin} style={formStyles}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyles}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyles}
                required
              />
              <Button type="submit" variant="primary">
                Login to Edit
              </Button>
            </form>
          )}
          <Button variant="secondary" onClick={() => navigate('/login')} style={{ marginTop: '15px' }}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div style={editorHeaderStyles}>
        <h2 style={{ flex: 1, margin: 0 }}>{board?.name}</h2>
        <span style={permissionIndicatorStyles}>
          {permission === 'admin' ? 'Admin' : permission === 'write' ? 'Can Edit' : 'Read Only'}
        </span>
        {connectedUsers.length > 0 && (
          <span style={usersIndicatorStyles}>
            👥 {connectedUsers.join(', ')}
          </span>
        )}
        {!loggedIn && (
          <Button variant="primary" onClick={() => navigate('/login')}>
            Login to Save
          </Button>
        )}
      </div>

      <div style={{ position: 'absolute', top: 50, left: 0, right: 0, bottom: 0 }}>
        <Tldraw
          onMount={handleMount}
          shapeUtils={[CustomNoteShapeUtil]}
          bindingUtils={[CustomArrowBindingUtil]}
          tools={[CustomNoteTool]}
          overrides={overrides}
          components={components}
        />
      </div>
    </div>
  )
}
