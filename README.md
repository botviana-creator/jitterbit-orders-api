# 📦 Jitterbit Orders API

API REST para gerenciamento de pedidos, desenvolvida em **Node.js + Express + SQLite**, como parte do Teste Técnico da Jitterbit.

---

## 🚀 Tecnologias

- **Node.js** — Runtime JavaScript
- **Express** — Framework web
- **better-sqlite3** — Banco de dados SQLite embarcado (sem necessidade de servidor externo)
- **dotenv** — Gerenciamento de variáveis de ambiente

---

## 📁 Estrutura do Projeto

```
jitterbit-orders-api/
├── src/
│   ├── config/
│   │   └── database.js        # Inicialização e conexão com o banco SQLite
│   ├── controllers/
│   │   └── orderController.js # Lógica de cada endpoint
│   ├── middleware/
│   │   └── errorHandler.js    # Tratamento global de erros e 404
│   ├── models/
│   │   └── orderModel.js      # Operações no banco + mapeamento de campos
│   ├── routes/
│   │   └── orderRoutes.js     # Definição das rotas
│   └── server.js              # Ponto de entrada da aplicação
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Como rodar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/jitterbit-orders-api.git
cd jitterbit-orders-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

O arquivo `.env` padrão já funciona sem alterações:
```env
PORT=3000
DB_PATH=./database.sqlite
```

### 4. Inicie o servidor
```bash
# Produção
npm start

# Desenvolvimento (com hot-reload via nodemon)
npm run dev
```

O banco de dados SQLite é criado automaticamente na primeira execução.

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `Order`
| Coluna        | Tipo | Descrição              |
|---------------|------|------------------------|
| orderId       | TEXT | Chave primária         |
| value         | REAL | Valor total do pedido  |
| creationDate  | TEXT | Data de criação (ISO)  |

### Tabela: `Items`
| Coluna    | Tipo    | Descrição                          |
|-----------|---------|------------------------------------|
| id        | INTEGER | Chave primária auto-incrementada   |
| orderId   | TEXT    | FK para Order                      |
| productId | INTEGER | ID do produto                      |
| quantity  | INTEGER | Quantidade                         |
| price     | REAL    | Preço unitário                     |

---

## 🔄 Mapeamento de Campos

A API recebe os dados no formato em português e os persiste mapeados para inglês:

| Campo recebido    | Campo salvo     |
|-------------------|-----------------|
| numeroPedido      | orderId         |
| valorTotal        | value           |
| dataCriacao       | creationDate    |
| items[].idItem    | items[].productId |
| items[].quantidadeItem | items[].quantity |
| items[].valorItem | items[].price   |

---

## 📡 Endpoints

### `POST /order` — Criar pedido

**Request body:**
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

**Response `201`:**
```json
{
  "message": "Pedido criado com sucesso.",
  "data": {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [{ "productId": 2434, "quantity": 1, "price": 1000 }]
  }
}
```

**cURL de exemplo:**
```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [{ "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }]
}'
```

---

### `GET /order/:orderId` — Buscar pedido por ID

```bash
curl http://localhost:3000/order/v10089015vdb-01
```

**Response `200`:**
```json
{
  "data": {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [{ "productId": 2434, "quantity": 1, "price": 1000 }]
  }
}
```

---

### `GET /order/list` — Listar todos os pedidos

```bash
curl http://localhost:3000/order/list
```

**Response `200`:**
```json
{
  "total": 1,
  "data": [ { "orderId": "...", "value": 10000, "creationDate": "...", "items": [] } ]
}
```

---

### `PUT /order/:orderId` — Atualizar pedido

```bash
curl --location --request PUT 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Content-Type: application/json' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 20000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [{ "idItem": "2434", "quantidadeItem": 2, "valorItem": 10000 }]
}'
```

**Response `200`:**
```json
{ "message": "Pedido atualizado com sucesso.", "data": { ... } }
```

---

### `DELETE /order/:orderId` — Deletar pedido

```bash
curl --location --request DELETE 'http://localhost:3000/order/v10089015vdb-01'
```

**Response `200`:**
```json
{ "message": "Pedido deletado com sucesso." }
```

---

## ⚠️ Códigos de Status HTTP

| Código | Significado                              |
|--------|------------------------------------------|
| 200    | Sucesso                                  |
| 201    | Criado com sucesso                       |
| 400    | Campos obrigatórios ausentes             |
| 404    | Pedido não encontrado                    |
| 409    | Pedido já existe (número duplicado)      |
| 500    | Erro interno do servidor                 |
