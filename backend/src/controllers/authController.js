/**
 * CONTROLLER DE AUTENTICAÇÃO
 * 
 * Gerencia todas as operações de login, cadastro e logout.
 * 
 * Rotas disponíveis:
 * - POST /auth/register - Cadastro de novo usuário
 * - POST /auth/login - Login de usuário existente
 * - POST /auth/logout - Logout do usuário
 * - GET /auth/me - Busca dados do usuário logado
 * 
 * Como fazer manutenção:
 * - Cada função corresponde a uma rota
 * - Para adicionar validações, faça antes de chamar o Supabase
 * - Para modificar dados salvos, altere o objeto inserido no Supabase
 */

const { supabase } = require('../config/supabase');

/**
 * Cadastro de novo usuário - Envia código de verificação
 */
async function register(req, res) {
  try {
    console.log('📝 Iniciando registro de usuário...');
    const { email, password, nome, idade, tipoDiabetes } = req.body;
    console.log(`📧 Email: ${email}`);

    // Validações básicas
    if (!email || !password || !nome) {
      console.log('❌ Dados incompletos no registro');
      return res.status(400).json({ 
        error: 'Email, senha e nome são obrigatórios.' 
      });
    }

    // Gera código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    console.log(`🔢 Código gerado: ${verificationCode}`);

    // Salva código temporário no banco
    const { error: codeError } = await supabase
      .from('verification_codes')
      .upsert([
        {
          email,
          code: verificationCode,
          user_data: JSON.stringify({ nome, password, idade, tipo_diabetes: tipoDiabetes }),
          expires_at: expiresAt.toISOString(),
          verified: false
        }
      ], { onConflict: 'email' });

    if (codeError) {
      console.error('❌ Erro ao salvar código:', codeError);
      return res.status(400).json({ error: 'Erro ao gerar código de verificação.' });
    }

    // Envia email com código
    console.log('📧 Enviando email...');
    const emailService = require('../services/emailService');
    await emailService.sendVerificationCode(email, nome, verificationCode);
    console.log('✅ Email enviado com sucesso!');

    return res.status(200).json({
      message: 'Código de verificação enviado para seu email!',
      email
    });
  } catch (error) {
    console.error('❌ Erro no cadastro:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
}

/**
 * Verifica código e cria usuário
 */
async function verifyCode(req, res) {
  try {
    console.log('🔍 Verificando código...');
    const { email, code } = req.body;
    console.log(`📧 Email: ${email}, Código: ${code}`);

    if (!email || !code) {
      console.log('❌ Email ou código ausente');
      return res.status(400).json({ error: 'Email e código são obrigatórios.' });
    }

    // Busca código
    const { data: verificationData, error: verifyError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('verified', false)
      .single();

    if (verifyError || !verificationData) {
      console.log('❌ Código inválido ou não encontrado');
      return res.status(400).json({ error: 'Código inválido ou expirado.' });
    }

    // Verifica se expirou
    if (new Date() > new Date(verificationData.expires_at)) {
      console.log('❌ Código expirado');
      return res.status(400).json({ error: 'Código expirado. Solicite um novo.' });
    }

    // Extrai dados do usuário
    const userData = JSON.parse(verificationData.user_data);

    // Cria o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: userData.password,
      options: {
        data: {
          nome: userData.nome,
          idade: userData.idade,
          tipo_diabetes: userData.tipo_diabetes
        },
        emailRedirectTo: undefined
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Cria o perfil do usuário na tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          nome: userData.nome,
          email,
          idade: userData.idade,
          tipo_diabetes: userData.tipo_diabetes,
          meta_glicemia_jejum_min: 80,
          meta_glicemia_jejum_max: 130,
          meta_glicemia_pos_prandial_max: 180
        }
      ]);

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError);
    }

    // Marca código como verificado
    await supabase
      .from('verification_codes')
      .update({ verified: true })
      .eq('email', email)
      .eq('code', code);

    return res.status(201).json({
      message: 'Email verificado! Usuário cadastrado com sucesso!',
      user: authData.user
    });
  } catch (error) {
    console.error('Erro na verificação:', error);
    return res.status(500).json({ error: 'Erro ao verificar código.' });
  }
}

/**
 * Login de usuário
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios.' 
      });
    }

    // Faz login no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Busca o perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
    }

    return res.json({
      message: 'Login realizado com sucesso!',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao fazer login.' });
  }
}

/**
 * Login com Google OAuth
 */
async function googleLogin(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token do Google é obrigatório.' });
    }

    // Autentica com o token do Google OAuth
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError) {
      return res.status(401).json({ error: 'Token inválido.' });
    }

    // Verifica se o perfil já existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // Se não existe perfil, cria um básico
    if (profileError || !profile) {
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            nome: authData.user.user_metadata?.full_name || authData.user.email.split('@')[0],
            email: authData.user.email,
            meta_glicemia_jejum_min: 80,
            meta_glicemia_jejum_max: 130,
            meta_glicemia_pos_prandial_max: 180
          }
        ]);

      if (createError) {
        console.error('Erro ao criar perfil Google:', createError);
      }

      // Busca o perfil criado
      const { data: newProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      return res.status(200).json({
        message: 'Login com Google realizado!',
        token,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          ...newProfile
        }
      });
    }

    return res.status(200).json({
      message: 'Login com Google realizado!',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error('Erro no login Google:', error);
    return res.status(500).json({ error: 'Erro ao fazer login com Google.' });
  }
}

/**
 * Logout do usuário
 */
async function logout(req, res) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Logout realizado com sucesso!' });
  } catch (error) {
    console.error('Erro no logout:', error);
    return res.status(500).json({ error: 'Erro ao fazer logout.' });
  }
}

/**
 * Busca dados do usuário logado
 */
async function getMe(req, res) {
  try {
    const userId = req.user.id;

    // Busca o perfil completo do usuário
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Perfil não encontrado.' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
}

module.exports = {
  register,
  verifyCode,
  login,
  googleLogin,
  logout,
  getMe
};
