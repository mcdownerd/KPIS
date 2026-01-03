import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KPIEngine } from "@/lib/kpi-engine";

export function ProductDashboard() {
  const engine = new KPIEngine();
  const data = engine.calculateResults().produto;

  return (
    <div className="space-y-6">
      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardHeader className="bg-black py-3 border-b border-border/50">
          <CardTitle className="text-sm font-bold text-white uppercase tracking-wider text-center">
            Indicadores de Produto
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
                <TableCell className="font-medium text-xs">CMV</TableCell>
                <TableCell className="text-center text-xs">{data.cmv.pborges}</TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">{data.cmv.objetivo}</TableCell>
                <TableCell className="text-center text-xs font-bold text-white">{data.cmv.variacao}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/50 transition-colors border-b border-border/50">
                <TableCell className="font-medium text-xs">Waste</TableCell>
                <TableCell className="text-center text-xs">{data.waste.pborges}</TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">{data.waste.objetivo}</TableCell>
                <TableCell className="text-center text-xs font-bold text-white">{data.waste.variacao}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
