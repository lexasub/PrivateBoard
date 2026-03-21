export function Input({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  minLength,
  style: customStyle,
  ...props 
}) {
  const baseStyles = {
    padding: '12px',
    border: '2px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    width: '100%',
    boxSizing: 'border-box',
  }

  const style = { ...baseStyles, ...customStyle }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      style={style}
      {...props}
    />
  )
}

export function Select({ 
  value, 
  onChange, 
  children, 
  required = false,
  style: customStyle,
  ...props 
}) {
  const baseStyles = {
    padding: '8px',
    border: '2px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  }

  const style = { ...baseStyles, ...customStyle }

  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      style={style}
      {...props}
    >
      {children}
    </select>
  )
}
