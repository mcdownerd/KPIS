export type DLCType = "Primária" | "Secundária";

export type ProductStatus = "OK" | "WARNING" | "EXPIRED";

export interface Product {
  id: string;
  category: string;
  sub_category?: string;
  name: string;
  expiry_date: string;
  expiry_dates?: string[];
  dlc_type: DLCType;
  observation?: string;
  daysToExpiry: number;
  status: ProductStatus;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  store_id?: string;
}

export interface ProductHistoryLog {
  id: string;
  product_id: string;
  old_expiry_date: string | null;
  new_expiry_date: string | null;
  old_expiry_dates_array?: string[];
  new_expiry_dates_array?: string[];
  updated_at: string;
  updated_by: string;
  profiles?: {
    full_name: string | null;
  };
}
