/**
 * SERVIÇO DE PERFIL DE USUÁRIO
 * 
 * Gerencia dados do perfil do usuário no Supabase
 */

import { supabase } from '../config/supabase';

/**
 * Busca o perfil completo do usuário logado
 */
export async function getUserProfile() {
  try {
    // Pega o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Busca o perfil na tabela profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // console.error('Erro ao buscar perfil:', error);
      // Se não existir perfil, retorna valores padrão
      return {
        meta_glicemia_min: 70,
        meta_glicemia_max: 180,
        meta_jejum_min: 70,
        meta_jejum_max: 100,
        meta_pos_prandial_max: 140
      };
    }

    return data;
  } catch (error) {
    // console.error('Erro ao buscar perfil:', error);
    // Retorna valores padrão em caso de erro
    return {
      meta_glicemia_min: 70,
      meta_glicemia_max: 180,
      meta_jejum_min: 70,
      meta_jejum_max: 100,
      meta_pos_prandial_max: 140
    };
  }
}

/**
 * Atualiza o perfil do usuário
 */
export async function updateUserProfile(profileData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    // console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

/**
 * Verifica se o perfil do usuário está completo
 */
export async function isProfileComplete() {
  try {
    const profile = await getUserProfile();
    
    // Verifica se os campos essenciais estão preenchidos
    const camposObrigatorios = [
      'data_nascimento',
      'contato',
      'meta_jejum_min',
      'meta_jejum_max',
      'meta_pos_prandial_max',
      'meta_glicemia_min',
      'meta_glicemia_max'
    ];

    for (const campo of camposObrigatorios) {
      if (!profile[campo]) {
        return false;
      }
    }

    return true;
  } catch (error) {
    // console.error('Erro ao verificar perfil:', error);
    return false;
  }
}
