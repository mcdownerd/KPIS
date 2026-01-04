import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useServiceTimesData } from "@/hooks/useServiceTimesData";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceData {
  location: string;
  lunch: number;
  dinner: number;
  day: number;
  rank: number;
  target: number;
}

export function ServiceTimesTable() {
  const { serviceTimesData, monthlyData, loading, error } = useServiceTimesData();

  const getStatusColor = (time: number, target: number) => {
    if (time <= target) return "success";
    if (time <= target + 10) return "warning";
    return "destructive";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tempos de Serviço YTD</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tempos de Serviço YTD</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px]">
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Tempos de Serviço YTD</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Localização</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Almoço</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Jantar</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Dia</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Ranking</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Objetivo</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceTimesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhum dado disponível
                  </TableCell>
                </TableRow>
              ) : (
                serviceTimesData.map((item) => (
                  <TableRow key={item.location} className="h-8">
                    <TableCell className="font-medium py-1.5 px-2 text-[10px] h-8">{item.location}</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.lunch}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.dinner}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.day}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">#{item.rank}</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.target}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">
                      <Badge variant={getStatusColor(item.day, item.target)} className="text-[9px] h-4 px-1">
                        {item.day <= item.target ? "OK" : "NOK"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Local</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Jan</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Fev</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Mar</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Abr</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Mai</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Jun</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Jul</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">YTD</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">LY</TableHead>
                <TableHead className="py-1.5 px-2 text-[10px] h-8">Var</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-muted-foreground">
                    Nenhum dado disponível
                  </TableCell>
                </TableRow>
              ) : (
                monthlyData.map((item: any) => (
                  <TableRow key={item.location} className="h-8">
                    <TableCell className="font-medium py-1.5 px-2 text-[10px] h-8">{item.location}</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.jan}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.fev}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.mar}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.abr}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.mai}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.jun}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.jul}s</TableCell>
                    <TableCell className="font-semibold py-1.5 px-2 text-[10px] h-8">{item.ytd}s</TableCell>
                    <TableCell className="py-1.5 px-2 text-[10px] h-8">{item.ly}s</TableCell>
                    <TableCell className={cn("py-1.5 px-2 text-[10px] h-8", item.ytd < item.ly ? "text-success" : "text-destructive")}>
                      {item.ytd - item.ly}s
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
