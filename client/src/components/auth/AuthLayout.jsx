export function AuthLayout({ children, title, subtitle }) {
  const containerStyles = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }

  const cardStyles = {
    background: 'var(--card-bg)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '400px',
  }

  const titleStyles = {
    textAlign: 'center',
    marginBottom: '10px',
    color: 'var(--text-primary)',
  }

  const subtitleStyles = {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'var(--text-secondary)',
    fontWeight: 'normal',
  }

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        {title && <h1 style={titleStyles}>{title}</h1>}
        {subtitle && <h2 style={subtitleStyles}>{subtitle}</h2>}
        {children}
      </div>
    </div>
  )
}
