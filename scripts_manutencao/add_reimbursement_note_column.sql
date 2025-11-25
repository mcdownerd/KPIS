-- Adicionar coluna para nota de reembolso na tabela cash_register_shifts
ALTER TABLE cash_register_shifts 
ADD COLUMN IF NOT EXISTS reimbursement_note TEXT;

-- Comentário descritivo
COMMENT ON COLUMN cash_register_shifts.reimbursement_note IS 'Nota ou observação sobre o reembolso';
