import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  target?: string | number;
  subtitle?: string;
}

export function MetricCard({ title, value, change, trend, target, subtitle }: MetricCardProps) {
  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
              <TrendIcon className="h-4 w-4" />
              {Math.abs(change)}%
            </div>
          )}
        </div>
        {(target || subtitle) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {subtitle || `Meta: ${target}`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
