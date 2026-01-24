import { useMemo } from "react";
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
  "hsl(270, 91%, 65%)",  // Purple (primary for bars)
  "hsl(160, 84%, 39%)",  // Emerald
  "hsl(180, 84%, 45%)",  // Cyan
  "hsl(320, 91%, 60%)",  // Pink
  "hsl(45, 93%, 55%)",   // Gold
  "hsl(200, 91%, 55%)",  // Blue
];

// Starfield background component
const StarfieldBackground = () => {
  const stars = useMemo(() => 
    [...Array(40)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      opacity: Math.random() * 0.6 + 0.2,
      size: Math.random() > 0.8 ? 2 : 1,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse-slow"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};

// Holographic platform component
const HolographicPlatform = () => (
  <div className="absolute bottom-8 left-0 right-0 z-20 pointer-events-none">
    {/* Grid lines */}
    <div 
      className="absolute bottom-0 left-[10%] right-[10%] h-20"
      style={{
        background: `
          linear-gradient(90deg, hsl(200 80% 50% / 0.15) 1px, transparent 1px),
          linear-gradient(hsl(200 80% 50% / 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '30px 15px',
        transform: 'perspective(400px) rotateX(65deg)',
        transformOrigin: 'bottom center',
        maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
      }}
    />
    {/* Glowing edge */}
    <div 
      className="absolute bottom-0 left-[10%] right-[10%] h-1"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, hsl(200 80% 60% / 0.6) 20%, hsl(270 91% 65% / 0.8) 50%, hsl(200 80% 60% / 0.6) 80%, transparent 100%)',
        boxShadow: '0 0 20px hsl(200 80% 50% / 0.5), 0 0 40px hsl(270 91% 65% / 0.3)',
        borderRadius: '50%',
      }}
    />
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(payload[0].value);

    return (
      <div className="glass-card px-4 py-3 border border-purple-500/30 bg-background/95">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-purple-400">{value}</p>
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

const renderBarChart = (chart: ChartItem, uniqueId: string) => {
  const chartData = chart.data;

  return (
    <div className="relative h-[420px] overflow-hidden rounded-lg">
      {/* Layer 1: Starfield background */}
      <StarfieldBackground />
      
      {/* Layer 2: Holographic platform */}
      <HolographicPlatform />
      
      {/* Layer 3: Chart (floating, frontal - no 3D rotation) */}
      <div className="relative z-30 h-full pt-2">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id={`neonPurpleGradient-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(280, 91%, 75%)" />
                <stop offset="40%" stopColor="hsl(270, 91%, 65%)" />
                <stop offset="100%" stopColor="hsl(260, 91%, 50%)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" />
            <XAxis
              dataKey="name"
              stroke="hsl(220, 10%, 55%)"
              tick={{ fill: 'hsl(220, 10%, 70%)', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="hsl(220, 10%, 55%)"
              tick={{ fill: 'hsl(220, 10%, 70%)', fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill={`url(#neonPurpleGradient-${uniqueId})`}
              radius={[8, 8, 0, 0]}
              style={{
                filter: 'drop-shadow(0 0 12px hsl(270 91% 65% / 0.6))',
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const renderLineChart = (chart: ChartItem, uniqueId: string) => {
  const chartData = chart.data;

  return (
    <div className="relative h-[420px] overflow-hidden rounded-lg">
      <StarfieldBackground />
      <HolographicPlatform />
      
      <div className="relative z-30 h-full pt-2">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id={`neonLineGradient-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(270, 91%, 65%)" />
                <stop offset="50%" stopColor="hsl(200, 91%, 55%)" />
                <stop offset="100%" stopColor="hsl(160, 84%, 45%)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" />
            <XAxis
              dataKey="name"
              stroke="hsl(220, 10%, 55%)"
              tick={{ fill: 'hsl(220, 10%, 70%)', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="hsl(220, 10%, 55%)"
              tick={{ fill: 'hsl(220, 10%, 70%)', fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={`url(#neonLineGradient-${uniqueId})`}
              strokeWidth={3}
              dot={{
                fill: 'hsl(270, 91%, 65%)',
                strokeWidth: 2,
                r: 6,
                stroke: 'hsl(270, 91%, 75%)',
              }}
              activeDot={{
                r: 8,
                fill: 'hsl(200, 91%, 55%)',
                stroke: 'hsl(200, 91%, 65%)',
                strokeWidth: 2,
              }}
              style={{
                filter: 'drop-shadow(0 0 8px hsl(270 91% 65% / 0.5))',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const renderPieChart = (chart: ChartItem, uniqueId: string) => {
  const chartData = chart.data;

  return (
    <div className="relative h-[420px] overflow-hidden rounded-lg">
      <StarfieldBackground />
      
      <div className="relative z-30 h-full">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <defs>
              {NEON_COLORS.map((color, index) => (
                <linearGradient key={index} id={`pieGradient-${uniqueId}-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
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
                  fill={`url(#pieGradient-${uniqueId}-${index % NEON_COLORS.length})`}
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
                <span style={{ color: 'hsl(220, 10%, 70%)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const renderSingleChart = (chart: ChartItem, index: number = 0) => {
  const uniqueId = `chart-${index}-${Date.now()}`;
  
  switch (chart.type) {
    case 'bar':
      return renderBarChart(chart, uniqueId);
    case 'line':
      return renderLineChart(chart, uniqueId);
    case 'pie':
      return renderPieChart(chart, uniqueId);
    default:
      return renderBarChart(chart, uniqueId);
  }
};

const ChartDisplay = ({ charts }: ChartDisplayProps) => {
  // Filter charts with valid data
  const validCharts = charts.filter(chart => 
    chart.data && 
    chart.data.length > 0 && 
    chart.data.some(point => point.value > 0)
  );

  if (validCharts.length === 0) return null;

  // Single chart - no tabs needed
  if (validCharts.length === 1) {
    const chart = validCharts[0];
    return (
      <div className="glass-card p-6 animate-slide-up overflow-hidden">
        {chart.title && (
          <h3 className="text-xl font-display font-semibold text-foreground mb-4 text-center relative z-40">
            {chart.title}
          </h3>
        )}
        {renderSingleChart(chart, 0)}
      </div>
    );
  }

  // Multiple charts - use tabs
  return (
    <div className="glass-card p-6 animate-slide-up overflow-hidden">
      <Tabs defaultValue="chart-0" className="w-full">
        <TabsList className="grid w-full mb-6 relative z-40" style={{ gridTemplateColumns: `repeat(${validCharts.length}, 1fr)` }}>
          {validCharts.map((chartItem, index) => (
            <TabsTrigger
              key={index}
              value={`chart-${index}`}
              className="flex items-center gap-2"
            >
              {getChartIcon(chartItem.type)}
              <span className="hidden sm:inline truncate">{chartItem.title || `Gráfico ${index + 1}`}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {validCharts.map((chartItem, index) => (
          <TabsContent key={index} value={`chart-${index}`}>
            {chartItem.title && (
              <h3 className="text-xl font-display font-semibold text-foreground mb-4 text-center relative z-40">
                {chartItem.title}
              </h3>
            )}
            {renderSingleChart(chartItem, index)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ChartDisplay;
