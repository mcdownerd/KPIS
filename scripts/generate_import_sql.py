import csv
import json
import uuid
import re

# Caminhos dos arquivos
csv_file_path = r'w:\planilha-app-maker-main-main\produtos csv\products_rows - products_rows.csv'
sql_output_path = r'w:\planilha-app-maker-main-main\scripts_manutencao\import_all_products_final.sql'

def clean_uuid(u):
    # Remove tudo que não for hex ou hifen
    cleaned = re.sub(r'[^a-fA-F0-9-]', '', u)
    return cleaned

# IDs das lojas - Limpando e Validando
raw_queluz = '7df6b644-4830-489c-afd7-a4d81d5f7b86'
raw_amadora = 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf'

store_queluz = clean_uuid(raw_queluz)
store_amadora = clean_uuid(raw_amadora)

print(f"Queluz ID: {store_queluz} (Len: {len(store_queluz)})")
print(f"Amadora ID: {store_amadora} (Len: {len(store_amadora)})")

# Validação final
try:
    uuid.UUID(store_queluz)
    uuid.UUID(store_amadora)
except ValueError as e:
    print(f"ERRO CRÍTICO AINDA: {e}")
    exit(1)

def escape_sql(value):
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

def format_expiry_dates(value):
    if not value:
        return 'NULL'
    try:
        # Tenta carregar como JSON
        dates = json.loads(value)
        if isinstance(dates, list):
            # Formata como array do PostgreSQL: ARRAY['date1', 'date2']::timestamp[]
            dates_str = ",".join([f"'{d}'" for d in dates])
            return f"ARRAY[{dates_str}]::timestamp[]"
    except:
        pass
    return 'NULL'

print("Gerando script SQL...")

with open(csv_file_path, 'r', encoding='utf-8') as csvfile, open(sql_output_path, 'w', encoding='utf-8') as sqlfile:
    reader = csv.DictReader(csvfile)
    
    sqlfile.write("-- Script gerado automaticamente para importar produtos para Queluz e Amadora\n")
    sqlfile.write("BEGIN;\n\n") # Inicia transação
    
    count = 0
    for row in reader:
        # Extrair dados relevantes
        category = escape_sql(row.get('category', ''))
        sub_category = escape_sql(row.get('sub_category', ''))
        name = escape_sql(row.get('name', ''))
        expiry_date = escape_sql(row.get('expiry_date', ''))
        dlc_type = escape_sql(row.get('dlc_type', ''))
        observation = escape_sql(row.get('observation', ''))
        
        # Processar expiry_dates
        expiry_dates_raw = row.get('expiry_dates', '[]')
        expiry_dates_sql = format_expiry_dates(expiry_dates_raw)
        
        # Gerar INSERT para Queluz
        sqlfile.write(f"INSERT INTO products (category, sub_category, name, expiry_date, expiry_dates, dlc_type, observation, store_id) VALUES ({category}, {sub_category}, {name}, {expiry_date}, {expiry_dates_sql}, {dlc_type}, {observation}, '{store_queluz}'::uuid);\n")
        
        # Gerar INSERT para Amadora
        sqlfile.write(f"INSERT INTO products (category, sub_category, name, expiry_date, expiry_dates, dlc_type, observation, store_id) VALUES ({category}, {sub_category}, {name}, {expiry_date}, {expiry_dates_sql}, {dlc_type}, {observation}, '{store_amadora}'::uuid);\n")
        
        count += 1

    sqlfile.write("\nCOMMIT;\n")
    print(f"Script gerado com sucesso! {count} produtos processados (inseridos duplicados para ambas as lojas).")
