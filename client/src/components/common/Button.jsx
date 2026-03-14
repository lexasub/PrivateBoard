export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'md',
  style: customStyle,
  disabled = false,
  ...props 
}) {
  const baseStyles = {
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.3s',
    fontSize: '14px',
    opacity: disabled ? 0.6 : 1,
  }

  const variants = {
    primary: { background: '#667eea', color: 'white' },
    secondary: { background: '#f1f2f6', color: '#333' },
    success: { background: '#2ed573', color: 'white' },
    danger: { background: '#ff4757', color: 'white' },
    warning: { background: '#ffa502', color: 'white' },
    link: { background: 'none', color: '#667eea', textDecoration: 'underline' },
  }

  const sizes = {
    sm: { padding: '5px 10px', fontSize: '12px' },
    md: { padding: '12px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
  }

  const style = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    ...customStyle,
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      style={style} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
