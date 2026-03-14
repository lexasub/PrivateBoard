import { useState } from 'react'
import { Modal, ModalActions } from '../common/Modal.jsx'
import { Input } from '../common/Input.jsx'
import { Button } from '../common/Button.jsx'
import axios from 'axios'

export function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters')
      return
    }

    try {
      await axios.put('/api/auth/password', { currentPassword, newPassword })
      setSuccess('Password changed successfully!')
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password')
    }
  }

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      {error && <div style={errorStyles}>{error}</div>}
      {success && <div style={successStyles}>{success}</div>}

      <form onSubmit={handleSubmit} style={formStyles}>
        <Input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={4}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={4}
        />
        <ModalActions>
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" style={{ flex: 1 }}>
            Change Password
          </Button>
        </ModalActions>
      </form>
    </Modal>
  )
}
