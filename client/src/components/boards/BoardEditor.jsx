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

// Custom toolbar component - uses tldraw hooks directly
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

export function BoardEditor() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [theme, setTheme] = useState(() => localStorage.getItem('tldraw-theme') || 'light')
  const navigate = useNavigate()
  const editorRef = useRef(null)
  const wsRef = useRef(null)
  const { user } = useAuth()
  const isRemoteChange = useRef(false)
  const [saveStatus, setSaveStatus] = useState('saved');

  useEffect(() => {
    loadBoard()
    connectWebSocket()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [id])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('tldraw-theme', newTheme)
    if (editorRef.current) {
      editorRef.current.user.updateUserPreferences({ colorScheme: newTheme })
    }
  }

  const connectWebSocket = () => {
    const ws = createWebSocket(id, user, {
      onMessage: (message) => {
        const { type, payload } = message
        switch (type) {
          case 'users-list':
            setConnectedUsers([...new Set(payload)])
            break
          case 'user-joined':
            setConnectedUsers(prev => {
              if (prev.includes(payload.username)) return prev
              return [...prev, payload.username]
            })
            DEBUG_WS && console.log(`${payload.username} joined`)
            break
          case 'user-left':
            setConnectedUsers(prev => prev.filter(u => u !== payload.username))
            DEBUG_WS && console.log(`${payload.username} left`)
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

  const loadBoard = async () => {
    try {
      const data = await boardService.getBoard(id)
      setBoard(data)
    } catch (err) {
      console.error('Failed to load board', err)
      navigate('/boards')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBoard = async () => {
    if (!editorRef.current) return;
    
    setSaveStatus('saving'); // 🟡 1. Update UI to Saving
    const snapshot = editorRef.current.getSnapshot();
    
    try {
      await boardService.updateBoard(id, {
        name: board?.name,
        data: snapshot
      });
      setSaveStatus('saved'); // 🟢 2. Update UI to Saved
    } catch (err) {
      console.error('Save failed', err);
      setSaveStatus('failed'); // 🔴 3. Update UI to Failed
    }
  };

  const handleMount = (editor) => {
    editorRef.current = editor

    editor.user.updateUserPreferences({ colorScheme: theme })

    if (board?.data && board.data !== '{}') {
      try {
        const snapshot = JSON.parse(board.data)
        editor.loadSnapshot(snapshot)
      } catch (e) {
        console.error('Failed to load board data', e)
      }
    }

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

    const saveInterval = setInterval(() => {
      handleSaveBoard();
    }, 3000);

    return () => {
      clearInterval(saveInterval)
      unsubscribe()
      if (wsRef.current) {
        leaveRoom(wsRef.current)
      }
    }
  }

  const editorHeaderStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '50px',
    background: theme === 'light' ? 'white' : '#1e1e1e',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 9999,
  }

  const h2Styles = {
    flex: 1,
    margin: 0,
    color: theme === 'light' ? '#000' : '#fff',
  }

  const permissionIndicatorStyles = {
    background: theme === 'light' ? '#e0e0e0' : '#333',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: theme === 'light' ? '#666' : '#ccc',
  }

  const usersIndicatorStyles = {
    background: theme === 'light' ? '#e8f4ff' : '#1a3a52',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    color: theme === 'light' ? '#0066cc' : '#66b3ff',
    fontWeight: '500',
  }

  if (loading) return <div>Loading...</div>

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return <span style={{ color: '#feca57', fontSize: '14px' }}>🟡 Saving...</span>;
      case 'failed':
        return (
          <span style={{ color: '#ff6b6b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔴 Save failed
            <button 
              onClick={handleSaveBoard} 
              style={{ padding: '2px 6px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ff6b6b', background: 'white', color: '#ff6b6b' }}
            >
              Retry
            </button>
          </span>
        );
      case 'saved':
      default:
        return <span style={{ color: '#2ed573', fontSize: '14px' }}>🟢 Saved</span>;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div style={editorHeaderStyles}>
        <Button variant="secondary" onClick={() => navigate('/boards')}>
          ← Back
        </Button>
        <h2 style={h2Styles}>{board?.name}</h2>
        {(board?.isOwner || board?.permission === 'admin') && (
          <Button
            variant="primary"
            onClick={() => navigate(`/board/${id}/share`)}
          >
            Share
          </Button>
        )}
        {board?.permission && (
          <span style={permissionIndicatorStyles}>
            {board.permission === 'admin' ? 'Admin' : board.permission === 'write' ? 'Can Edit' : 'Read Only'}
          </span>
        )}
        {connectedUsers.length > 0 && (
          <span style={usersIndicatorStyles}>
            👥 {[...new Set(connectedUsers)].join(', ')}
          </span>
        )}
        {renderSaveStatus()}
      </div>

      <div style={{ position: 'absolute', top: 50, left: 0, right: 0, bottom: 0 }}>
        <Tldraw
          onMount={handleMount}
          shapeUtils={[CustomNoteShapeUtil]}
          bindingUtils={[CustomArrowBindingUtil]}
          tools={[CustomNoteTool]}
          overrides={overrides}
          components={components}
          theme={theme}
        />
      </div>
    </div>
  )
}
