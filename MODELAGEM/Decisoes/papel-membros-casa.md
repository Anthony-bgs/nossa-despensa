# Decisão: papel em membros_casa

## Duvida

Qual deve ser o valor do atributo `papel` em `membros_casa`?

## Decisão final

Usar `papel` como permissão funcional, com valores limitados a:

- `admin`
- `membro`

## Explicação

Para o cenário de casal e para o MVP, o papel deve refletir permissão na casa, e não identidade pessoal. Isso deixa o modelo mais flexível, simples e fácil de evoluir.

A ideia é que ambos os membros do casal possam ter acesso completo e compartilhar gestão da casa, mas sem depender de campos como "esposa" ou "marido". O papel representa a capacidade de ação dentro da casa, como gerenciar despensas, locais e configurações.

## Regras sugeridas

- `admin`: pode gerenciar a casa, configurar despensas, locais e permissões
- `membro`: pode visualizar e atualizar itens do estoque, mas com menos privilégios administrativos

## Observação

Como regra de negócios, um casal pode ter ambos os perfis como `admin` quando quiser que os dois tenham controle total. Se a aplicação crescer no futuro, pode ser evoluído para um modelo com roles e permissões mais granulares.
