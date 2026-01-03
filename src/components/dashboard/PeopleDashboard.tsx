import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KPIEngine } from "@/lib/kpi-engine";

export function PeopleDashboard() {
  const engine = new KPIEngine();
  const data = engine.calculateResults().pessoas;

  return (
    <div className="space-y-6">
      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardHeader className="bg-black py-3 border-b border-border/50">
          <CardTitle className="text-sm font-bold text-white uppercase tracking-wider text-center">
            Indicadores de Pessoas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="text-left text-xs font-bold text-muted-foreground">Indicador</TableHead>
                <TableHead className="text-center text-xs font-bold text-muted-foreground">P. Borges</TableHead>
                <TableHead className="text-center text-xs font-bold text-muted-foreground">Objetivo</TableHead>
                <TableHead className="text-center text-xs font-bold text-muted-foreground">Variação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/50 transition-colors border-b border-border/50">
                <TableCell className="font-medium text-xs">Absentismo</TableCell>
                <TableCell className="text-center text-xs">{data.absentismo.pborges}</TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">{data.absentismo.objetivo}</TableCell>
                <TableCell className="text-center text-xs font-bold text-white">{data.absentismo.variacao}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/50 transition-colors border-b border-border/50">
                <TableCell className="font-medium text-xs">Turnover</TableCell>
                <TableCell className="text-center text-xs">{data.turnover.pborges}</TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">{data.turnover.objetivo}</TableCell>
                <TableCell className="text-center text-xs font-bold text-white">{data.turnover.variacao}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
