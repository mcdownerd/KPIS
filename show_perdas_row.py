import openpyxl

wb = openpyxl.load_workbook('Relatório de Transações de Inventário 20251211 20.xlsx')
ws = wb.active

print("=" * 80)
print("PROCURANDO UTILIZADOR NAS LINHAS DE PERDAS")
print("=" * 80)

# Check row 53 (first Perdas row) - show all columns
print("\nLinha 53 (primeira linha de Perdas) - TODAS AS COLUNAS:")
for col in range(1, 35):
    cell = ws.cell(row=53, column=col)
    col_letter = chr(64+col) if col <= 26 else f"A{chr(64+col-26)}"
    if cell.value:
        print(f"  {col_letter}: {cell.value}")

print("\n" + "=" * 80)
