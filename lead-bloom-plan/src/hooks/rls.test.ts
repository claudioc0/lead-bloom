import { describe, it, expect, beforeAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configurações padrão para o Supabase Local (`supabase start`)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const describeRLS = SUPABASE_ANON_KEY ? describe : describe.skip;

describeRLS('Auditoria de RLS (Row Level Security) e Permissões', () => {
  let clientA: SupabaseClient;
  let clientB: SupabaseClient;
  let anonClient: SupabaseClient;
  let userA: any;
  let userB: any;

  let sharedLeadId: string;
  let sharedMessageId: string;

  beforeAll(async () => {
    // 1. Cliente Anônimo (não logado)
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });

    // Função helper para criar um usuário isolado
    const createUser = async () => {
      const email = `rls-${Date.now()}-${Math.floor(Math.random() * 1000)}@test.com`;
      const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      });
      const { data } = await client.auth.signUp({ email, password: 'testpassword123' });
      return { client, user: data.user };
    };

    // 2. Criação dos Usuários de Teste (A e B)
    const setupA = await createUser();
    clientA = setupA.client;
    userA = setupA.user;

    const setupB = await createUser();
    clientB = setupB.client;
    userB = setupB.user;

    // 3. Pré-condição: O Usuário A insere um Lead legítimo no sistema
    const { data: lead } = await clientA
      .from('leads')
      .insert({
        channel_name: 'Canal Teste RLS',
        niche: 'Gaming',
        subscribers: 1000,
        upload_frequency: 'Weekly',
        is_saved: true,
        status: 'new',
        user_id: userA.id,
      })
      .select('id')
      .single();
    
    if (lead) sharedLeadId = lead.id;

    // 4. Pré-condição: O Usuário A gera uma Mensagem para esse Lead
    if (sharedLeadId) {
      const { data: msg } = await clientA
        .from('messages')
        .insert({
          lead_id: sharedLeadId,
          body: 'Teste de isolamento de mensagens',
          tone: 'casual',
          goal: 'ask_call',
          user_id: userA.id,
        })
        .select('id')
        .single();
      if (msg) sharedMessageId = msg.id;
    }
  });

  describe('Acesso Não Autenticado (Anônimo)', () => {
    it('Deve bloquear leitura na tabela profiles para anônimos (Erro 42501)', async () => {
      const { error } = await anonClient.from('profiles').select('*');
      expect(error).toBeDefined();
      expect(error?.code).toBe('42501'); // 42501: Insufficient Privilege / Policy Fail
    });

    it('Deve bloquear leitura na tabela leads para anônimos', async () => {
      const { error } = await anonClient.from('leads').select('*');
      expect(error).toBeDefined();
      expect(error?.code).toBe('42501');
    });
  });

  describe('Isolamento Multitenant (Usuário A vs Usuário B)', () => {
    it('Usuário B não deve conseguir ler o profile do Usuário A', async () => {
      const { data } = await clientB.from('profiles').select('*').eq('id', userA.id);
      expect(data).toHaveLength(0); // Em RLS ativas de restrição, a query retorna array vazio em vez de crash
    });

    it('Usuário B não deve conseguir ler os leads do Usuário A', async () => {
      const { data } = await clientB.from('leads').select('*').eq('id', sharedLeadId);
      expect(data).toHaveLength(0);
    });

    it('Usuário B não deve conseguir atualizar leads do Usuário A', async () => {
      const { data } = await clientB.from('leads').update({ note: 'Hackeado' }).eq('id', sharedLeadId).select();
      expect(data).toHaveLength(0); // O banco recusa a edição silenciando e retornando vazio
    });

    it('Usuário B não deve conseguir deletar leads do Usuário A', async () => {
      const { data } = await clientB.from('leads').delete().eq('id', sharedLeadId).select();
      expect(data).toHaveLength(0);
    });
  });
});