# Ford Retain 🚘

Sistema inteligente de retenção pós-venda desenvolvido para monitoramento de clientes Ford com risco de abandono no pós-venda.

O projeto foi desenvolvido como parte do **Challenge 2 — Pós-Vendas**, com foco em experiência do usuário, gestão de clientes, acompanhamento de revisões, analytics e retenção de clientes.

---

# ✨ Funcionalidades

- Dashboard inteligente de retenção
- Cadastro de usuários
- Login e autenticação
- Proteção de senhas com bcrypt
- Classificação de risco dos clientes
- Analytics e insights operacionais
- Gestão de clientes e veículos
- Busca e filtros de clientes
- Tela de detalhes completa
- Atualização de status dos clientes
- Sistema de agendamento de revisões
- Seleção de concessionária
- Registro de data, horário e serviço
- Persistência dos dados
- Interface responsiva para desktop e mobile
- Navegação com Expo Router
- Integração com API REST

---

# 📊 Módulos do sistema

## Dashboard

- Visão geral dos clientes
- Indicadores de risco
- Clientes prioritários
- Navegação rápida entre os módulos

## Clientes

- Listagem de clientes e veículos
- Busca por cliente, veículo ou cidade
- Filtros por nível de risco
- Cards responsivos
- Informações de contato
- Status de acompanhamento

## Detalhes

- Informações completas do cliente
- Dados do veículo
- Quilometragem
- Última revisão
- Situação da garantia
- Motivo da classificação de risco
- Sugestão de ação
- Atualização do status do cliente
- Acesso ao agendamento de revisão

## Analytics & IA

- Distribuição dos clientes por risco
- Indicadores operacionais
- Média de quilometragem
- Informações para auxiliar na priorização dos clientes

## Agendamentos

- Registro de revisões
- Seleção de concessionária
- Escolha de data e horário
- Tipo de serviço
- Campo de observações
- Status do agendamento
- Atualização automática do status do cliente

## Cadastro e Login

- Cadastro de novos usuários
- Validação de nome e e-mail
- Validação e confirmação de senha
- Verificação de e-mail já cadastrado
- Exibição e ocultação da senha
- Senhas protegidas com bcrypt
- Login integrado ao banco de dados

---

# 🛠️ Tecnologias utilizadas

## Front-end

- React Native
- Expo
- Expo Router
- TypeScript
- JavaScript
- React Hooks
- Responsive Design

## Back-end

- Node.js
- Express
- API REST
- bcrypt
- CORS

## Banco de dados

- SQLite

---

# 🔗 API REST

O aplicativo possui um backend próprio responsável pela comunicação entre a interface e o banco de dados.

Principais rotas:

### Usuários

```text
POST /usuarios
POST /login
```

### Clientes

```text
GET /clientes
GET /clientes/:id
PUT /clientes/:id/status
```

### Agendamentos

```text
GET /agendamentos
POST /agendamentos
```

### Concessionárias

```text
GET /concessionarias
```

---

# 🔐 Segurança

As senhas dos novos usuários não são armazenadas diretamente no banco de dados.

O sistema utiliza **bcrypt** para gerar o hash das senhas antes do armazenamento.

O cadastro também possui validações para impedir:

- Campos vazios
- E-mails inválidos
- E-mails já cadastrados
- Senhas com menos de 6 caracteres
- Confirmação de senha diferente da senha informada

---

# 💾 Persistência de dados

O Ford Retain utiliza **SQLite** para armazenamento dos dados.

São armazenadas informações relacionadas a:

- Usuários
- Clientes
- Veículos
- Status de atendimento
- Agendamentos

Os dados permanecem salvos mesmo após o servidor ser encerrado e iniciado novamente.

---

# 📱 Responsividade

O sistema foi adaptado para diferentes tamanhos de tela:

- Desktop
- Tablet
- Mobile

A interface utiliza layouts responsivos para reorganizar cards, formulários e informações de acordo com o tamanho da tela.

---

# ▶️ Como executar o projeto

## 1. Instalar as dependências

Na pasta principal do projeto:

```bash
npm install
```

## 2. Instalar as dependências do backend

```bash
cd backend
npm install
```

## 3. Iniciar o backend

Dentro da pasta `backend`:

```bash
node server.js
```

O servidor será iniciado na porta `3001`.

## 4. Iniciar o aplicativo

Em outro terminal, na pasta principal:

```bash
npx expo start
```

Para executar no navegador:

```bash
npx expo start --web
```

---

# ⚙️ Configuração da API

O endereço utilizado pelo aplicativo para acessar o backend está configurado no arquivo:

```text
src/services/api.ts
```

Exemplo:

```ts
const API_URL = "http://10.0.0.131:3001";
```

Caso o projeto seja executado em outro computador ou outra rede, o endereço IP deve ser alterado para o IP da máquina que está executando o backend.

---

# 🚀 Futuras implementações

- Autenticação utilizando JWT
- Recuperação de senha
- Área específica para o cliente
- Sistema de notificações
- Integração com serviços de IA
- Deploy do backend
- Melhorias nos relatórios e analytics

---

# 📸 Preview

Sistema inspirado em soluções corporativas automotivas modernas, focado em retenção de clientes, acompanhamento de revisões e inteligência operacional no pós-venda.

---

# 🎓 Challenge — Pós-Vendas

Projeto desenvolvido para o **Challenge — Pós-Vendas**.

## 👥 Integrantes

- **Lorenzzo Vendruscolo Dias** — RM558305
- **Gabriel Martins Vannucci** — RM556883
- **Miguel Marques Lourenço** — RM555426
- **Pedro Henrique Ferronato** — RM554757
- **Athos Rodrigues Alves** — RM555515

---

# 👨‍💻 Repositório

GitHub:

https://github.com/LorenzzoDiass