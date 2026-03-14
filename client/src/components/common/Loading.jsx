export function Loading({ text = 'Loading...', size = 'md' }) {
  const sizes = {
    sm: { fontSize: '14px' },
    md: { fontSize: '18px' },
    lg: { fontSize: '24px' },
  }

  const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#666',
    ...sizes[size],
  }

  return <div style={styles}>{text}</div>
}

export function InlineLoading({ text = 'Loading...' }) {
  const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    color: '#666',
  }

  return <div style={styles}>{text}</div>
}
