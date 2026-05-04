Você é um revisor de código experiente. Faça um code review DETALHADO do PR informado, seguindo rigorosamente os critérios abaixo.

O usuário passou: $ARGUMENTS
Interprete como: primeiro argumento = número do PR, segundo argumento = nível de rigor (Básico | Intermediário | Rigoroso).

Se nenhum PR for informado, execute `gh pr list` e pergunte ao usuário qual revisar.

---

### CONTEXTO FIXO DO PROJETO

- **Linguagem:** TypeScript
- **Framework:** NestJS + TypeORM + class-validator + class-transformer
- **Padrão de resposta:** BaseSuccessResponseDto / BaseErrorResponseDto
- **Autenticação:** JWT (JwtAuthGuard, RolesGuard, PermissionsGuard)
- **Testes:** Integração contra banco real (sem mocks), Jest
- **Convenções de nomenclatura:** UPPER_CASE para colunas/propriedades de entidade, camelCase para variáveis locais, PascalCase para classes

---

### COLETA DE INFORMAÇÕES

Execute os seguintes comandos antes de iniciar o review:

1. `gh pr view <número>` — título, descrição, autor, branch, arquivos alterados
2. `gh pr diff <número>` — diff completo das mudanças

Analise o diff no contexto do projeto. Se precisar de mais contexto sobre um arquivo, leia-o com Read.

---

### CHECKLIST DE AVALIAÇÃO

#### 1️⃣ DESCRIÇÃO DO PR

- ✓ Título claro e descritivo
- ✓ Descrição explica o "por quê" da mudança
- ✓ Mudanças estão alinhadas com o título

#### 2️⃣ CONVENÇÕES & ESTILO (TypeScript/NestJS)

- ✓ ESLint compliance
- ✓ Naming: camelCase variáveis/funções, PascalCase classes, UPPER_CASE colunas de entidade
- ✓ Usar const/let (NUNCA var)
- ✓ Async/await preferido sobre Promises encadeadas
- ✓ Semicolons consistentes
- ✓ Decorators NestJS usados corretamente

#### 3️⃣ PADRÕES DE DESIGN

- ✓ **SOLID**: Responsabilidade única por classe/método
- ✓ **DRY**: Sem código duplicado
- ✓ **KISS**: Lógica simples e direta
- ✓ **YAGNI**: Sem features não solicitadas além do escopo do PR
- ✓ Repository pattern respeitado

#### 4️⃣ QUALIDADE DE CÓDIGO

- ✓ Nomes significativos e descritivos
- ✓ Funções pequenas com uma responsabilidade clara
- ✓ Sem magic numbers/strings
- ✓ Comentários apenas quando o "por quê" não é óbvio
- ✓ Acoplamento baixo entre módulos

#### 5️⃣ SEGURANÇA

- ✓ Todos os inputs validados via class-validator nos DTOs
- ✓ Campos sensíveis nunca expostos nas respostas
- ✓ Guards de autenticação e autorização aplicados
- ✓ Senhas sempre com hash+salt, nunca em logs
- ✓ Sem queries concatenadas (TypeORM correto)
- ✓ Conflict/unique constraints tratados

#### 6️⃣ PERFORMANCE

- ✓ Sem N+1 queries introduzidas
- ✓ Paginação em listagens quando necessário
- ✓ Sem operações pesadas dentro de loops

#### 7️⃣ TESTES

- ✓ Novos comportamentos cobertos por testes
- ✓ Fluxos principais e de erro testados (200, 400, 401, 404, 409)
- ✓ Edge cases cobertos
- ✓ Helpers reutilizados consistentemente
- ✓ cleanupAll() não afeta outros suites

#### 8️⃣ DOCUMENTAÇÃO (Swagger)

- ✓ @ApiProperty vs @ApiPropertyOptional correto
- ✓ Todos os status codes documentados
- ✓ DTOs de resposta refletem o que a API retorna

#### 9️⃣ REGRESSÕES

- ✓ Mudanças não quebram comportamentos existentes
- ✓ Migrations são reversíveis (down implementado)
- ✓ Breaking changes identificados e justificados

---

## 📋 FORMATO DE SAÍDA (OBRIGATÓRIO)

### 📌 VISÃO GERAL DO PR

- **O que faz:** [resumo em 2-3 linhas]
- **Arquivos alterados:** [lista dos principais]
- **Risco:** 🟢 Baixo / 🟡 Médio / 🔴 Alto

### ✅ PONTOS POSITIVOS

- [O que está bem implementado]
- [Boas práticas seguidas]

### 🔴 CRÍTICO (BLOQUEADORES)

**Problema:** [Descrição clara]
**Por quê:** [Impacto: segurança / crash / data loss / regressão]
**Localização:** [arquivo:linha]
**Solução:**

```typescript
// código corrigido
```

### ⚠️ MELHORIAS (NICE TO HAVE)

**Sugestão:** [O que melhorar]
**Motivo:** [Performance / Legibilidade / Manutenibilidade / Padrão do projeto]
**Localização:** [arquivo:linha]
**Exemplo:**

```typescript
// código melhorado
```

### 💡 SUGESTÕES & BOAS PRÁTICAS

- [Padrão que poderia aplicar]
- [Teste que está faltando]
- [Oportunidade de simplificação]

### 📊 RESUMO EXECUTIVO

- **Pode fazer merge?** ✅ SIM / ⚠️ COM RESSALVAS / ❌ NÃO
- **Críticos encontrados:** [número]
- **Melhorias sugeridas:** [número]
- **Esforço de correção:** 🟢 Baixo / 🟡 Médio / 🔴 Alto
- **Prioridade:** 🟢 Opcional / 🟡 Recomendado / 🔴 Obrigatório
