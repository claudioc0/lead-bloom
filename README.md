# EditorLeads (protótipo)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154?logo=react-query&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)

Protótipo de interface para um MicroSaaS de prospecção de clientes voltado a editores
de vídeo freelancers: dashboard de métricas, busca de leads (criadores de conteúdo) com
filtros, gerador de mensagens de abordagem e um CRM em kanban (Novos Leads → Contactado →
Respondeu → Cliente).

**Escopo atual — só frontend:** todos os dados vêm de `src/data/mockLeads.ts` (mock).
Não há backend, scraping ou integração de IA implementados — o
[PRD](docs/prd.md) descreve a visão completa do produto (geração de mensagens via
LLM, scraping de YouTube/Instagram/TikTok, métricas de negócio), mas o código hoje é um
protótipo de UI/UX construído a partir desse PRD, com apoio do Lovable para o scaffolding
inicial.

## Stack

React 19, TanStack Start (SSR) + TanStack Router/Query, Tailwind, deploy alvo Cloudflare
Workers (`wrangler.jsonc`).

## Rodando localmente

```bash
npm install
npm run dev
```

## Documentação de produto

Ver [`docs/prd.md`](docs/prd.md) para a visão de produto completa (ICP, métricas de
negócio, roadmap de funcionalidades).
