import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './VerifyCode.css';

/**
 * PÁGINA DE VERIFICAÇÃO DE CÓDIGO
 * 
 * Esta página permite ao usuário inserir o código de 6 dígitos
 * recebido por email para confirmar o cadastro.
 * 
 * Fluxo:
 * 1. Usuário preenche formulário de registro
 * 2. Backend envia código por email
 * 3. Usuário insere código aqui
 * 4. Se válido, conta é criada e redirecionado para login
 */

function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Refs para os inputs de código
  const inputRefs = useRef([]);

  useEffect(() => {
    // Se não tem email no state, redireciona para registro
    if (!email) {
      navigate('/register');
    }
    // Foca no primeiro input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, navigate]);

  /**
   * Manipula mudança de valor nos inputs
   */
  const handleChange = (index, value) => {
    // Permite apenas números
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Se digitou um número, move para o próximo input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Manipula tecla pressionada
   */
  const handleKeyDown = (index, e) => {
    // Se backspace e campo vazio, volta para o anterior
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Se Enter e todos os campos preenchidos, submete
    if (e.key === 'Enter' && code.every(digit => digit !== '')) {
      handleVerify();
    }
  };

  /**
   * Manipula cola de texto (permite colar código completo)
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Verifica se são 6 dígitos
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      // Foca no último input
      inputRefs.current[5]?.focus();
    }
  };

  /**
   * Verifica o código
   */
  const handleVerify = async () => {
    const codeString = code.join('');

    if (codeString.length !== 6) {
      setError('Por favor, preencha todos os 6 dígitos.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/verify-code', {
        email,
        code: codeString
      });

      setSuccess(response.data.message);
      
      // Aguarda 2 segundos e redireciona para login
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Cadastro confirmado! Faça login para continuar.' 
          } 
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao verificar código.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Solicita novo código
   */
  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Aqui você pode implementar endpoint para reenviar código
      setSuccess('Novo código enviado para seu email!');
    } catch (err) {
      setError('Erro ao reenviar código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-header">
          <h1>🩺 Glico</h1>
          <h2>Verificação de Email</h2>
        </div>

        <div className="verify-content">
          <p className="verify-instruction">
            Enviamos um código de 6 dígitos para
          </p>
          <p className="verify-email">{email}</p>
          <p className="verify-instruction">
            Digite o código abaixo para confirmar seu cadastro:
          </p>

          {/* Inputs de código */}
          <div className="code-inputs" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                disabled={loading}
              />
            ))}
          </div>

          {/* Mensagens de erro/sucesso */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Botões */}
          <button
            onClick={handleVerify}
            disabled={loading || code.some(digit => !digit)}
            className="verify-button"
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>

          <div className="verify-footer">
            <p>Não recebeu o código?</p>
            <button
              onClick={handleResendCode}
              disabled={loading}
              className="resend-button"
            >
              Reenviar código
            </button>
          </div>

          <button
            onClick={() => navigate('/register')}
            className="back-button"
            disabled={loading}
          >
            ← Voltar para cadastro
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyCode;
