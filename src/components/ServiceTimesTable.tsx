import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ServiceData {
  location: string;
  lunch: number;
  dinner: number;
  day: number;
  rank: number;
  target: number;
}

const serviceTimesData: ServiceData[] = [
  { location: "AMADORA", lunch: 108, dinner: 122, day: 132, rank: 6, target: 110 },
  { location: "QUELUZ", lunch: 90, dinner: 100, day: 95, rank: 1, target: 95 },
];

const monthlyData = [
  { location: "AMADORA", jan: 97, fev: 99, mar: 108, abr: 117, mai: 121, jun: 128, jul: 135, ytd: 116, ly: 118 },
  { location: "QUELUZ", jan: 90, fev: 91, mar: 107, abr: 99, mai: 106, jun: 106, jul: 100, ytd: 103, ly: 100 },
];

export function ServiceTimesTable() {
  const getStatusColor = (time: number, target: number) => {
    if (time <= target) return "success";
    if (time <= target + 10) return "warning";
    return "destructive";
  };

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
              {serviceTimesData.map((item) => (
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
              ))}
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
              {monthlyData.map((item) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
