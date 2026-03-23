import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { boardService } from '../../services/board.service.js'
import { BoardCard } from './BoardCard.jsx'
import { ChangePasswordModal } from '../common/ChangePasswordModal.jsx'
import { Input } from '../common/Input.jsx'
import { Button } from '../common/Button.jsx'

export function BoardList() {
  const [boards, setBoards] = useState([])
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadBoards()
    const interval = setInterval(loadBoards, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : ''
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
  }

  const loadBoards = async () => {
    try {
      const data = await boardService.getAllBoards()
      setBoards(data)
    } catch (err) {
      console.error('Failed to load boards', err)
    }
  }

  const createBoard = async () => {
    if (!newBoardName.trim()) return
    try {
      await boardService.createBoard(newBoardName)
      setNewBoardName('')
      loadBoards()
    } catch (err) {
      console.error('Failed to create board', err)
    }
  }
  
  const toggleBoardSelection = (boardId) => {
    setSelectedBoards((prev) => 
      prev.includes(boardId) 
        ? prev.filter(id => id !== boardId) 
        : [...prev, boardId]               
    )
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete selected ${selectedBoards.length} boards?`)) return;
    
    try {
      await Promise.all(selectedBoards.map(id => boardService.deleteBoard(id)));
      setSelectedBoards([]); 
      loadBoards(); 
    } catch (err) {
      console.error('Failed to delete boards', err);
    }
  }

  const pageStyles = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    background: theme === 'light' ? '#fff' : '#1e1e1e',
    color: theme === 'light' ? '#000' : '#fff',
  }

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: `2px solid ${theme === 'light' ? '#e0e0e0' : '#444'}`,
  }

  const userInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }

  const adminBadgeStyles = {
    background: '#667eea',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  }

  const createSectionStyles = {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
  }

  const boardsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  }

  const emptyStyles = {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: theme === 'light' ? '#666' : '#999',
    padding: '40px',
  }

  return (
    <div style={pageStyles}>
      <header style={headerStyles}>
        <h1>My Boards</h1>
        <div style={userInfoStyles}>
          <span>
            Welcome, {user?.username}{' '}
            {user?.role === 'admin' && (
              <span style={adminBadgeStyles}>(Admin)</span>
            )}
          </span>
          <Button 
            variant="warning" 
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
          <Button variant="secondary" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark' : 'Light'}
          </Button>
          {user?.role === 'admin' && (
            <Button variant="primary" onClick={() => navigate('/admin')}>
              Admin Panel
            </Button>
          )}
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div style={createSectionStyles}>
        <Input
          type="text"
          placeholder="New board name..."
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && createBoard()}
        />
        <Button variant="success" size="lg" onClick={createBoard}>
          Create Board
        </Button>
        {selectedBoards.length > 0 && (
        <Button variant="danger" size="lg" onClick={handleBulkDelete}>
        Delete Selected ({selectedBoards.length})
        </Button>
        )}
      </div>

      <div style={boardsGridStyles}>
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} isSelected={selectedBoards.includes(board.id)}  onSelect={() => toggleBoardSelection(board.id)}/>
        ))}
        {boards.length === 0 && (
          <p style={emptyStyles}>No boards yet. Create your first board!</p>
        )}
      </div>

      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  )
}
