# Regras do projeto

## Padrão de acesso ao banco

- Priorizar sempre o uso do cliente Supabase e do SDK oficial do Supabase em vez de SQL bruto ou lógicas alternativas quando o mesmo comportamento puder ser resolvido com `supabase.from(...)`.
- Preferir consultas relacionais no padrão do Supabase, por exemplo `select()` com relacionamento (`produtos_despensa!inner(...)`) em vez de resolver a mesma operação com múltiplas consultas separadas.
- Usar o padrão do SDK do Supabase para filtros e ordenação: `.select()`, `.eq()`, `.in()`, `.order()`, `.single()`, `.insert()`, `.update()`, `.delete()`.
- Manter os nomes dos campos conforme o banco: `snake_case` no Supabase, e fazer o mapeamento para `camelCase` na camada de aplicação quando necessário.
- Quando houver uma relação entre tabelas, priorizar o join/relacionamento do próprio Supabase em vez de fazer contagem em memória ou múltiplas buscas do backend.
- Evitar introduzir padrões que não sigam a convenção do projeto com Supabase, especialmente para queries, filtros e joins.

## Padrão de retorno da API

- O serviço deve retornar modelos da aplicação já mapeados para o formato esperado pela API.
- O nome das propriedades da aplicação deve seguir `camelCase` e não refletir diretamente nomes de colunas do banco.
- A lógica de agregação/contagem deve acontecer no banco sempre que possível, seguindo o padrão de acesso ao Supabase.
