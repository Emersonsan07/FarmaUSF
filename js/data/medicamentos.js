// =================================================================
// BASE DE DADOS DOS MEDICAMENTOS (REMUME / RENAME), INTERAÇÕES E CRITÉRIOS DE BEERS
// =================================================================

const MEDICAMENTOS = [
  {
    id: "metformina",
    nome: "Metformina (Cloridrato)",
    classe: "Hipoglicemiante Oral / Biguanida",
    indicacoes: "Diabetes Mellitus Tipo 2, especialmente em pacientes com sobrepeso, como monoterapia ou em combinação com outros antidiabéticos orais ou insulina. Também utilizado na Síndrome dos Ovários Policísticos (SOP).",
    posologia: "Iniciar com 500 mg a 850 mg uma vez ao dia, junto ao café da manhã ou jantar. Aumentar gradualmente se necessário. Dose máxima: 2.550 mg/dia (dividida em 3 tomadas).",
    contraindicacoes: "Insuficiência renal grave (Clearance de Creatinina < 30 mL/min), acidose metabólica aguda ou crônica, desidratação grave, insuficiência hepática, consumo excessivo de álcool.",
    orientacoes: "Administrar sempre durante ou imediatamente após as refeições para minimizar reações gastrointestinais (diarreia, náusea, flatulência). O uso crônico pode reduzir a absorção de Vitamina B12.",
    alertaSUS: "Disponibilizado gratuitamente pelo Componente Básico da Assistência Farmacêutica e pelo Programa Farmácia Popular.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500mg", tarde: "0", noite: "500mg", obs: "Durante as refeições" },
    monitoramento: ["Glicemia de jejum", "HbA1c a cada 3 meses", "Creatinina/TFGe anual", "Vitamina B12 anual"],
    beersCriteria: false
  },
  {
    id: "losartana",
    nome: "Losartana Potássica",
    classe: "Anti-hipertensivo / Bloqueador dos Receptores de Angiotensina II (BRA)",
    indicacoes: "Tratamento da hipertensão arterial sistêmica, insuficiência cardíaca congestiva crônica (quando o uso de IECA não é adequado), e proteção renal em pacientes com DM2 e proteinúria.",
    posologia: "Dose inicial usual: 50 mg uma vez ao dia. Pode ser aumentada para até 100 mg ao dia, em tomada única ou dividida em duas tomadas.",
    contraindicacoes: "Hipersensibilidade, gravidez (risco de toxicidade fetal - classes D/X), uso concomitante com alisquireno em pacientes com diabetes ou insuficiência renal.",
    orientacoes: "Pode ser tomado com ou sem alimentos. Monitorar níveis de potássio sérico (risco de hipercalemia) e função renal, especialmente em idosos ou nefropatas.",
    alertaSUS: "Disponibilizado gratuitamente no SUS e no Programa Farmácia Popular.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "50mg", tarde: "0", noite: "0", obs: "Pode ser dividido em 2 tomadas" },
    monitoramento: ["Pressão arterial semanal", "Potássio sérico a cada 3 meses", "Creatinina/TFGe"],
    beersCriteria: false
  },
  {
    id: "captopril",
    nome: "Captopril",
    classe: "Anti-hipertensivo / Inibidor da Enzima Conversora de Angiotensina (IECA)",
    indicacoes: "Hipertensão arterial, insuficiência cardíaca congestiva, infarto agudo do miocárdio (fase pós-infarto estável), nefropatia diabética.",
    posologia: "Hipertensão: iniciar com 12,5 mg ou 25 mg, 2 a 3 vezes ao dia. Ajustar conforme necessidade clínica. Dose máxima: 150 mg/dia.",
    contraindicacoes: "Histórico de angioedema relacionado a tratamento anterior com IECA, gravidez (2º e 3º trimestres), uso concomitante com alisquireno em diabéticos.",
    orientacoes: "Tomar 1 hora antes das refeições (estômago vazio), pois os alimentos diminuem a absorção em 30-40%. Alerta para tosse seca persistente como efeito adverso comum.",
    alertaSUS: "Disponibilizado na Relação Nacional de Medicamentos Essenciais (RENAME) e Farmácia Popular.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "25mg", tarde: "25mg", noite: "0", obs: "Jejum - 1h antes das refeicoes" },
    monitoramento: ["Pressao arterial", "Funcao renal (creatinina)", "Potassio serico", "Observar tosse seca"],
    beersCriteria: false
  },
  {
    id: "glibenclamida",
    nome: "Glibenclamida",
    classe: "Hipoglicemiante Oral / Sulfonilureia",
    indicacoes: "Tratamento de diabetes mellitus tipo 2, quando o controle glicêmico não é obtido apenas com dieta, exercício físico e redução de peso.",
    posologia: "Dose inicial: 2,5 mg a 5 mg ao dia, administrada antes do café da manhã ou da primeira refeição principal. Ajustes em incrementos de 2,5 mg. Dose máxima: 15 mg/dia.",
    contraindicacoes: "Diabetes Mellitus Tipo 1, cetoacidose diabética, pré-coma ou coma diabético, insuficiência renal ou hepática grave, gravidez e lactação.",
    orientacoes: "Risco significativo de hipoglicemia. O paciente deve ser orientado a reconhecer os sintomas (sudorese, tremor, palpitacao, fome) e portar uma fonte de carboidrato rapido. Evitar pular refeicoes.",
    alertaSUS: "Disponibilizado gratuitamente no Programa Farmácia Popular.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "5mg", tarde: "0", noite: "0", obs: "Antes do cafe da manha" },
    monitoramento: ["Glicemia capilar diaria", "HbA1c a cada 3 meses", "Sinais de hipoglicemia", "Funcao renal"],
    beersCriteria: true,
    beersAlerta: "Criterio de Beers: Risco de hipoglicemia grave em idosos. Preferir Gliclazida MR."
  },
  {
    id: "sinvastatina",
    nome: "Sinvastatina",
    classe: "Hipolipemiante / Inibidor da HMG-CoA Redutase (Estatina)",
    indicacoes: "Hipercolesterolemia primária, prevenção cardiovascular (redução da morbimortalidade coronariana e acidente vascular cerebral em pacientes de alto risco).",
    posologia: "Geralmente 10 mg a 40 mg uma vez ao dia, por via oral. Dose máxima recomendada: 40 mg/dia. Casos específicos podem requerer 80 mg.",
    contraindicacoes: "Doença hepática activa, elevação persistente inexplicável das transaminases hepáticas, gravidez e lactação, uso concomitante de inibidores potentes do CYP3A4.",
    orientacoes: "Administrar em dose unica a noite (a sintese de colesterol e predominantemente noturna). Relatar imediatamente dor, sensibilidade ou fraqueza muscular inexplicada (risco de miopatia/rabdomiolise).",
    alertaSUS: "Disponível na Rename e no programa Farmácia Popular.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "0", tarde: "0", noite: "20-40mg", obs: "A noite (sintese noturna do colesterol)" },
    monitoramento: ["Perfil lipidico a cada 3 meses", "TGO/TGP (transaminases)", "CPK se dor muscular"],
    beersCriteria: false
  },
  {
    id: "ibuprofeno",
    nome: "Ibuprofeno",
    classe: "Anti-inflamatório Não Esteroidal (AINE) / Analgésico / Antitérmico",
    indicacoes: "Alívio da dor leve a moderada (cefaleia, dor de dente, dismenorreia), febre e inflamações articulares/musculares.",
    posologia: "Adultos: 200 mg a 600 mg, a cada 6 ou 8 horas. Dose máxima para dor/febre: 1.200 mg/dia (sem supervisão) ou 3.200 mg/dia sob prescrição médica.",
    contraindicacoes: "Histórico de sangramento ou perfuração gastrointestinal por AINEs, úlcera péptica ativa, insuficiência cardíaca grave, insuficiência renal ou hepática grave, terceiro trimestre de gravidez.",
    orientacoes: "Tomar preferencialmente com alimentos ou leite para evitar irritacao gastrica. Usar a menor dose eficaz pelo menor tempo possivel. Atencao ao uso cronico que pode elevar a pressao arterial e prejudicar a funcao renal.",
    alertaSUS: "Disponibilizado na atenção básica do SUS.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "400mg", tarde: "400mg", noite: "400mg", obs: "Com alimentos ou leite" },
    monitoramento: ["Pressao arterial", "Funcao renal", "Sinais de sangramento GI", "Edema periferico"],
    beersCriteria: true,
    beersAlerta: "Criterio de Beers: Em idosos aumenta risco de sangramento GI e IRC. Preferir Paracetamol."
  },
  {
    id: "paracetamol",
    nome: "Paracetamol",
    classe: "Analgésico / Antitérmico (Não Salicilato)",
    indicacoes: "Redução da febre e alívio temporário de dores leves a moderadas associadas a gripes, resfriados, cefaleia, dor de dente e dor muscular.",
    posologia: "Adultos: 500 mg a 1000 mg por dose, a cada 4 a 6 horas. Limite máximo absoluto de 4.000 mg (4g) por dia para evitar hepatotoxicidade grave.",
    contraindicacoes: "Hipersensibilidade, insuficiência hepática grave ou doença ativa do fígado.",
    orientacoes: "Nao exceder a dose diaria maxima. Muitos medicamentos para gripe contem paracetamol, o que pode causar superdose acidental. Evitar o consumo concomitante de bebidas alcoolicas.",
    alertaSUS: "Disponível de forma ampla nas farmácias das Unidades Básicas de Saúde (UBS).",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500-1000mg", tarde: "500mg", noite: "500-1000mg", obs: "Max 4g/dia total" },
    monitoramento: ["Funcao hepatica (TGO/TGP)", "Verificar outros produtos com paracetamol"],
    beersCriteria: false
  },
  {
    id: "amoxicilina",
    nome: "Amoxicilina",
    classe: "Antibiótico Beta-lactâmico / Penicilina de Amplo Espectro",
    indicacoes: "Infecções bacterianas do trato respiratório superior e inferior, trato urinário, pele e tecidos moles causadas por microrganismos sensíveis.",
    posologia: "Adultos: 250 mg a 500 mg a cada 8 horas, ou 500 mg a 875 mg a cada 12 horas. Ajustar dose em insuficiência renal grave.",
    contraindicacoes: "Hipersensibilidade a penicilinas, cefalosporinas ou outros beta-lactâmicos.",
    orientacoes: "Pode ser tomado com ou sem alimentos. Concluir o tratamento prescrito mesmo se houver melhora precoce, para evitar resistencia bacteriana. Uso racional de antibioticos e fundamental.",
    alertaSUS: "Sujeito a retenção de receita de controle especial (Receita Duas Vias). Disponível no SUS.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500mg", tarde: "500mg", noite: "500mg", obs: "8/8h - Completar o ciclo" },
    monitoramento: ["Sinais de reacao alergica", "Diarreia por C. difficile", "Eficacia (melhora dos sintomas)"],
    beersCriteria: false
  },
  {
    id: "omeprazol",
    nome: "Omeprazol",
    classe: "Antiulceroso / Inibidor da Bomba de Prótons (IBP)",
    indicacoes: "Tratamento de úlceras gástricas e duodenais, esofagite de refluxo, erradicação do Helicobacter pylori (em associação com antibióticos) e profilaxia de úlceras por estresse em pacientes graves.",
    posologia: "Geralmente 20 mg a 40 mg uma vez ao dia, em jejum (30 a 60 minutos antes do café da manhã). Duração do tratamento varia de 2 a 8 semanas conforme indicação.",
    contraindicacoes: "Hipersensibilidade ao omeprazol ou outros benzimidazóis. Uso concomitante com nelfinavir.",
    orientacoes: "Ingerir as capsulas inteiras com liquido, sem mastigar ou esmagar. O uso prolongado (anos) esta associado a risco de hipomagnesemia, osteoporose e deficiencia de vitamina B12.",
    alertaSUS: "Disponível na RENAME e fornecido amplamente pelo SUS.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "20-40mg", tarde: "0", noite: "0", obs: "30-60min antes do cafe (jejum)" },
    monitoramento: ["Magnesio serico (uso > 1 ano)", "Vitamina B12 anual", "Densidade ossea (uso > 5 anos)"],
    beersCriteria: true,
    beersAlerta: "Criterio de Beers: Evitar uso > 8 semanas sem reavaliacao em idosos. Risco de hipomagnesemia e fraturas."
  },
  {
    id: "espironolactona",
    nome: "Espironolactona",
    classe: "Diurético Poupador de Potássio / Antagonista da Aldosterona",
    indicacoes: "Hipertensão essencial, edema associado a insuficiência cardíaca congestiva, cirrose hepática ou síndrome nefrótica; prevenção de hipocalemia; tratamento do hiperaldosteronismo primário.",
    posologia: "Hipertensão e Edema: 25 mg a 100 mg ao dia, em dose única ou dividida. Insuficiência Cardíaca Grave: 12,5 mg a 25 mg ao dia.",
    contraindicacoes: "Anúria, insuficiência renal aguda ou disfunção renal significativa (ritmo de filtração glomerular < 30 mL/min), hipercalemia, doença de Addison.",
    orientacoes: "Tomar preferencialmente pela manha para evitar nocturia (acordar a noite para urinar). Monitorar potassio serico. Evitar substitutos do sal contendo potassio.",
    alertaSUS: "Disponível no SUS.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "25-100mg", tarde: "0", noite: "0", obs: "Pela manha para evitar nocturia" },
    monitoramento: ["Potassio serico a cada 3 meses", "Funcao renal", "Pressao arterial", "Ginecomastia (homens)"],
    beersCriteria: false
  },
  {
    id: "atenolol",
    nome: "Atenolol",
    classe: "Anti-hipertensivo / Beta-bloqueador seletivo Beta-1",
    indicacoes: "Controle da hipertensão arterial, angina de peito, arritmias cardíacas e tratamento do infarto agudo do miocárdio.",
    posologia: "Hipertensão: 50 mg a 100 mg uma vez ao dia por via oral. Angina: 100 mg ao dia.",
    contraindicacoes: "Bradicardia sinusal severa, choque cardiogênico, hipotensão, insuficiência cardíaca descompensada, bloqueio atrioventricular de 2º ou 3º grau.",
    orientacoes: "Nao interromper abruptamente o uso (risco de efeito rebote cardiaco). Monitorar pulso cardiaco regularmente.",
    alertaSUS: "Disponibilizado gratuitamente pelo Componente Básico e Programa Farmácia Popular.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "50-100mg", tarde: "0", noite: "0", obs: "Nao suspender abruptamente" },
    monitoramento: ["Frequencia cardiaca (FC > 60bpm)", "Pressao arterial", "Sinais de broncospasmo"],
    beersCriteria: false
  },
  {
    id: "hidroclorotiazida",
    nome: "Hidroclorotiazida",
    classe: "Anti-hipertensivo / Diurético Tiazídico",
    indicacoes: "Tratamento da hipertensão arterial sistêmica, seja isolado ou em associação com outros anti-hipertensivos. Edemas associados a ICC.",
    posologia: "Hipertensão: 12,5 mg a 25 mg uma vez ao dia, pela manhã. Dose máxima usual: 50 mg/dia.",
    contraindicacoes: "Anúria, hipersensibilidade a sulfonamidas, comprometimento renal ou hepático grave.",
    orientacoes: "Tomar preferencialmente pela manha para evitar miccao noturna. Pode causar hipocalemia (queda de potassio) e intolerancia a glicose.",
    alertaSUS: "Disponibilizado na RENAME e gratuitamente no Farmácia Popular.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "12,5-25mg", tarde: "0", noite: "0", obs: "Pela manha" },
    monitoramento: ["Potassio serico", "Glicemia de jejum", "Acido urico", "Pressao arterial"],
    beersCriteria: false
  },
  {
    id: "enalapril",
    nome: "Enalapril (Maleato)",
    classe: "Anti-hipertensivo / Inibidor da Enzima Conversora de Angiotensina (IECA)",
    indicacoes: "Hipertensão arterial sistêmica em todos os graus e insuficiência cardíaca congestiva assintomática ou sintomática.",
    posologia: "Dose inicial: 5 mg a 10 mg uma vez ao dia. Ajustar conforme necessidade. Manutenção usual: 20 mg ao dia. Máximo: 40 mg/dia.",
    contraindicacoes: "Histórico de angioedema associado a IECA, gravidez (risco fetal D), estenose de artéria renal bilateral.",
    orientacoes: "Pode causar tosse seca irritativa. Em caso de inchaco na boca, lingua ou garganta (angioedema), suspender imediatamente e procurar pronto-socorro.",
    alertaSUS: "Disponibilizado gratuitamente no SUS e Farmácia Popular.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "10-20mg", tarde: "0", noite: "0", obs: "Dose unica diaria" },
    monitoramento: ["Pressao arterial", "Funcao renal", "Potassio serico", "Observar tosse seca"],
    beersCriteria: false
  },
  {
    id: "anlodipino",
    nome: "Anlodipino (Besilato)",
    classe: "Anti-hipertensivo / Bloqueador dos Canais de Cálcio (BCC - Di-hidropiridínico)",
    indicacoes: "Tratamento de primeira linha da hipertensão arterial sistêmica e da angina de peito (crônica estável e vasoespástica).",
    posologia: "Dose inicial usual de 5 mg uma vez ao dia, podendo ser aumentada para dose máxima de 10 mg ao dia dependendo da resposta do paciente.",
    contraindicacoes: "Hipotensão grave, choque cardiogênico, estenose aórtica clinicamente significativa, insuficiência cardíaca instável pós-infarto.",
    orientacoes: "Frequente associacao com inchaco nos tornozelos (edema maleolar periferico). Comunicar o medico se houver inchaco desconfortavel.",
    alertaSUS: "Disponibilizado nas farmácias básicas do SUS e Componente de Assistência Municipal.",
    remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "5-10mg", tarde: "0", noite: "0", obs: "Dose unica - qualquer horario" },
    monitoramento: ["Pressao arterial", "Edema periferico", "Frequencia cardiaca"],
    beersCriteria: false
  },
  {
    id: "propranolol", nome: "Propranolol (Cloridrato)", classe: "Anti-hipertensivo / Beta-bloqueador Não Seletivo",
    indicacoes: "Hipertensão arterial, arritmias cardíacas, angina de peito, tremor essencial, profilaxia de enxaqueca e controle de sintomas de ansiedade.",
    posologia: "Hipertensão: 40-80 mg/dia, 2-3x ao dia. Enxaqueca: 40-160 mg/dia. Tremor essencial: 40-120 mg/dia.",
    contraindicacoes: "Asma brônquica, DPOC grave, bradicardia sinusal, bloqueio AV de 2º/3º grau, choque cardiogênico, ICC descompensada.",
    orientacoes: "Não suspender abruptamente (risco de efeito rebote cardíaco). Monitorar pulso cardíaco regularmente. Evitar em asmáticos.",
    alertaSUS: "Disponível na RENAME e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "40mg", tarde: "0", noite: "40mg", obs: "Não suspender abruptamente" },
    monitoramento: ["Frequência cardíaca", "Pressão arterial", "Glicemia em diabéticos"], beersCriteria: false
  },
  {
    id: "furosemida", nome: "Furosemida", classe: "Diurético de Alça",
    indicacoes: "Edema associado a ICC, cirrose hepática, síndrome nefrótica. Hipertensão arterial quando tiazídicos são ineficazes (ClCr < 30 mL/min).",
    posologia: "Edema: 20-80 mg/dia pela manhã, podendo aumentar até 600 mg/dia em casos graves. Hipertensão: 20-40 mg/dia.",
    contraindicacoes: "Anúria, hipovolemia, desidratação grave, hipocalemia ou hiponatremia severas, encefalopatia hepática.",
    orientacoes: "Tomar pela manhã para evitar noctúria. Pode causar perda de potássio, magnésio e cálcio. Monitorar eletrólitos.",
    alertaSUS: "Disponível no SUS e RENAME.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "40mg", tarde: "0", noite: "0", obs: "Pela manhã - monitorar K+" },
    monitoramento: ["Potássio sérico", "Sódio", "Creatinina", "PA", "Peso corporal"], beersCriteria: false
  },
  {
    id: "nifedipina", nome: "Nifedipina (Retard)", classe: "Anti-hipertensivo / BCC Di-hidropiridínico",
    indicacoes: "Hipertensão arterial sistêmica e angina de peito crônica estável (formulação de liberação controlada).",
    posologia: "20-60 mg/dia em dose única ou dividida em 2 tomadas (formulação retard). Não usar formulação de ação rápida sublingual.",
    contraindicacoes: "Choque cardiogênico, estenose aórtica significativa, angina instável, IAM recente (4 semanas).",
    orientacoes: "Usar APENAS formulação de liberação prolongada (Retard/CR). Nifedipina sublingual de ação rápida é contraindicada pelo risco de hipotensão grave.",
    alertaSUS: "Disponível no SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "20mg", tarde: "0", noite: "20mg", obs: "Apenas formulação Retard" },
    monitoramento: ["PA", "FC", "Edema periférico", "Cefaleia"], beersCriteria: false
  },
  {
    id: "gliclazida", nome: "Gliclazida MR", classe: "Hipoglicemiante Oral / Sulfonilureia de 2ª geração",
    indicacoes: "DM2 quando dieta e exercícios são insuficientes. Preferida em relação à Glibenclamida em idosos por menor risco de hipoglicemia.",
    posologia: "Iniciar 30 mg/dia antes do café. Aumentar a cada 2-4 semanas. Dose máxima: 120 mg/dia em tomada única.",
    contraindicacoes: "DM1, cetoacidose diabética, insuficiência renal grave (ClCr < 15 mL/min), insuficiência hepática grave.",
    orientacoes: "Menor risco de hipoglicemia que Glibenclamida. Preferida em idosos e pacientes com DRC moderada. Tomar no café da manhã.",
    alertaSUS: "Disponível no SUS e RENAME.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "30-60mg", tarde: "0", noite: "0", obs: "Antes do café da manhã" },
    monitoramento: ["Glicemia capilar", "HbA1c trimestral", "Função renal"], beersCriteria: false
  },
  {
    id: "insulina_nph", nome: "Insulina NPH (Humana)", classe: "Hipoglicemiante Injetável / Insulina de Ação Intermediária",
    indicacoes: "DM1 (sempre), DM2 quando antidiabéticos orais são insuficientes, diabetes gestacional, hiperglicemia grave.",
    posologia: "DM2: iniciar 10 UI ao deitar (bedtime) ou 0,1-0,2 UI/kg. Ajustar a cada 3-7 dias conforme glicemia de jejum.",
    contraindicacoes: "Hipoglicemia ativa. Usar com cautela em insuficiência renal (necessidade de redução de dose).",
    orientacoes: "Armazenar em geladeira (2-8°C). Após aberto, usar em até 28 dias em temperatura ambiente. Homogeneizar suavemente antes de aplicar. Fazer rodízio dos locais de aplicação.",
    alertaSUS: "Fornecida gratuitamente pelo SUS e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "Conforme prescrição", tarde: "0", noite: "10 UI (bedtime)", obs: "Rodízio de locais de aplicação" },
    monitoramento: ["Glicemia capilar diária", "HbA1c trimestral", "Sinais de hipoglicemia", "Locais de aplicação"], beersCriteria: false
  },
  {
    id: "levotiroxina", nome: "Levotiroxina Sódica", classe: "Hormônio Tireoidiano / Reposição T4",
    indicacoes: "Hipotireoidismo primário e secundário, supressão de TSH em câncer diferenciado de tireoide pós-cirurgia.",
    posologia: "Adultos: iniciar 25-50 mcg/dia (idosos: 12,5-25 mcg/dia). Ajustar a cada 4-6 semanas conforme TSH. Dose usual: 75-150 mcg/dia.",
    contraindicacoes: "Tireotoxicose não tratada, insuficiência adrenal não corrigida, IAM recente.",
    orientacoes: "Tomar em jejum absoluto, 30-60 minutos antes do café da manhã, com água. Separar de cálcio, ferro e antiácidos por pelo menos 4 horas.",
    alertaSUS: "Disponível na RENAME e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "75-150mcg", tarde: "0", noite: "0", obs: "Jejum absoluto - 30min antes do café" },
    monitoramento: ["TSH a cada 6-8 semanas até estabilizar", "TSH anual depois", "T4 livre"], beersCriteria: false
  },
  {
    id: "fluoxetina", nome: "Fluoxetina (Cloridrato)", classe: "Antidepressivo / ISRS (Inibidor Seletivo da Recaptação de Serotonina)",
    indicacoes: "Depressão maior, transtorno obsessivo-compulsivo (TOC), bulimia nervosa, transtorno de pânico.",
    posologia: "Depressão: iniciar 20 mg/dia pela manhã. Pode aumentar até 60-80 mg/dia. Efeito pleno em 4-6 semanas.",
    contraindicacoes: "Uso concomitante com IMAOs (intervalo mínimo de 14 dias). Hipersensibilidade ao fármaco.",
    orientacoes: "Tomar pela manhã (pode causar insônia). Não suspender abruptamente após uso prolongado (reduzir gradualmente). Alertar sobre risco de ideação suicida nas primeiras semanas em jovens.",
    alertaSUS: "Disponível na RENAME e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "20mg", tarde: "0", noite: "0", obs: "Pela manhã - efeito em 4-6 semanas" },
    monitoramento: ["Humor e ideação suicida", "Efeitos GI", "Peso corporal", "Função sexual"], beersCriteria: false
  },
  {
    id: "sertralina", nome: "Sertralina (Cloridrato)", classe: "Antidepressivo / ISRS",
    indicacoes: "Depressão maior, transtorno de pânico, TOC, TEPT, fobia social. Primeira escolha em idosos e cardiopatas.",
    posologia: "Iniciar 50 mg/dia. Aumentar a cada 1-2 semanas se necessário. Dose máxima: 200 mg/dia.",
    contraindicacoes: "Uso concomitante com IMAOs, pimozida. Hipersensibilidade.",
    orientacoes: "Pode ser tomada com ou sem alimentos. Meia-vida mais curta que fluoxetina, facilitando ajustes. Preferida em idosos pela segurança cardiovascular.",
    alertaSUS: "Disponível no SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "50mg", tarde: "0", noite: "0", obs: "Com ou sem alimentos" },
    monitoramento: ["Humor", "Sintomas GI", "Sódio sérico em idosos (risco SIADH)"], beersCriteria: false
  },
  {
    id: "amitriptilina", nome: "Amitriptilina (Cloridrato)", classe: "Antidepressivo Tricíclico (ADT)",
    indicacoes: "Depressão, dor neuropática crônica, profilaxia de enxaqueca, fibromialgia.",
    posologia: "Depressão: 25-75 mg/dia à noite (pode aumentar até 150 mg/dia). Dor neuropática: 10-25 mg à noite.",
    contraindicacoes: "IAM recente, uso de IMAOs, glaucoma de ângulo fechado, retenção urinária, bloqueio cardíaco.",
    orientacoes: "Tomar à noite (causa sonolência). Efeitos anticolinérgicos intensos: boca seca, constipação, retenção urinária, visão turva. EVITAR em idosos (Beers).",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "0", tarde: "0", noite: "25-75mg", obs: "À noite - causa sonolência" },
    monitoramento: ["ECG (intervalo QT)", "PA ortostática", "Efeitos anticolinérgicos", "Peso"],
    beersCriteria: true, beersAlerta: "Critério de Beers: Altamente anticolinérgico. Risco de sedação, quedas, confusão mental e retenção urinária em idosos. Preferir ISRS."
  },
  {
    id: "diazepam", nome: "Diazepam", classe: "Ansiolítico / Benzodiazepínico de Ação Longa",
    indicacoes: "Transtornos de ansiedade, espasmos musculares, convulsões, síndrome de abstinência alcoólica, pré-anestesia.",
    posologia: "Ansiedade: 2-10 mg, 2-4x ao dia. Espasmo muscular: 2-10 mg, 3-4x ao dia. Usar menor dose pelo menor tempo possível.",
    contraindicacoes: "Miastenia gravis, insuficiência respiratória grave, apneia do sono, insuficiência hepática grave, glaucoma de ângulo fechado.",
    orientacoes: "CONTROLADO (Portaria 344 - Lista B1). Risco de dependência física e psíquica. Não usar com álcool. Evitar em idosos (Beers). Meia-vida muito longa (20-100h).",
    alertaSUS: "Disponível no SUS mediante receita B1.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "5mg", tarde: "0", noite: "5mg", obs: "Receita B1 - Menor tempo possível" },
    monitoramento: ["Nível de sedação", "Risco de quedas", "Sinais de dependência", "Função respiratória"],
    beersCriteria: true, beersAlerta: "Critério de Beers: Alto risco de quedas, fraturas, delirium e dependência em idosos. Meia-vida longa. Preferir alternativas não farmacológicas."
  },
  {
    id: "clonazepam", nome: "Clonazepam", classe: "Anticonvulsivante / Benzodiazepínico",
    indicacoes: "Epilepsia (crises mioclônicas, ausências), transtorno de pânico, ansiedade generalizada (uso off-label).",
    posologia: "Ansiedade/Pânico: 0,25-0,5 mg, 2x ao dia. Pode aumentar até 4 mg/dia. Epilepsia: até 20 mg/dia.",
    contraindicacoes: "Miastenia gravis, insuficiência respiratória grave, insuficiência hepática grave.",
    orientacoes: "CONTROLADO (Lista B1). Risco alto de dependência. Não associar com álcool ou outros depressores do SNC. Retirada deve ser gradual.",
    alertaSUS: "Disponível no SUS mediante receita B1.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "0,5mg", tarde: "0", noite: "0,5mg", obs: "Lista B1 - Retirada gradual" },
    monitoramento: ["Sedação", "Risco de quedas", "Dependência", "Função cognitiva"],
    beersCriteria: true, beersAlerta: "Critério de Beers: Risco de quedas, fraturas, delirium e dependência em idosos. Evitar uso crônico."
  },
  {
    id: "carbamazepina", nome: "Carbamazepina", classe: "Anticonvulsivante / Estabilizador de Humor",
    indicacoes: "Epilepsia (crises parciais e tônico-clônicas), neuralgia do trigêmeo, transtorno bipolar (fase maníaca).",
    posologia: "Epilepsia: iniciar 200 mg/dia, aumentar 200 mg a cada semana. Dose usual: 600-1200 mg/dia em 2-3 tomadas.",
    contraindicacoes: "Bloqueio AV, porfiria aguda intermitente, uso concomitante com IMAOs, supressão medular.",
    orientacoes: "Forte indutor enzimático (CYP3A4) — reduz eficácia de ACOs, varfarina e outros fármacos. Monitorar hemograma e função hepática.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "200mg", tarde: "200mg", noite: "200mg", obs: "Indutor enzimático - verificar interações" },
    monitoramento: ["Hemograma (risco agranulocitose)", "TGO/TGP", "Sódio sérico", "Nível sérico do fármaco"], beersCriteria: false
  },
  {
    id: "acido_valproico", nome: "Ácido Valproico / Valproato de Sódio", classe: "Anticonvulsivante / Estabilizador de Humor",
    indicacoes: "Epilepsia (todos os tipos de crises), transtorno bipolar (mania aguda e profilaxia), profilaxia de enxaqueca.",
    posologia: "Epilepsia: 10-15 mg/kg/dia, aumentando semanalmente. Dose usual: 500-2000 mg/dia em 2-3 tomadas.",
    contraindicacoes: "Doença hepática ativa, porfiria, gestação (TERATOGÊNICO - categoria X), distúrbios do ciclo da ureia.",
    orientacoes: "TERATOGÊNICO — contraindicado na gestação. Monitorar função hepática, hemograma e nível sérico. Pode causar ganho de peso e tremor.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500mg", tarde: "0", noite: "500mg", obs: "TERATOGÊNICO - Evitar na gestação" },
    monitoramento: ["TGO/TGP", "Hemograma", "Nível sérico (50-100 mcg/mL)", "Amilase/Lipase", "Peso"], beersCriteria: false
  },
  {
    id: "varfarina", nome: "Varfarina Sódica", classe: "Anticoagulante Oral / Antagonista da Vitamina K",
    indicacoes: "Profilaxia e tratamento de tromboembolismo venoso (TVP/TEP), fibrilação atrial, prótese valvar mecânica.",
    posologia: "Dose individualizada conforme INR. Iniciar 5 mg/dia. Ajustar a cada 3-7 dias. Alvo: INR 2,0-3,0 (prótese mecânica: 2,5-3,5).",
    contraindicacoes: "Gestação (teratogênico), sangramento ativo, úlcera péptica ativa, HAS não controlada grave, cirurgia recente no SNC.",
    orientacoes: "Dieta constante em vitamina K (não precisa evitar, mas manter quantidade estável). Inúmeras interações medicamentosas. Controle rigoroso do INR.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "5mg (ajustar)", tarde: "0", noite: "0", obs: "Controle de INR rigoroso" },
    monitoramento: ["INR semanal→quinzenal→mensal", "Sinais de sangramento", "Interações medicamentosas"], beersCriteria: false
  },
  {
    id: "aas", nome: "Ácido Acetilsalicílico (AAS)", classe: "Antiagregante Plaquetário / AINE",
    indicacoes: "Prevenção secundária de eventos cardiovasculares (IAM, AVC) em pacientes de alto risco. Antiplaquetário em dose baixa.",
    posologia: "Antiagregante: 100 mg/dia em dose única. Analgésico/Antitérmico: 500-1000 mg a cada 4-6h (máx 4g/dia).",
    contraindicacoes: "Úlcera péptica ativa, hemofilia, dengue (risco de sangramento), crianças com infecções virais (síndrome de Reye).",
    orientacoes: "Tomar após as refeições. Na dose antiagregante (100mg), não interromper sem orientação médica. Evitar associar com outros AINEs.",
    alertaSUS: "Disponível na RENAME e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "100mg", tarde: "0", noite: "0", obs: "Após o café - Não suspender sem orientação" },
    monitoramento: ["Sinais de sangramento GI", "Hemoglobina/Hematócrito", "Função renal"], beersCriteria: false
  },
  {
    id: "dipirona", nome: "Dipirona Sódica (Metamizol)", classe: "Analgésico / Antitérmico (Não Opioide)",
    indicacoes: "Dor aguda moderada a intensa, febre alta refratária a paracetamol, cólicas (ação espasmolítica associada).",
    posologia: "500 mg a 1000 mg por dose, a cada 6 horas. Via oral ou IV. Dose máxima: 4000 mg/dia.",
    contraindicacoes: "Hipersensibilidade a pirazolonas, porfiria aguda intermitente, deficiência de G6PD, discrasias sanguíneas.",
    orientacoes: "Risco raro mas grave de agranulocitose. Orientar paciente a procurar atendimento se febre, odinofagia ou ulcerações na boca.",
    alertaSUS: "Amplamente disponível no SUS e farmácias.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500-1000mg", tarde: "500-1000mg", noite: "500-1000mg", obs: "6/6h - Máx 4g/dia" },
    monitoramento: ["Hemograma (se uso prolongado)", "Sinais de agranulocitose", "PA (pode causar hipotensão IV)"], beersCriteria: false
  },
  {
    id: "tramadol", nome: "Tramadol (Cloridrato)", classe: "Analgésico Opioide Fraco",
    indicacoes: "Dor moderada a intensa aguda ou crônica, dor pós-operatória, dor oncológica.",
    posologia: "50-100 mg a cada 4-6h. Dose máxima: 400 mg/dia. Idosos: iniciar 25 mg e titular lentamente.",
    contraindicacoes: "Uso concomitante com IMAOs, epilepsia não controlada, intoxicação aguda por álcool/sedativos.",
    orientacoes: "CONTROLADO (Lista A2). Pode causar náusea, constipação, tontura e sonolência. Risco de convulsão em doses elevadas. Reduzir dose em DRC e idosos.",
    alertaSUS: "Disponível no SUS mediante receita especial.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "50mg", tarde: "50mg", noite: "50mg", obs: "Receita A2 - Ajustar dose em idosos" },
    monitoramento: ["Nível de sedação", "Frequência respiratória", "Função intestinal", "Sinais de dependência"],
    beersCriteria: true, beersAlerta: "Critério de Beers: Risco de sedação, quedas, confusão e constipação em idosos. Usar menor dose possível pelo menor tempo."
  },
  {
    id: "salbutamol", nome: "Salbutamol (Sulfato) Inalatório", classe: "Broncodilatador / Beta-2 Agonista de Curta Duração (SABA)",
    indicacoes: "Alívio rápido de broncoespasmo na asma aguda, DPOC, bronquite. Resgate em crises de dispneia.",
    posologia: "Aerossol: 100-200 mcg (1-2 jatos) a cada 4-6h conforme necessário. Nebulização: 2,5-5 mg a cada 4-6h.",
    contraindicacoes: "Hipersensibilidade. Usar com cautela em arritmias, hipertireoidismo e cardiopatia isquêmica.",
    orientacoes: "Uso exclusivo como resgate (SOS). Se usar >3x/semana, asma está descontrolada — necessita corticoide inalatório. Ensinar técnica inalatória correta.",
    alertaSUS: "Disponível no SUS e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "SOS", tarde: "SOS", noite: "SOS", obs: "Apenas quando necessário (resgate)" },
    monitoramento: ["Frequência de uso (>3x/sem = descontrole)", "FC e tremor", "Técnica inalatória"], beersCriteria: false
  },
  {
    id: "beclometasona", nome: "Beclometasona (Dipropionato) Inalatória", classe: "Corticoide Inalatório (CI)",
    indicacoes: "Tratamento de manutenção da asma persistente (todas as gravidades). Previne crises e remodelamento brônquico.",
    posologia: "Asma leve: 200-500 mcg/dia. Asma moderada: 500-1000 mcg/dia. Asma grave: 1000-2000 mcg/dia. Dividir em 2 tomadas.",
    contraindicacoes: "Não usar para alívio de broncoespasmo agudo (não tem efeito rápido). Hipersensibilidade.",
    orientacoes: "Usar DIARIAMENTE mesmo sem sintomas. Enxaguar a boca após cada uso para evitar candidíase oral. Usar com espaçador para melhorar deposição pulmonar.",
    alertaSUS: "Disponível no SUS e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "250mcg", tarde: "0", noite: "250mcg", obs: "Diário - Lavar a boca após uso" },
    monitoramento: ["Controle de sintomas de asma", "Candidíase oral", "Crescimento em crianças", "Rouquidão"], beersCriteria: false
  },
  {
    id: "budesonida_formoterol", nome: "Budesonida + Fumarato de Formoterol", classe: "Corticoide Inalatório + Beta-2 Agonista de Longa Duração (CI + LABA)",
    indicacoes: "Tratamento de manutenção e alívio (estratégia SMART / MART) da asma persistente moderada a grave e DPOC sintomática.",
    posologia: "Dose habitual: 1 a 2 inalações (200/6 mcg ou 400/12 mcg) 2x ao dia. Na estratégia MART, pode ser usada como alívio nas crises até limite prescrito.",
    contraindicacoes: "Hipersensibilidade conhecida aos componentes. Usar com cautela em arritmias cardíacas graves e hipertireoidismo.",
    orientacoes: "Enxaguar a boca após a inalação. Não engolir a água do enxágue. Verificar se o paciente compreendeu a técnica do inalador de pó seco ou spray.",
    alertaSUS: "Disponível no Componente Especializado (CEAF) e Farmácia Popular.", remumeCG: "Padronizado no Componente Especializado da Assistência Farmacêutica (SUS)",
    posologiaVisual: { manha: "1 inal", tarde: "0", noite: "1 inal", obs: "Enxaguar a boca após inalar" },
    monitoramento: ["Frequência de exacerbações", "Controle de sintomas (ACT/GINA)", "Candidíase oral e rouquidão", "FC"], beersCriteria: false
  },
  {
    id: "ipratropio", nome: "Brometo de Ipratrópio Inalatório", classe: "Broncodilatador Anticolinérgico de Curta Duração (SAMA)",
    indicacoes: "Broncoespasmo na DPOC, coadjuvante no manejo da exacerbação grave de asma associado a beta-2 agonista.",
    posologia: "Nebulização: 0,25 a 0,5 mg (20 a 40 gotas) diluídas em soro fisiológico a cada 6-8 horas. Aerossol: 2 jatos 3-4x/dia.",
    contraindicacoes: "Glaucoma de ângulo fechado não tratado, hipertrofia prostática grave (risco de retenção urinária).",
    orientacoes: "Evitar contato acidental do aerossol ou vapor com os olhos (risco de midríase e piora de glaucoma). Uso com máscara facial bem ajustada.",
    alertaSUS: "Disponível no SUS e UPA.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "SOS", tarde: "SOS", noite: "SOS", obs: "Apenas se prescrito / Proteger os olhos" },
    monitoramento: ["Boca seca", "Retenção urinária", "Pressão intraocular em pacientes com glaucoma"], beersCriteria: false
  },
  {
    id: "prednisona", nome: "Prednisona", classe: "Corticosteroide Sistêmico / Anti-inflamatório Esteroidal",
    indicacoes: "Doenças inflamatórias e autoimunes (artrite reumatoide, LES, asma grave), reações alérgicas graves, exacerbação de DPOC.",
    posologia: "Dose variável conforme indicação: 5-60 mg/dia. Usar menor dose pelo menor tempo. Cursos curtos (5-7 dias) não necessitam desmame.",
    contraindicacoes: "Infecções fúngicas sistêmicas, herpes zóster ativo, vacinas com vírus vivo durante imunossupressão.",
    orientacoes: "Tomar pela manhã (mimetiza ciclo circadiano do cortisol). Uso prolongado: risco de osteoporose, hiperglicemia, supressão adrenal, Cushing. Necessita desmame se >14 dias.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "5-20mg", tarde: "0", noite: "0", obs: "Pela manhã - Desmame se >14 dias" },
    monitoramento: ["Glicemia", "PA", "Densitometria (uso crônico)", "Sinais de Cushing", "Potássio"], beersCriteria: false
  },
  {
    id: "sulfato_ferroso", nome: "Sulfato Ferroso", classe: "Antianêmico / Suplemento de Ferro",
    indicacoes: "Anemia ferropriva, prevenção de deficiência de ferro em gestantes e lactentes.",
    posologia: "Adultos: 120-200 mg de ferro elementar/dia (2-3 cp de 40mg Fe elem.) em 2-3 tomadas. Gestantes: 40-60 mg Fe elem./dia.",
    contraindicacoes: "Hemocromatose, anemias não ferroprivas, hemossiderose, úlcera péptica ativa.",
    orientacoes: "Tomar em jejum com suco de laranja (vitamina C melhora absorção). Separar de leite, antiácidos e café por 2h. Pode escurecer fezes. Pode causar náusea e constipação.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "40mg Fe", tarde: "40mg Fe", noite: "0", obs: "Em jejum com suco de laranja" },
    monitoramento: ["Hemoglobina/Hematócrito", "Ferritina sérica", "Ferro sérico", "Tolerância GI"], beersCriteria: false
  },
  {
    id: "acido_folico", nome: "Ácido Fólico", classe: "Vitamina do Complexo B / Suplemento",
    indicacoes: "Prevenção de defeitos do tubo neural na gestação, anemia megaloblástica por deficiência de folato.",
    posologia: "Prevenção pré-concepcional: 0,4-5 mg/dia (iniciar 1-3 meses antes da concepção). Anemia: 5 mg/dia.",
    contraindicacoes: "Não usar isoladamente em anemia por deficiência de B12 (pode mascarar o diagnóstico).",
    orientacoes: "Essencial no período periconcepcional. Pode ser tomado com ou sem alimentos. Seguro em doses habituais.",
    alertaSUS: "Disponível na RENAME e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "5mg", tarde: "0", noite: "0", obs: "Iniciar antes da gestação" },
    monitoramento: ["Hemograma", "Dosagem de B12 (descartar deficiência concomitante)"], beersCriteria: false
  },
  {
    id: "dexametasona", nome: "Dexametasona", classe: "Corticosteroide / Anti-inflamatório Esteroidal Potente",
    indicacoes: "Processos inflamatórios e alérgicos graves, edema cerebral, náuseas por quimioterapia, COVID-19 grave com hipoxemia.",
    posologia: "Dose variável: 0,5-20 mg/dia conforme indicação. Anti-inflamatório: 0,5-9 mg/dia. Curto prazo preferível.",
    contraindicacoes: "Infecções fúngicas sistêmicas, herpes ocular, vacinas vivas em imunossuprimidos.",
    orientacoes: "Potência 7x maior que prednisona. Usar pelo menor tempo possível. Tomar pela manhã. Necessita desmame se uso >7-14 dias.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "4mg", tarde: "0", noite: "0", obs: "Pela manhã - Menor tempo possível" },
    monitoramento: ["Glicemia", "PA", "Sinais de infecção", "Supressão adrenal"], beersCriteria: false
  },
  {
    id: "metildopa", nome: "Metildopa", classe: "Anti-hipertensivo / Agonista Alfa-2 Central",
    indicacoes: "Hipertensão na gestação (fármaco de 1ª escolha). Hipertensão crônica em gestantes.",
    posologia: "Iniciar 250 mg, 2-3x ao dia. Dose usual: 500-2000 mg/dia. Dose máxima: 3000 mg/dia.",
    contraindicacoes: "Doença hepática ativa, feocromocitoma, uso de IMAOs, anemia hemolítica.",
    orientacoes: "Pode causar sonolência, boca seca e hipotensão postural. Monitorar função hepática. Seguro na gestação (categoria B).",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "250mg", tarde: "250mg", noite: "250mg", obs: "1ª escolha na HAS gestacional" },
    monitoramento: ["PA", "TGO/TGP", "Hemograma (Coombs direto)", "Sonolência"], beersCriteria: false
  },
  {
    id: "ciprofloxacino", nome: "Ciprofloxacino", classe: "Antibiótico / Fluoroquinolona",
    indicacoes: "ITU complicada, prostatite, infecções GI, osteomielite. Reservar para infecções resistentes.",
    posologia: "ITU: 500 mg 12/12h por 7-14 dias. Infecções graves: 750 mg 12/12h.",
    contraindicacoes: "Menores de 18 anos (risco de lesão cartilaginosa), gestação, uso concomitante com tizanidina.",
    orientacoes: "Não tomar com leite, antiácidos ou suplementos de ferro/cálcio (quelação). Risco de tendinopatia e ruptura de tendão, especialmente em idosos e em uso de corticoides.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500mg", tarde: "0", noite: "500mg", obs: "12/12h - Separar de antiácidos/leite" },
    monitoramento: ["Função renal", "Sinais de tendinopatia", "Fotossensibilidade", "QTc em cardiopatas"], beersCriteria: false
  },
  {
    id: "azitromicina", nome: "Azitromicina", classe: "Antibiótico / Macrolídeo",
    indicacoes: "Infecções do trato respiratório superior e inferior, otite média, sinusite, ISTs (clamídia, gonorreia).",
    posologia: "500 mg/dia por 3 dias (dose total 1,5g). IST por Clamídia: dose única de 1g.",
    contraindicacoes: "Hipersensibilidade a macrolídeos. Uso com cautela em hepatopatias e pacientes com prolongamento QT.",
    orientacoes: "Pode ser tomada com ou sem alimentos. Meia-vida longa (efeito persiste 5-7 dias após última dose). Risco de prolongamento QT.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500mg", tarde: "0", noite: "0", obs: "Por 3 dias - Meia-vida longa" },
    monitoramento: ["TGO/TGP", "ECG se cardiopata", "Eficácia clínica"], beersCriteria: false
  },
  {
    id: "cefalexina", nome: "Cefalexina", classe: "Antibiótico / Cefalosporina de 1ª Geração",
    indicacoes: "Infecções de pele e partes moles, ITU não complicada, faringite estreptocócica, profilaxia de infecção de ferida.",
    posologia: "250-500 mg a cada 6h. ITU: 500 mg 12/12h. Duração usual: 7-10 dias.",
    contraindicacoes: "Alergia grave a cefalosporinas. Cautela em alergia a penicilinas (reatividade cruzada ~1-2%).",
    orientacoes: "Pode ser tomada com ou sem alimentos. Completar todo o ciclo de tratamento mesmo com melhora dos sintomas.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500mg", tarde: "500mg", noite: "500mg", obs: "6/6h ou 8/8h - Completar o ciclo" },
    monitoramento: ["Sinais de alergia", "Diarreia (C. difficile)", "Função renal em uso prolongado"], beersCriteria: false
  },
  {
    id: "metronidazol", nome: "Metronidazol", classe: "Antibiótico / Antiparasitário (Nitroimidazol)",
    indicacoes: "Vaginose bacteriana, giardíase, amebíase, infecções anaeróbias, H. pylori (esquema tríplice).",
    posologia: "Vaginose: 500 mg 12/12h por 7 dias. Giardíase: 250 mg 8/8h por 5-7 dias. Amebíase: 500-750 mg 8/8h por 5-10 dias.",
    contraindicacoes: "Primeiro trimestre da gestação, uso de álcool (efeito dissulfiram), doença neurológica ativa.",
    orientacoes: "NÃO consumir álcool durante o tratamento e até 48h após (reação tipo dissulfiram: náusea, vômitos, cefaleia intensa). Pode escurecer a urina.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "500mg", tarde: "0", noite: "500mg", obs: "PROIBIDO álcool durante e 48h após" },
    monitoramento: ["Sinais neurológicos (neuropatia)", "Adesão à abstinência alcoólica", "Leucograma"], beersCriteria: false
  },
  {
    id: "albendazol", nome: "Albendazol", classe: "Anti-helmíntico de Amplo Espectro",
    indicacoes: "Ascaridíase, enterobíase, ancilostomíase, estrongiloidíase, teníase, neurocisticercose.",
    posologia: "Dose única: 400 mg (maioria das parasitoses intestinais). Estrongiloidíase: 400 mg/dia por 3 dias. Neurocisticercose: 15 mg/kg/dia por 8-30 dias.",
    contraindicacoes: "Gestação (teratogênico), hipersensibilidade. Cautela em hepatopatias.",
    orientacoes: "Tomar após refeição gordurosa para melhor absorção. Mulheres em idade fértil devem ter teste de gravidez negativo antes do uso.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "400mg", tarde: "0", noite: "0", obs: "Dose única com refeição gordurosa" },
    monitoramento: ["TGO/TGP (uso prolongado)", "Hemograma", "Teste de gravidez pré-tratamento"], beersCriteria: false
  },
  {
    id: "ivermectina", nome: "Ivermectina", classe: "Antiparasitário / Endectocida",
    indicacoes: "Escabiose (sarna), pediculose, oncocercose, estrongiloidíase, filariose linfática.",
    posologia: "Dose única: 200 mcg/kg (geralmente 1 cp de 6mg para cada 30 kg). Escabiose: repetir após 7-14 dias.",
    contraindicacoes: "Crianças < 15 kg, gestação, lactação. Cautela em pacientes com co-infecção por Loa loa.",
    orientacoes: "Tomar em jejum com água. Dose baseada no peso corporal. Para escabiose: tratar todos os contactantes domiciliares simultaneamente.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "200mcg/kg", tarde: "0", noite: "0", obs: "Em jejum - Dose única pelo peso" },
    monitoramento: ["Resolução dos sintomas", "Reinfecção", "Tratamento dos contactantes"], beersCriteria: false
  },
  {
    id: "loratadina", nome: "Loratadina", classe: "Anti-histamínico de 2ª Geração (Não Sedante)",
    indicacoes: "Rinite alérgica sazonal e perene, urticária crônica, conjuntivite alérgica.",
    posologia: "Adultos: 10 mg uma vez ao dia. Crianças 2-12 anos: 5 mg/dia.",
    contraindicacoes: "Hipersensibilidade. Ajustar dose em insuficiência hepática grave.",
    orientacoes: "Não causa sedação significativa (2ª geração). Pode ser tomada a qualquer horário. Preferida em idosos em relação aos anti-histamínicos de 1ª geração.",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "10mg", tarde: "0", noite: "0", obs: "Não sedante - Qualquer horário" },
    monitoramento: ["Controle dos sintomas", "Boca seca (raro)"], beersCriteria: false
  },
  {
    id: "insulina_regular", nome: "Insulina Regular (Humana)", classe: "Hipoglicemiante Injetável / Insulina de Ação Rápida",
    indicacoes: "Controle glicêmico prandial (antes das refeições), correção de hiperglicemia aguda, cetoacidose diabética, uso IV hospitalar.",
    posologia: "SC: 30 minutos antes das refeições. Dose conforme contagem de carboidratos ou prescrição. IV: em ambiente hospitalar.",
    contraindicacoes: "Hipoglicemia ativa.",
    orientacoes: "Aplicar 30 minutos antes da refeição (diferente das análogas ultrarrápidas). Aspecto límpido e transparente (não homogeneizar). Armazenar em geladeira.",
    alertaSUS: "Fornecida gratuitamente pelo SUS e Farmácia Popular.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "Conforme prescrição", tarde: "Conforme prescrição", noite: "Conforme prescrição", obs: "30 min antes das refeições" },
    monitoramento: ["Glicemia capilar pré e pós-prandial", "HbA1c trimestral", "Sinais de hipoglicemia"], beersCriteria: false
  },
  {
    id: "metoclopramida", nome: "Metoclopramida", classe: "Antiemético / Procinético Dopaminérgico",
    indicacoes: "Náuseas e vômitos, gastroparesia diabética, refluxo gastroesofágico (uso curto).",
    posologia: "10 mg, 3x ao dia, 30 minutos antes das refeições. Uso máximo recomendado: 5 dias contínuos.",
    contraindicacoes: "Feocromocitoma, obstrução GI mecânica, epilepsia, uso com medicamentos que causem reações extrapiramidais.",
    orientacoes: "Uso por período curto (máximo 5 dias). Risco de sintomas extrapiramidais (acatisia, discinesia tardia) especialmente em jovens e idosos. EVITAR em idosos (Beers).",
    alertaSUS: "Disponível na RENAME e SUS.", remumeCG: "Padronizado na REMUME de Campo Grande - MS (RENAME)",
    posologiaVisual: { manha: "10mg", tarde: "10mg", noite: "10mg", obs: "30min antes das refeições - Máx 5 dias" },
    monitoramento: ["Sintomas extrapiramidais", "Sinais de discinesia tardia", "Nível de prolactina"],
    beersCriteria: true, beersAlerta: "Critério de Beers: Risco de sintomas extrapiramidais e discinesia tardia em idosos. Evitar uso >5 dias. Preferir ondansetrona se necessário."
  }
];

const BEERS_CRITERIA = [
  { id: "b1", farmaco: "Glibenclamida", risco: "Hipoglicemia grave prolongada", alternativa: "Gliclazida MR ou Glipizida", categoria: "Hipoglicemiantes" },
  { id: "b2", farmaco: "AINEs (Ibuprofeno, Naproxeno, Diclofenaco)", risco: "Sangramento GI, IRC, ICC, Hipertensao", alternativa: "Paracetamol (1 escolha em idosos)", categoria: "Analgesicos" },
  { id: "b3", farmaco: "Benzodiazepinicos (Diazepam, Clonazepam)", risco: "Quedas, delirium, dependencia", alternativa: "Melatonina, Trazodona, Psicoterapia", categoria: "Psicotropicos" },
  { id: "b4", farmaco: "Amitriptilina / ADTs", risco: "Sedacao, quedas, efeitos anticolin ergicos", alternativa: "Sertralina, Escitalopram", categoria: "Antidepressivos" },
  { id: "b5", farmaco: "IBPs cronicos (Omeprazol > 8 semanas)", risco: "Hipomagnesemia, fraturas, C. difficile", alternativa: "Reavaliacao da indicacao; reducao de dose", categoria: "Antiulcerosos" },
  { id: "b6", farmaco: "Anti-histaminicos 1 geracao (Difenidramina)", risco: "Delirium, sedacao, retencao urinaria", alternativa: "Loratadina, Cetirizina", categoria: "Anti-historaminicos" },
  { id: "b7", farmaco: "Metoclopramida", risco: "Sintomas extrapiramidais, discinesia tardia", alternativa: "Domperidona (uso curto)", categoria: "Antieméticos" },
  { id: "b8", farmaco: "Alprazolam / Clonazepam", risco: "Quedas, fraturas, delirium, dependencia", alternativa: "TCC, Melatonina 2mg", categoria: "Ansioliticos" }
];

const REVISAO_CHECKLIST = [
  { id: "r1", item: "Verificar indicacao de cada medicamento (tem diagnostico documentado?)", categoria: "Indicacao" },
  { id: "r2", item: "Identificar duplicidades terapeuticas (dois farmacos da mesma classe)", categoria: "Indicacao" },
  { id: "r3", item: "Avaliar necessidade de desprescricao (medicamentos desnecessarios)", categoria: "Indicacao" },
  { id: "r4", item: "Verificar dose adequada para faixa etaria e funcao renal", categoria: "Dose" },
  { id: "r5", item: "Confirmar via de administracao e forma farmaceutica correta", categoria: "Dose" },
  { id: "r6", item: "Avaliar horario de administracao (jejum, com alimento, a noite)", categoria: "Dose" },
  { id: "r7", item: "Rastrear interacoes medicamentosas clinicamente relevantes", categoria: "Seguranca" },
  { id: "r8", item: "Verificar medicamentos inapropriados em idosos (Criterios de Beers)", categoria: "Seguranca" },
  { id: "r9", item: "Avaliar reacoes adversas em curso (queixas podem ser RAMs)", categoria: "Seguranca" },
  { id: "r10", item: "Investigar automedicacao, fitoterapicos e suplementos", categoria: "Seguranca" },
  { id: "r11", item: "Avaliar adesao ao tratamento (Morisky-Green / escala de adesao)", categoria: "Adesao" },
  { id: "r12", item: "Identificar barreiras a adesao (custo, efeitos adversos, esquecimento)", categoria: "Adesao" },
  { id: "r13", item: "Verificar disponibilidade dos medicamentos na farmacia do SUS/REMUME", categoria: "Adesao" },
  { id: "r14", item: "Avaliar metas terapeuticas: PA, glicemia, colesterol controlados?", categoria: "Efetividade" },
  { id: "r15", item: "Registrar intervencao farmaceutica no prontuario (e-SUS PEC)", categoria: "Documentacao" }
];

const INTERACOES = [
  {
    id: 1,
    medA: "losartana",
    medB: "espironolactona",
    gravidade: "Grave",
    mecanismo: "Efeito aditivo de retenção de potássio.",
    efeito: "Risco severo de hipercalemia (níveis perigosamente elevados de potássio no sangue), que pode levar a arritmias cardíacas graves e parada cardíaca.",
    conduta: "Evitar a associação, exceto sob monitoramento rigoroso e frequente dos eletrólitos séricos (potássio) e da função renal. Ajustar as doses se necessário."
  },
  {
    id: 2,
    medA: "captopril",
    medB: "espironolactona",
    gravidade: "Grave",
    mecanismo: "Ambos os fármacos reduzem a excreção renal de potássio.",
    efeito: "Hipercalemia grave e risco de distúrbios de condução cardíaca.",
    conduta: "Geralmente não recomendada. Caso seja extremamente necessária (ex: ICC grave), monitorar o potássio sérico semanalmente no início do tratamento."
  },
  {
    id: 3,
    medA: "losartana",
    medB: "ibuprofeno",
    gravidade: "Moderada",
    mecanismo: "Os AINEs inibem as prostaglandinas renais, reduzindo o fluxo sanguíneo renal e atenuando o efeito vasodilatador da losartana.",
    efeito: "Redução da eficácia anti-hipertensiva da losartana e aumento do risco de nefrotoxicidade (insuficiência renal aguda), especialmente em idosos e desidratados.",
    conduta: "Monitorar a pressão arterial regularmente. Garantir hidratação adequada. Avaliar a função renal (creatinina e ureia) se o uso de AINE for prolongado."
  },
  {
    id: 4,
    medA: "captopril",
    medB: "ibuprofeno",
    gravidade: "Moderada",
    mecanismo: "Antagonismo do efeito vasodilatador renal mediado pelas prostaglandinas pelos AINEs.",
    efeito: "Diminuição do efeito anti-hipertensivo do captopril e risco aumentado de deterioração da função renal.",
    conduta: "Evitar o uso prolongado de AINEs em pacientes sob terapia com IECA. Optar por analgésicos alternativos, como o paracetamol, quando apropriado."
  },
  {
    id: 5,
    medA: "glibenclamida",
    medB: "ibuprofeno",
    gravidade: "Moderada",
    mecanismo: "Deslocamento da sulfonilureia de suas proteínas de ligação plasmática e redução de sua excreção renal pelos AINEs.",
    efeito: "Aumento do efeito hipoglicemiante da glibenclamida, elevando significativamente o risco de hipoglicemia severa.",
    conduta: "Monitorar de perto os níveis de glicemia capilar. Orientar o paciente a reconhecer os sintomas de hipoglicemia e ajustar a dose da sulfonilureia, se necessário."
  },
  {
    id: 6,
    medA: "simvastatina",
    medB: "amoxicilina",
    gravidade: "Leve",
    mecanismo: "Não há interação farmacocinética ou farmacodinâmica significativa documentada entre amoxicilina (penicilina) e simvastatina.",
    efeito: "Sem efeito adverso clinicamente relevante esperado.",
    conduta: "Associação segura. Recomenda-se tomar conforme as respectivas prescrições."
  },
  {
    id: 7,
    medA: "metformina",
    medB: "ibuprofeno",
    gravidade: "Moderada",
    mecanismo: "Os AINEs podem diminuir a função renal, o que reduz a excreção renal de metformina.",
    efeito: "Acúmulo de metformina e risco aumentado de acidose lática (uma complicação metabólica rara, porém grave).",
    conduta: "Usar com cautela. Evitar o uso crônico de AINEs em pacientes diabéticos sob uso de metformina, monitorando a função renal regularmente."
  },
  {
    id: 8,
    medA: "omeprazol",
    medB: "simvastatina",
    gravidade: "Moderada",
    mecanismo: "O omeprazol pode inibir levemente o metabolismo da simvastatina mediado pelo CYP3A4.",
    efeito: "Pode aumentar os níveis plasmáticos da simvastatina, elevando teoricamente o risco de miopatia (dor muscular) e rabdomiólise.",
    conduta: "Monitorar o paciente para dores musculares inexplicadas. Em alguns casos, pode ser recomendável limitar a dose de simvastatina a 20-40 mg ou utilizar um IBP alternativo como o pantoprazol."
  },
  {
    id: 9, medA: "varfarina", medB: "ibuprofeno", gravidade: "Grave",
    mecanismo: "AINEs inibem COX-1 plaquetária e causam erosão da mucosa gástrica, somando-se ao efeito anticoagulante.",
    efeito: "Risco muito elevado de sangramento gastrointestinal e aumento do INR.",
    conduta: "Evitar associação. Se necessário analgésico, preferir paracetamol em dose baixa. Monitorar INR e sinais de sangramento."
  },
  {
    id: 10, medA: "varfarina", medB: "omeprazol", gravidade: "Moderada",
    mecanismo: "Omeprazol inibe CYP2C19, podendo alterar o metabolismo do enantiômero R da varfarina.",
    efeito: "Possível aumento do INR e risco de sangramento.",
    conduta: "Monitorar INR mais frequentemente ao iniciar ou descontinuar omeprazol. Considerar pantoprazol como alternativa (menor interação CYP)."
  },
  {
    id: 11, medA: "fluoxetina", medB: "tramadol", gravidade: "Grave",
    mecanismo: "Ambos aumentam a serotonina central. Fluoxetina também inibe CYP2D6, reduzindo a conversão do tramadol em metabólito ativo.",
    efeito: "Risco de síndrome serotoninérgica (agitação, tremor, hipertermia, mioclonia) e redução da eficácia analgésica.",
    conduta: "Evitar associação. Se necessário opioide, preferir outro que não atue em serotonina. Monitorar sinais de síndrome serotoninérgica."
  },
  {
    id: 12, medA: "fluoxetina", medB: "amitriptilina", gravidade: "Grave",
    mecanismo: "Fluoxetina inibe fortemente o CYP2D6, reduzindo o metabolismo da amitriptilina e aumentando seus níveis plasmáticos.",
    efeito: "Toxicidade por ADT: arritmia, convulsão, sedação excessiva, efeitos anticolinérgicos graves.",
    conduta: "Evitar associação. Se necessário ADT com ISRS, preferir sertralina (menor inibição CYP2D6) e usar dose baixa de ADT com monitoramento."
  },
  {
    id: 13, medA: "carbamazepina", medB: "varfarina", gravidade: "Grave",
    mecanismo: "Carbamazepina é potente indutor do CYP3A4 e CYP2C9, acelerando o metabolismo da varfarina.",
    efeito: "Redução significativa do efeito anticoagulante (INR subterapêutico), risco de tromboembolismo.",
    conduta: "Necessário aumento da dose de varfarina com monitoramento intensivo do INR. Considerar anticoagulante alternativo."
  },
  {
    id: 14, medA: "enalapril", medB: "espironolactona", gravidade: "Grave",
    mecanismo: "Ambos reduzem a excreção renal de potássio por mecanismos complementares.",
    efeito: "Hipercalemia grave, potencialmente fatal com arritmias cardíacas.",
    conduta: "Se associação necessária (ex: ICC), monitorar potássio sérico semanalmente no início. Evitar suplementos de potássio."
  },
  {
    id: 15, medA: "enalapril", medB: "ibuprofeno", gravidade: "Moderada",
    mecanismo: "AINEs antagonizam o efeito vasodilatador renal dos IECAs mediado pelas prostaglandinas.",
    efeito: "Redução do efeito anti-hipertensivo e risco de deterioração da função renal.",
    conduta: "Evitar uso prolongado de AINEs. Preferir paracetamol. Monitorar PA e creatinina."
  },
  {
    id: 16, medA: "metformina", medB: "furosemida", gravidade: "Moderada",
    mecanismo: "Furosemida pode reduzir a função renal e causar desidratação, diminuindo a excreção de metformina.",
    efeito: "Acúmulo de metformina e risco aumentado de acidose lática.",
    conduta: "Monitorar função renal regularmente. Garantir hidratação adequada. Suspender metformina se ClCr < 30 mL/min."
  },
  {
    id: 17, medA: "diazepam", medB: "amitriptilina", gravidade: "Moderada",
    mecanismo: "Efeito aditivo de depressão do SNC entre benzodiazepínico e antidepressivo tricíclico.",
    efeito: "Sedação excessiva, confusão mental, risco de quedas e depressão respiratória.",
    conduta: "Evitar associação em idosos (ambos são Beers). Se necessário, usar doses mínimas com monitoramento da sedação."
  },
  {
    id: 18, medA: "levotiroxina", medB: "sulfato_ferroso", gravidade: "Moderada",
    mecanismo: "O ferro quelata a levotiroxina no trato GI, reduzindo significativamente sua absorção.",
    efeito: "Redução do efeito da levotiroxina com possível descontrole do hipotireoidismo (TSH elevado).",
    conduta: "Separar a administração por pelo menos 4 horas. Tomar levotiroxina em jejum e ferro após o almoço."
  },
  {
    id: 19, medA: "levotiroxina", medB: "omeprazol", gravidade: "Moderada",
    mecanismo: "IBPs reduzem a acidez gástrica necessária para dissolução e absorção da levotiroxina.",
    efeito: "Redução da absorção de levotiroxina, necessidade de doses maiores.",
    conduta: "Monitorar TSH ao iniciar/descontinuar IBP. Pode ser necessário ajustar dose de levotiroxina."
  },
  {
    id: 20, medA: "metronidazol", medB: "varfarina", gravidade: "Grave",
    mecanismo: "Metronidazol inibe CYP2C9, principal via de metabolismo do enantiômero S (mais ativo) da varfarina.",
    efeito: "Aumento significativo do INR e risco elevado de sangramento.",
    conduta: "Reduzir dose de varfarina em 25-50% durante o uso de metronidazol. Monitorar INR a cada 2-3 dias."
  },
  {
    id: 21, medA: "ciprofloxacino", medB: "varfarina", gravidade: "Grave",
    mecanismo: "Ciprofloxacino inibe CYP1A2 e altera flora intestinal (reduzindo produção de vitamina K).",
    efeito: "Potencialização do efeito anticoagulante com aumento do INR e risco de sangramento.",
    conduta: "Monitorar INR de perto ao iniciar e descontinuar o antibiótico. Considerar ajuste de dose de varfarina."
  },
  {
    id: 22, medA: "aas", medB: "ibuprofeno", gravidade: "Moderada",
    mecanismo: "O ibuprofeno compete pela ligação à COX-1 plaquetária, bloqueando o efeito antiplaquetário irreversível do AAS.",
    efeito: "Redução do efeito cardioprotetor do AAS em dose baixa, aumentando risco de eventos cardiovasculares.",
    conduta: "Se necessário usar ambos, tomar AAS 30 min antes do ibuprofeno. Preferir paracetamol como analgésico em pacientes em uso de AAS."
  }
];
