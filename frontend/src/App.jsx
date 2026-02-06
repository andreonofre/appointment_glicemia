/**
 * COMPONENTE PRINCIPAL DA APLICAÇÃO
 * 
 * Configura rotas e provedores de contexto.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyCode from './pages/VerifyCode';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Registrar from './pages/Registrar';
import Historico from './pages/Historico';
import Graficos from './pages/Graficos';
import Relatorios from './pages/Relatorios';
import './styles/global.css';

/**
 * Componente para proteger rotas privadas
 */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

/**
 * Componente para rotas públicas (só acessa se NÃO estiver logado)
 */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/painel" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/cadastro" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/verify-code" 
            element={
              <PublicRoute>
                <VerifyCode />
              </PublicRoute>
            } 
          />
          
          {/* Rota de callback do OAuth */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Rotas privadas */}
          <Route 
            path="/painel" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/registrar" 
            element={
              <PrivateRoute>
                <Registrar />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/historico" 
            element={
              <PrivateRoute>
                <Historico />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/graficos" 
            element={
              <PrivateRoute>
                <Graficos />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/relatorios" 
            element={
              <PrivateRoute>
                <Relatorios />
              </PrivateRoute>
            } 
          />

          {/* Redireciona raiz para login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
