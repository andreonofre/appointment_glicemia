/**
 * COMPONENTE FOOTER
 * 
 * Rodapé com copyright para páginas privadas
 */

import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">
          © {currentYear} Glico - Autocuidado em Diabetes. Todos os direitos reservados.
        </p>
        <p className="footer-doctor">
          Dra. Ysis Mota
        </p>
      </div>
    </footer>
  );
}

export default Footer;
