---
name: guarde-ui
description: Define a identidade visual e os padrões de UI do app Guarde (azul e branco). Use sempre que for criar ou estilizar telas/componentes deste app — cores, cards, listas, calendário, barra de navegação inferior, botão flutuante — para manter consistência visual com o mockup de referência. Gatilhos: "estilizar", "criar tela", "novo componente", "cores do app", "design system", "UI do Guarde".
---

# Identidade Visual — Guarde

O Guarde é um app de saúde pessoal (PHR) cuja identidade visual é **estritamente azul e branco**. O ícone do app é um escudo branco com um "G" estilizado sobre fundo azul sólido — reforça o conceito de "guardar/proteger" os dados clínicos do usuário. Essa dualidade proteção + clínico deve se refletir na UI: limpa, clara, confiável, sem ruído visual.

## Paleta de cores

Extraída do mockup de referência (tela "Suas Consultas") e do ícone do app. Valores são aproximados — ajuste levemente se houver guia de marca oficial, mas mantenha a relação entre eles.

| Token | Valor aprox. | Uso |
|---|---|---|
| `primary` | `#0A84FF` | Ações primárias, texto/ícones de destaque, dia da semana de fim de semana no calendário, aba ativa da tab bar, barra de destaque em itens de lista |
| `primary-gradient-from` / `primary-gradient-to` | `#2FA8FF` → `#00C2FF` | Botão flutuante central de chat/IA (único elemento com gradiente no app — reserve gradiente só para esse destaque) |
| `surface` | `#FFFFFF` | Fundo das telas e dos cards |
| `surface-subtle` | `#F5F7FA` | Fundos secundários/seções |
| `hairline` | `#E3ECFB` | Bordas de cards (ex.: contorno do widget de calendário), tom azul bem claro, nunca cinza puro — usar como `border-hairline` no NativeWind |
| `text-primary` | `#0B0B0C` | Títulos, nomes de consulta/exame |
| `text-secondary` | `#6B7280` | Datas, legendas, labels de mês/dias da semana |

Regra: **nenhuma outra cor de marca** (verde, vermelho, laranja) deve aparecer, exceto para estados semânticos inevitáveis (erro/sucesso de validação) — e mesmo assim, usar com moderação.

## Padrões de componente observados no mockup

- **Cantos arredondados em tudo**: cards, botões, calendário, ícone da aba ativa. Nunca usar bordas quadradas.
- **Card branco com borda sutil** (`border-subtle`) é o container padrão — usado no calendário e nos itens de lista.
- **Calendário**: header com nome do mês centralizado em `text-secondary`; dias da semana (Sáb/Dom) em `primary`; dias úteis em `text-primary`/`text-secondary`; numeração de semana à esquerda em pill preto arredondado.
- **Lista de itens (consultas/exames)**: card branco arredondado, checkbox à esquerda, título em negrito (`text-primary`), data abaixo em `text-secondary` menor, menu de 3 pontos à direita. O próximo item relevante ganha uma **barra vertical `primary`** de ~3–4px colada na borda esquerda do card — use esse padrão para indicar "próximo/destaque", não cor de fundo diferente.
- **Botão de ação flutuante (FAB) "+"**: círculo `primary` sólido, canto inferior direito, sobre a lista — para ações de criação (nova consulta, novo exame).
- **Barra de navegação inferior**: fundo branco, 5 posições (Home, Repositório de exames, [botão central], Agenda, Perfil). O item ativo tem um fundo preenchido `primary` arredondado atrás do ícone (não apenas cor do ícone). O botão central é **elevado acima da barra**, circular, com o gradiente reservado para o assistente de IA/chat — é o único ponto do app com gradiente, reforçando que é o "diferencial técnico".
- **Ícones**: estilo outline, traço fino, minimalista — consistente em toda a navbar e nos menus de ação (3 pontos).

## Como aplicar no código

- O projeto já usa **NativeWind** ([tailwind.config.js](../../../tailwind.config.js)), que já tem os tokens `primary`, `surface`/`surface-subtle`, `hairline` e `muted` registrados em `theme.extend.colors` — use-os (`bg-primary`, `border-hairline`, `text-muted`, etc.) em vez de hex direto espalhado pelos componentes.
- `src/constants/theme.ts` hoje só tem tons neutros (`Colors.light`/`Colors.dark`) sem azul de marca — ao introduzir os tokens no Tailwind, espelhe os equivalentes nesse arquivo para quem ainda usa `Colors` diretamente (ex.: `@expo/ui`, que não lê classes Tailwind).
- Em dark mode, mantenha `primary` vibrante (pode clarear levemente, ex. `#409CFF`, para contraste em fundo escuro) e inverta `surface`/`text-primary` para preto/branco, seguindo o padrão já usado em `Colors.dark`.
- Prefira `@expo/ui` para controles nativos padrão (switch, picker, segmented control) e NativeWind para os componentes customizados descritos acima (cards, lista, calendário, tab bar, FAB) — ver decisão registrada em [[app-context]].

## O que evitar

- Não misturar bordas retas com o restante arredondado do app.
- Não usar cinza puro em bordas — usar `border-subtle` (azul bem claro) para manter a identidade azul mesmo em elementos neutros.
- Não replicar o gradiente do botão de chat em outros elementos — ele é exclusivo do ponto de entrada da IA.
- Não assumir os hex acima como definitivos sem confirmar com o usuário caso surja um guia de marca oficial do TCC.
