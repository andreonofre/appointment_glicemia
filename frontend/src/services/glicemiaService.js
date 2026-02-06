/**
 * SERVIÇO DE GLICEMIA - SOMENTE SUPABASE
 */

import { supabase } from '../config/supabase';

export const create = async (dados) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('glicemias')
    .insert([{
      user_id: user.id,
      valor: dados.valor,
      momento: dados.momento,
      observacoes: dados.observacoes,
      data_medicao: dados.data || new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const list = async (filtros = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  let query = supabase
    .from('glicemias')
    .select('*')
    .eq('user_id', user.id)
    .order('data_medicao', { ascending: false });

  if (filtros.dataInicio) query = query.gte('data_medicao', filtros.dataInicio);
  if (filtros.dataFim) query = query.lte('data_medicao', filtros.dataFim);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Busca um registro específico
 */
export const getById = async (id) => {
  try {
    const response = await api.get(`/glicemias/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao buscar glicemia' };
  }
};

/**
 * Atualiza um registro
 */
export const update = async (id, data) => {
  try {
    const response = await api.put(`/glicemias/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao atualizar glicemia' };
  }
};

export const remove = async (id) => {
  const { error } = await supabase
    .from('glicemias')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const getStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { media: 0, total: 0, noAlvo: 0 };

  const { data, error } = await supabase
    .from('glicemias')
    .select('valor')
    .eq('user_id', user.id);

  if (error || !data) return { media: 0, total: 0, noAlvo: 0 };

  const valores = data.map(g => g.valor);
  const media = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
  const noAlvo = valores.filter(v => v >= 70 && v <= 180).length;

  return {
    media: Math.round(media),
    total: valores.length,
    noAlvo,
    percentualNoAlvo: valores.length > 0 ? Math.round((noAlvo / valores.length) * 100) : 0
  };
};
