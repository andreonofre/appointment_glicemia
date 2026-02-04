/**
 * PONTO DE ENTRADA DA APLICAÇÃO
 * 
 * Renderiza o componente App na DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
