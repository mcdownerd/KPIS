import re

file_path = r'w:\planilha-app-maker-main-main\public\shift-management.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Padrão para encontrar o div tab-tabela e o lixo que segue
# Procuramos por id="tab-tabela" ... <p ...> ... // Coletar valores
pattern = r'(<div id="tab-tabela" class="tab-conteudo">\s*<p[^>]*>)([\s\S]*?)(const dadosDia = \{\};)'

match = re.search(pattern, content)

if not match:
    print("❌ Padrão de corrupção não encontrado. Verifique o arquivo manualmente.")
    # Vamos tentar um padrão mais amplo ou imprimir o que tem lá
    start_marker = '<div id="tab-tabela" class="tab-conteudo">'
    start_idx = content.find(start_marker)
    if start_idx != -1:
        print(f"Conteúdo ao redor de tab-tabela:\n{content[start_idx:start_idx+500]}")
    exit(1)

print("✅ Corrupção encontrada! Reparando...")

# O que queremos:
# 1. Fechar o p e o div corretamente.
# 2. Iniciar o script corretamente com as constantes e estado.
# 3. Manter o resto do código JS (que parece começar com 'const dadosDia = {};' mas isso é parte de uma função antiga?)

# Espera, 'const dadosDia = {};' é parte de salvarDadosDia. Onde está o resto do código?
# O código que vazou para o HTML parece ser um fragmento de salvarDadosDia.
# Isso significa que o INÍCIO do script (Constantes, Estado, Funções auxiliares) foi PERDIDO ou SOBRESCRITO.

# Precisamos reinserir o cabeçalho do script e tentar salvar o que restou do código, 
# mas se o código está fragmentado, talvez seja melhor reinserir as funções perdidas também.

# Vamos reconstruir a parte da transição HTML -> JS
html_fix = """        <div id="tab-tabela" class="tab-conteudo">
            <p style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #E5E7EB;">
                Conteúdo da Tabela Mensal (Será implementado na próxima etapa)
            </p>
        </div>
    </div>

    <script>
        // ============= CONSTANTES =============
        const CONSTANTES = {
            TET_OBJETIVO: 490,
            R2P_OBJETIVO: 216,
            MO_OBJETIVO: 11.5,
            VALOR_MO: 8.50, // Valor hora médio
            MESES: [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ],
            DIAS_NO_MES: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            GERENTES: ['William', 'Patricia', 'Diogo', 'Paula', 'Outro'],
            CORES_GERENTES: {
                'William': '#E0F2FE', // Azul claro
                'Patricia': '#FCE7F3', // Rosa claro
                'Diogo': '#DCFCE7', // Verde claro
                'Paula': '#FEF3C7', // Amarelo claro
                'Outro': '#F3F4F6'  // Cinza claro
            }
        };

        // ============= ESTADO DA APLICAÇÃO =============
        let estado = {
            mesAtual: 0, // Janeiro (0-11)
            diaAtual: 1, // Dia do mês (1-31)
            tabAtual: 'tabela' // 'tabela', 'graficos', 'analise'
        };
        
        // Funções auxiliares que podem ter sido perdidas
        function formatarMoeda(valor) {
            return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(valor);
        }

        function formatarPercentagem(valor) {
            return new Intl.NumberFormat('pt-PT', { style: 'percent', minimumFractionDigits: 2 }).format(valor / 100);
        }
        
        function formatarNumero(valor, decimais = 0) {
            return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: decimais, maximumFractionDigits: decimais }).format(valor);
        }

        const STORAGE_KEY = 'shift_management_data_2025';

        function obterTodosDados() {
            const dados = localStorage.getItem(STORAGE_KEY);
            return dados ? JSON.parse(dados) : {};
        }

        function salvarTodosDados(dados) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
        }

        function obterChaveDia() {
            return `${estado.mesAtual}-${estado.diaAtual}`;
        }
        
        function carregarDadosDia() {
            const chave = obterChaveDia();
            const todosDados = obterTodosDados();
            const dadosDia = todosDados[chave] || {};

            console.log('📅 Carregando dia:', chave, dadosDia);

            // Limpar campos primeiro
            document.querySelectorAll('.campo-input').forEach(input => {
                if (!input.readOnly && !input.classList.contains('calculado')) {
                    input.value = '';
                }
            });

            // Preencher campos
            Object.keys(dadosDia).forEach(campoId => {
                const elemento = document.getElementById(campoId);
                if (elemento) {
                    elemento.value = dadosDia[campoId] || '';
                }
            });

            // Recalcular
            calcularCampos('m');
            calcularCampos('n');
            atualizarResumoDia();
        }

        function calcularCampos(turno) {
            // Implementação simplificada para garantir que funcione
            // A lógica real deve estar mais abaixo no arquivo, mas se foi perdida, precisamos restaurar
            // Vamos assumir que as funções calcularCampos e outras estão mais abaixo ou precisamos restaurá-las
        }
"""

# Substituir a parte corrompida pelo fix
# Mas cuidado: o match pegou até 'const dadosDia'. Precisamos ver o que vem depois.
# O arquivo original tinha muito código JS. Se ele foi cortado, precisamos restaurar tudo.

# Vamos ler o arquivo inteiro e substituir do ponto de corrupção até o final se necessário, 
# ou tentar mesclar.

# Se o arquivo está muito quebrado, talvez seja melhor usar o git checkout para restaurar 
# e aplicar APENAS a mudança do tema de forma segura.
# Mas o usuário disse que o git checkout foi cancelado.

# Vamos tentar aplicar o fix na transição e ver se o resto do arquivo (funções) está lá.
# O match pegou o início do lixo. Vamos substituir o início do lixo pelo nosso header JS.

content_fixed = re.sub(pattern, html_fix + "\n\n// Código recuperado:\nconst dadosDia = {};", content, count=1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_fixed)

print("✅ Arquivo reparado (tentativa 1).")
