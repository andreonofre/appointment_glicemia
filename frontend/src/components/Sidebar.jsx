/**
 * COMPONENTE SIDEBAR
 * 
 * Menu lateral de navegação.
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: '📊', label: 'Painel', path: '/painel' },
    { icon: '➕', label: 'Registrar', path: '/registrar' },
    { icon: '📜', label: 'Histórico', path: '/historico' },
    { icon: '📈', label: 'Gráficos', path: '/graficos' },
    { icon: '📄', label: 'Relatórios', path: '/relatorios' },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🩺</span>
          <h2>Glico</h2>
        </div>
        <p className="sidebar-subtitle">Autocuidado</p>
      </div>

      {/* Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer com usuário */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.nome?.[0]?.toUpperCase() || 'M'}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.nome || 'Usuário'}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button 
          className="btn-logout" 
          onClick={logout}
          title="Sair"
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
