import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Configurações para o Supabase Local (padrão do `supabase start`)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

// Cliente para gerenciar a sessão de teste
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const describeIntegration = SUPABASE_ANON_KEY ? describe : describe.skip;

describeIntegration('Edge Functions - Integração Local', () => {
  let validToken: string = '';

  beforeAll(async () => {
    // 1. Cria ou autentica um usuário de teste temporário para gerar um JWT válido
    const email = `test-${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'test-password-123',
    });
    
    if (!error && data.session) {
      validToken = data.session.access_token;
    }
  });

  // Função utilitária para chamar as Edge Functions via HTTP diretamente
  const invokeEdgeFunction = async (name: string, payload: any, jwt?: string) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    return { status: response.status, data };
  };

  describe('Segurança e Autenticação (401)', () => {
    it('search-leads: deve retornar 401 quando o JWT não é enviado', async () => {
      const { status, data } = await invokeEdgeFunction('search-leads', { niche: 'Tech' });
      
      expect(status).toBe(401);
      expect(data?.error).toMatch(/unauthorized/i);
    });

    it('generate-message: deve retornar 401 com JWT inválido ou expirado', async () => {
      const { status, data } = await invokeEdgeFunction('generate-message', { leadId: '1' }, 'ey...jwt.invalido');
      
      expect(status).toBe(401);
      expect(data?.error).toMatch(/unauthorized/i);
    });
  });

  describe('Controle de Limites (Mensal)', () => {
    it('search-leads: deve retornar erro de limite de leads excedido', async () => {
      // NOTA: Em um ambiente real de testes, você utilizaria a service_role_key para 
      // injetar no banco de dados (tabela `profiles`) que este usuário de teste já 
      // consumiu todo o limite (ex: leads_used = 50 para o plano Starter) antes desta chamada.
      
      const { status, data } = await invokeEdgeFunction('search-leads', { niche: 'Gaming' }, validToken);
      
      // Se a Edge Function lida com limite retornando 200 + { error: 'limit reached' } 
      // ou envia um HTTP Status Code específico (403, 402, 429).
      if (status === 200) {
        // Validação comum baseado na implementação anterior de hook
        expect(data.error).toMatch(/limit/i); 
      } else {
        expect([402, 403, 429]).toContain(status);
      }
    });
  });

  describe('Rate Limiting (429)', () => {
    it('generate-message: deve retornar 429 (Too Many Requests) ao ser atacado/flodado', async () => {
      // Dispara 30 requisições concorrentes de forma simultânea
      const requests = Array.from({ length: 30 }).map(() => 
        invokeEdgeFunction('generate-message', { leadId: '1' }, validToken)
      );
      
      const responses = await Promise.all(requests);
      
      // Esperamos que o API Gateway (ou Upstash Redis se configurado dentro da Edge Function)
      // consiga dropar pelo menos uma parte das requisições acusando Rate Limit.
      const hasRateLimitResponse = responses.some(r => r.status === 429);
      
      // Aviso: Dependendo das configurações locais do `supabase start` no seu config.toml,
      // o rate limit em dev pode vir desligado. Ajuste `api.rate_limit_enabled` no config para true.
      expect(hasRateLimitResponse).toBe(true);
    });
  });
});