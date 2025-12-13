import xlrd
from datetime import datetime

try:
    # Open the workbook
    wb = xlrd.open_workbook('tempos.xls')
    ws = wb.sheet_by_index(0)

    print("=" * 80)
    print("ANÁLISE DO EXCEL DE TEMPOS (xlrd)")
    print("=" * 80)

    # Check date in C2 (row 1, col 2)
    try:
        c2_val = ws.cell_value(1, 2)
        print(f"\n📅 Data (C2): {c2_val}")
    except:
        print("\n📅 Data (C2): Erro ao ler")

    # Analyze rows 13-25 (indices 12-24)
    print("\n📊 ESTRUTURA DAS LINHAS (13-25):")
    print("-" * 80)
    
    # Print header with column letters
    header = "Row   "
    for c in range(1, 18): # Print up to column Q (17)
        header += f"{chr(64+c):<10}"
    print(header)
    print("-" * 80)

    for r in range(12, 26): # Rows 13-26
        row_str = f"{r+1:<6}"
        for c in range(1, 18): # Cols B to Q (indices 1 to 16) - actually let's print A to Q (0 to 16)
            try:
                val = ws.cell_value(r, c-1) # 0-indexed
                # Format value
                if isinstance(val, float):
                    val_str = f"{val:.2f}"
                else:
                    val_str = str(val)[:9]
                row_str += f"{val_str:<10}"
            except:
                row_str += f"{'-':<10}"
        print(row_str)

    # Look for "Total" or summary rows
    print("\n🎯 PROCURANDO TOTAIS/MÉDIAS:")
    print("-" * 80)
    
    # Check rows 13-100
    for r in range(12, 100):
        try:
            # Check col B (index 1) for time range pattern like "10:00 - 10:59"
            b_val = ws.cell_value(r, 1)
            if isinstance(b_val, str) and " - " in b_val:
                # This looks like a summary row
                i_val = ws.cell_value(r, 8) # Col I = index 8 (R2P?)
                o_val = ws.cell_value(r, 14) # Col O = index 14 (TET?)
                
                print(f"Linha {r+1}: '{b_val}'")
                print(f"  → Col I (R2P?): {i_val}")
                print(f"  → Col O (TET?): {o_val}")
        except:
            pass

except Exception as e:
    print(f"Erro: {e}")
