import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationData {
  name: string;
  serviceTime: number;
  serviceTarget: number;
  deliveryTime: number;
  deliveryTarget: number;
  rating: number;
  sales: string;
}

const locations: LocationData[] = [
  {
    name: "Amadora",
    serviceTime: 105,
    serviceTarget: 95,
    deliveryTime: 366,
    deliveryTarget: 306,
    rating: 4.2,
    sales: "€2.74M"
  },
  {
    name: "Queluz",
    serviceTime: 103,
    serviceTarget: 95,
    deliveryTime: 306,
    deliveryTarget: 306,
    rating: 4.3,
    sales: "€1.72M"
  }
];

export function LocationTabs() {
  return (
    <Tabs defaultValue="amadora" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-secondary">
        <TabsTrigger value="amadora" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <MapPin className="mr-2 h-4 w-4" />
          Amadora
        </TabsTrigger>
        <TabsTrigger value="queluz" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <MapPin className="mr-2 h-4 w-4" />
          Queluz
        </TabsTrigger>
      </TabsList>
      
      {locations.map((location) => (
        <TabsContent 
          key={location.name.toLowerCase()} 
          value={location.name.toLowerCase()}
          className="mt-4 space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tempo de Serviço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{location.serviceTime}s</div>
                <p className="text-xs text-muted-foreground">Meta: {location.serviceTarget}s</p>
                <div className={`mt-2 text-xs font-medium ${
                  location.serviceTime > location.serviceTarget ? 'text-destructive' : 'text-success'
                }`}>
                  {location.serviceTime > location.serviceTarget ? '+' : ''}
                  {location.serviceTime - location.serviceTarget}s da meta
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tempo Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{location.deliveryTime}s</div>
                <p className="text-xs text-muted-foreground">Meta: {location.deliveryTarget}s</p>
                <div className={`mt-2 text-xs font-medium ${
                  location.deliveryTime > location.deliveryTarget ? 'text-destructive' : 'text-success'
                }`}>
                  {location.deliveryTime > location.deliveryTarget ? '+' : ''}
                  {location.deliveryTime - location.deliveryTarget}s da meta
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avaliação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{location.rating} ⭐</div>
                <p className="text-xs text-muted-foreground">Meta: 4.5</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Vendas YTD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{location.sales}</div>
                <p className="text-xs text-success">Crescimento positivo</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
