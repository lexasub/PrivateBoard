import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { Button } from '../common/Button.jsx'
import { boardService } from '../../services/board.service.js'

export function BoardCard({ board, isSelected, onSelect }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const cardStyles = {
    background: 'var(--card-bg)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
  }

  const metaStyles = {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginTop: '5px',
  }

  const badgeStyles = {
    display: 'inline-block',
    background: 'var(--indicator-bg)',
    color: 'var(--text-secondary)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    marginTop: '5px',
  }

  const shareBtnStyles = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '5px 10px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  }

  const deleteBtnStyles = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '5px 10px',
    background: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm(`Delete board "${board.name}"?`)) return
    try {
      await boardService.deleteBoard(board.id)
      window.location.reload()
    } catch (err) {
      console.error('Failed to delete board', err)
    }
  }

  const checkboxStyles = {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
    transform: 'scale(1.5)', 
    cursor: 'pointer',
    zIndex: 10, 
  }

  return (
    <div
      style={cardStyles}
      onClick={() => navigate(`/board/${board.id}`)}
    >
      <h3>{board.name}</h3>
      <p style={metaStyles}>Owner: {board.owner_username}</p>
      <p style={metaStyles}>
        Updated: {new Date(board.updated_at).toLocaleString()}
      </p>
      {board.access_type === 'shared' && (
        <span style={badgeStyles}>Shared ({board.permission_level})</span>
      )}
      {(board.access_type === 'owner' || user?.role === 'admin') && (
        <>
        <input 
          type="checkbox" 
          checked={isSelected}
          style={checkboxStyles}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation(); 
            onSelect();
          }}
        />
          <Button
            variant="primary"
            size="sm"
            style={shareBtnStyles}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/board/${board.id}/share`)
            }}
          >
            Share
          </Button>
          <Button
            variant="danger"
            size="sm"
            style={deleteBtnStyles}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  )
}
