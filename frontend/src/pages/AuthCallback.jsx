/**
 * PÁGINA DE CALLBACK DO OAUTH
 * 
 * Esta página processa o retorno da autenticação OAuth (Google)
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 AuthCallback: Processando retorno do OAuth...');
    
    // Aguarda o Supabase processar o hash da URL
    const handleCallback = async () => {
      try {
        // Obtém a sessão após o redirect
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          navigate('/login?error=oauth_failed');
          return;
        }

        if (session) {
          console.log('✅ Sessão obtida com sucesso!', session.user.email);
          
          // Salva dados do usuário
          const user = {
            id: session.user.id,
            email: session.user.email,
            nome: session.user.user_metadata.full_name || 
                  session.user.user_metadata.name || 
                  session.user.email.split('@')[0],
            avatar_url: session.user.user_metadata.avatar_url
          };
          
          localStorage.setItem('token', session.access_token);
          localStorage.setItem('user', JSON.stringify(user));
          
          console.log('💾 Dados salvos, redirecionando para /painel...');
          navigate('/painel', { replace: true });
        } else {
          console.log('ℹ️ Nenhuma sessão encontrada, redirecionando para login...');
          navigate('/login');
        }
      } catch (err) {
        console.error('❌ Erro no callback:', err);
        navigate('/login?error=callback_error');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="spinner"></div>
      <p>Processando autenticação...</p>
    </div>
  );
}

export default AuthCallback;
