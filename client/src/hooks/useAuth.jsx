import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { authService } from '../services/auth.service.js'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      authService.getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const user = await authService.login(username, password)
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    setUser(user)
    return user
  }

  const register = async (username, password) => {
    const user = await authService.register(username, password)
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    setUser(user)
    return user
  }

  const logout = () => {
    authService.logout()
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
