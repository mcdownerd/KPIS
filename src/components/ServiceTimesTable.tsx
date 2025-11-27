import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useServiceTimesData } from "@/hooks/useServiceTimesData";
import { Loader2 } from "lucide-react";

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
              <TableRow>
                <TableHead>Localização</TableHead>
                <TableHead>Almoço</TableHead>
                <TableHead>Jantar</TableHead>
                <TableHead>Dia</TableHead>
                <TableHead>Ranking</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableRow key={item.location}>
                    <TableCell className="font-medium">{item.location}</TableCell>
                    <TableCell>{item.lunch}s</TableCell>
                    <TableCell>{item.dinner}s</TableCell>
                    <TableCell>{item.day}s</TableCell>
                    <TableCell>#{item.rank}</TableCell>
                    <TableCell>{item.target}s</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(item.day, item.target)}>
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
              <TableRow>
                <TableHead>Local</TableHead>
                <TableHead>Jan</TableHead>
                <TableHead>Fev</TableHead>
                <TableHead>Mar</TableHead>
                <TableHead>Abr</TableHead>
                <TableHead>Mai</TableHead>
                <TableHead>Jun</TableHead>
                <TableHead>Jul</TableHead>
                <TableHead>YTD</TableHead>
                <TableHead>LY</TableHead>
                <TableHead>Var</TableHead>
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
                  <TableRow key={item.location}>
                    <TableCell className="font-medium">{item.location}</TableCell>
                    <TableCell>{item.jan}s</TableCell>
                    <TableCell>{item.fev}s</TableCell>
                    <TableCell>{item.mar}s</TableCell>
                    <TableCell>{item.abr}s</TableCell>
                    <TableCell>{item.mai}s</TableCell>
                    <TableCell>{item.jun}s</TableCell>
                    <TableCell>{item.jul}s</TableCell>
                    <TableCell className="font-semibold">{item.ytd}s</TableCell>
                    <TableCell>{item.ly}s</TableCell>
                    <TableCell className={item.ytd < item.ly ? "text-success" : "text-destructive"}>
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
