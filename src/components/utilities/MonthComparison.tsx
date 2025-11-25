import { useState } from "react";
import { MonthlyData } from "@/types/utilities";
import { calculateDailyCosts, formatCurrency } from "@/utils/utilitiesCalculations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface MonthComparisonProps {
  allMonthsData: Record<string, MonthlyData>;
  months: string[];
}

export function MonthComparison({ allMonthsData, months }: MonthComparisonProps) {
  const [month1, setMonth1] = useState<string>("");
  const [month2, setMonth2] = useState<string>("");

  const availableMonths = Object.keys(allMonthsData).sort();

  const getMonthData = (monthKey: string) => {
    const data = allMonthsData[monthKey];
    if (!data) return null;

    const costs = calculateDailyCosts(
      data.electricityReadings,
      data.waterReadings,
      data.waterPricePerM3
    );

    const lastDay = costs[costs.length - 1];

    return {
      data,
      totalElectricity: lastDay?.accumulatedElectricity || 0,
      totalWater: lastDay?.accumulatedWater || 0,
      total: lastDay?.accumulatedTotal || 0,
      avgDaily: (lastDay?.accumulatedTotal || 0) / 31,
    };
  };

  const month1Data = month1 ? getMonthData(month1) : null;
  const month2Data = month2 ? getMonthData(month2) : null;

  const calculateVariation = (value1: number, value2: number) => {
    if (value2 === 0) return 0;
    return ((value1 - value2) / value2) * 100;
  };

  const formatVariation = (variation: number) => {
    const formatted = Math.abs(variation).toFixed(1);
    const isPositive = variation > 0;
    const isNeutral = Math.abs(variation) < 0.1;

    return (
      <div className={`flex items-center gap-1 ${isNeutral ? 'text-muted-foreground' : isPositive ? 'text-destructive' : 'text-green-600'}`}>
        {isNeutral ? (
          <Minus className="h-4 w-4" />
        ) : isPositive ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
        <span className="font-medium">{formatted}%</span>
      </div>
    );
  };

  const getMonthLabel = (monthKey: string) => {
    const [year, monthIndex] = monthKey.split('-');
    return `${months[parseInt(monthIndex)]} ${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Primeiro Mês</label>
          <Select value={month1} onValueChange={setMonth1}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um mês" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((key) => (
                <SelectItem key={key} value={key}>
                  {getMonthLabel(key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Segundo Mês</label>
          <Select value={month2} onValueChange={setMonth2}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um mês" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((key) => (
                <SelectItem key={key} value={key}>
                  {getMonthLabel(key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {month1Data && month2Data && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Comparativo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Métrica</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {getMonthLabel(month1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {getMonthLabel(month2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">Eletricidade</div>
                    <div>{formatCurrency(month1Data.totalElectricity)}</div>
                    <div className="flex items-center justify-between">
                      <span>{formatCurrency(month2Data.totalElectricity)}</span>
                      {formatVariation(
                        calculateVariation(month1Data.totalElectricity, month2Data.totalElectricity)
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">Água</div>
                    <div>{formatCurrency(month1Data.totalWater)}</div>
                    <div className="flex items-center justify-between">
                      <span>{formatCurrency(month2Data.totalWater)}</span>
                      {formatVariation(calculateVariation(month1Data.totalWater, month2Data.totalWater))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">Total</div>
                    <div className="text-lg font-bold">{formatCurrency(month1Data.total)}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{formatCurrency(month2Data.total)}</span>
                      {formatVariation(calculateVariation(month1Data.total, month2Data.total))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">Média Diária</div>
                    <div>{formatCurrency(month1Data.avgDaily)}</div>
                    <div className="flex items-center justify-between">
                      <span>{formatCurrency(month2Data.avgDaily)}</span>
                      {formatVariation(calculateVariation(month1Data.avgDaily, month2Data.avgDaily))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diferença Absoluta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Diferença Eletricidade</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(Math.abs(month1Data.totalElectricity - month2Data.totalElectricity))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Diferença Água</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(Math.abs(month1Data.totalWater - month2Data.totalWater))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Diferença Total</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(Math.abs(month1Data.total - month2Data.total))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Diferença Média Diária</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(Math.abs(month1Data.avgDaily - month2Data.avgDaily))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações dos Gestores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">{getMonthLabel(month1)}</h4>
                  <div className="space-y-1 text-sm">
                    <p>Manhã: {month1Data.data.managerMorning || "—"}</p>
                    <p>Noite: {month1Data.data.managerNight || "—"}</p>
                    <p>Preço Água: {formatCurrency(month1Data.data.waterPricePerM3)}/m³</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{getMonthLabel(month2)}</h4>
                  <div className="space-y-1 text-sm">
                    <p>Manhã: {month2Data.data.managerMorning || "—"}</p>
                    <p>Noite: {month2Data.data.managerNight || "—"}</p>
                    <p>Preço Água: {formatCurrency(month2Data.data.waterPricePerM3)}/m³</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {(!month1Data || !month2Data) && (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Selecione dois meses para visualizar a comparação
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
