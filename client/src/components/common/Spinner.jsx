export function Spinner({ size = 40, color = '#667eea' }) {
  const containerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  }

  const spinnerStyles = {
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid rgba(102, 126, 234, 0.1)`,
    borderTop: `4px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }

  return (
    <div style={containerStyles}>
      <div style={spinnerStyles} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
