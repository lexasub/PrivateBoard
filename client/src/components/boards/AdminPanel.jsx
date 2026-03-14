import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { boardService } from '../../services/board.service.js'
import { Button } from '../common/Button.jsx'
import { Select } from '../common/Input.jsx'

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [boards, setBoards] = useState([])
  const [selectedUserFilter, setSelectedUserFilter] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/boards')
      return
    }
    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [usersRes, boardsRes] = await Promise.all([
        boardService.getAllUsers(),
        boardService.getAllBoardsAdmin()
      ])
      setUsers(usersRes)
      setBoards(boardsRes)
    } catch (err) {
      setError('Failed to load admin data')
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await boardService.updateUserRole(userId, newRole)
      setSuccess(`User role updated to ${newRole}`)
      loadData()
    } catch (err) {
      setError('Failed to update role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user? All their boards will be deleted.')) return
    try {
      await boardService.deleteUser(userId)
      setSuccess('User deleted')
      loadData()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user')
    }
  }

  const handleDeleteBoard = async (boardId) => {
    if (!confirm('Delete this board?')) return
    try {
      await boardService.deleteBoardAdmin(boardId)
      setSuccess('Board deleted')
      loadData()
    } catch (err) {
      setError('Failed to delete board')
    }
  }

  const filteredBoards = selectedUserFilter
    ? boards.filter(b => b.owner_id === selectedUserFilter)
    : boards

  const pageStyles = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  }

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  }

  const userInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }

  const errorStyles = {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  }

  const successStyles = {
    background: '#efe',
    color: '#3c3',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  }

  const tabsStyles = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '10px',
  }

  const tabStyles = {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#666',
  }

  const activeTabStyles = {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    fontSize: '16px',
  }

  const tabContentStyles = {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
  }

  const thStyles = {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #e0e0e0',
    color: '#666',
    fontSize: '14px',
  }

  const tdStyles = {
    padding: '12px',
    borderBottom: '1px solid #e0e0e0',
  }

  const filterSectionStyles = {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }

  const emptyStyles = {
    color: '#666',
    textAlign: 'center',
    padding: '40px',
  }

  return (
    <div style={pageStyles}>
      <header style={headerStyles}>
        <h1>Admin Panel</h1>
        <div style={userInfoStyles}>
          <span>Admin: {user?.username}</span>
          <Button variant="secondary" onClick={() => navigate('/boards')}>
            Back to Boards
          </Button>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {error && <div style={errorStyles}>{error}</div>}
      {success && <div style={successStyles}>{success}</div>}

      <div style={tabsStyles}>
        <button
          onClick={() => setActiveTab('users')}
          style={activeTab === 'users' ? activeTabStyles : tabStyles}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('boards')}
          style={activeTab === 'boards' ? activeTabStyles : tabStyles}
        >
          All Boards
        </button>
      </div>

      {activeTab === 'users' && (
        <div style={tabContentStyles}>
          <h2>Manage Users</h2>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Username</th>
                <th style={thStyles}>Role</th>
                <th style={thStyles}>Created</th>
                <th style={thStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={tdStyles}>{u.username}</td>
                  <td style={tdStyles}>
                    <Select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </td>
                  <td style={tdStyles}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={tdStyles}>
                    {u.id !== user?.id && (
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'boards' && (
        <div style={tabContentStyles}>
          <h2>All Boards</h2>
          <div style={filterSectionStyles}>
            <label>Filter by user: </label>
            <Select
              value={selectedUserFilter}
              onChange={(e) => setSelectedUserFilter(e.target.value)}
            >
              <option value="">All users</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </Select>
          </div>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Board Name</th>
                <th style={thStyles}>Owner</th>
                <th style={thStyles}>Created</th>
                <th style={thStyles}>Updated</th>
                <th style={thStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoards.map(b => (
                <tr key={b.id}>
                  <td style={tdStyles}>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate(`/board/${b.id}`)}
                    >
                      {b.name}
                    </Button>
                  </td>
                  <td style={tdStyles}>{b.owner_username}</td>
                  <td style={tdStyles}>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td style={tdStyles}>{new Date(b.updated_at).toLocaleDateString()}</td>
                  <td style={tdStyles}>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteBoard(b.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBoards.length === 0 && (
            <p style={emptyStyles}>No boards found</p>
          )}
        </div>
      )}
    </div>
  )
}
