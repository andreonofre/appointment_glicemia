/**
 * CONTROLLER DE GLICEMIAS
 * 
 * Gerencia todas as operações relacionadas aos registros de glicemia.
 * 
 * Rotas disponíveis:
 * - POST /glicemias - Criar novo registro de glicemia
 * - GET /glicemias - Listar todos os registros do usuário (com filtros)
 * - GET /glicemias/:id - Buscar um registro específico
 * - PUT /glicemias/:id - Atualizar um registro
 * - DELETE /glicemias/:id - Deletar um registro
 * - GET /glicemias/stats - Estatísticas (médias, contadores)
 * 
 * Como fazer manutenção:
 * - Para adicionar filtros, modifique a função list()
 * - Para alterar campos salvos, modifique create() e update()
 */

const { supabase } = require('../config/supabase');

/**
 * Criar novo registro de glicemia
 */
async function create(req, res) {
  try {
    const userId = req.user.id;
    const { valor, categoria, observacoes, data_hora } = req.body;

    // Validações
    if (!valor || !categoria) {
      return res.status(400).json({ 
        error: 'Valor e categoria são obrigatórios.' 
      });
    }

    // Insere o registro no banco
    const { data, error } = await supabase
      .from('glicemias')
      .insert([
        {
          user_id: userId,
          valor,
          categoria,
          observacoes,
          data_hora: data_hora || new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Glicemia registrada com sucesso!',
      data
    });
  } catch (error) {
    console.error('Erro ao criar glicemia:', error);
    return res.status(500).json({ error: 'Erro ao registrar glicemia.' });
  }
}

/**
 * Listar registros de glicemia com filtros
 */
async function list(req, res) {
  try {
    const userId = req.user.id;
    const { 
      categoria, 
      data_inicio, 
      data_fim, 
      limite = 100,
      ordenar = 'data_hora',
      direcao = 'desc'
    } = req.query;

    // Inicia a query
    let query = supabase
      .from('glicemias')
      .select('*')
      .eq('user_id', userId);

    // Aplica filtros opcionais
    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    if (data_inicio) {
      query = query.gte('data_hora', data_inicio);
    }

    if (data_fim) {
      query = query.lte('data_hora', data_fim);
    }

    // Ordena e limita
    query = query.order(ordenar, { ascending: direcao === 'asc' })
                 .limit(parseInt(limite));

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro ao listar glicemias:', error);
    return res.status(500).json({ error: 'Erro ao buscar glicemias.' });
  }
}

/**
 * Buscar um registro específico
 */
async function getById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('glicemias')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Registro não encontrado.' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro ao buscar glicemia:', error);
    return res.status(500).json({ error: 'Erro ao buscar glicemia.' });
  }
}

/**
 * Atualizar um registro
 */
async function update(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { valor, categoria, observacoes, data_hora } = req.body;

    const { data, error } = await supabase
      .from('glicemias')
      .update({ valor, categoria, observacoes, data_hora })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      message: 'Glicemia atualizada com sucesso!',
      data
    });
  } catch (error) {
    console.error('Erro ao atualizar glicemia:', error);
    return res.status(500).json({ error: 'Erro ao atualizar glicemia.' });
  }
}

/**
 * Deletar um registro
 */
async function deleteRecord(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
      .from('glicemias')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Glicemia deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar glicemia:', error);
    return res.status(500).json({ error: 'Erro ao deletar glicemia.' });
  }
}

/**
 * Estatísticas das glicemias
 */
async function getStats(req, res) {
  try {
    const userId = req.user.id;
    const { dias = 7 } = req.query;

    // Data de início (X dias atrás)
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - parseInt(dias));

    // Busca todos os registros do período
    const { data: glicemias, error } = await supabase
      .from('glicemias')
      .select('valor, categoria, data_hora')
      .eq('user_id', userId)
      .gte('data_hora', dataInicio.toISOString())
      .order('data_hora', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Calcula estatísticas
    const total = glicemias.length;
    const soma = glicemias.reduce((acc, g) => acc + g.valor, 0);
    const media = total > 0 ? soma / total : 0;

    const hipoglicemias = glicemias.filter(g => g.valor < 70).length;
    const hiperglicemias = glicemias.filter(g => g.valor > 180).length;
    const noAlvo = glicemias.filter(g => g.valor >= 70 && g.valor <= 180).length;

    // Última medição
    const ultimaMedicao = glicemias[0] || null;

    // Percentuais
    const percentualNoAlvo = total > 0 ? (noAlvo / total) * 100 : 0;

    // GMI estimado (Glucose Management Indicator)
    // Fórmula: GMI = 3.31 + 0.02392 × média_glicemia
    const gmiEstimado = 3.31 + (0.02392 * media);

    return res.json({
      periodo_dias: parseInt(dias),
      total_medicoes: total,
      media_geral: Math.round(media),
      ultima_medicao: ultimaMedicao,
      no_alvo: noAlvo,
      percentual_no_alvo: Math.round(percentualNoAlvo),
      hipoglicemias,
      hiperglicemias,
      gmi_estimado: gmiEstimado.toFixed(1)
    });
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    return res.status(500).json({ error: 'Erro ao calcular estatísticas.' });
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  deleteRecord,
  getStats
};
