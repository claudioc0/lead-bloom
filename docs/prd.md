# 1. Visão Geral do Produto

 

## 1.1 Descrição

O EditorLeads é um MicroSaaS de prospecção automatizada de clientes voltado exclusivamente para editores de vídeo freelancers e micro-agências. A plataforma monitora canais no YouTube, Instagram e TikTok em busca de criadores de conteúdo com potencial de contratar um editor profissional, gerando leads qualificados com score de fit e mensagens de abordagem personalizadas por IA.

 

## 1.2 Problema que Resolve

Editores de vídeo possuem habilidade técnica mas carecem de sistema de vendas. A prospecção manual é lenta, inconsistente e desmotivante. Hoje um editor típico gasta de 5 a 10 horas semanais procurando clientes de forma manual, com taxa de resposta inferior a 2% por falta de personalização.

 

## 1.3 Proposta de Valor

•     Encontrar leads qualificados automaticamente por nicho, idioma e tamanho de canal

•     Gerar mensagens de prospecção personalizadas com IA (não parecem robô)

•     Pontuar cada lead com score de fit 0–100 para priorização

•     Gerenciar todo o pipeline de vendas em um CRM simples integrado

 

## 1.4 Público-Alvo (ICP)


|                        |                                                            |                                    |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------- |
| **Perfil**             | **Características**                                        | **Dor Principal**                  |
| Freelancer de Edição   | Solo, fatura R$2k–R$8k/mês, quer escalar                   | Sem sistema de prospecção          |
| Micro-agência de Vídeo | 2–5 pessoas, quer mais clientes sem contratar SDR          | Tempo perdido em prospecção manual |
| Editor em Transição    | Saiu de CLT, tem skill técnica, zero experiência em vendas | Não sabe como encontrar clientes   |


  


 

# 2. Objetivos e Métricas de Sucesso

 

## 2.1 Objetivos de Negócio


|             |              |                 |                  |
| ----------- | ------------ | --------------- | ---------------- |
| **Período** | **Meta MRR** | **Nº Clientes** | **Ticket Médio** |
| Mês 3       | R$ 2.500     | ~30 clientes    | R$ 83            |
| Mês 6       | R$ 8.000     | ~100 clientes   | R$ 80            |
| Mês 12      | R$ 15.000    | ~180 clientes   | R$ 83            |


 

## 2.2 KPIs do Produto


|                            |              |                |                |
| -------------------------- | ------------ | -------------- | -------------- |
| **Métrica**                | **Meta MVP** | **Meta Ano 1** | **Frequência** |
| Churn Mensal               | < 8%         | < 5%           | Mensal         |
| Ativação (gera 1 mensagem) | > 60%        | > 75%          | D+7            |
| Retenção D30               | > 45%        | > 60%          | Mensal         |
| NPS                        | > 30         | > 50           | Trimestral     |
| Taxa de Resposta aos Leads | > 8%         | > 15%          | Mensal         |


  


 

# 3. Funcionalidades do Produto

 

## 3.1 MVP — Fase 1 (Meses 1–3)

 

### 3.1.1 Dashboard

•     Cards de métricas: Leads do mês, Mensagens geradas, Leads contactados, Taxa estimada de resposta

•     Indicadores de tendência (↑/↓) com variação percentual em relação ao mês anterior

•     Barra de progress de uso do plano (ex: 12/50 leads)

•     Tabela de leads recentes com colunas: Canal, Nicho, Inscritos, Frequência, Fit Score, Status, Ação

•     Atalhos rápidos: Buscar Leads, Gerar Mensagem, Ver Pipeline

 

### 3.1.2 Busca de Leads (Find Leads)

•     Filtros: Nicho, faixa de inscritos (slider), frequência de upload, idioma, país

•     Contador dinâmico de leads disponíveis conforme filtros mudam

•     Grid de cards com: nome do canal, nicho, inscritos/mês, frequência, país, Fit Score

•     Botões por card: "Gerar Mensagem" e "Salvar Lead"

•     Botão "Buscar Leads" com simulação de loading (scraping assíncrono)

 

### 3.1.3 Gerador de Mensagens (IA)

•     Painel deslizante lateral ativado pelo botão "Gerar Mensagem"

•     Resumo do lead no topo: canal, nicho, inscritos

•     Seletor de Tom: Profissional / Casual / Direto

•     Seletor de Objetivo: Oferecer serviços / Pedir uma call / Enviar portfólio

•     Mensagem personalizada gerada em português via OpenAI GPT-4o-mini

•     Botões: Regenerar, Copiar Mensagem (feedback "Copiado!" por 2s), Marcar como Contactado

•     Contador de caracteres exibido abaixo da área de texto

 

### 3.1.4 Meus Leads (CRM Kanban)

•     Board kanban com 4 colunas: Novos Leads | Contactado | Respondeu | Cliente

•     Cards arrastáveis entre colunas com borda esquerda colorida por score

•     Ícone de arrasto visível nos cards

•     Ações no hover: editar nota, remover lead

•     Nota inline expansível diretamente no card (sem modal)

•     Contador de cards por coluna com cor semântica nos badges

•     Filtros por nicho e score mínimo

 

### 3.1.5 Mensagens

•     Lista de todas as mensagens geradas/enviadas

•     Borda esquerda colorida por status: Contactado=laranja, Respondeu=teal, Cliente=verde

•     Ações no hover: Enviar Follow-up, Ver Lead, Copiar Mensagem

•     Filtros: Todos | Contactado | Respondeu | Cliente

•     Badge "Resposta recebida!" nos cards com status Replied

 

### 3.1.6 Configurações

•     Seção Perfil: Nome, E-mail, Especialidade de edição, URL do portfólio

•     Bloco do Plano: badge do plano atual, features incluídas, barra de uso de leads, botão de upgrade

•     Preferências de prospecção: nicho padrão, idioma das mensagens, tom padrão

•     Seção Zona de Perigo: excluir conta, exportar dados (estilizado em vermelho outline)

 

## 3.2 V2 — Fase 2 (Meses 4–8)

•     Scraping de Instagram e TikTok

•     Envio de e-mail automatizado com integração Gmail/Outlook

•     Sequência de follow-up automático (até 3 etapas)

•     Alertas em tempo real: notifica quando canal do nicho atinge gatilho de crescimento

•     Programa de afiliados com dashboard de comissões (30% recorrente)

•     API pública para plano Agency

  


 

# 4. Histórias de Usuário

 


|        |                                                                                                                       |                                                                 |                 |
| ------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------- |
| **ID** | **História**                                                                                                          | **Critério de Aceitação**                                       | **Prioridade**  |
| US01   | Como editor, quero filtrar leads por nicho e tamanho de canal para encontrar criadores que se encaixam no meu perfil. | Filtros funcionando, resultados atualizados em tempo real       | **Must Have**   |
| US02   | Como editor, quero ver um Fit Score para cada lead para priorizar meu tempo de prospecção.                            | Score 0–100 com codificação de cores (verde/amarelo/vermelho)   | **Must Have**   |
| US03   | Como editor, quero gerar uma mensagem personalizada por IA para não parecer um robô na abordagem.                     | Mensagem referencia o nicho e tamanho do canal, gerada em < 5s  | **Must Have**   |
| US04   | Como editor, quero copiar a mensagem gerada com um clique para colá-la no canal que eu preferir.                      | Botão copia para clipboard + feedback visual "Copiado!"         | **Must Have**   |
| US05   | Como editor, quero salvar leads e organizá-los em um kanban para não perder o controle do funil.                      | Cards arrastáveis entre 4 colunas, persistência no localStorage | **Must Have**   |
| US06   | Como editor, quero ver quantos leads já usei no mês para saber quando estou próximo do limite do plano.               | Barra de progresso visível no dashboard e em settings           | Should Have     |
| US07   | Como editor, quero adicionar notas a cada lead para registrar informações da conversa.                                | Nota expansível inline no card kanban, salva automaticamente    | Should Have     |
| US08   | Como editor, quero filtrar minhas mensagens por status para focar nos leads que responderam.                          | Filtros: Todos / Contactado / Respondeu / Cliente               | Should Have     |
| US09   | Como editor, quero personalizar meu tom padrão de mensagem para não ter que reconfigurar toda vez.                    | Preferência salva em Settings aplicada automaticamente ao gerar | Could Have      |
| US10   | Como editor, quero receber notificações quando novos leads do meu nicho aparecerem para agir rápido.                  | Badge no sino + dropdown com até 5 notificações recentes        | Won't Have (V2) |


  


 

# 5. Arquitetura Técnica

 

## 5.1 Stack Recomendada


|            |                               |                                           |             |
| ---------- | ----------------------------- | ----------------------------------------- | ----------- |
| **Camada** | **Tecnologia**                | **Justificativa**                         | **Custo**   |
| Frontend   | **Next.js 14 + Tailwind CSS** | SSR, ecossistema rico, deploy simples     | Gratuito    |
| Backend    | **Node.js + Hono**            | Leve, tipado, performance edge            | Gratuito    |
| Banco      | **Supabase (Postgres)**       | Auth + DB + Realtime, gratuito até escala | Free tier   |
| Scraping   | **YouTube Data API v3**       | Oficial, estável, 10k unidades/dia grátis | Gratuito    |
| IA         | **OpenAI GPT-4o-mini**        | ∼$0.002/mensagem, rápido, qualidade       | ∼R$0,01/uso |
| Pagamentos | **Stripe ou Hotmart**         | Stripe global; Hotmart para foco BR + Pix | 2.9% + R$1  |
| E-mail     | **Resend**                    | 3k e-mails/mês grátis, API simples        | Free tier   |
| Filas/Jobs | **Upstash QStash**            | Serverless, sem servidor dedicado         | Free tier   |
| Deploy     | **Vercel + Railway**          | Vercel pro frontend, Railway pro workers  | ∼R$50/mês   |


 

## 5.2 Fluxo de Dados — Geração de Lead

1.   Usuário configura filtros (nicho, país, faixa de inscritos, frequência)

2.   Frontend chama endpoint POST /api/leads/search com parâmetros

3.   Backend consulta YouTube Data API v3 com os filtros mapeados

4.   Algoritmo calcula Fit Score (0–100) baseado em: frequência de upload (30%), crescimento recente (25%), consistência do nicho (25%), engajamento médio (20%)

5.   Resultados salvos no Supabase e retornados ao frontend paginados (12 por página)

6.   Usuário clica "Gerar Mensagem" → frontend chama POST /api/messages/generate

7.   Backend monta prompt com dados do canal + preferências do usuário e envia para GPT-4o-mini

8.   Mensagem retornada e exibida no painel lateral em < 5 segundos

  


 

# 6. Modelo de Precificação

 


|                             |                        |                               |                        |
| --------------------------- | ---------------------- | ----------------------------- | ---------------------- |
| **Feature**                 | **Starter — R$47/mês** | **Pro — R$97/mês**            | **Agency — R$197/mês** |
| **Leads por mês**           | 50                     | 300                           | Ilimitados             |
| **Fontes de scraping**      | YouTube                | YouTube + Instagram           | Todas                  |
| **Geração de mensagens IA** | Sim                    | Sim + personalização avançada | Sim + fine-tuning      |
| **Fit Score**               | Básico                 | Completo                      | Completo               |
| **Nichos configurados**     | 1                      | 3                             | Ilimitados             |
| **Follow-up automático**    | Não                    | Sim (3 etapas)                | Sim (5 etapas)         |
| **CRM Kanban**              | Sim                    | Sim                           | Sim                    |
| **Multi-usuário**           | Não                    | Não                           | Sim (5 assentos)       |
| **API Access**              | Não                    | Não                           | Sim                    |
| **Suporte**                 | E-mail (48h)           | E-mail (24h)                  | Prioritário (4h)       |


  


 

# 7. Roadmap de Desenvolvimento

 


|                  |             |                                                                                                         |                                           |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **Fase**         | **Período** | **Entregas**                                                                                            | **Meta de Negócio**                       |
| **Validação**    | Sem 1–4     | Entrevistas com 20 editores, landing page + waitlist, protótipo no-code, definição de stack             | Validar willingness to pay antes de codar |
| **MVP Dev**      | Sem 5–10    | Scraper YouTube API, integração OpenAI, dashboard de leads, sistema de score, auth + billing (Stripe)   | Produto funcional em produção             |
| **Beta Fechado** | Sem 11–14   | Beta com 20 usuários (50% off), coleta de feedback, ajuste de produto, lançamento em grupos de editores | R$ 2.500 MRR                              |
| **Crescimento**  | Meses 4–6   | Scraping Instagram, programa de afiliados (30%), conteúdo SEO, otimização de onboarding                 | R$ 8.000 MRR                              |
| **Maturidade**   | Meses 7–12  | CRM completo, follow-up automático, expansão LATAM, parcerias com escolas de edição, API pública        | R$ 15.000 MRR                             |


  


 

# 8. Riscos e Mitigações

 


|       |                                                              |           |             |                                                                                                    |
| ----- | ------------------------------------------------------------ | --------- | ----------- | -------------------------------------------------------------------------------------------------- |
| **#** | **Risco**                                                    | **Prob.** | **Impacto** | **Mitigação**                                                                                      |
| R01   | YouTube bloqueia acesso à API ou muda limites de cota        | **Média** | **Alto**    | Usar API oficial (10k unidades/dia). Diversificar fontes (Instagram, LinkedIn Jobs) desde o Mês 4  |
| R02   | Baixa conversão na landing page (< 2%)                       | **Média** | **Alto**    | Validar com 20 entrevistas antes de codar. Oferecer garantia de 7 dias sem perguntas               |
| R03   | Churn alto por falta de resultado do usuário                 | **Alta**  | **Alto**    | Onboarding guiado em 3 passos. Templates de mensagem pré-testados. Case studies com early adopters |
| R04   | Custo OpenAI escala desproporcionalmente                     | **Baixa** | **Médio**   | GPT-4o-mini custa ~$0.002/mensagem. Cache de mensagens similares. Fine-tuning próprio no Agency    |
| R05   | Concorrente grande copia o produto                           | **Baixa** | **Médio**   | Focar em comunidade e niche-down. Concorrentes grandes não se movem rápido em microssegmentos      |
| R06   | Dificuldade de ativação (usuário não gera primeira mensagem) | **Média** | **Alto**    | Onboarding interativo que guia até a primeira mensagem gerada. E-mail D+1 com template de ativação |


  


 

# 9. Estratégia Go-to-Market

 

## 9.1 Canais de Aquisição


|                              |                                                                                        |                  |              |
| ---------------------------- | -------------------------------------------------------------------------------------- | ---------------- | ------------ |
| **Canal**                    | **Descrição**                                                                          | **CAC Estimado** | **Fase**     |
| **Comunidades (FB/Discord)** | Grupos de editores de vídeo. Presença genúina + conteúdo de valor antes de vender      | R$ 0–30          | **MVP**      |
| **YouTube Orgânico**         | Vídeos sobre "como conseguir clientes como editor" — SEO de longo prazo                | R$ 20–80         | **Meses 2+** |
| **Afiliados (30% MRR)**      | Editores com audiência promovem o produto. Alta LTV por credibilidade                  | R$ 40–90         | **Mês 4+**   |
| **Cold Outreach**            | Usar o próprio produto para prospectar editores no LinkedIn — prova social instantânea | R$ 15–50         | **MVP**      |
| **Product Hunt**             | Lançamento com caso de uso claro. Early adopters que divulgam                          | R$ 0–20          | **Mês 3**    |
| **Parcerias com Escolas**    | Cinesamurai, Escola do Vídeo como canal de distribuição                                | R$ 50–120        | **Mês 6+**   |


 

## 9.2 Funil de Conversão Esperado

•     Visitante → Cadastro: 3–5%

•     Cadastro → Ativação (1ª mensagem gerada): 60%

•     Ativação → Trial convertido em pago: 25%

•     Pago → Retenção D30: 80%

•     Pago → Upgrade de plano (6 meses): 15%

  


 

# 10. Design System e UI Guidelines

 

## 10.1 Paleta de Cores


|                      |         |                                               |
| -------------------- | ------- | --------------------------------------------- |
| **Token**            | **Hex** | **Uso**                                       |
| **--color-bg**       | #0A0A0F | Fundo principal da aplicação                  |
| **--color-surface**  | #111118 | Cards, sidebars, paineis                      |
| **--color-surface2** | #1A1A24 | Elementos elevados, modais                    |
| **--color-accent**   | #FF5C35 | CTAs primários, Fit Score alto, bordas ativas |
| **--color-teal**     | #4ECDC4 | Status de sucesso, tags, scores altos         |
| **--color-amber**    | #FFB347 | Avisos, scores médios                         |
| **--color-border**   | #2A2A3A | Bordas de cards e divisórias                  |
| **--color-text**     | #F0F0F5 | Texto primário                                |
| **--color-muted**    | #7070A0 | Texto secundário, labels                      |


 

## 10.2 Tipografia

•     Display / Headings: Syne (Google Fonts) — Bold 700/800, letter-spacing: -0.02em

•     Body / UI: DM Sans — Regular 400, Medium 500

•     Código / Mono: DM Mono — usado em labels, badges, IDs

 

## 10.3 Componentes-Chave

•     Fit Score Badge: círculo com cor semântica (verde ≥ 80, amarelo 50–79, vermelho < 50), animação de pulse sutil no hover

•     Cards de Lead: fundo surface, borda 1px, hover lift (translateY -2px), borda superior colorida no hover

•     Sidebar: 240px fixo, item ativo com background + glow gradiente laranja, colapsa para ícones em telas < 768px

•     Toast Notifications: aparecem no canto inferior direito, auto-dismiss em 3s, cores semânticas

•     Progress Bar: cor laranja até 70%, muda para vermelho acima de 80% de uso do plano