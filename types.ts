
export enum CropType {
  Rice = 'Rice',
  Cowpea = 'Cowpea',
  Maize = 'Maize',
  Cassava = 'Cassava'
}

export interface PlotCoordinate {
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

export interface FarmPlot {
  id: string;
  name: string;
  boundary: PlotCoordinate[];
  areaHectares: number;
  center: PlotCoordinate;
}

export interface SimulationState {
  day: number;
  growth: number;
  moisture: number;
  pests: number;
  nutrients: number;
  cmlAttenuation: number;
  rainfallRate: number;
  isRaining: boolean;
  yieldQuality: number;
  temperature: number;
}

export interface MNOConfig {
  provider: 'MTN' | 'Airtel' | 'Glo' | '9mobile';
  endpoint: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
}

export interface RawTelemetry {
  linkId: string;
  tsl: number; // Transmitted Signal Level (dBm)
  rsl: number; // Received Signal Level (dBm)
  frequency: number; // GHz
  distance: number; // km
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  cmlSignalStrength: number;
  timestamp: string;
}

export interface Advisory {
  id: string;
  title: string;
  category: 'Irrigation' | 'Planting' | 'Pest Control' | 'Harvest';
  content: string;
  urgency: 'Low' | 'Medium' | 'High';
}
