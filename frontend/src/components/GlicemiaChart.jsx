/**
 * COMPONENTE GLICEMIACHART
 * 
 * Gráfico de linha mostrando evolução das glicemias.
 * Usa biblioteca Recharts.
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import './GlicemiaChart.css';

function GlicemiaChart({ data }) {
  /**
   * Prepara dados para o gráfico
   */
  const prepareChartData = () => {
    if (!data || data.length === 0) return [];

    return data
      .map(item => ({
        data: new Date(item.data_hora).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        hora: new Date(item.data_hora).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        valor: item.valor,
        categoria: item.categoria,
      }))
      .reverse();
  };

  const chartData = prepareChartData();

  /**
   * Tooltip personalizado
   */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{data.data} às {data.hora}</p>
          <p className="tooltip-value">
            <strong>{data.valor} mg/dL</strong>
          </p>
          <p className="tooltip-categoria">{data.categoria.replace('-', ' ')}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível para exibir</p>
      </div>
    );
  }

  return (
    <div className="glicemia-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          <XAxis 
            dataKey="data" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 300]}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Linhas de referência */}
          <ReferenceLine 
            y={70} 
            stroke="#e74c3c" 
            strokeDasharray="3 3" 
            label={{ value: 'Baixo', position: 'right', fill: '#e74c3c' }}
          />
          <ReferenceLine 
            y={180} 
            stroke="#f39c12" 
            strokeDasharray="3 3"
            label={{ value: 'Alto', position: 'right', fill: '#f39c12' }}
          />
          
          {/* Linha principal */}
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="#2D9A9A" 
            strokeWidth={3}
            dot={{ fill: '#2D9A9A', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GlicemiaChart;
