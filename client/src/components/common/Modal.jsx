export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = '400px'
}) {
  if (!isOpen) return null

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  }

  const modalStyles = {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '100%',
    maxWidth,
  }

  const titleStyles = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  }

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        {title && <h2 style={titleStyles}>{title}</h2>}
        {children}
      </div>
    </div>
  )
}

export function ModalActions({ children, style: customStyle }) {
  const baseStyles = {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  }

  const style = { ...baseStyles, ...customStyle }

  return <div style={style}>{children}</div>
}
