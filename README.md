# Nossa Despensa - API Backend

API REST para gerenciamento de despensa doméstica, permitindo controle de produtos, lotes e imagens com armazenamento local.

## 🚀 Tecnologias

- **Node.js** com **ES Modules**
- **Express.js** para API REST
- **MongoDB** + **Mongoose** para persistência
- **Multer** + **Sharp** para upload e processamento de imagens
- **CORS** para acesso cross-origin

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou Atlas)

### Instalação
```bash
npm install
```

### Configuração
Crie arquivo `.env` na raiz:
```env
APP_URL=http://localhost:5000
PORT=5000
MONGO_URI=mongodb://localhost:27017/nossa-despensa
```

### Execução
```bash
# Desenvolvimento
npm run dev

# Migração de dados (se necessário)
npm run migrate
```

## 📋 API Endpoints

### 🛒 Produtos

#### CRUD Básico
| Método | Endpoint | Descrição | Ciclo de Vida |
|--------|----------|-----------|---------------|
| `POST` | `/produtos` | Criar produto | → Validação → Criação no DB → Retorno |
| `GET` | `/produtos` | Listar produtos | → Consulta DB → Retorno lista resumida |
| `GET` | `/produtos/:id` | Buscar produto | → Busca por ID → Populate lotes/imagens → Retorno |
| `PUT` | `/produtos/:id` | Atualizar produto | → Busca → Validação → Update → Retorno |
| `DELETE` | `/produtos/:id` | Remover produto | → Busca → Remove lotes/imagens → Remove produto |

#### Consultas Específicas
| Método | Endpoint | Descrição | Ciclo de Vida |
|--------|----------|-----------|---------------|
| `GET` | `/produtos/status/proximos-do-vencimento?dias=7` | Produtos próximos vencimento | → Busca lotes → Filtra por data → Retorna produtos únicos |
| `GET` | `/produtos/status/em-falta` | Produtos sem estoque | → Filtra produtos sem lotes ativos → Retorno |
| `GET` | `/produtos/categoria/:categoria` | Produtos por categoria | → Busca por enum categoria → Retorno |

### 📦 Lotes

#### Gerenciamento de Lotes
| Método | Endpoint | Descrição | Ciclo de Vida |
|--------|----------|-----------|---------------|
| `POST` | `/produtos/:produtoId/lotes` | Adicionar lote | → Valida produto → Cria lote → Adiciona ref no produto → Atualiza status produto |
| `GET` | `/produtos/:produtoId/lotes` | Listar lotes do produto | → Busca produto → Retorna lotes ordenados por validade |
| `GET` | `/lotes/:numero` | Buscar lote por número | → Busca por número único → Populate produto → Retorno |
| `PUT` | `/lotes/:id` | Atualizar lote | → Busca lote → Update campos → Verifica status produto → Retorno |
| `DELETE` | `/lotes/:id` | Remover lote | → Busca lote → Remove lote → Remove ref do produto → Atualiza status produto |
| `PUT` | `/lotes/:id/status` | Alterar status lote | → Valida status → Update lote → Retorno |

### 🖼️ Imagens

#### Gerenciamento de Imagens
| Método | Endpoint | Descrição | Ciclo de Vida |
|--------|----------|-----------|---------------|
| `POST` | `/imagens/produtos/:produtoId` | Upload imagem | → Recebe multipart → Valida tipo/tamanho → Processa com Sharp → Salva local → Cria registro DB → Adiciona ref no produto |
| `GET` | `/imagens/produtos/:produtoId` | Listar imagens | → Busca produto → Retorna metadados imagens |
| `DELETE` | `/imagens/produtos/:produtoId/:imagemId` | Remover imagem | → Busca imagem → Remove arquivo disco → Remove registro DB → Remove ref do produto |

### 📁 Arquivos Estáticos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/uploads/produtos/:produtoId/:filename` | Servir imagem | Acesso direto aos arquivos processados |

## 🔄 Ciclo de Vida das Operações

### 1. **Criação de Produto**
```
Requisição → controller.adicionarProduto → service.criarProduto → Validação campos → Criação MongoDB → Resposta 201
```

### 2. **Adição de Lote**
```
Requisição → controller.adicionarLote → service.adicionarLote → Validação produto existe → Validação dados lote →
Criação lote DB → Adiciona referência no produto → Atualiza status produto (EM_ESTOQUE) → Resposta 201
```

### 3. **Upload de Imagem**
```
Requisição multipart → controller.adicionarImagem → service.adicionarImagem → Validação tipo/tamanho → Buffer na memória →
Processamento Sharp (resize) → Salvamento disco local → Criação registro imagem DB → Adiciona referência no produto → Resposta 201
```

### 4. **Consulta com Relacionamentos**
```
Requisição → controller.listarProduto → service.listarProdutoPorId → Busca por ID → Populate lotes/imagens → Retorno JSON
```

### 5. **Atualização com Dependências**
```
Requisição → controller.atualizarLote → service.atualizarLote → Busca lote → Update campos → Verifica status produto → Resposta
```

### 6. **Remoção em Cascata**
```
Requisição → controller.removerProduto → service.removerProduto → Busca produto → Remove lotes/imagens → Remove produto → Resposta 204
```

## 📝 Exemplos de Uso

### Criar Produto
```bash
POST /produtos
Content-Type: application/json

{
  "nome": "Arroz Branco",
  "marca": "Tio João",
  "categoria": "graos",
  "grandeza": "kg",
  "codigoBarras": "789123456789"
}
```

### Adicionar Lote
```bash
POST /produtos/64f1a2b3c4d5e6f7g8h9i0j1/lotes
Content-Type: application/json

{
  "quantidade": 5,
  "validade": "2024-12-31",
  "numero": "LT001"
}
```

### Upload Imagem
```bash
POST /imagens/produtos/64f1a2b3c4d5e6f7g8h9i0j1
Content-Type: multipart/form-data

# Campo: imagem (file)
```

### Consultar Produtos Próximos Vencimento
```bash
GET /produtos/status/proximos-do-vencimento?dias=7
```

## 🏗️ Arquitetura

```
server.js
├── src/app.js (middlewares + rotas)
├── src/routes/
│   ├── produto.route.js
│   ├── lote.route.js
│   └── imagem.route.js
├── src/controllers/
│   ├── produto.controller.js
│   ├── lote.controller.js
│   └── imagem.controller.js
├── src/services/
│   ├── produto.service.js
│   ├── lote.service.js
│   └── imagem.service.js
├── src/models/
│   ├── produto.model.js
│   ├── lote.model.js
│   └── imagem.model.js
└── src/helpers/
    ├── produto.enum.js
    └── tratamentoErro.js
```

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev      # Inicia servidor
npm run migrate  # Executa migração de dados
```

### Estrutura de Dados

#### Produto
```javascript
{
  nome: String,
  marca: String,
  categoria: Enum,
  grandeza: Enum,
  codigoBarras: String,
  localArmazenamento: String,
  status: Enum,
  estoqueTotal: Number,
  lotes: [ObjectId],
  images: [ObjectId]
}
```

#### Lote
```javascript
{
  produto: ObjectId,
  quantidade: Number,
  validade: Date,
  dataEntrada: Date,
  numero: String,
  status: Enum
}
```

#### Imagem
```javascript
{
  produto: ObjectId,
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  path: String,
  url: String,
  width: Number,
  height: Number
}
```

## 📋 TODO / Melhorias Futuras

- [ ] Autenticação JWT
- [ ] Validação com Joi/Zod
- [ ] Testes unitários/integração
- [ ] Cache Redis
- [ ] Upload para S3/Cloudinary
- [ ] Logs estruturados
- [ ] Documentação OpenAPI/Swagger
- [ ] Rate limiting
- [ ] Compressão de respostas

## 📄 Licença

Este projeto é para fins educacionais.