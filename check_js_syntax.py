import re
import subprocess
import os

html_file = r'w:\planilha-app-maker-main-main\public\shift-management.html'
js_file = r'w:\planilha-app-maker-main-main\temp_check.js'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extrair conteúdo dentro de <script>...</script>
# Pode haver múltiplos scripts, vamos pegar o último que é o principal
scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)

if not scripts:
    print("❌ Nenhum script encontrado!")
    exit(1)

# O último script é o principal
main_script = scripts[-1]

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(main_script)

print(f"✅ Script extraído para {js_file}")
print("Executando verificação de sintaxe...")

try:
    result = subprocess.run(['node', '--check', js_file], capture_output=True, text=True)
    if result.returncode == 0:
        print("✅ Sintaxe JavaScript válida!")
    else:
        print("❌ Erro de sintaxe encontrado:")
        print(result.stderr)
except Exception as e:
    print(f"Erro ao executar node: {e}")

# Limpar
# os.remove(js_file)
