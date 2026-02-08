/**
 * PÁGINA DE CALLBACK DO OAUTH
 * 
 * Esta página processa o retorno da autenticação OAuth (Google)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import * as profileService from '../services/profileService';

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // console.log('🔄 AuthCallback: Processando retorno do OAuth...');
    // console.log('📍 URL atual:', window.location.href);
    
    const handleCallback = async () => {
      try {
        // PRIMEIRA TENTATIVA: Processar hash fragment manualmente
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // console.log('🔑 Tokens encontrados no hash, estabelecendo sessão...');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            // console.error('❌ Erro ao estabelecer sessão:', error);
            throw error;
          }
          
          if (data.session) {
            // console.log('✅ Sessão estabelecida com sucesso!', data.user.email);
            
            // Salva dados do usuário
            const user = {
              id: data.user.id,
              email: data.user.email,
              nome: data.user.user_metadata.full_name || 
                    data.user.user_metadata.name || 
                    data.user.email.split('@')[0],
              avatar_url: data.user.user_metadata.avatar_url
            };
            
            localStorage.setItem('token', data.session.access_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // console.log('📋 Verificando se o perfil está completo...');
            
            // Verifica se o perfil está completo
            const perfilCompleto = await profileService.isProfileComplete();
            
            if (perfilCompleto) {
              // console.log('✅ Perfil completo, redirecionando para /painel...');
              setTimeout(() => {
                navigate('/painel', { replace: true });
              }, 500);
            } else {
              // console.log('📝 Perfil incompleto, redirecionando para /completar-perfil...');
              setTimeout(() => {
                navigate('/completar-perfil', { replace: true });
              }, 500);
            }
            
            return; // Sai da função se deu certo
          }
        }
        
        // SEGUNDA TENTATIVA: Listener de eventos (fallback)
        // console.log('⏳ Aguardando evento de autenticação...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          // console.log('🔔 Auth event:', event);
          
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
            // console.log('✅ Sessão criada via evento!', session.user.email);
            
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
            
            // Verifica se o perfil está completo
            const perfilCompleto = await profileService.isProfileComplete();
            
            setTimeout(() => {
              subscription.unsubscribe();
              if (perfilCompleto) {
                navigate('/painel', { replace: true });
              } else {
                navigate('/completar-perfil', { replace: true });
              }
            }, 500);
          }
        });

        // Timeout de segurança
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            // console.log('⏱️ Timeout - Nenhuma sessão encontrada após 8s');
            setError('Tempo esgotado. Redirecionando...');
            setTimeout(() => navigate('/login'), 2000);
          }
        }, 8000);

      } catch (err) {
        // console.error('❌ Erro no callback:', err);
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
