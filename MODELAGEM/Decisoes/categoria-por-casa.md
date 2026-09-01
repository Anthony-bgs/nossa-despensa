# Decisão: categoria específica da casa

## Duvida

Deveria a categoria ser uma tabela global em `produtos` ou deveria ser específica da casa e ficar em `itens_despensa`?

## Decisão final

A categoria será específica da casa e ficará em `itens_despensa.categoria_id`.

## Explicação

Essa decisão foi tomada porque o casal pode organizar o estoque da casa de forma diferente, mesmo para o mesmo produto. Por exemplo, o arroz pode ser classificado como "Grãos" em uma casa e "Alimentos Básicos" em outra. Isso torna a categoria mais contextual e alinhada ao uso real do sistema.

Além disso, a categoria da casa é mais flexível para filtros e organização do estoque, sem forçar todos os produtos a seguir uma mesma classificação global. Mantém também a entidade `produtos` mais limpa e focada no catálogo do item, enquanto `itens_despensa` representa a realidade do estoque da casa.

## Impacto

- `produtos` continua sendo o catálogo do produto
- `itens_despensa` representa o item real dentro da casa
- cada casa pode definir sua própria organização por categoria
- filtros por categoria passam a ser mais úteis para o dashboard do usuário
- reduz a rigidez de classificar todos os produtos em um padrão único

## Observação

Se futuramente a equipe quiser suporte a categorias globais e categorias por casa ao mesmo tempo, isso pode ser evoluído com uma tabela de categorias e uma relação opcional por casa, mas por enquanto a decisão atual é manter a categoria no nível do item da despensa.
