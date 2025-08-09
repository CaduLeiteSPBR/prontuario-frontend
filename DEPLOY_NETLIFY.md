# 🌐 Deploy no Netlify - Frontend

## Configuração Automática

Este repositório está configurado para deploy automático no Netlify usando o arquivo `netlify.toml`.

## Passos para Deploy

### 1. Atualizar URL do Backend
**IMPORTANTE**: Antes do deploy, atualize a URL do backend:

1. Edite o arquivo `netlify.toml` na linha 14:
   ```toml
   VITE_API_URL = "https://SUA_URL_DO_RENDER"
   ```

2. Edite o arquivo `.env.production`:
   ```
   VITE_API_URL=https://SUA_URL_DO_RENDER
   ```

3. Faça commit das alterações:
   ```bash
   git add .
   git commit -m "Update backend URL"
   git push
   ```

### 2. Conectar Repositório
1. Acesse [netlify.com](https://netlify.com)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Selecione este repositório
5. Clique em **"Deploy site"**

### 3. Configuração Automática
O Netlify detectará automaticamente o arquivo `netlify.toml` e configurará:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 20
- **Redirects**: SPA (Single Page Application)

### 4. Aguardar Deploy
- O deploy levará 2-3 minutos
- Você pode acompanhar os logs em tempo real
- Quando concluído, você receberá uma URL

### 5. Personalizar URL (Opcional)
1. Vá em **"Site settings"** → **"Change site name"**
2. Escolha um nome como: `prontuario-medico-seunome`
3. Sua URL ficará: `https://prontuario-medico-seunome.netlify.app`

## Estrutura de Arquivos Importantes

```
├── src/
│   ├── components/          # Componentes React
│   ├── config/             # Configurações
│   ├── lib/                # Utilitários
│   └── main.jsx            # Entrada da aplicação
├── public/                 # Arquivos estáticos
├── package.json           # Dependências e scripts
├── netlify.toml          # Configuração do Netlify
├── .env.production       # Variáveis de ambiente
└── README.md             # Documentação
```

## Funcionalidades

### Páginas Principais
- **Configurações**: Gerenciamento de chaves da API
- **Pacientes**: Cadastro e busca de pacientes
- **Exames**: Upload e visualização de exames
- **Relatórios**: Gráficos e análises

### Recursos
- Interface responsiva (desktop/mobile)
- Componentes reutilizáveis
- Validação de formulários
- Gráficos interativos
- Upload de arquivos
- Busca em tempo real

## Monitoramento

No painel do Netlify você pode:
- Ver logs de build
- Monitorar performance
- Configurar domínio customizado
- Ver analytics de uso

## Atualizações

Para atualizar o sistema:
1. Faça push para o repositório GitHub
2. O Netlify fará build e deploy automático
3. Acompanhe os logs para verificar sucesso

## Variáveis de Ambiente

A variável `VITE_API_URL` é configurada automaticamente pelo `netlify.toml` e aponta para seu backend no Render.

## Troubleshooting

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Confirme se a URL do backend está correta
- Verifique os logs de build no Netlify

### Site não carrega
- Confirme se o build foi bem-sucedido
- Verifique se o backend está rodando
- Teste a URL do backend diretamente

