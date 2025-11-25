export interface ElectricityReading {
  day: number;
  vazia: number | null;
  ponta: number | null;
  cheia: number | null;
  sVazia: number | null;
}

export interface WaterReading {
  day: number;
  reading: number | null;
  m3Used: number;
  euroSpent: number;
}

export interface ElectricityRates {
  sVazia: number; // 0.03425
  vazia: number;  // 0.0375
  ponta: number;  // 0.0571
  cheia: number;  // 0.052
}

export interface MonthlyData {
  month: number;
  year: number;
  managerMorning: string;
  managerNight: string;
  electricityReadings: ElectricityReading[];
  waterReadings: WaterReading[];
  waterPricePerM3: number; // 0.70 or 3.02 depending on location
}

export interface DailyCosts {
  day: number;
  electricityCost: number;
  waterCost: number;
  totalCost: number;
  accumulatedElectricity: number;
  accumulatedWater: number;
  accumulatedTotal: number;
}
