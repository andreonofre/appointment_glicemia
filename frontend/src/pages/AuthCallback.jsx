/**
 * PÁGINA DE CALLBACK DO OAUTH
 * 
 * Esta página processa o retorno da autenticação OAuth (Google)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🔄 AuthCallback: Processando retorno do OAuth...');
    console.log('📍 URL atual:', window.location.href);
    
    const handleCallback = async () => {
      try {
        // O Supabase processa automaticamente o hash fragment da URL
        // Precisamos aguardar o evento de auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔔 Auth event:', event);
          
          // Aceita tanto SIGNED_IN quanto INITIAL_SESSION
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
            console.log('✅ Sessão criada com sucesso!', session.user.email);
            
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
            
            // Pequeno delay para garantir que tudo foi salvo
            setTimeout(() => {
              subscription.unsubscribe();
              navigate('/painel', { replace: true });
            }, 500);
          } else if (event === 'SIGNED_OUT') {
            console.log('⚠️ Usuário deslogado');
            subscription.unsubscribe();
            navigate('/login');
          }
        });

        // Timeout de segurança - se após 5 segundos não houver sessão, redireciona
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            console.log('⏱️ Timeout - Nenhuma sessão encontrada após 5s');
            setError('Tempo esgotado. Redirecionando...');
            setTimeout(() => navigate('/login'), 2000);
          }
        }, 5000);

      } catch (err) {
        console.error('❌ Erro no callback:', err);
        setError('Erro ao processar autenticação');
        setTimeout(() => navigate('/login?error=callback_error'), 2000);
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
      gap: '20px',
      background: 'linear-gradient(135deg, #3da9a4 0%, #2c8a87 100%)',
      color: 'white'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ fontSize: '18px', fontWeight: '500' }}>
        {error || 'Processando autenticação com Google...'}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AuthCallback;
