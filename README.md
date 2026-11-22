# 📱 Cadastro e Gerenciamento de Produtos (Expo + Node.js + Neon PostgreSQL)

Aplicativo full stack completo para cadastro e gerenciamento de produtos desenvolvido em **React Native**, **Expo**, **TypeScript**, com API backend em **Node.js/Express** e banco de dados **PostgreSQL** hospedado na nuvem pelo **Neon Serverless**.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura e Segurança](#-arquitetura-e-segurança)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração do Banco de Dados Neon](#-configuração-do-banco-de-dados-neon)
- [Configuração das Variáveis de Ambiente](#-configuração-das-variáveis-de-ambiente)
- [Instalação e Execução do Backend](#-instalação-e-execução-do-backend)
- [Instalação e Execução do Aplicativo Expo](#-instalação-e-execução-do-aplicativo-expo)
- [Configuração da URL da API no Mobile](#-configuração-da-url-da-api-no-mobile)
- [Testes e Validações](#-testes-e-validações)
- [Endpoints da API](#-endpoints-da-api)
- [Instruções de Execução (Expo Go, Emulador e Simulador)](#-instruções-de-execução)
- [Cuidados de Segurança](#-cuidados-de-segurança)

---

## 🚀 Visão Geral

O projeto resolve o fluxo de cadastro e listagem de produtos com as seguintes funcionalidades:
- **Cadastro**: Formulário para inserção de Nome e Preço (com suporte a números inteiros, vírgula e ponto decimal, ex: `89,90` ou `1250.50`), normalização automática e validação de campos obrigatórios e não-negativos.
- **Listagem Otimizada**: Exibição dos produtos via componente nativo `FlatList`, com ordenação decrescente por ID (produtos novos no topo), formatação de preço em moeda brasileira (`R$ 1.250,90`) e botão de exclusão.
- **Exclusão Segura**: Confirmação visual antes da remoção e prevenção contra múltiplos toques simultâneos (bloqueio do botão com estado de carregamento por item).
- **Tratamento de Estados**: Indicadores visuais de carregamento (`ActivityIndicator`), mensagens amigáveis para lista vazia e tratamento de falhas de conexão com botão de repetição ("Tentar novamente").

---

## 🛠 Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native** & **Expo SDK 52**
- **TypeScript** (tipagem estática em todos os componentes e serviços)
- **Expo Constants** (descoberta automática de IP no Expo Go)
- **Intl / Formatter** (formatação padrão Real brasileiro BRL)

### Backend (API)
- **Node.js** (v24.x) & **Express**
- **TypeScript**
- **pg** (Node PostgreSQL Pool com suporte a SSL para conexões Serverless)
- **dotenv** (isolamento de variáveis de ambiente)
- **cors** (compartilhamento de recursos entre origens)
- **tsx** (execução rápida em desenvolvimento com TypeScript)

### Banco de Dados
- **PostgreSQL** no **Neon Serverless**

---

## 🏛 Arquitetura e Segurança

Adotou-se o modelo de **três camadas desacopladas**:

```
[ App React Native (Expo) ]
           │
           │ HTTP / JSON (REST)
           ▼
[ API Backend (Node.js/Express) ]
           │
           │ Conexão Segura com SSL (pg.Pool)
           ▼
[ PostgreSQL (Neon Serverless) ]
```

### Regras de Segurança Aplicadas:
1. **Sem Acesso Direto**: O aplicativo React Native **nunca** acessa o PostgreSQL diretamente. A string de conexão do Neon reside **exclusivamente no backend**.
2. **Consultas Parametrizadas**: Todas as instruções SQL utilizam queries parametrizadas (`$1`, `$2`), impedindo qualquer tentativa de injeção de SQL (*SQL Injection*).
3. **Isolamento de Credenciais**: Arquivos `.env` estão devidamente incluídos no `.gitignore`. O repositório contém apenas `.env.example`.
4. **Mensagens Sanitizadas**: Erros internos do banco não vazam para o cliente e credenciais nunca são expostas em logs públicos ou respostas JSON.

---

## 📁 Estrutura de Pastas

```
cadastro-produtos-expo-neon/
├── .gitignore                      # Ignora node_modules, .env e arquivos de build
├── README.md                       # Documentacao completa do projeto
├── backend/                        # API Node.js com Express e PostgreSQL
│   ├── .env.example                # Modelo de variaveis de ambiente
│   ├── .gitignore                  # Ignora .env e dist do backend
│   ├── package.json                # Dependencias e scripts do backend
│   ├── tsconfig.json               # Configuracao do TypeScript
│   └── src/
│       ├── app.ts                  # Configuracao do Express e middlewares
│       ├── index.ts                # Inicializacao do servidor HTTP
│       ├── config/
│       │   ├── db.ts               # Pool de conexao PostgreSQL (Neon com SSL)
│       │   └── env.ts              # Leitura e validacao de variaveis de ambiente
│       ├── controllers/
│       │   └── produtoController.ts # Controle de requisicoes HTTP
│       ├── middlewares/
│       │   └── errorHandler.ts     # Middleware central de tratamento de erros
│       ├── routes/
│       │   └── produtoRoutes.ts    # Rotas (/produtos)
│       ├── services/
│       │   └── produtoService.ts   # Regra de negocio, queries e parse de preco
│       ├── types/
│       │   └── produto.ts          # Interfaces TypeScript
│       └── scripts/
│           ├── initDb.ts           # Script de criacao/validacao idempotente da tabela
│           └── testSuite.ts        # Suite automatizada de testes da API
└── mobile/                         # Aplicativo React Native com Expo
    ├── .env.example                # Modelo de configuracao da URL da API
    ├── .gitignore                  # Ignora .env, .expo e dependencias mobile
    ├── app.json                    # Configuracao do projeto Expo
    ├── package.json                # Dependencias do app Expo
    ├── tsconfig.json               # Configuracao TypeScript para Expo
    ├── App.tsx                     # Ponto de entrada com SafeArea e StatusBar
    └── src/
        ├── components/
        │   ├── EmptyList.tsx       # Mensagem amigavel de lista vazia
        │   ├── ErrorFeedback.tsx   # Banner de erro com botao de tentar novamente
        │   ├── Header.tsx          # Cabecalho do aplicativo
        │   ├── ProdutoForm.tsx     # Formulario com validacao de Nome e Preco
        │   └── ProdutoItem.tsx     # Card do produto na FlatList com botao de exclusao
        ├── config/
        │   └── apiConfig.ts        # Resolucao inteligente da URL da API
        ├── screens/
        │   └── HomeScreen.tsx      # Tela principal (FlatList + Formulario + Estados)
        ├── services/
        │   └── api.ts              # Cliente HTTP (fetch) com tratamento de excecoes
        ├── types/
        │   └── produto.ts          # Tipos de produto e respostas da API
        └── utils/
            ├── currency.ts         # Formatador para padrao Real brasileiro (R$)
            └── validators.ts       # Validador e normalizador de valores de entrada
```

---

## 📋 Pré-requisitos

- **Node.js** v18+ instalado (recomendado v20 ou v24);
- **npm** instalado;
- **Git** instalado e configurado;
- **GitHub CLI (`gh`)** instalada e autenticada;
- Conta ativa no [Neon Serverless](https://neon.tech) com um projeto PostgreSQL criado;
- Celular físico com o aplicativo **Expo Go** instalado (disponível na Google Play e App Store) ou Emulador Android / Simulador iOS configurado.

---

## 🗄 Configuração do Banco de Dados Neon

### Tabela Obrigatória

O projeto utiliza a seguinte estrutura relacional:

```sql
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL
);
```

### Inicialização Idempotente via Script

Dentro da pasta `backend`, você pode rodar o script que verifica se a tabela já existe antes de criá-la:

```bash
cd backend
npm run db:init
```

O script testará a conectividade com o seu cluster Neon, exibirá o horário e banco conectado e garantirá a presença da tabela sem qualquer alteração destrutiva caso já exista.

---

## 🔐 Configuração das Variáveis de Ambiente

### 1. No Backend (`backend/.env`)

Crie o arquivo `backend/.env` baseado no modelo `backend/.env.example`:

```env
PORT=3001
DATABASE_URL=postgresql://seu_usuario:sua_senha@ep-exemplo.us-east-2.aws.neon.tech/neondb?sslmode=require
```

> **Atenção**: Nunca compartilhe ou faça commit do arquivo `.env`.

### 2. No Mobile (`mobile/.env`)

Crie o arquivo `mobile/.env` baseado no `mobile/.env.example` (opcional caso utilize a auto-descoberta):

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3001
```

---

## 🖥 Instalação e Execução do Backend

1. Abra o Prompt de Comando (CMD) e navegue até a pasta do backend:
   ```cmd
   cd backend
   ```

2. Instale as dependências (caso ainda não tenha feito):
   ```cmd
   npm install
   ```

3. Execute o script de criação da tabela:
   ```cmd
   npm run db:init
   ```

4. Inicie o servidor em modo de desenvolvimento:
   ```cmd
   npm run dev
   ```

O backend estará ativo em `http://localhost:3001`. Você pode checar o status acessando `http://localhost:3001/health`.

---

## 📱 Instalação e Execução do Aplicativo Expo

1. Abra um segundo terminal e navegue até a pasta `mobile`:
   ```cmd
   cd mobile
   ```

2. Instale as dependências:
   ```cmd
   npm install
   ```

3. Inicie o Metro Bundler do Expo:
   ```cmd
   npx expo start
   ```

---

## 🌐 Configuração da URL da API no Mobile

Ao executar em um dispositivo físico com **Expo Go**, `localhost` aponta para o próprio celular e **não** para o computador de desenvolvimento.

O arquivo `mobile/src/config/apiConfig.ts` possui uma estratégia inteligente em camadas:

1. **Variável de Ambiente (`EXPO_PUBLIC_API_URL`)**: Se configurada no `.env` do mobile, tem prioridade máxima.
2. **Detecção Automática do Host via Expo Go**: Quando você escaneia o QR Code no Expo Go, o Expo fornece o IP local da máquina que está servindo o Metro bundler (`Constants.expoConfig.hostUri`). O aplicativo extrai esse IP e se conecta automaticamente à porta `3001` do seu computador!
3. **Emulador Android**: Utiliza `http://10.0.2.2:3001` (alias padrão do Android Studio para a máquina hospedeira).
4. **Simulador iOS / Web**: Utiliza `http://localhost:3001`.

### Como descobrir seu IP local manualmente (se necessário):
No Windows (Prompt de Comando):
```cmd
ipconfig
```
Procure pelo "Endereço IPv4" do seu adaptador Wi-Fi ou Ethernet (ex: `192.168.0.15`) e defina em `mobile/.env`:
```env
EXPO_PUBLIC_API_URL=http://192.168.0.15:3001
```

---

## 🧪 Testes e Validações

O projeto inclui uma suíte de testes automatizada para validar os 12 critérios solicitados:

Execute no backend:
```cmd
cd backend
npm test
```

### Casos de Teste Validados:
- [x] Normalização de preço com vírgula (`"1250,90"` -> `1250.90`);
- [x] Preço brasileiro completo (`"1.250,90"` -> `1250.90`);
- [x] Preço americano com ponto (`"1250.90"` -> `1250.90`);
- [x] Rejeição de valores negativos (`-10.50`, `-5`);
- [x] Rejeição de valores zerados (`0`, `"0"`);
- [x] Rejeição de campos vazios ou apenas com espaços (`""`, `"   "`);
- [x] Rejeição de valores alfabéticos no preço (`"invalido"`);
- [x] Validação de cabeçalhos e status HTTP adequados (`200`, `201`, `400`, `404`);
- [x] Rejeição de DELETE com IDs inválidos ou negativos (`/produtos/abc`, `/produtos/-1`);
- [x] Healthcheck operacional (`GET /health`);
- [x] Compilação estrita sem erros de TypeScript (`npx tsc --noEmit`).

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição | Status Sucesso | Status Erro |
|---|---|---|---|---|
| `GET` | `/health` | Status de saúde da API | `200 OK` | - |
| `GET` | `/produtos` | Lista todos os produtos ordenados por ID decrescente | `200 OK` | `500 Internal Error` |
| `POST` | `/produtos` | Valida e cadastra um novo produto | `201 Created` | `400 Bad Request` / `500` |
| `DELETE` | `/produtos/:id` | Exclui o produto correspondente ao ID informado | `200 OK` | `400` / `404 Not Found` / `500` |

### Exemplo de Corpo da Requisição (`POST /produtos`):
```json
{
  "nome": "Monitor Gamer 27\"",
  "preco": "1.499,90"
}
```

### Exemplo de Resposta de Sucesso:
```json
{
  "success": true,
  "message": "Produto cadastrado com sucesso!",
  "data": {
    "id": 1,
    "nome": "Monitor Gamer 27\"",
    "preco": 1499.90
  }
}
```

---

## 📲 Instruções de Execução

### No Expo Go (Aparelho Físico)
1. Conecte o celular e o computador na mesma rede Wi-Fi;
2. Execute `npx expo start` dentro de `mobile`;
3. Abra a câmera (iOS) ou o app Expo Go (Android) e escaneie o QR Code exibido no terminal.

### No Emulador Android (Android Studio)
1. Inicie seu emulador no Android Studio;
2. Com o Expo rodando, pressione a tecla `a` no terminal do Metro Bundler.

### No Simulador iOS (macOS / Xcode)
1. Com o simulador aberto, pressione a tecla `i` no terminal do Expo.

---

## 🔒 Cuidados de Segurança

1. O arquivo `.gitignore` protege contra a inclusão inadvertida de `.env` ou pastas de dependências.
2. Jamais realize commits contendo chaves de API, senhas ou strings de conexão.
3. Para publicação em produção, recomenda-se configurar variáveis de ambiente no serviço de hospedagem (como Render, Railway ou Fly.io para a API, e EAS Build para o app Expo).
