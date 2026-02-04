/**
 * COMPONENTE STATSCARD
 * 
 * Cartão de estatística reutilizável.
 */

import './StatsCard.css';

function StatsCard({ icon, label, value, unit, color = 'primary' }) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <div className="stats-value">
          <span className="stats-number">{value}</span>
          {unit && <span className="stats-unit">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
