# Planilha App Maker

Aplicação de gerenciamento de lojas e produtos, desenvolvida com React, TypeScript, Vite e Supabase.

## 🚀 Tecnologias

- **Frontend**: React, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Backend/Database**: Supabase
- **State Management**: TanStack Query
- **Icons**: Lucide React

## 🛠️ Configuração e Instalação

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd planilha-app-maker-main
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🔐 Permissões e Roles

O sistema possui 4 níveis de acesso:

1. **Admin**: Acesso total a todas as lojas e funcionalidades.
2. **Supervisor**: Acesso total (exceto painel admin), visualiza todas as lojas.
3. **Gerente**: Acesso restrito à sua loja, pode editar apenas datas.
4. **User**: Acesso básico à sua loja (requer aprovação).

Para mais detalhes sobre permissões, consulte [docs/PERMISSIONS.md](docs/PERMISSIONS.md).

## 📁 Estrutura do Projeto

- `src/components`: Componentes reutilizáveis e de UI
- `src/pages`: Páginas da aplicação
- `src/hooks`: Custom hooks (auth, data fetching)
- `src/lib`: Configurações de bibliotecas (Supabase, utils)
- `src/types`: Definições de tipos TypeScript
- `database/`: Scripts SQL para manutenção e migração

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
