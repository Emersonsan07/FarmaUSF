// =================================================================
// BASE DE DADOS DOS PROTOCOLOS CLÍNICOS E FLUXOGRAMAS DE DECISÃO
// =================================================================

const PROTOCOLOS = [
  {
    id: "hipertensao",
    titulo: "Diretrizes Brasileiras de Hipertensão Arterial - 2020",
    categoria: "Cardiovascular",
    resumo: "Documento de referência para o diagnóstico, estratificação de risco cardiovascular e tratamento farmacológico e não farmacológico da hipertensão no Brasil.",
    metas: "Geral: < 140/90 mmHg. Alto risco cardiovascular/diabéticos: < 130/80 mmHg.",
    primeiraLinha: "Tiazídicos (Clortalidona, Hidroclorotiazida), IECAs (Captopril, Enalapril), BRAs (Losartana) ou Bloqueadores de Canais de Cálcio (Anlodipino).",
    linkOficial: "http://departamentos.cardiol.br/sbc-dha/institucional/diretrizes.asp"
  },
  {
    id: "diabetes",
    titulo: "Diretriz da Sociedade Brasileira de Diabetes - 2023",
    categoria: "Endócrino / Metabólico",
    resumo: "Protocolo clínico focado no manejo integrado do Diabetes Mellitus Tipo 2 na Atenção Primária, priorizando a prevenção de complicações micro e macrovasculares.",
    metas: "HbA1c < 7.0% para a maioria dos adultos; Glicemia de jejum < 100 mg/dL; Glicemia pós-prandial < 160 mg/dL.",
    primeiraLinha: "Metformina como terapia inicial associada a mudanças no estilo de vida. Adição de Sulfonilureia (Glibenclamida/Gliclazida) ou inibidores de SGLT2 conforme perfil do paciente.",
    linkOficial: "https://diretriz.diabetes.org.br/"
  },
  {
    id: "asma",
    titulo: "Protocolo Clínico e Diretrizes Terapêuticas (PCDT) da Asma - 2023",
    categoria: "Respiratório",
    resumo: "Atualização das diretrizes do Ministério da Saúde e GINA para o diagnóstico, classificação de controle e tratamento escalonado da asma.",
    metas: "Controle dos sintomas diurnos e noturnos, prevenção de exacerbações agudas e manutenção da função pulmonar normal.",
    primeiraLinha: "Corticoide inalatório (Budesonida/Beclometasona) isolado ou associado a LABA (Formoterol). Salbutamol para alívio rápido de crises.",
    linkOficial: "https://www.gov.br/saude/pt-br/assuntos/protocolos-clinicos-e-diretrizes-terapeuticas-pcdt"
  },
  {
    id: "dpoc",
    titulo: "Diretrizes Globais para o Manejo da DPOC (GOLD 2023 / PCDT SUS)",
    categoria: "Respiratório",
    resumo: "Diretriz para diagnóstico, classificação de grupos A, B e E e escolha de broncodilatadores LAMA/LABA e corticoides inalatórios na DPOC.",
    metas: "Redução de sintomas diários, melhora da tolerância ao exercício e prevenção de exacerbações graves e internações.",
    primeiraLinha: "Broncodilatadores de longa ação LAMA (Tiotrópio) e LABA (Formoterol). Adição de corticoide inalatório se eosinófilos ≥ 300.",
    linkOficial: "https://goldcopd.org/"
  },
  {
    id: "dislipidemia",
    titulo: "Atualização da Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose - SBC",
    categoria: "Cardiovascular / Metabólico",
    resumo: "Diretriz da Sociedade Brasileira de Cardiologia para estratificação de risco cardiovascular global e terapia lipidemiante com estatinas.",
    metas: "Muito Alto Risco: LDL-c < 50 mg/dL | Alto Risco: LDL-c < 70 mg/dL | Intermediário: LDL-c < 100 mg/dL | Baixo Risco: LDL-c < 130 mg/dL.",
    primeiraLinha: "Mudanças no Estilo de Vida (MEV) + Estatinas padronizadas no SUS (Sinvastatina 20-40mg ou Atorvastatina).",
    linkOficial: "http://departamentos.cardiol.br/sbc-dha/"
  },
  {
    id: "antimicrobianos",
    titulo: "Guia de Uso Racional de Antimicrobianos na Atenção Primária à Saúde",
    categoria: "Infectologia / Uso Racional",
    resumo: "Manual prático de suporte decisório para o uso prescritivo de antibióticos na APS em infecções urinárias e respiratórias superiores comuns.",
    metas: "Eficácia clínica máxima, redução de efeitos adversos e prevenção da seleção de bactérias multirresistentes (RAM).",
    primeiraLinha: "Nitrofurantoína/Sulfametoxazol+Trimetoprima em ITU baixa; Amoxicilina em Faringite Estreptocócica bacteriana (Centor ≥ 3). Evitar antibióticos em quadros virais.",
    linkOficial: "https://www.gov.br/anvisa/pt-br/assuntos/servicosdesaude/resistencia-microbiana"
  },
  {
    id: "atencao_farmaceutica",
    titulo: "Serviços Farmacêuticos na Atenção Básica - Caderno 1",
    categoria: "Gestão / Assistência",
    resumo: "Manual do Ministério da Saúde que orienta a implantação do cuidado farmacêutico, reconciliação medicamentosa, acompanhamento farmacoterapêutico e educação em saúde.",
    metas: "Garantir a resolutividade das ações de saúde, promover o uso racional de medicamentos e qualificar a prescrição e dispensação.",
    primeiraLinha: "Método Clínico Dader ou Método de SOAP para registro das consultas farmacêuticas em prontuário eletrônico integrado (e-SUS).",
    linkOficial: "https://bvsms.saude.gov.br/"
  }
];

const FLUXOGRAMAS = {
  hipertensao: {
    titulo: "Manejo da Hipertensão Arterial na Atenção Básica",
    passos: {
      inicio: {
        pergunta: "A Pressão Arterial medida em consultório é ≥ 140/90 mmHg em duas ou mais ocasiões?",
        opcoes: [
          { texto: "Sim", proximo: "confirmar_has" },
          { texto: "Não", proximo: "normotenso_pre" }
        ]
      },
      normotenso_pre: {
        pergunta: "A PA está entre 121/81 mmHg e 139/89 mmHg (Pré-Hipertensão)?",
        opcoes: [
          { texto: "Sim", proximo: "conduta_prehas" },
          { texto: "Não", proximo: "conduta_otima" }
        ]
      },
      conduta_otima: {
        final: true,
        tipo: "success",
        titulo: "Pressão Arterial Ótima (< 120/80 mmHg)",
        conduta: "Manter hábitos saudáveis de vida. Nova aferição de rotina em 1 ano (ou antes, se clinicamente indicado)."
      },
      conduta_prehas: {
        final: true,
        tipo: "warning",
        titulo: "Pré-Hipertensão",
        conduta: "Iniciar mudanças no estilo de vida (MEV): redução de sódio, atividade física (150 min/semana), redução de peso e cessação do tabagismo. Reavaliar em 6 meses."
      },
      confirmar_has: {
        pergunta: "O paciente apresenta Lesão em Órgão Alvo (LOA), Diabetes Mellitus, Doença Renal Crônica ou Risco Cardiovascular Alto?",
        opcoes: [
          { texto: "Sim", proximo: "has_alto_risco" },
          { texto: "Não", proximo: "has_estagiar" }
        ]
      },
      has_alto_risco: {
        final: true,
        tipo: "danger",
        titulo: "Hipertensão Arterial Confirmada (Alto Risco)",
        conduta: "Iniciar imediatamente terapia farmacológica combinada (Ex: Losartana 50mg + Hidroclorotiazida 12.5mg ou Anlodipino 5mg) + MEV. Agendar retorno em 30 dias para ajuste."
      },
      has_estagiar: {
        pergunta: "A Pressão Arterial está ≥ 160/100 mmHg (Hipertensão Estágio 2 ou 3)?",
        opcoes: [
          { texto: "Sim", proximo: "has_farmaco_duplo" },
          { texto: "Não", proximo: "has_farmaco_unico" }
        ]
      },
      has_farmaco_duplo: {
        final: true,
        tipo: "danger",
        titulo: "Hipertensão Arterial Estágio 2 ou 3",
        conduta: "Iniciar terapia farmacológica com combinação de dois fármacos (Ex: IECA ou BRA + Diurético Tiazídico ou BCC) + MEV. Meta terapêutica: < 140/90 mmHg em até 3 meses."
      },
      has_farmaco_unico: {
        final: true,
        tipo: "warning",
        titulo: "Hipertensão Arterial Estágio 1 (Risco Baixo/Médio)",
        conduta: "Pode ser tentado MEV isolado por 3 meses. Se não atingir a meta (< 140/90 mmHg), iniciar monoterapia com IECA (Captopril/Enalapril), BRA (Losartana), Diurético (HCTZ) ou BCC (Anlodipino)."
      }
    }
  },
  diabetes: {
    titulo: "Fluxograma de Rastreamento e Início do Tratamento de Diabetes Mellitus Tipo 2",
    passos: {
      inicio: {
        pergunta: "A Glicemia de Jejum é ≥ 126 mg/dL ou HbA1c é ≥ 6.5% em dois testes distintos?",
        opcoes: [
          { texto: "Sim", proximo: "confirmar_dm2" },
          { texto: "Não", proximo: "rastreamento_pre" }
        ]
      },
      rastreamento_pre: {
        pergunta: "A Glicemia de Jejum está entre 100 mg/dL e 125 mg/dL ou HbA1c está entre 5.7% e 6.4% (Pré-Diabetes)?",
        opcoes: [
          { texto: "Sim", proximo: "conduta_prediabetes" },
          { texto: "Não", proximo: "conduta_normal" }
        ]
      },
      conduta_normal: {
        final: true,
        tipo: "success",
        titulo: "Glicemia de Jejum Normal (< 100 mg/dL)",
        conduta: "Manter acompanhamento de rotina. Repetir rastreamento em 3 anos para indivíduos com mais de 45 anos ou fatores de risco."
      },
      conduta_prediabetes: {
        final: true,
        tipo: "warning",
        titulo: "Pré-Diabetes Detectado",
        conduta: "Iniciar intervenção intensiva de estilo de vida (redução de peso em 5-7%, dieta pobre em carboidratos refinados, atividade física regular). Considerar Metformina se paciente apresentar alto risco (IMC > 35, histórico de diabetes gestacional ou < 60 anos). Reavaliar glicemia em 6 meses."
      },
      confirmar_dm2: {
        pergunta: "O paciente apresenta sintomas clássicos de hiperglicemia (polidipsia, poliúria, perda de peso inexplicada) ou crise hiperglicêmica com glicemia casual ≥ 200 mg/dL?",
        opcoes: [
          { texto: "Sim", proximo: "dm2_sintomatico" },
          { texto: "Não", proximo: "dm2_assintomatico" }
        ]
      },
      dm2_sintomatico: {
        pergunta: "A Glicemia de Jejum está > 300 mg/dL ou HbA1c > 10%?",
        opcoes: [
          { texto: "Sim", proximo: "iniciar_insulina" },
          { texto: "Não", proximo: "iniciar_metformina_combinada" }
        ]
      },
      iniciar_insulina: {
        final: true,
        tipo: "danger",
        titulo: "Diabetes Mellitus Tipo 2 Descompensada (Grave)",
        conduta: "Iniciar insulinoterapia plena imediatamente (NPH à noite, 0.1 a 0.2 UI/kg) associada ou não à Metformina para reverter a glicotoxicidade. Encaminhar para acompanhamento médico-farmacêutico semanal."
      },
      iniciar_metformina_combinada: {
        final: true,
        tipo: "danger",
        titulo: "DM2 com Hiperglicemia Moderada a Alta",
        conduta: "Iniciar terapia combinada com Metformina (iniciar 500mg e escalar para 1.700mg a 2.000mg/dia) + Sulfonilureia (Ex: Glibenclamida 5mg/dia antes do café) ou Inibidor de SGLT2 + Mudanças no Estilo de Vida (MEV)."
      },
      dm2_assintomatico: {
        final: true,
        tipo: "warning",
        titulo: "Diabetes Mellitus Tipo 2 Inicial (Assintomático)",
        conduta: "Iniciar imediatamente Metformina como monoterapia (iniciar com 500 mg ao dia com alimentos e aumentar gradativamente para 1.500 mg a 2.000 mg/dia) associado a orientações nutricionais e exercícios. Meta de HbA1c: < 7%."
      }
    }
  },
  asma: {
    titulo: "Manejo e Escalonamento Terapêutico da Asma (GINA / PCDT SUS)",
    passos: {
      inicio: {
        pergunta: "O paciente apresenta sintomas respiratórios variáveis (sibilância, dispneia, opressão torácica ou tosse) associados à limitação de fluxo aéreo?",
        opcoes: [
          { texto: "Sim", proximo: "avaliar_controle" },
          { texto: "Não", proximo: "descartar_asma" }
        ]
      },
      descartar_asma: {
        final: true,
        tipo: "success",
        titulo: "Quadro Não Sugestivo de Asma Típica",
        conduta: "Investigar diagnósticos diferenciais na Atenção Básica (ex: Rinite alérgica, DRGE, IVAS, Tosse induzida por IECA ou Insuficiência Cardíaca)."
      },
      avaliar_controle: {
        pergunta: "Nas últimas 4 semanas, o paciente apresentou: 1) Sintomas diurnos > 2x/sem? 2) Despertar noturno? 3) Resgate > 2x/sem? 4) Limitação de atividades?",
        opcoes: [
          { texto: "Sim (1 a 4 itens)", proximo: "asma_sintomatica" },
          { texto: "Não (0 itens)", proximo: "asma_controlada" }
        ]
      },
      asma_controlada: {
        final: true,
        tipo: "success",
        titulo: "Asma Controlada",
        conduta: "Manter o tratamento atual de manutenção (STEP 1 ou STEP 2). Reavaliar a cada 3-6 meses. Reforçar a técnica do inalador e o plano de ação escrito."
      },
      asma_sintomatica: {
        pergunta: "O paciente já faz uso regular diário de Corticoide Inalatório (Beclometasona ou Budesonida) com boa adesão e técnica inalatória correta?",
        opcoes: [
          { texto: "Sim", proximo: "escalar_step3" },
          { texto: "Não", proximo: "iniciar_step2" }
        ]
      },
      iniciar_step2: {
        final: true,
        tipo: "warning",
        titulo: "Asma Parcialmente Controlada ou Não Controlada (Iniciar STEP 2)",
        conduta: "Iniciar Corticoide Inalatório em dose baixa contínua (Beclometasona 200-400 mcg/dia ou Budesonida 200-400 mcg/dia) + Salbutamol 100mcg para alívio nas crises. Orientar uso de espaçador com máscara."
      },
      escalar_step3: {
        final: true,
        tipo: "danger",
        titulo: "Asma Não Controlada sob Corticoide Inalatório (Escalar para STEP 3 / 4)",
        conduta: "Associar LABA ao Corticoide Inalatório em dose média (Ex: Formoterol + Budesonida 12/400mcg em dose de manutenção) OU aumentar a dose de Beclometasona. Se permanecer não controlada, encaminhar à Atenção Especializada (Pneumologia)."
      }
    }
  },
  dpoc: {
    titulo: "Manejo da Doença Pulmonar Obstrutiva Crônica (GOLD 2023 / PCDT SUS)",
    passos: {
      inicio: {
        pergunta: "O paciente apresenta dispneia crônica, tosse ou catarro + histórico de tabagismo (≥ 10 maços-ano) ou poeiras e espirometria VEF1/CVF < 0,70 pós-BD?",
        opcoes: [
          { texto: "Sim", proximo: "avaliar_exacerbacoes" },
          { texto: "Não", proximo: "investigar_dpoc" }
        ]
      },
      investigar_dpoc: {
        final: true,
        tipo: "success",
        titulo: "DPOC Não Confirmada por Espirometria",
        conduta: "Encaminhar para espirometria pós-broncodilatador para confirmação diagnóstica. Afastar asma grave, sequela de tuberculose ou insuficiência cardíaca."
      },
      avaliar_exacerbacoes: {
        pergunta: "O paciente apresentou 2 ou mais exacerbações moderadas OU 1 exacerbação que necessitou de internação hospitalar no último ano?",
        opcoes: [
          { texto: "Sim", proximo: "grupo_e" },
          { texto: "Não", proximo: "avaliar_sintomas_mmrc" }
        ]
      },
      avaliar_sintomas_mmrc: {
        pergunta: "O escore de dispneia mMRC é ≥ 2 (ou CAT ≥ 10)? [mMRC 2 = caminha mais devagar que pessoas da mesma idade ou para para respirar no plano]",
        opcoes: [
          { texto: "Sim (mMRC ≥ 2)", proximo: "grupo_b" },
          { texto: "Não (mMRC 0-1)", proximo: "grupo_a" }
        ]
      },
      grupo_a: {
        final: true,
        tipo: "success",
        titulo: "DPOC Grupo A (Poucos Sintomas, Sem Exacerbações)",
        conduta: "Iniciar um broncodilatador de curta ou longa ação (Salbutamol conforme necessidade ou Formoterol/Tiotrópio). Estimular cessação do tabagismo e vacinação (Influenza, Pneumococo e COVID-19)."
      },
      grupo_b: {
        final: true,
        tipo: "warning",
        titulo: "DPOC Grupo B (Muito Sintomático, Sem Exacerbações)",
        conduta: "Iniciar combinação de broncodilatadores de longa ação: LAMA + LABA (Ex: Tiotrópio + Formoterol). Orientar reabilitação pulmonar e atividade física diária."
      },
      grupo_e: {
        pergunta: "O hemograma apresenta contagem de eosinófilos no sangue periférico ≥ 300 células/µL?",
        opcoes: [
          { texto: "Sim (Eosinófilos ≥ 300)", proximo: "grupo_e_ics" },
          { texto: "Não (Eosinófilos < 300)", proximo: "grupo_e_no_ics" }
        ]
      },
      grupo_e_ics: {
        final: true,
        tipo: "danger",
        titulo: "DPOC Grupo E (Exacerbador com Indicação de ICS)",
        conduta: "Iniciar terapia tripla: LAMA + LABA + Corticoide Inalatório (ICS). O corticoide inalatório está indicado pela eosinofilia para prevenir exacerbações graves."
      },
      grupo_e_no_ics: {
        final: true,
        tipo: "danger",
        titulo: "DPOC Grupo E (Exacerbador Sem Indicação de ICS)",
        conduta: "Iniciar LAMA + LABA de longa ação. Evitar o uso de corticoides inalatórios devido ao risco elevado de pneumonia bacteriana sem benefício comprovado se eosinófilos < 100."
      }
    }
  },
  dislipidemia: {
    titulo: "Estratificação de Risco Cardiovascular & Manejo da Dislipidemia (SBC 2023)",
    passos: {
      inicio: {
        pergunta: "O paciente possui Doença Cardiovascular Aterosclerótica manifesta (IAM, Angina, AVC/AITE, DAOP) ou DRC grave (TFGe < 30)?",
        opcoes: [
          { texto: "Sim", proximo: "muito_alto_risco" },
          { texto: "Não", proximo: "checar_dm" }
        ]
      },
      muito_alto_risco: {
        final: true,
        tipo: "danger",
        titulo: "Muito Alto Risco Cardiovascular (Meta LDL-c < 50 mg/dL)",
        conduta: "Iniciar imediatamente terapia lipidemiante de alta potência: Atorvastatina 40-80 mg/dia ou Rosuvastatina 20 mg/dia. Reavaliar perfil lipídico em 60 dias."
      },
      checar_dm: {
        pergunta: "O paciente tem diagnóstico de Diabetes Mellitus?",
        opcoes: [
          { texto: "Sim", proximo: "alto_risco_dm" },
          { texto: "Não", proximo: "checar_escore_risco" }
        ]
      },
      alto_risco_dm: {
        final: true,
        tipo: "danger",
        titulo: "Alto Risco Cardiovascular - Diabetes (Meta LDL-c < 70 mg/dL)",
        conduta: "Iniciar estatina de moderada/alta potência (Sinvastatina 40 mg/dia ou Atorvastatina 20 mg/dia). Acompanhar função hepática e glicemia."
      },
      checar_escore_risco: {
        pergunta: "O Escore de Risco Cardiovascular Global em 10 anos é ≥ 20% (Homens) ou ≥ 10% (Mulheres)?",
        opcoes: [
          { texto: "Sim (Alto Risco)", proximo: "alto_risco_geral" },
          { texto: "Não (Baixo/Intermediário)", proximo: "checar_intermediario" }
        ]
      },
      alto_risco_geral: {
        final: true,
        tipo: "danger",
        titulo: "Alto Risco Cardiovascular Global (Meta LDL-c < 70 mg/dL)",
        conduta: "Iniciar Sinvastatina 40 mg/dia à noite. Reforçar dieta cardioprotetora, controle pressórico e cessação do tabagismo."
      },
      checar_intermediario: {
        pergunta: "O Risco Cardiovascular Global está entre 5% e 20% (Homens) ou 5% e 10% (Mulheres)?",
        opcoes: [
          { texto: "Sim (Intermediário)", proximo: "risco_intermediario" },
          { texto: "Não (Baixo Risco)", proximo: "baixo_risco" }
        ]
      },
      risco_intermediario: {
        final: true,
        tipo: "warning",
        titulo: "Risco Cardiovascular Intermediário (Meta LDL-c < 100 mg/dL)",
        conduta: "Iniciar Sinvastatina 20 mg a 40 mg/dia + Mudanças no Estilo de Vida (MEV) por 3 meses. Reavaliar exames laboratoriais."
      },
      baixo_risco: {
        final: true,
        tipo: "success",
        titulo: "Baixo Risco Cardiovascular (Meta LDL-c < 130 mg/dL)",
        conduta: "Tratamento inicial exclusivo com Mudanças no Estilo de Vida (MEV) por 3 a 6 meses (dieta pobre em gorduras saturadas, 150 min/sem de atividade física). Ponderar estatina se LDL mantiver > 130 mg/dL."
      }
    }
  },
  antimicrobianos: {
    titulo: "Uso Racional de Antimicrobianos na Atenção Básica (Guia de Prescrição APS)",
    passos: {
      inicio: {
        pergunta: "Qual é o sítio principal da infecção sob avaliação clínica?",
        opcoes: [
          { texto: "Trato Urinário (ITU Baixa)", proximo: "itu_triagem" },
          { texto: "Vias Aéreas (Faringe/Garganta)", proximo: "faringe_triagem" }
        ]
      },
      itu_triagem: {
        pergunta: "Trata-se de Cistite não complicada em mulher (disúria, polaciúria, urgência) SEM febre, dor lombar, gravidez ou cateterismo?",
        opcoes: [
          { texto: "Sim", proximo: "cistite_nao_complicada" },
          { texto: "Não", proximo: "itu_complicada" }
        ]
      },
      cistite_nao_complicada: {
        final: true,
        tipo: "warning",
        titulo: "Cistite Aguda Não Complicada (Tratamento Empírico 1ª Linha)",
        conduta: "Prescrever Nitrofurantoína 100 mg de 6/6h por 5 dias OU Sulfametoxazol + Trimetoprima (800/160 mg) de 12/12h por 3 dias. Hidratação abundante (> 2L/dia). Não há necessidade de urocultura prévia se sintomas clássicos."
      },
      itu_complicada: {
        final: true,
        tipo: "danger",
        titulo: "ITU Complicada / Pielonefrite ou Gestante",
        conduta: "Coletar Urocultura com Antibiograma antes do antibiótico. Iniciar Ciprofloxacino 500 mg de 12/12h por 7 dias (se não gestante) ou Cefalexina 500 mg de 6/6h por 7-10 dias (se gestante). Reavaliar em 48h."
      },
      faringe_triagem: {
        pergunta: "O paciente apresenta Escore de Centor ≥ 3? (Exsudato amigdaliano + gânglios cervicais dolentes + febre > 38°C + AUSÊNCIA de tosse/coriza)",
        opcoes: [
          { texto: "Sim (Centor ≥ 3 - Bacteriana)", proximo: "faringite_bacteriana" },
          { texto: "Não (Centor < 3 - Viral)", proximo: "faringite_viral" }
        ]
      },
      faringite_bacteriana: {
        final: true,
        tipo: "danger",
        titulo: "Faringoamigdalite Estreptocócica Bacteriana Confirmada",
        conduta: "Prescrever Amoxicilina 500 mg de 8/8h por 10 dias OU Penicilina G Benzatina 1.200.000 UI IM em dose única. Se alérgico à penicilina: Azitromicina 500 mg 1x/dia por 5 dias."
      },
      faringite_viral: {
        final: true,
        tipo: "success",
        titulo: "Infeção Viral de Vias Aéreas Superiores (IVAS / Faringite Viral)",
        conduta: "CONTRAINDICADO USO DE ANTIBIÓTICOS. Prescrever sintomáticos: Dipirona 500mg-1g de 6/6h ou Paracetamol 500mg de 6/6h + soro fisiológico nasal e repouso."
      }
    }
  }
};
