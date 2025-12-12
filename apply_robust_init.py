import re

file_path = r'w:\planilha-app-maker-main-main\public\shift-management.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Adicionar log no início do script para debug
if "console.log('🚀 Script iniciado');" not in content:
    content = content.replace('let estado = {', "console.log('🚀 Script iniciado');\n        let estado = {")
    print("✅ Log de início adicionado.")

# 2. Substituir DOMContentLoaded por initApp robusto
# Padrão para capturar todo o bloco DOMContentLoaded
# Começa com document.addEventListener('DOMContentLoaded', () => {
# Termina com }); antes de </script>
pattern = r"document\.addEventListener\('DOMContentLoaded', \(\) => \{([\s\S]*?)\}\);"

match = re.search(pattern, content)
if match:
    body_content = match.group(1)
    
    new_init_code = f"""
        function initApp() {{
            console.log('🚀 Inicializando aplicação...');
            {body_content}
        }}

        if (document.readyState === 'loading') {{
            document.addEventListener('DOMContentLoaded', initApp);
        }} else {{
            initApp();
        }}
    """
    
    content = content.replace(match.group(0), new_init_code)
    print("✅ Inicialização robusta aplicada.")
else:
    print("❌ Bloco DOMContentLoaded não encontrado para substituição.")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Arquivo atualizado.")
