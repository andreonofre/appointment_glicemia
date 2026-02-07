/**
 * COMPONENTE GLICEMIACHART
 * 
 * Gráfico de linha mostrando evolução das glicemias.
 * Usa biblioteca Recharts.
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter } from 'recharts';
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
        medicamentos: item.medicamentos,
        temMedicamento: item.medicamentos ? item.valor : null, // Para mostrar ponto especial
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
          {data.medicamentos && (
            <p className="tooltip-medicamento">
              💊 {data.medicamentos}
            </p>
          )}
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
            stroke="#E8A8B8" 
            strokeDasharray="3 3" 
            label={{ value: 'Baixo', position: 'right', fill: '#E8A8B8' }}
          />
          <ReferenceLine 
            y={180} 
            stroke="#F5A862" 
            strokeDasharray="3 3"
            label={{ value: 'Alto', position: 'right', fill: '#F5A862' }}
          />
          
          {/* Linha principal */}
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="#7BCCC4" 
            strokeWidth={3}
            dot={{ fill: '#7BCCC4', r: 5 }}
            activeDot={{ r: 7 }}
          />
          
          {/* Pontos especiais para medicamentos */}
          <Scatter 
            dataKey="temMedicamento" 
            fill="#E8A8B8" 
            shape="circle"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GlicemiaChart;
