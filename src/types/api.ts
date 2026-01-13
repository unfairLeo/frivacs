export interface ChartData {
  labels: string[];
  valores: number[];
}

export interface ApiResponse {
  tipo: 'bar' | 'pie' | 'line' | null;
  titulo?: string;
  texto?: string;
  total?: number;
  dados?: ChartData;
}
