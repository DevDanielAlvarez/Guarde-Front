---
name: app-progress
description: Mostra o que já foi construído no app Guarde e o que ainda falta, mapeado contra as 7 funcionalidades descritas em [[app-context]]. Use quando o usuário perguntar "o que já foi feito", "status do projeto", "progresso do app", "o que falta fazer" ou pedir um resumo do andamento do TCC.
---

# Progresso do Guarde

**Última atualização deste snapshot: 2026-08-15.** Este arquivo é um retrato do repositório num momento específico — ele decai rápido. Antes de apresentar qualquer item abaixo como fato atual, confira contra o estado real do repo (`git log --oneline`, existência dos arquivos citados) e, se o usuário pedir uma atualização de status, **atualize este arquivo** depois de responder (nova seção/data, não reescreva o histórico).

---

## Infraestrutura

- Expo SDK 57 + Expo Router (rotas tipadas) + TypeScript strict, app root em `src/`.
- **NativeWind** (Tailwind v3.4) configurado: `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `nativewind-env.d.ts`, diretivas `@tailwind` em `src/global.css`.
- Tokens de design em `tailwind.config.js` (`primary`, `surface`/`surface-subtle`, `hairline`, `muted`) — ver [[guarde-ui]] para o racional da paleta.
- Tipografia: **Inter** (Google Fonts) carregada de verdade via `expo-font` (pesos 400/500/600/700/800, importados por caminho exato pra não empacotar pesos não usados). Substituiu as fontes de sistema inconsistentes que o template usava antes. `constants/theme.ts` (`Fonts`) e `ThemedText` já usam os pesos corretos.
- ESLint configurado (`eslint-config-expo`). Único erro pendente, pré-existente e não relacionado a nada construído: `react-hooks/set-state-in-effect` em `src/hooks/use-color-scheme.web.ts`.

## Navegação

- Stack raiz (`src/app/_layout.tsx`): grupo `(tabs)`, `login`, `register`, `chat` (apresentado como modal).
- Dentro de `(tabs)`: tab bar **customizada** via `expo-router/ui` (`Tabs`/`TabList`/`TabTrigger`/`TabSlot`) — trocou a `NativeTabs` original porque ela não suporta o botão de chat flutuante saindo por cima da barra.
- 4 abas reais: **Home** (`index.tsx`, ainda com o conteúdo boilerplate "Welcome to Expo" do template — não trocado ainda), **Arquivos**, **Agenda**, **Perfil**. Mais o botão de **chat** flutuante (gradiente azul→ciano) que abre `/chat` como modal.
- `Arquivos`, `Perfil` e `Chat` são **placeholders** (`PlaceholderScreen`: só título + descrição, zero funcionalidade real). `Agenda` já tem UI real com dados mock — ver seção "Agenda" abaixo.
- `explore.tsx` (aba antiga do template Expo) segue existindo como arquivo mas não está mais linkada na tab bar.

## Autenticação

- `/login`: CPF (com máscara automática `000.000.000-00`) + senha (toggle mostrar/ocultar), validação de formato client-side.
- `/register`: nome completo, CPF, e-mail, senha, confirmar senha — mesmas validações de formato.
- Visual: foto de fundo em tela cheia + gradiente + logo real (`assets/images/branding/logo.png`) + card branco flutuante com inputs em formato pílula (ver [[guarde-ui]]).
- **Não implementado**: recuperação de senha (o link "Esqueci minha senha" é só texto estático), login social, persistência de sessão/token, qualquer chamada de API real. O botão "Entrar"/"Cadastrar" apenas navega — não autentica de verdade.

## Agenda

- `/calendar` (`(tabs)/calendar.tsx`, "Suas Consultas"): tela real com **dados mock**, não é mais placeholder.
- [[mini-calendar]]: grade de mês calculada de verdade (`src/components/mini-calendar.tsx`) — semana começa na segunda, número da semana ISO real (`getISOWeek`), fins de semana em azul, dias fora do mês em cinza. Fixada em março/2026 pra bater com as datas mock. Sem navegação entre meses ainda.
- `src/components/appointment-card.tsx`: card de consulta com checkbox que alterna estado local (sem persistência), título, data, ícone de "mais opções" sem ação.
- 4 consultas mockadas hardcoded no próprio `calendar.tsx` (Cardiologista, Ortopedista, Exame de sangue, Exame de urina).
- Botão "+" flutuante no canto inferior direito — visual apenas, sem `onPress` (não existe fluxo de criar/editar consulta ainda).
- **Não implementado**: dados vindos de API/storage real, criar/editar/excluir consulta, notificação 48h antes (item da funcionalidade 5 do app-context), navegação entre meses.

## Skills do projeto

- [[app-context]] — contexto do TCC (funcionalidades, equipe).
- [[guarde-ui]] — design system (paleta azul/branco, padrões de componente, tokens do Tailwind).
- `app-progress` (esta) — status do que foi construído.

## Git / branches

- `feat/login` — NativeWind + telas de login/cadastro + tipografia. **Mergeado na `main`** (PR #1).
- `feat/navigate` — barra de navegação customizada + tela de Agenda com mock. **Pushed, PR ainda não aberto/mergeado.** A tela de Agenda (`calendar.tsx`, `mini-calendar.tsx`, `appointment-card.tsx`) ainda está **não commitada** no momento deste snapshot.

## Cobertura das 7 funcionalidades do app-context

| # | Funcionalidade | Status |
|---|---|---|
| 1 | Perfil Clínico Estruturado | Não iniciado — `profile.tsx` é placeholder |
| 2 | Carteira de Identificação Virtual (ID de Emergência) | Não iniciado |
| 3 | Repositório de Evidências Clínicas (Arquivos) | Não iniciado — `files.tsx` é placeholder; há mockup de referência ("Seus Arquivos") ainda não implementado |
| 4 | Diário de Consultas | Não iniciado |
| 5 | Gestão de Agenda e Profilaxia | **UI com dados mock feita** (`/calendar`) — falta dados reais, CRUD e notificação 48h antes |
| 6 | Assistente de IA Contextual | Não iniciado — `chat.tsx` é placeholder, sem integração com nenhuma API |
| 7 | Botão "Resumo Médico" | Não iniciado |

Só a Agenda tem UI construída até agora, e só com dados mock — as outras 6 funcionalidades-núcleo ainda não foram iniciadas. Não existe backend/API integrada em nenhum ponto do app.
