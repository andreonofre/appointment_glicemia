/**
 * PÁGINA DE POLÍTICA DE PRIVACIDADE
 * 
 * Política de privacidade e proteção de dados (LGPD)
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './TermosUso.css';

function PoliticaPrivacidade() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    // Se veio de alguma página, volta. Senão, vai para cadastro
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/cadastro');
    }
  };

  return (
    <div className="legal-container">
      <div className="legal-card">
        <button className="back-button" onClick={handleVoltar}>
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="legal-header">
          <h1>Política de Privacidade e Proteção de Dados</h1>
          <p className="legal-date">Última atualização: 08 de fevereiro de 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Introdução</h2>
            <p>
              A presente Política de Privacidade estabelece como o Glico ("Plataforma") coleta, 
              armazena, utiliza e protege os dados pessoais e de saúde dos usuários, em 
              conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2>2. Dados Coletados</h2>
            <p>A Plataforma coleta os seguintes tipos de dados:</p>
            
            <h3>2.1 Dados Pessoais</h3>
            <ul>
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Data de nascimento</li>
              <li>Endereço</li>
              <li>Contato telefônico</li>
            </ul>

            <h3>2.2 Dados de Saúde (Dados Sensíveis)</h3>
            <ul>
              <li>Tipo de diabetes</li>
              <li>Medições de glicemia</li>
              <li>Medicamentos em uso</li>
              <li>Metas glicêmicas personalizadas</li>
              <li>Observações sobre medições</li>
            </ul>

            <h3>2.3 Dados de Uso</h3>
            <ul>
              <li>Data e hora de acesso</li>
              <li>Páginas visitadas</li>
              <li>Endereço IP</li>
              <li>Tipo de navegador</li>
            </ul>
          </section>

          <section>
            <h2>3. Finalidade do Tratamento de Dados</h2>
            <p>Os dados coletados são utilizados para:</p>
            <ul>
              <li>Fornecer e manter os serviços da Plataforma</li>
              <li>Permitir o registro e monitoramento de medições de glicemia</li>
              <li>Gerar relatórios e gráficos personalizados</li>
              <li>Melhorar a experiência do usuário</li>
              <li>Enviar notificações e lembretes (quando autorizados)</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section>
            <h2>4. Base Legal</h2>
            <p>O tratamento de dados pessoais é fundamentado nas seguintes bases legais:</p>
            <ul>
              <li><strong>Consentimento:</strong> Você consente expressamente com a coleta e uso dos dados ao aceitar esta política</li>
              <li><strong>Execução de contrato:</strong> Processamento necessário para fornecer os serviços solicitados</li>
              <li><strong>Proteção da saúde:</strong> Tratamento de dados de saúde para garantia da assistência à saúde</li>
            </ul>
          </section>

          <section>
            <h2>5. Compartilhamento de Dados</h2>
            <p>
              Seus dados NÃO são vendidos, alugados ou compartilhados com terceiros para 
              fins comerciais. Podemos compartilhar dados apenas:
            </p>
            <ul>
              <li>Com seu consentimento expresso</li>
              <li>Com prestadores de serviços que auxiliam na operação da Plataforma (ex: hospedagem)</li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>Para proteção dos direitos, segurança ou propriedade da Plataforma</li>
            </ul>
          </section>

          <section>
            <h2>6. Armazenamento e Segurança</h2>
            <p>
              Implementamos medidas técnicas e organizacionais adequadas para proteger seus 
              dados contra acesso não autorizado, alteração, divulgação ou destruição:
            </p>
            <ul>
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Criptografia de dados em repouso</li>
              <li>Autenticação segura de usuários</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento de segurança contínuo</li>
              <li>Backups regulares</li>
            </ul>
            <p>
              Os dados são armazenados em servidores seguros localizados no Brasil ou em países 
              com legislação de proteção de dados equivalente.
            </p>
          </section>

          <section>
            <h2>7. Retenção de Dados</h2>
            <p>
              Os dados pessoais serão mantidos pelo tempo necessário para cumprir as finalidades 
              descritas nesta política, salvo se houver:
            </p>
            <ul>
              <li>Obrigação legal de retenção por período maior</li>
              <li>Necessidade de manutenção para exercício de direitos</li>
              <li>Seu consentimento para retenção adicional</li>
            </ul>
            <p>
              Após o término do período de retenção, os dados serão excluídos de forma segura.
            </p>
          </section>

          <section>
            <h2>8. Seus Direitos (LGPD)</h2>
            <p>De acordo com a LGPD, você tem os seguintes direitos:</p>
            <ul>
              <li><strong>Confirmação e acesso:</strong> Confirmar se seus dados estão sendo tratados e acessá-los</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li><strong>Portabilidade:</strong> Solicitar a portabilidade dos dados a outro fornecedor</li>
              <li><strong>Eliminação:</strong> Solicitar eliminação de dados tratados com seu consentimento</li>
              <li><strong>Revogação do consentimento:</strong> Revogar o consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento realizado em desconformidade com a lei</li>
            </ul>
          </section>

          <section>
            <h2>9. Como Exercer seus Direitos</h2>
            <p>
              Para exercer qualquer dos direitos acima, você pode:
            </p>
            <ul>
              <li>Acessar as configurações de sua conta na Plataforma</li>
              <li>Enviar email para: <a href="mailto:privacidade@glico.com">privacidade@glico.com</a></li>
            </ul>
            <p>
              Responderemos às solicitações em até 15 (quinze) dias úteis.
            </p>
          </section>

          <section>
            <h2>10. Cookies e Tecnologias Similares</h2>
            <p>
              A Plataforma utiliza cookies e tecnologias similares para melhorar a experiência 
              do usuário. Você pode configurar seu navegador para recusar cookies, mas isso 
              pode limitar algumas funcionalidades.
            </p>
          </section>

          <section>
            <h2>11. Menores de Idade</h2>
            <p>
              A Plataforma não deve ser utilizada por menores de 18 anos sem o consentimento 
              dos pais ou responsáveis legais. Se tomarmos conhecimento de coleta inadvertida 
              de dados de menores, tomaremos medidas para excluí-los.
            </p>
          </section>

          <section>
            <h2>12. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
              mudanças significativas por email ou através de avisos na Plataforma. A versão 
              atualizada entrará em vigor imediatamente após a publicação.
            </p>
          </section>

          <section>
            <h2>13. Encarregado de Proteção de Dados (DPO)</h2>
            <p>
              Para questões relacionadas à proteção de dados, entre em contato com nosso 
              Encarregado de Proteção de Dados:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:dpo@glico.com">dpo@glico.com</a>
            </p>
          </section>

          <section>
            <h2>14. Autoridade Nacional de Proteção de Dados</h2>
            <p>
              Você também tem o direito de apresentar reclamação à Autoridade Nacional de 
              Proteção de Dados (ANPD) caso considere que o tratamento de seus dados viola 
              a LGPD.
            </p>
          </section>

          <section>
            <h2>15. Consentimento</h2>
            <p>
              Ao criar uma conta e utilizar a Plataforma, você declara ter lido, compreendido 
              e concordado com esta Política de Privacidade, incluindo o tratamento de seus 
              dados pessoais e de saúde conforme descrito.
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <button className="btn btn-primary" onClick={handleVoltar}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

export default PoliticaPrivacidade;
