# Sistema de Prontuário Médico - Frontend

Interface React moderna para gerenciamento de prontuários médicos.

## 🚀 Deploy no Netlify

### Configuração Automática
Este repositório está configurado para deploy automático no Netlify.

### Variáveis de Ambiente Necessárias
- `VITE_API_URL`: URL da API backend (será configurada automaticamente)

### Arquivos de Configuração
- `netlify.toml`: Configuração do Netlify
- `.env.production`: Variáveis de ambiente para produção
- `package.json`: Dependências e scripts

## 🛠️ Funcionalidades

### Páginas Principais
- **Configurações**: Gerenciamento de chaves da API
- **Pacientes**: Cadastro e busca de pacientes
- **Exames**: Upload e visualização de exames
- **Relatórios**: Gráficos e análises

### Recursos Implementados
- ✅ Interface responsiva (desktop/mobile)
- ✅ Componentes reutilizáveis
- ✅ Validação de formulários
- ✅ Gráficos interativos
- ✅ Upload de arquivos
- ✅ Busca em tempo real
- ✅ Design profissional

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 20+
- npm ou yarn

### Instalação
```bash
# Clonar repositório
git clone <seu-repo>
cd prontuario-frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Estrutura do Projeto
```
src/
├── components/      # Componentes React
├── config/         # Configurações
├── lib/            # Utilitários
└── main.jsx        # Entrada da aplicação
```

## 📋 Tecnologias

- **React 18**: Framework frontend
- **Vite**: Build tool moderna
- **Tailwind CSS**: Framework CSS
- **shadcn/ui**: Componentes UI
- **Recharts**: Gráficos interativos
- **Lucide React**: Ícones

## 🎨 Design System

- **Cores**: Paleta profissional médica
- **Tipografia**: Inter (legível e moderna)
- **Componentes**: shadcn/ui (acessíveis)
- **Layout**: Responsivo e intuitivo

## 🔗 Integração

- Comunicação com API via fetch
- Gerenciamento de estado local
- Tratamento de erros
- Loading states
- Feedback visual

## 📝 Licença

Este projeto é de uso pessoal para fins médicos.

