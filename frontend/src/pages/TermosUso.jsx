/**
 * PÁGINA DE TERMOS DE USO
 * 
 * Termos e condições de uso do sistema Glico
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './TermosUso.css';

function TermosUso() {
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
          <h1>Termos de Uso</h1>
          <p className="legal-date">Última atualização: 08 de fevereiro de 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma Glico ("Plataforma"), você concorda em cumprir 
              e estar vinculado aos seguintes Termos de Uso. Se você não concordar com estes 
              termos, não deverá utilizar a Plataforma.
            </p>
          </section>

          <section>
            <h2>2. Descrição do Serviço</h2>
            <p>
              O Glico é uma plataforma digital de autocuidado em diabetes que permite aos 
              usuários registrar, monitorar e visualizar seus níveis de glicemia. A Plataforma 
              oferece:
            </p>
            <ul>
              <li>Registro de medições de glicemia</li>
              <li>Visualização de histórico e gráficos</li>
              <li>Geração de relatórios personalizados</li>
              <li>Configuração de metas glicêmicas personalizadas</li>
            </ul>
          </section>

          <section>
            <h2>3. Uso Adequado</h2>
            <p>
              A Plataforma é destinada exclusivamente para fins de acompanhamento pessoal e 
              não substitui consultas, diagnósticos, tratamentos ou orientações médicas 
              profissionais. Você concorda em:
            </p>
            <ul>
              <li>Utilizar a Plataforma apenas para fins legítimos e pessoais</li>
              <li>Não compartilhar suas credenciais de acesso com terceiros</li>
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Não utilizar a Plataforma para fins comerciais sem autorização</li>
            </ul>
          </section>

          <section>
            <h2>4. Responsabilidades do Usuário</h2>
            <p>Você é responsável por:</p>
            <ul>
              <li>Manter a segurança de sua conta e senha</li>
              <li>Todas as atividades realizadas em sua conta</li>
              <li>A precisão dos dados inseridos na Plataforma</li>
              <li>Consultar profissionais de saúde para decisões relacionadas ao tratamento</li>
            </ul>
          </section>

          <section>
            <h2>5. Limitação de Responsabilidade</h2>
            <p>
              O Glico não se responsabiliza por:
            </p>
            <ul>
              <li>Decisões médicas tomadas com base nos dados registrados</li>
              <li>Erros ou imprecisões nos dados inseridos pelo usuário</li>
              <li>Interrupções temporárias no serviço devido a manutenção ou problemas técnicos</li>
              <li>Perda de dados devido a falhas técnicas ou ações do usuário</li>
            </ul>
          </section>

          <section>
            <h2>6. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da Plataforma, incluindo mas não limitado a textos, gráficos, 
              logos, ícones, imagens e software, é de propriedade do Glico e está protegido 
              por leis de direitos autorais e propriedade intelectual.
            </p>
          </section>

          <section>
            <h2>7. Modificações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação na Plataforma. 
              O uso continuado da Plataforma após as modificações constitui aceitação dos 
              novos termos.
            </p>
          </section>

          <section>
            <h2>8. Rescisão</h2>
            <p>
              Podemos rescindir ou suspender seu acesso à Plataforma imediatamente, sem aviso 
              prévio, por qualquer motivo, incluindo violação destes Termos de Uso.
            </p>
          </section>

          <section>
            <h2>9. Lei Aplicável</h2>
            <p>
              Estes Termos de Uso são regidos pelas leis do Brasil. Qualquer disputa 
              relacionada a estes termos será resolvida nos tribunais brasileiros.
            </p>
          </section>

          <section>
            <h2>10. Contato</h2>
            <p>
              Para questões sobre estes Termos de Uso, entre em contato através do email: 
              <a href="mailto:contato@glico.com">contato@glico.com</a>
            </p>
          </section>

          <section>
            <h2>11. Aceitação</h2>
            <p>
              Ao criar uma conta e utilizar a Plataforma, você declara ter lido, compreendido 
              e concordado com estes Termos de Uso.
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

export default TermosUso;
