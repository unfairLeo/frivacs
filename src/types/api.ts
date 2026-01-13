export interface MetricItem {
  label: string;
  value: string;
  icon?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChartItem {
  type: 'bar' | 'pie' | 'line';
  title: string;
  data: ChartDataPoint[];
}

export interface ApiResponse {
  title?: string;
  metrics?: MetricItem[];
  charts?: ChartItem[];
  conversation?: string;
}

// Legacy types for backwards compatibility
export interface ChartData {
  labels: string[];
  valores: number[];
}
