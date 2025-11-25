import { useState } from "react";
import { DeliveryDay } from "@/types/delivery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface MonthComparisonProps {
  allMonthsData: Record<string, DeliveryDay[]>;
  months: string[];
}

export function MonthComparison({ allMonthsData, months }: MonthComparisonProps) {
  const [month1, setMonth1] = useState<string>("");
  const [month2, setMonth2] = useState<string>("");

  const availableMonths = Object.keys(allMonthsData).sort();

  const getMonthData = (monthKey: string) => {
    const data = allMonthsData[monthKey];
    if (!data || data.length === 0) return null;

    let totalGCS = 0;
    let totalSales = 0;
    let totalCash = 0;
    let totalMB = 0;
    let totalMBP = 0;
    let totalTrEuro = 0;
    let totalDifference = 0;
    let totalReimbursementQty = 0;
    let totalReimbursementValue = 0;
    let totalShifts = 0;

    data.forEach(day => {
      [...day.morning_shifts, ...day.night_shifts].forEach(shift => {
        totalGCS += shift.gcs;
        totalSales += shift.sales;
        totalCash += shift.cash;
        totalMB += shift.mb;
        totalMBP += shift.mbp;
        totalTrEuro += shift.tr_euro;
        totalDifference += shift.difference;
        totalReimbursementQty += shift.reimbursement_qty;
        totalReimbursementValue += shift.reimbursement_value;
        totalShifts++;
      });
    });

    const avgGCS = totalShifts > 0 ? totalGCS / totalShifts : 0;
    const avgSales = totalShifts > 0 ? totalSales / totalShifts : 0;
    const avgDifference = totalShifts > 0 ? totalDifference / totalShifts : 0;

    return {
      totalGCS,
      totalSales,
      totalCash,
      totalMB,
      totalMBP,
      totalTrEuro,
      totalDifference,
      totalReimbursementQty,
      totalReimbursementValue,
      totalShifts,
      avgGCS,
      avgSales,
      avgDifference,
      daysWithData: data.length
    };
  };

  const month1Data = month1 ? getMonthData(month1) : null;
  const month2Data = month2 ? getMonthData(month2) : null;

  const calculateVariation = (value1: number, value2: number) => {
    if (value2 === 0) return 0;
    return ((value1 - value2) / value2) * 100;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatVariation = (variation: number) => {
    const formatted = Math.abs(variation).toFixed(1);
    const isPositive = variation > 0;
    const isNeutral = Math.abs(variation) < 0.1;

    return (
      <div className={`flex items-center gap-1 ${isNeutral ? 'text-muted-foreground' : isPositive ? 'text-green-600' : 'text-destructive'}`}>
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
                    <div className="font-medium">Total GCS</div>
                    <div>{formatCurrency(month1Data.totalGCS)}</div>
                    <div className="flex items-center justify-between">
                      <span>{formatCurrency(month2Data.totalGCS)}</span>
                      {formatVariation(
                        calculateVariation(month1Data.totalGCS, month2Data.totalGCS)
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">Total Vendas</div>
                    <div>{formatCurrency(month1Data.totalSales)}</div>
                    <div className="flex items-center justify-between">
                      <span>{formatCurrency(month2Data.totalSales)}</span>
                      {formatVariation(calculateVariation(month1Data.totalSales, month2Data.totalSales))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">Total Diferença</div>
                    <div className={month1Data.totalDifference < 0 ? 'text-destructive font-bold' : 'font-bold'}>
                      {formatCurrency(month1Data.totalDifference)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={month2Data.totalDifference < 0 ? 'text-destructive font-bold' : 'font-bold'}>
                        {formatCurrency(month2Data.totalDifference)}
                      </span>
                      {formatVariation(calculateVariation(month1Data.totalDifference, month2Data.totalDifference))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">Média Diferença/Turno</div>
                    <div>{formatCurrency(month1Data.avgDifference)}</div>
                    <div className="flex items-center justify-between">
                      <span>{formatCurrency(month2Data.avgDifference)}</span>
                      {formatVariation(calculateVariation(month1Data.avgDifference, month2Data.avgDifference))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">Total Reembolsos</div>
                    <div>{formatCurrency(month1Data.totalReimbursementValue)}</div>
                    <div className="flex items-center justify-between">
                      <span>{formatCurrency(month2Data.totalReimbursementValue)}</span>
                      {formatVariation(calculateVariation(month1Data.totalReimbursementValue, month2Data.totalReimbursementValue))}
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
                  <p className="text-sm text-muted-foreground mb-1">Diferença GCS</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(Math.abs(month1Data.totalGCS - month2Data.totalGCS))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Diferença Vendas</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(Math.abs(month1Data.totalSales - month2Data.totalSales))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Diferença Caixa</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(Math.abs(month1Data.totalDifference - month2Data.totalDifference))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Diferença Reembolsos</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(Math.abs(month1Data.totalReimbursementValue - month2Data.totalReimbursementValue))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">{getMonthLabel(month1)}</h4>
                  <div className="space-y-1 text-sm">
                    <p>Total de Turnos: {month1Data.totalShifts}</p>
                    <p>Dias com Dados: {month1Data.daysWithData}</p>
                    <p>Média GCS/Turno: {formatCurrency(month1Data.avgGCS)}</p>
                    <p>Média Vendas/Turno: {formatCurrency(month1Data.avgSales)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{getMonthLabel(month2)}</h4>
                  <div className="space-y-1 text-sm">
                    <p>Total de Turnos: {month2Data.totalShifts}</p>
                    <p>Dias com Dados: {month2Data.daysWithData}</p>
                    <p>Média GCS/Turno: {formatCurrency(month2Data.avgGCS)}</p>
                    <p>Média Vendas/Turno: {formatCurrency(month2Data.avgSales)}</p>
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
