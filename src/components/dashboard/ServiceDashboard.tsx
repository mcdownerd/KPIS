import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KPIEngine } from "@/lib/kpi-engine";

export function ServiceDashboard() {
    const engine = new KPIEngine();
    const data = engine.calculateResults().servico;

    return (
        <div className="space-y-6">
            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
                <CardHeader className="bg-black py-3 border-b border-border/50">
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider text-center">
                        Tempos de Serviço
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20">
                                <TableHead className="text-center text-xs font-bold text-white bg-zinc-900/50" colSpan={1}>Loja</TableHead>
                                <TableHead className="text-center text-xs font-bold text-white bg-zinc-900/50" colSpan={5}>Amadora</TableHead>
                                <TableHead className="text-center text-xs font-bold text-white bg-zinc-900/50" colSpan={5}>Queluz</TableHead>
                            </TableRow>
                            <TableRow className="bg-muted/10 hover:bg-muted/10">
                                <TableHead className="text-left text-[10px] font-medium text-muted-foreground">Período</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Tempo</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Obj</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Var</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Rank</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">%</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Tempo</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Obj</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Var</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Rank</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">%</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-muted/50 transition-colors border-b border-border/50">
                                <TableCell className="font-medium text-xs">Almoço</TableCell>
                                <TableCell className="text-center text-xs">{data.amadora.almoco.tempo}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.almoco.objetivo}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.amadora.almoco.var}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.almoco.rank}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.almoco.percentil}%</TableCell>
                                <TableCell className="text-center text-xs">{data.queluz.almoco.tempo}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.almoco.objetivo}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.queluz.almoco.var}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.almoco.rank}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.almoco.percentil}%</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/50 transition-colors border-b border-border/50">
                                <TableCell className="font-medium text-xs">Jantar</TableCell>
                                <TableCell className="text-center text-xs">{data.amadora.jantar.tempo}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.jantar.objetivo}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.amadora.jantar.var}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.jantar.rank}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.jantar.percentil}%</TableCell>
                                <TableCell className="text-center text-xs">{data.queluz.jantar.tempo}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.jantar.objetivo}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.queluz.jantar.var}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.jantar.rank}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.jantar.percentil}%</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/50 transition-colors border-b border-border/50 bg-muted/5">
                                <TableCell className="font-bold text-xs text-white">Dia</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.amadora.dia.tempo}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.dia.objetivo}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.amadora.dia.var}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.dia.rank}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.amadora.dia.percentil}%</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.queluz.dia.tempo}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.dia.objetivo}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.queluz.dia.var}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.dia.rank}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.queluz.dia.percentil}%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
                <CardHeader className="bg-black py-3 border-b border-border/50">
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider text-center">
                        Delivery
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20">
                                <TableHead className="text-left text-[10px] font-medium text-muted-foreground">Loja</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Tempo</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Var</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Rank</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">%</TableHead>
                                <TableHead className="text-center text-[10px] font-medium text-muted-foreground">Nacional</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-muted/50 transition-colors border-b border-border/50">
                                <TableCell className="font-medium text-xs">Amadora</TableCell>
                                <TableCell className="text-center text-xs">{data.delivery.amadora.tempo}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.delivery.amadora.var}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.delivery.amadora.rank}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.delivery.amadora.percentil}%</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.delivery.amadora.nacional}</TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/50 transition-colors border-b border-border/50">
                                <TableCell className="font-medium text-xs">Queluz</TableCell>
                                <TableCell className="text-center text-xs">{data.delivery.queluz.tempo}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-white">{data.delivery.queluz.var}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.delivery.queluz.rank}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">{data.delivery.queluz.percentil}%</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
