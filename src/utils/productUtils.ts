import { ProductStatus } from "@/types/product";

export const getStatusLabel = (status: ProductStatus): string => {
  const labels: Record<ProductStatus, string> = {
    OK: "OK",
    WARNING: "Atenção",
    EXPIRED: "Vencido",
  };
  return labels[status];
};

export const getStatusColor = (status: ProductStatus): string => {
  const colors: Record<ProductStatus, string> = {
    OK: "bg-success text-success-foreground",
    WARNING: "bg-warning text-warning-foreground",
    EXPIRED: "bg-destructive text-destructive-foreground",
  };
  return colors[status];
};

export const calculateDaysToExpiry = (expiryDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateProductStatus = (daysToExpiry: number): ProductStatus => {
  if (daysToExpiry < 0) return "EXPIRED";
  if (daysToExpiry <= 3) return "WARNING";
  return "OK";
};
