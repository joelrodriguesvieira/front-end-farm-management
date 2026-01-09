export type SensorData = {
  _id?: string;
  temperature: number;
  humidity: number;
  luminosity?: number;
  rationWeight?: number;
  waterLevel?: number;
  lastSeen: string;
  createdAt?: string;
  updatedAt?: string;
};

export const mockSensorsCurrent: SensorData = {
  _id: "sensor_001",
  temperature: 23.5,
  humidity: 62.3,
  luminosity: 450,
  rationWeight: 45.2,
  waterLevel: 87.5,
  lastSeen: new Date().toISOString(),
  createdAt: new Date(Date.now() - 60000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockSensorsHistory: SensorData[] = [
  {
    temperature: 20,
    humidity: 60,
    lastSeen: new Date(Date.now() - 600000).toISOString(),
  },
  {
    temperature: 21,
    humidity: 61,
    lastSeen: new Date(Date.now() - 500000).toISOString(),
  },
  {
    temperature: 22,
    humidity: 62,
    lastSeen: new Date(Date.now() - 400000).toISOString(),
  },
  {
    temperature: 23,
    humidity: 63,
    lastSeen: new Date(Date.now() - 300000).toISOString(),
  },
  {
    temperature: 24,
    humidity: 64,
    lastSeen: new Date(Date.now() - 200000).toISOString(),
  },
  { temperature: 23.5, humidity: 62.3, lastSeen: new Date().toISOString() },
];
