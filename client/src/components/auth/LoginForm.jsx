import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { AuthLayout } from './AuthLayout.jsx'
import { Input } from '../common/Input.jsx'
import { Button } from '../common/Button.jsx'

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await register(username, password)
      }
      navigate('/boards')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
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

  const toggleStyles = {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  }

  const hintStyles = {
    textAlign: 'center',
    marginTop: '15px',
    color: '#999',
    fontSize: '12px',
  }

  return (
    <AuthLayout title="Tldraw Boards" subtitle={isLogin ? 'Login' : 'Register'}>
      {error && <div style={errorStyles}>{error}</div>}

      <form onSubmit={handleSubmit} style={formStyles}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={4}
        />
        <Button type="submit" variant="primary" size="lg">
          {isLogin ? 'Login' : 'Create Account'}
        </Button>
      </form>

      <p style={toggleStyles}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Button 
          variant="link" 
          onClick={() => setIsLogin(!isLogin)}
          style={{ padding: 0, fontSize: '14px' }}
        >
          {isLogin ? 'Register' : 'Login'}
        </Button>
      </p>

      {isLogin && <p style={hintStyles}>Default: admin / admin</p>}
    </AuthLayout>
  )
}
