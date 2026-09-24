# Diagrama de Entidades e Tipos

```mermaid
erDiagram
    USUARIOS {
        int8 id PK
        text nome
        text email
        text senha_hash
        text foto
        text telefone
        text cpf
        timestamptz criado_em
        timestamptz atualizado_em
    }

    CASAS {
        int8 id PK
        text nome
        text descricao
        timestamptz criado_em
        timestamptz atualizado_em
    }

    MEMBROS_CASA {
        int8 id PK
        int8 casa_id FK
        int8 usuario_id FK
        text papel
        text status
        timestamptz criado_em
        timestamptz atualizado_em
    }

    DESPENSAS {
        int8 id PK
        int8 casa_id FK
        text nome
        text tipo
        text descricao
        timestamptz criado_em
        timestamptz atualizado_em
    }

    LOCAIS_ARMAZENAMENTO {
        int8 id PK
        int8 despensa_id FK
        text nome
        text tipo
        integer ordem
        text observacao
        timestamptz atualizado_em
    }

    CATEGORIAS {
        int8 id PK
        text nome
        text descricao
    }

    PRODUTOS {
        int8 id PK
        text nome
        text marca
        text codigo_barras
        text tamanho_padrao
        text unidade_medida
        timestamptz criado_em
        timestamptz atualizado_em
    }

    ITENS_DESPENSA {
        int8 id PK
        int8 casa_id FK
        int8 despensa_id FK
        int8 local_armazenamento_id FK
        int8 produto_id FK
        int8 categoria_id FK
        int2 quantidade
        int2 quantidade_minima
        date validade
        text status
        timestamptz comprado_em
        timestamptz criado_em
        timestamptz atualizado_em
    }

    LOTES {
        int8 id PK
        int8 item_despensa_id FK
        int2 quantidade
        date validade
        text status
        timestamptz comprado_em
        timestamptz criado_em
        timestamptz atualizado_em
    }

    LISTAS_COMPRA {
        int8 id PK
        int8 casa_id FK
        int8 criada_por FK
        text nome
        text status
        timestamptz criado_em
        timestamptz atualizado_em
    }

    ITENS_LISTA_COMPRA {
        int8 id PK
        int8 lista_compra_id FK
        int8 produto_id FK
        int2 quantidade
        text prioridade
        boolean comprado
        text observacao
        timestamptz atualizado_em
    }

    USUARIOS ||--o{ MEMBROS_CASA : participa
    CASAS ||--o{ MEMBROS_CASA : possui
    CASAS ||--o{ DESPENSAS : tem
    DESPENSAS ||--o{ LOCAIS_ARMAZENAMENTO : contém
    CASAS ||--o{ ITENS_DESPENSA : controla
    DESPENSAS ||--o{ ITENS_DESPENSA : armazena
    LOCAIS_ARMAZENAMENTO ||--o{ ITENS_DESPENSA : guarda
    PRODUTOS ||--o{ ITENS_DESPENSA : representa
    ITENS_DESPENSA ||--o{ LOTES : possui
    CASAS ||--o{ LISTAS_COMPRA : cria
    LISTAS_COMPRA ||--o{ ITENS_LISTA_COMPRA : contém
    PRODUTOS ||--o{ ITENS_LISTA_COMPRA : aparece
    CATEGORIAS ||--o{ ITENS_DESPENSA : classifica
```

## Explicação da modelagem

### 1. `usuarios`
Armazena os usuários da aplicação e o casal.

### 2. `casas`
Representa a residência compartilhada.

### 3. `membros_casa`
Relaciona usuários à casa e define o papel, por exemplo: administrador, membro.

### 4. `despensas`
Representa locais físicos de armazenamento, como geladeira, armário, despensa, etc.

### 5. `locais_armazenamento`
Representa prateleiras, gavetas, portas, etc.

### 6. `categorias`
Agrupa itens por tipo dentro do contexto da casa, como alimentação, limpeza, higiene, grãos, etc.

### 7. `produtos`
É o catálogo do produto base, sem depender da casa.

### 8. `itens_despensa`
É a instância real de um produto na casa. Aqui ficam:
- categoria específica da casa
- quantidade
- quantidade mínima
- validade
- localização física
- status do item

### 9. `lotes`
Permite controlar validade e compra por lote, quando o item chega em diferentes compras.

### 10. `listas_compra`
Armazena a lista de compras da casa.

### 11. `itens_lista_compra`
Relaciona a lista com o produto que precisa ser comprado.

## Observação importante

Para o seu cenário, a separação entre `produtos` e `itens_despensa` é a parte mais importante. Isso permite que o mesmo produto exista em vários locais da casa, com quantidade, validade e categoria específicos do contexto da casa.

A categoria foi movida para `itens_despensa` porque a classificação do estoque pode variar entre casas, mesmo para o mesmo produto, e isso deixa o modelo mais fiel ao uso real do sistema.
