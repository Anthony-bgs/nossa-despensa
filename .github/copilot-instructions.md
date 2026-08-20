# Instruções para o Copilot

- Priorizar o uso do SDK do Supabase em todas as consultas ao banco.
- Quando existir relacionamento entre tabelas, usar a sintaxe de relacionamento do Supabase antes de buscar alternativas mais complexas.
- Manter a convenção de `snake_case` no banco e `camelCase` na API.
- Evitar SQL bruto e consultas manuais quando o cliente do Supabase puder resolver a mesma necessidade.
- Para contagem e agregação por relacionamento, preferir a query do banco ao invés de computar em memória com múltiplas requisições.
