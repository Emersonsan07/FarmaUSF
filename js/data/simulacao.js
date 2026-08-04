// =================================================================
// BASE DE DADOS DE NOTÍCIAS E CONSULTAS SIMULADAS PARA O DASHBOARD
// =================================================================

const NOTICIAS = [
  {
    id: 1,
    data: "18/07/2026",
    categoria: "Alerta Epidemiológico",
    titulo: "Residência Multiprofissional inicia campanha de conscientização sobre o Uso Racional de Antimicrobianos",
    conteúdo: "Com o aumento das taxas de resistência bacteriana global, residentes da área de farmácia clínica estão promovendo palestras nas salas de espera das Unidades Básicas de Saúde da região, orientando pacientes sobre a importância de concluir o tempo prescrito de antibióticos e os riscos da automedicação."
  },
  {
    id: 2,
    data: "14/07/2026",
    categoria: "Evento Acadêmico",
    titulo: "I Simpósio de Farmácia Clínica na Atenção Primária à Saúde",
    conteúdo: "No próximo mês, a Residência Multiprofissional em Saúde da Família sediará um evento online voltado para a discussão de casos clínicos de polifarmácia em idosos. As inscrições são gratuitas e haverá emissão de certificado de 10 horas. Fique atento às inscrições no site da instituição."
  },
  {
    id: 3,
    data: "05/07/2026",
    categoria: "Nota Técnica ANVISA",
    titulo: "Atualização da RENAME inclui novos tratamentos para doenças crônicas",
    conteúdo: "O Ministério da Saúde publicou a atualização da Relação Nacional de Medicamentos Essenciais (RENAME), incluindo novas opções terapêuticas para o manejo de pacientes com diabetes tipo 2 de alto risco cardiovascular e asma grave. Nossa equipe do CIM está preparando bulas simplificadas para estes novos medicamentos."
  }
];

// Histórico de Consultas Simulado para Alimentação Inicial do Dashboard
const SIMULACAO_CONSULTAS = [
  { id: 101, data: "2026-07-01", paciente: "A. S. Oliveira", idade: 62, sexo: "F", paSistolica: 148, paDiastolica: 92, glicemia: 142, adesaoMorisky: 3, prm: "Não adesão", conduta: "Educação em saúde sobre adesão à Losartana.", medicamentosCount: 6, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: false, paControlada: false },
  { id: 102, data: "2026-07-02", paciente: "J. M. Silva", idade: 45, sexo: "M", paSistolica: 132, paDiastolica: 84, glicemia: 110, adesaoMorisky: 4, prm: "Nenhum", conduta: "Manter acompanhamento.", medicamentosCount: 3, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true },
  { id: 103, data: "2026-07-02", paciente: "M. C. Santos", idade: 70, sexo: "F", paSistolica: 155, paDiastolica: 95, glicemia: 210, adesaoMorisky: 2, prm: "Ineficácia terapêutica", conduta: "Sugerido ajuste de dose da Glibenclamida ao médico.", medicamentosCount: 7, antibioticoUso: true, antibioticoRacional: false, glicemiaControlada: false, paControlada: false },
  { id: 104, data: "2026-07-03", paciente: "F. R. Souza", idade: 58, sexo: "M", paSistolica: 125, paDiastolica: 80, glicemia: 95, adesaoMorisky: 4, prm: "Nenhum", conduta: "Excelente controle. Manter conduta.", medicamentosCount: 2, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true },
  { id: 105, data: "2026-07-04", paciente: "L. P. Costa", idade: 51, sexo: "F", paSistolica: 140, paDiastolica: 90, glicemia: 165, adesaoMorisky: 3, prm: "Efeito adverso", conduta: "Queixa de tosse seca devido ao Captopril. Sugerido troca para Losartana.", medicamentosCount: 5, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: false, paControlada: false },
  { id: 106, data: "2026-07-04", paciente: "E. S. Lima", idade: 67, sexo: "M", paSistolica: 160, paDiastolica: 100, glicemia: 180, adesaoMorisky: 1, prm: "Não adesão", conduta: "Paciente relatou medo de efeitos colaterais. Realizada conciliação medicamentosa.", medicamentosCount: 8, antibioticoUso: true, antibioticoRacional: true, glicemiaControlada: false, paControlada: false },
  { id: 107, data: "2026-07-05", paciente: "R. A. Barbosa", idade: 38, sexo: "M", paSistolica: 118, paDiastolica: 76, glicemia: 88, adesaoMorisky: 4, prm: "Nenhum", conduta: "Perfil excelente. Uso racional de medicamentos mantido.", medicamentosCount: 2, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true },
  { id: 108, data: "2026-07-05", paciente: "A. C. Teixeira", idade: 75, sexo: "F", paSistolica: 135, paDiastolica: 85, glicemia: 240, adesaoMorisky: 2, prm: "Dose subterapêutica", conduta: "Metformina 500mg/dia insuficiente. Sugerido aumento para 1.700mg/dia.", medicamentosCount: 6, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: false, paControlada: true },
  { id: 109, data: "2026-07-06", paciente: "G. V. Rocha", idade: 61, sexo: "M", paSistolica: 145, paDiastolica: 90, glicemia: 152, adesaoMorisky: 3, prm: "Não adesão", conduta: "Organização de caixa de medicação por horários com adesivo de cores.", medicamentosCount: 5, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: false, paControlada: false },
  { id: 110, data: "2026-07-07", paciente: "H. F. Nogueira", idade: 49, sexo: "F", paSistolica: 128, paDiastolica: 82, glicemia: 105, adesaoMorisky: 4, prm: "Nenhum", conduta: "Paciente motivada, seguindo orientações de estilo de vida.", medicamentosCount: 3, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true },
  { id: 111, data: "2026-07-08", paciente: "P. R. Martins", idade: 55, sexo: "M", paSistolica: 150, paDiastolica: 95, glicemia: 130, adesaoMorisky: 3, prm: "Não adesão", conduta: "Reforçado orientações sobre a Espironolactona e Losartana.", medicamentosCount: 5, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: false },
  { id: 112, data: "2026-07-09", paciente: "S. M. Ferreira", idade: 64, sexo: "F", paSistolica: 130, paDiastolica: 80, glicemia: 198, adesaoMorisky: 2, prm: "Ineficácia terapêutica", conduta: "Uso correto de Metformina mas sem controle. Solicitado exames de lab adicionais.", medicamentosCount: 6, antibioticoUso: true, antibioticoRacional: false, glicemiaControlada: false, paControlada: true },
  { id: 113, data: "2026-07-10", paciente: "C. E. Mendes", idade: 43, sexo: "M", paSistolica: 122, paDiastolica: 78, glicemia: 90, adesaoMorisky: 4, prm: "Nenhum", conduta: "Retorno de rotina com ótimos resultados.", medicamentosCount: 2, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true },
  { id: 114, data: "2026-07-11", paciente: "V. L. Castro", idade: 69, sexo: "F", paSistolica: 165, paDiastolica: 102, glicemia: 175, adesaoMorisky: 1, prm: "Não adesão", conduta: "Uso irregular dos anti-hipertensivos. Abordagem com a filha para apoio.", medicamentosCount: 7, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: false, paControlada: false },
  { id: 115, data: "2026-07-12", paciente: "J. A. Nascimento", idade: 72, sexo: "M", paSistolica: 138, paDiastolica: 88, glicemia: 148, adesaoMorisky: 3, prm: "Efeito adverso", conduta: "Cãibras relatadas. Avaliação de eletrólitos devido ao diurético.", medicamentosCount: 5, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true },
  { id: 116, data: "2026-07-13", paciente: "T. C. Azevedo", idade: 50, sexo: "F", paSistolica: 125, paDiastolica: 80, glicemia: 115, adesaoMorisky: 4, prm: "Nenhum", conduta: "Acompanhamento estável.", medicamentosCount: 3, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true },
  { id: 117, data: "2026-07-14", paciente: "O. S. Fonseca", idade: 63, sexo: "M", paSistolica: 142, paDiastolica: 90, glicemia: 135, adesaoMorisky: 3, prm: "Não adesão", conduta: "Esquecimento comum de doses. Sugerido uso de alarmes no celular.", medicamentosCount: 6, antibioticoUso: true, antibioticoRacional: true, glicemiaControlada: true, paControlada: false },
  { id: 118, data: "2026-07-15", paciente: "I. M. Cardoso", idade: 47, sexo: "F", paSistolica: 134, paDiastolica: 86, glicemia: 120, adesaoMorisky: 4, prm: "Nenhum", conduta: "Mantido plano de metas pactuado.", medicamentosCount: 4, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true },
  { id: 119, data: "2026-07-16", paciente: "W. J. Guimarães", idade: 59, sexo: "M", paSistolica: 158, paDiastolica: 98, glicemia: 265, adesaoMorisky: 2, prm: "Não adesão", conduta: "Paciente parou com Glibenclamida por conta própria. Orientado riscos.", medicamentosCount: 7, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: false, paControlada: false },
  { id: 120, data: "2026-07-17", paciente: "D. S. Pinheiro", idade: 66, sexo: "F", paSistolica: 120, paDiastolica: 75, glicemia: 100, adesaoMorisky: 4, prm: "Nenhum", conduta: "Paciente extremamente disciplinada. Parabenizada pelo autocuidado.", medicamentosCount: 4, antibioticoUso: false, antibioticoRacional: null, glicemiaControlada: true, paControlada: true }
];
