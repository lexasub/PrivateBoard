import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { Button } from '../common/Button.jsx'

export function Header({ 
  title, 
  showLogout = true, 
  showAdminPanel = true,
  showChangePassword = true,
  onLogout,
  children 
}) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    onLogout?.()
    navigate('/login')
  }

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid var(--border-color)',
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

  return (
    <header style={headerStyles}>
      <h1>{title}</h1>
      <div style={userInfoStyles}>
        {children}
        <span>
          Welcome, {user?.username}{' '}
          {user?.role === 'admin' && (
            <span style={adminBadgeStyles}>(Admin)</span>
          )}
        </span>
        {showChangePassword && (
          <Button variant="warning" onClick={() => navigate('/boards', { state: { showPasswordModal: true } })}>
            Change Password
          </Button>
        )}
        {showAdminPanel && user?.role === 'admin' && (
          <Button variant="primary" onClick={() => navigate('/admin')}>
            Admin Panel
          </Button>
        )}
        {showLogout && (
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </header>
  )
}

export function EditorHeader({ 
  boardName, 
  boardId, 
  canShare, 
  permission, 
  connectedUsers = [],
  onBack,
  onShare,
  showAutoSave = true
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    onBack?.()
    navigate('/boards')
  }

  const handleShare = () => {
    onShare?.()
    navigate(`/board/${boardId}/share`)
  }

  const headerStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '50px',
    background: 'var(--header-bg)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 9999,
  }

  const permissionIndicatorStyles = {
    background: 'var(--indicator-bg)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  }

  const usersIndicatorStyles = {
    background: 'var(--users-bg)',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    color: 'var(--users-text)',
    fontWeight: '500',
  }

  return (
    <div style={headerStyles}>
      <Button variant="secondary" onClick={handleBack}>
        ← Back
      </Button>
      <h2 style={{ flex: 1, margin: 0 }}>{boardName}</h2>
      {canShare && (
        <Button variant="primary" onClick={handleShare}>
          Share
        </Button>
      )}
      {permission && (
        <span style={permissionIndicatorStyles}>
          {permission === 'admin' ? 'Admin' : permission === 'write' ? 'Can Edit' : 'Read Only'}
        </span>
      )}
      {connectedUsers.length > 0 && (
        <span style={usersIndicatorStyles}>
          👥 {connectedUsers.join(', ')}
        </span>
      )}
      {showAutoSave && (
        <span style={{ color: '#2ed573', fontSize: '14px' }}>Auto-saving...</span>
      )}
    </div>
  )
}
