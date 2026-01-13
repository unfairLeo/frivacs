import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartData } from "@/types/api";

interface ChartDisplayProps {
  tipo: 'bar' | 'pie' | 'line';
  titulo?: string;
  dados: ChartData;
}

const NEON_COLORS = [
  "hsl(160, 84%, 39%)",  // Emerald
  "hsl(270, 91%, 65%)",  // Purple
  "hsl(180, 84%, 45%)",  // Cyan
  "hsl(320, 91%, 60%)",  // Pink
  "hsl(45, 93%, 55%)",   // Gold
  "hsl(200, 91%, 55%)",  // Blue
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(payload[0].value);

    return (
      <div className="glass-card px-4 py-3 border border-primary/30">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-primary">{value}</p>
      </div>
    );
  }
  return null;
};

const ChartDisplay = ({ tipo, titulo, dados }: ChartDisplayProps) => {
  const chartData = dados.labels.map((label, index) => ({
    name: label,
    value: dados.valores[index],
  }));

  const renderChart = () => {
    switch (tipo) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" />
              <XAxis
                dataKey="name"
                stroke="hsl(220, 10%, 55%)"
                tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="hsl(220, 10%, 55%)"
                tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="hsl(160, 84%, 39%)"
                radius={[8, 8, 0, 0]}
                style={{
                  filter: 'drop-shadow(0 0 8px hsl(160 84% 39% / 0.5))',
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" />
              <XAxis
                dataKey="name"
                stroke="hsl(220, 10%, 55%)"
                tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="hsl(220, 10%, 55%)"
                tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={3}
                dot={{
                  fill: 'hsl(160, 84%, 39%)',
                  strokeWidth: 2,
                  r: 6,
                }}
                activeDot={{
                  r: 8,
                  fill: 'hsl(270, 91%, 65%)',
                  stroke: 'hsl(270, 91%, 65%)',
                  strokeWidth: 2,
                }}
                style={{
                  filter: 'drop-shadow(0 0 8px hsl(160 84% 39% / 0.5))',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{
                  stroke: 'hsl(220, 10%, 55%)',
                }}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={NEON_COLORS[index % NEON_COLORS.length]}
                    style={{
                      filter: `drop-shadow(0 0 8px ${NEON_COLORS[index % NEON_COLORS.length]}80)`,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                formatter={(value) => (
                  <span style={{ color: 'hsl(220, 10%, 55%)' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      {titulo && (
        <h3 className="text-xl font-display font-semibold text-foreground mb-6 text-center">
          {titulo}
        </h3>
      )}
      {renderChart()}
    </div>
  );
};

export default ChartDisplay;
