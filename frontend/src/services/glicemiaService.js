/**
 * SERVIÇO DE GLICEMIAS
 * 
 * Funções para gerenciar registros de glicemia.
 * 
 * Como usar:
 * - import * as glicemiaService from './services/glicemiaService';
 * - const glicemias = await glicemiaService.list();
 * 
 * Como fazer manutenção:
 * - Para adicionar filtros, modifique os parâmetros das funções
 * - Para adicionar validações, faça antes das chamadas de API
 */

import api from './api';

/**
 * Cria novo registro de glicemia
 */
export const create = async (data) => {
  try {
    const response = await api.post('/glicemias', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao criar glicemia' };
  }
};

/**
 * Lista registros de glicemia com filtros opcionais
 */
export const list = async (filters = {}) => {
  try {
    const response = await api.get('/glicemias', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao listar glicemias' };
  }
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

/**
 * Deleta um registro
 */
export const remove = async (id) => {
  try {
    const response = await api.delete(`/glicemias/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao deletar glicemia' };
  }
};

/**
 * Busca estatísticas
 */
export const getStats = async (dias = 7) => {
  try {
    const response = await api.get('/glicemias/stats', { params: { dias } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao buscar estatísticas' };
  }
};
