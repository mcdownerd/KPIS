import { ElectricityReading, ElectricityRates, WaterReading, DailyCosts } from "@/types/utilities";

export const electricityRates: ElectricityRates = {
  sVazia: 0.03425,
  vazia: 0.0375,
  ponta: 0.0571,
  cheia: 0.052,
};

export const calculateElectricityCost = (
  currentReading: ElectricityReading,
  previousReading: ElectricityReading | null
): number => {
  if (!previousReading) return 0;

  const vaziaUsed = (currentReading.vazia || 0) - (previousReading.vazia || 0);
  const pontaUsed = (currentReading.ponta || 0) - (previousReading.ponta || 0);
  const cheiaUsed = (currentReading.cheia || 0) - (previousReading.cheia || 0);
  const sVaziaUsed = (currentReading.sVazia || 0) - (previousReading.sVazia || 0);

  const cost =
    vaziaUsed * electricityRates.vazia +
    pontaUsed * electricityRates.ponta +
    cheiaUsed * electricityRates.cheia +
    sVaziaUsed * electricityRates.sVazia;

  return cost;
};

export const calculateWaterCost = (
  currentReading: WaterReading,
  previousReading: WaterReading | null,
  pricePerM3: number
): { m3Used: number; cost: number } => {
  if (!previousReading || !currentReading.reading || !previousReading.reading) {
    return { m3Used: 0, cost: 0 };
  }

  const m3Used = currentReading.reading - previousReading.reading;
  const cost = m3Used * pricePerM3;

  return { m3Used, cost };
};

export const calculateDailyCosts = (
  electricityReadings: ElectricityReading[],
  waterReadings: WaterReading[],
  waterPricePerM3: number
): DailyCosts[] => {
  const dailyCosts: DailyCosts[] = [];
  let accumulatedElectricity = 0;
  let accumulatedWater = 0;

  for (let i = 0; i < 31; i++) {
    const day = i + 1;
    const currentElecReading = electricityReadings[i];
    const previousElecReading = i > 0 ? electricityReadings[i - 1] : null;
    const currentWaterReading = waterReadings[i];
    const previousWaterReading = i > 0 ? waterReadings[i - 1] : null;

    const electricityCost = calculateElectricityCost(currentElecReading, previousElecReading);
    const { cost: waterCost } = calculateWaterCost(currentWaterReading, previousWaterReading, waterPricePerM3);

    accumulatedElectricity += electricityCost;
    accumulatedWater += waterCost;

    dailyCosts.push({
      day,
      electricityCost,
      waterCost,
      totalCost: electricityCost + waterCost,
      accumulatedElectricity,
      accumulatedWater,
      accumulatedTotal: accumulatedElectricity + accumulatedWater,
    });
  }

  return dailyCosts;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
};
