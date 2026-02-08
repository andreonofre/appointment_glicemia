/**
 * COMPONENTE SIDEBAR
 * 
 * Menu lateral de navegação com ícones e responsividade mobile.
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Clock, BarChart3, FileText, LogOut, Droplet, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { Icon: LayoutDashboard, label: 'Painel', path: '/painel' },
    { Icon: User, label: 'Perfil', path: '/perfil' },
    { Icon: Activity, label: 'Registrar', path: '/registrar' },
    { Icon: Clock, label: 'Histórico', path: '/historico' },
    { Icon: BarChart3, label: 'Gráficos', path: '/graficos' },
    { Icon: FileText, label: 'Relatórios', path: '/relatorios' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Botão hambúrguer (mobile) */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Droplet size={32} className="logo-icon" />
            <h2>Glico</h2>
          </div>
          <p className="sidebar-subtitle">Autocuidado em Diabetes</p>
        </div>

        {/* Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) => 
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <item.Icon size={20} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer com usuário */}
        <div className="sidebar-footer">
          {/* Nome da Doutora */}
          <div className="doutora-info">
            <div className="doutora-icon">❤️</div>
            <div className="doutora-details">
              <p className="doutora-nome">Dra. Ysis Mota</p>
              <p className="doutora-especialidade">Médica da Família</p>
            </div>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {user?.nome?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.nome || user?.email?.split('@')[0] || 'Usuário'}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button 
            className="btn-logout" 
            onClick={logout}
            title="Sair"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
