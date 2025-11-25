import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChildDetails from './pages/ChildDetails';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import { Box } from '@mui/material';

function AppLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/child/:childId"
                element={
                  <ProtectedRoute>
                    <ChildDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    
  );
}

export default App;
