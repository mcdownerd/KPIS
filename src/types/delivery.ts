export interface DeliveryShift {
  id: string;
  operator: string;
  gcs: number;
  sales: number;
  cash: number;
  mb: number;
  mbp: number;
  tr_euro: number;
  difference: number;
  reimbursement_qty: number;
  reimbursement_value: number;
  reimbursement_note?: string;
}

export interface DeliveryDay {
  day: number;
  morning_shifts: DeliveryShift[];
  night_shifts: DeliveryShift[];
  manager_morning: string;
  manager_night: string;
}

export interface OperatorStats {
  operator: string;
  avg_gcs: number;
  avg_sales: number;
  avg_cash: number;
  avg_mb: number;
  avg_mbp: number;
  avg_tr_euro: number;
  avg_difference: number;
  avg_reimbursement_qty: number;
  avg_reimbursement_value: number;
  total_shifts: number;
}
