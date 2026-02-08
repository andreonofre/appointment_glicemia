/**
 * COMPONENTE FOOTER
 * 
 * Rodapé com copyright e links para políticas
 */

import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-main">
          <p className="footer-text">
            © {currentYear} Glico - Autocuidado em Diabetes. Todos os direitos reservados.
          </p>
          <p className="footer-doctor">
            Dra. Ysis Mota
          </p>
        </div>
        <div className="footer-links">
          <Link to="/termos-uso" className="footer-link">
            Termos de Uso
          </Link>
          <span className="footer-separator">•</span>
          <Link to="/politica-privacidade" className="footer-link">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
