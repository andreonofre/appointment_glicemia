/**
 * COMPONENTE INTERVALOSCHART
 * 
 * Gráfico de barras mostrando tempo nos intervalos.
 */

import './IntervalosChart.css';

function IntervalosChart({ stats }) {
  if (!stats) {
    return (
      <div className="chart-empty">
        <p>Carregando...</p>
      </div>
    );
  }

  const total = stats.total_medicoes || 1;
  const noAlvo = stats.no_alvo || 0;
  const alto = stats.hiperglicemias || 0;
  const baixo = stats.hipoglicemias || 0;

  const percentNoAlvo = Math.round((noAlvo / total) * 100) || 0;
  const percentAlto = Math.round((alto / total) * 100) || 0;
  const percentBaixo = Math.round((baixo / total) * 100) || 0;

  return (
    <div className="intervalos-chart">
      {/* Gráfico de barras vertical */}
      <div className="bar-chart">
        {/* Barra No Alvo */}
        <div className="bar-container">
          <div 
            className="bar bar-success"
            style={{ height: `${percentNoAlvo}%` }}
          >
            <span className="bar-label">{percentNoAlvo}%</span>
          </div>
        </div>

        {/* Barra Alto */}
        <div className="bar-container">
          <div 
            className="bar bar-warning"
            style={{ height: `${percentAlto}%` }}
          >
            <span className="bar-label">{percentAlto}%</span>
          </div>
        </div>

        {/* Barra Muito Alto/Baixo */}
        <div className="bar-container">
          <div 
            className="bar bar-danger"
            style={{ height: `${percentBaixo}%` }}
          >
            <span className="bar-label">{percentBaixo}%</span>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="intervalos-legend">
        <div className="legend-item">
          <div className="legend-dot legend-dot-success"></div>
          <div className="legend-text">
            <span className="legend-label">No alvo</span>
            <span className="legend-range">70-180 mg/dL</span>
            <span className="legend-count">{noAlvo} medições</span>
          </div>
        </div>

        <div className="legend-item">
          <div className="legend-dot legend-dot-warning"></div>
          <div className="legend-text">
            <span className="legend-label">Alto</span>
            <span className="legend-range">181-250 mg/dL</span>
            <span className="legend-count">{alto} medições</span>
          </div>
        </div>

        <div className="legend-item">
          <div className="legend-dot legend-dot-danger"></div>
          <div className="legend-text">
            <span className="legend-label">Muito alto/baixo</span>
            <span className="legend-range">&gt;250 ou &lt;70 mg/dL</span>
            <span className="legend-count">{baixo} medições</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="meta-info">
        <p>Meta: &gt;70% no alvo (70-180 mg/dL)</p>
      </div>
    </div>
  );
}

export default IntervalosChart;
