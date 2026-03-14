import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { boardService } from '../../services/board.service.js'
import { Button } from '../common/Button.jsx'
import { Input, Select } from '../common/Input.jsx'

export function ShareBoardPage() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  const [users, setUsers] = useState([])
  const [shares, setShares] = useState([])
  const [shareLinks, setShareLinks] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [permissionLevel, setPermissionLevel] = useState('read')
  const [linkPermission, setLinkPermission] = useState('read')
  const [linkExpiry, setLinkExpiry] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newLink, setNewLink] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [boardRes, usersRes, sharesRes, linksRes] = await Promise.all([
        boardService.getBoard(id),
        boardService.getAllUsers(),
        boardService.getBoardShares(id),
        boardService.getShareLinks(id)
      ])
      setBoard(boardRes)
      setUsers(usersRes)
      setShares(sharesRes)
      setShareLinks(linksRes)
    } catch (err) {
      console.error('Failed to load data', err)
      navigate('/boards')
    }
  }

  const handleShare = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!selectedUser) {
      setError('Please select a user')
      return
    }

    try {
      await boardService.shareBoard(id, selectedUser, permissionLevel)
      setSuccess('Board shared successfully!')
      setSelectedUser('')
      loadData()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to share board')
    }
  }

  const handleRemoveShare = async (userId) => {
    if (!confirm('Remove access for this user?')) return
    try {
      await boardService.removeShare(id, userId)
      setSuccess('Access removed')
      loadData()
    } catch (err) {
      setError('Failed to remove access')
    }
  }

  const handleCreateLink = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setNewLink(null)

    try {
      const expiresDays = linkExpiry ? parseInt(linkExpiry) : null
      const link = await boardService.createShareLink(id, linkPermission, expiresDays)
      setNewLink(link)
      setSuccess('Share link created!')
      loadData()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link')
    }
  }

  const handleDeleteLink = async (tokenId) => {
    if (!confirm('Delete this share link?')) return
    try {
      await boardService.deleteShareLink(id, tokenId)
      setSuccess('Link deleted')
      loadData()
    } catch (err) {
      setError('Failed to delete link')
    }
  }

  const copyLink = (url) => {
    navigator.clipboard.writeText(url)
    setSuccess('Link copied to clipboard!')
  }

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

  const newLinkBoxStyles = {
    background: '#e8f5e9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '2px solid #2ed573',
  }

  const linkRowStyles = {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  }

  const linkInputStyles = {
    flex: 1,
    padding: '10px',
    border: '2px solid #2ed573',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'white',
  }

  const linkInfoStyles = {
    marginTop: '10px',
    color: '#666',
    fontSize: '14px',
  }

  const shareSectionStyles = {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  }

  const shareFormStyles = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  }

  const sharesListStyles = {
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

  const permissionBadgeStyles = {
    background: '#667eea',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    textTransform: 'capitalize',
  }

  const emptyStyles = {
    color: '#666',
    textAlign: 'center',
    padding: '20px',
  }

  if (!board) return <div>Loading...</div>

  return (
    <div style={pageStyles}>
      <header style={headerStyles}>
        <h1>Share: {board.name}</h1>
        <Button variant="secondary" onClick={() => navigate('/boards')}>
          ← Back to Boards
        </Button>
      </header>

      {error && <div style={errorStyles}>{error}</div>}
      {success && <div style={successStyles}>{success}</div>}

      {newLink && (
        <div style={newLinkBoxStyles}>
          <h3>Share Link Created</h3>
          <div style={linkRowStyles}>
            <input
              type="text"
              value={newLink.shareUrl}
              readOnly
              style={linkInputStyles}
            />
            <Button variant="success" onClick={() => copyLink(newLink.shareUrl)}>
              Copy
            </Button>
          </div>
          <p style={linkInfoStyles}>
            Permission: <strong>{newLink.permissionLevel}</strong>
            {newLink.expiresAt && ` • Expires: ${new Date(newLink.expiresAt).toLocaleDateString()}`}
          </p>
        </div>
      )}

      <div style={shareSectionStyles}>
        <h2>Share with specific user</h2>
        <form onSubmit={handleShare} style={shareFormStyles}>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Select a user...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </Select>
          <Select
            value={permissionLevel}
            onChange={(e) => setPermissionLevel(e.target.value)}
          >
            <option value="read">Read Only</option>
            <option value="write">Can Edit</option>
            <option value="admin">Admin (can share)</option>
          </Select>
          <Button type="submit" variant="success">
            Share Board
          </Button>
        </form>
      </div>

      <div style={sharesListStyles}>
        <h2>Users with Access</h2>
        {shares.length === 0 ? (
          <p style={emptyStyles}>No users have access yet</p>
        ) : (
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Username</th>
                <th style={thStyles}>Permission</th>
                <th style={thStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shares.map(share => (
                <tr key={share.user_id}>
                  <td style={tdStyles}>{share.username}</td>
                  <td style={tdStyles}>
                    <span style={permissionBadgeStyles}>{share.permission_level}</span>
                  </td>
                  <td style={tdStyles}>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRemoveShare(share.user_id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={shareSectionStyles}>
        <h2>Create Share Link</h2>
        <form onSubmit={handleCreateLink} style={shareFormStyles}>
          <Select
            value={linkPermission}
            onChange={(e) => setLinkPermission(e.target.value)}
          >
            <option value="read">Read Only</option>
            <option value="write">Can Edit</option>
            <option value="admin">Admin (can share)</option>
          </Select>
          <Select
            value={linkExpiry}
            onChange={(e) => setLinkExpiry(e.target.value)}
          >
            <option value="">No expiration</option>
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
          </Select>
          <Button type="submit" variant="success">
            Generate Link
          </Button>
        </form>
      </div>

      <div style={sharesListStyles}>
        <h2>Active Share Links</h2>
        {shareLinks.length === 0 ? (
          <p style={emptyStyles}>No share links created yet</p>
        ) : (
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Permission</th>
                <th style={thStyles}>Created</th>
                <th style={thStyles}>Expires</th>
                <th style={thStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shareLinks.map(link => (
                <tr key={link.id}>
                  <td style={tdStyles}>
                    <span style={permissionBadgeStyles}>{link.permission_level}</span>
                  </td>
                  <td style={tdStyles}>{new Date(link.created_at).toLocaleDateString()}</td>
                  <td style={tdStyles}>
                    {link.expires_at
                      ? new Date(link.expires_at).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td style={tdStyles}>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
