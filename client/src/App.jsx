import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { Loading } from './components/common/Loading.jsx'
import { LoginForm } from './components/auth/LoginForm.jsx'
import { BoardList } from './components/boards/BoardList.jsx'
import { BoardEditor } from './components/boards/BoardEditor.jsx'
import { ShareBoardPage } from './components/boards/ShareBoardPage.jsx'
import { ShareLinkPage } from './components/boards/ShareLinkPage.jsx'
import { AdminPanel } from './components/boards/AdminPanel.jsx'
import NotFound from './components/common/NotFound.jsx'

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />

  return children
}

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/boards" replace />

  return children
}

// Main App - Router only
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/boards" element={
            <ProtectedRoute>
              <BoardList />
            </ProtectedRoute>
          } />
          <Route path="/board/:id" element={
            <ProtectedRoute>
              <BoardEditor />
            </ProtectedRoute>
          } />
          <Route path="/board/:id/share" element={
            <ProtectedRoute>
              <ShareBoardPage />
            </ProtectedRoute>
          } />
          <Route path="/share/:token" element={<ShareLinkPage />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          <Route path="/" element={<Navigate to="/boards" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
