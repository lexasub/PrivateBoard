export function Sidebar({ isOpen, onClose, children }) {
  const sidebarStyles = {
    position: 'fixed',
    left: isOpen ? 0 : '-250px',
    top: 0,
    bottom: 0,
    width: '250px',
    background: '#1a1a2e',
    color: 'white',
    padding: '20px',
    transition: 'left 0.3s ease',
    zIndex: 1000,
    overflowY: 'auto',
  }

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    display: isOpen ? 'block' : 'none',
  }

  const closeBtnStyles = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
  }

  return (
    <>
      <div style={overlayStyles} onClick={onClose} />
      <div style={sidebarStyles}>
        <button style={closeBtnStyles} onClick={onClose}>×</button>
        {children}
      </div>
    </>
  )
}

export function SidebarItem({ icon, label, onClick, active = false }) {
  const itemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    background: active ? '#667eea' : 'transparent',
    marginBottom: '5px',
  }

  return (
    <div style={itemStyles} onClick={onClick}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
