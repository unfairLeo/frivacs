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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartItem } from "@/types/api";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";

interface ChartDisplayProps {
  charts: ChartItem[];
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

const getChartIcon = (type: string) => {
  switch (type) {
    case 'bar':
      return <BarChart3 className="w-4 h-4" />;
    case 'line':
      return <LineChartIcon className="w-4 h-4" />;
    case 'pie':
      return <PieChartIcon className="w-4 h-4" />;
    default:
      return <BarChart3 className="w-4 h-4" />;
  }
};

const renderSingleChart = (chart: ChartItem) => {
  const chartData = chart.data;

  switch (chart.type) {
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

const ChartDisplay = ({ charts }: ChartDisplayProps) => {
  if (charts.length === 0) return null;

  // Single chart - no tabs needed
  if (charts.length === 1) {
    const chart = charts[0];
    return (
      <div className="glass-card p-6 animate-slide-up">
        {chart.title && (
          <h3 className="text-xl font-display font-semibold text-foreground mb-6 text-center">
            {chart.title}
          </h3>
        )}
        {renderSingleChart(chart)}
      </div>
    );
  }

  // Multiple charts - use tabs
  return (
    <div className="glass-card p-6 animate-slide-up">
      <Tabs defaultValue="chart-0" className="w-full">
        <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${charts.length}, 1fr)` }}>
          {charts.map((chart, index) => (
            <TabsTrigger
              key={index}
              value={`chart-${index}`}
              className="flex items-center gap-2"
            >
              {getChartIcon(chart.type)}
              <span className="hidden sm:inline truncate">{chart.title || `Gráfico ${index + 1}`}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {charts.map((chart, index) => (
          <TabsContent key={index} value={`chart-${index}`}>
            {chart.title && (
              <h3 className="text-xl font-display font-semibold text-foreground mb-6 text-center">
                {chart.title}
              </h3>
            )}
            {renderSingleChart(chart)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ChartDisplay;
