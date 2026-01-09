export type ConfigData = {
  _id?: string;
  mode: "auto" | "manual";
  lighting: {
    enabled: boolean;
    schedule?: { on: string; off: string };
  };
  fan: {
    enabled: boolean;
    temperature?: { on: number; off: number };
  };
  feeder: {
    enabled: boolean;
    weight?: { min: number; max: number };
  };
  waterPump: {
    enabled: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
};

export const mockConfig: ConfigData = {
  _id: "config_001",
  mode: "auto",
  lighting: {
    enabled: true,
    schedule: { on: "06:00", off: "20:00" },
  },
  fan: {
    enabled: false,
    temperature: { on: 25, off: 20 },
  },
  feeder: {
    enabled: true,
    weight: { min: 2000, max: 5000 },
  },
  waterPump: {
    enabled: true,
  },
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};
