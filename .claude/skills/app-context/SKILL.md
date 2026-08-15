---
name: app-context
description: Fornece o contexto completo do projeto de TCC "Rede Inteligente de Dados Clínicos" (app mobile PHR de gestão de histórico médico pessoal) para contextualizar respostas sobre o app, suas funcionalidades e decisões de produto/arquitetura. Use quando o usuário pedir para "carregar contexto do app", "contexto do TCC", ou quando a conversa precisar de contexto de domínio sobre o projeto (perfil clínico, ID de emergência, exames, diário de consultas, agenda, assistente de IA, resumo médico).
---

Você está me ajudando a desenvolver meu TCC. Abaixo está todo o contexto
do projeto, da equipe e do meu perfil. Use essas informações para
contextualizar todas as suas respostas.

---

## PROJETO: Rede Inteligente de Dados Clínicos

### Descrição Geral
Aplicação mobile focada na centralização e portabilidade de informações
clínicas essenciais, permitindo que o usuário atue como principal gestor
de seu histórico médico (PHR - Personal Health Record).

---

### Funcionalidades do Sistema

1. **Perfil Clínico Estruturado**
   - Cadastro de dados biométricos e críticos
   - Tipo sanguíneo, alergias severas, condições crônicas (ex: arritmia)
   - Medicamentos de uso contínuo

2. **Carteira de Identificação Virtual (ID de Emergência)**
   - Interface de acesso rápido
   - Exibe exclusivamente dados vitais para situações de socorro imediato

3. **Repositório de Evidências Clínicas**
   - Módulo para anexar e organizar exames laboratoriais
   - Registros fotográficos de laudos

4. **Diário de Consultas**
   - Registro descritivo de interações médicas
   - Anotações sobre diagnósticos, orientações recebidas
   - Anexos pertinentes a cada visita médica

5. **Gestão de Agenda e Profilaxia**
   - Agendamento de consultas futuras
   - Notificações configuradas para 48 horas de antecedência

6. **Assistente de IA Contextual (Diferencial Técnico)**
   - Chat de IA via API (Claude ou similar)
   - Técnica de Injeção de Contexto: a cada interação, o sistema envia
     automaticamente os dados críticos do perfil do usuário (alergias,
     patologias, restrições) como system prompt ou metadados
   - Respostas personalizadas e seguras considerando o histórico clínico
     específico do indivíduo

7. **Botão "Resumo Médico" (Interoperabilidade Humana)**
   - Consolida em visualização em cascata todos os dados críticos e
     histórico cronológico de consultas
   - Facilita comunicação médico-paciente durante o atendimento
   - Permite que o profissional visualize meses de histórico em segundos
