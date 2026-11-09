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
  },
  {
    id: "pe_diabetico",
    titulo: "Avaliação e Classificação do Pé Diabético — IWGDF / SBD 2024",
    categoria: "Endócrino / Complicações do Diabetes",
    resumo: "Protocolo de rastreamento sistemático de neuropatia periférica, doença arterial periférica (DAP) e estratificação do risco de ulceração e amputação em pacientes diabéticos, fundamentado nas Diretrizes Internacionais do Grupo de Trabalho sobre Pé Diabético (IWGDF) e da Sociedade Brasileira de Diabetes (SBD).",
    metas: "Detectar precocemente perda de sensibilidade protetora (PSP) e DAP; estratificar o risco IWGDF; prevenir ulcerações e amputações; orientar autocuidado preventivo.",
    primeiraLinha: "Avaliação anual com monofilamento 10g e diapasão 128 Hz. Educação em saúde sobre inspeção diária dos pés, calçado adequado e cuidado com as unhas. Controle glicêmico rigoroso (HbA1c < 7%).",
    linkOficial: "https://iwgdfguidelines.org/"
  },
  {
    id: "transicao_nph_glargina",
    titulo: "Transição da Insulina NPH para Insulina Glargina (Análogo de Longa Ação) — SBD 2024",
    categoria: "Endócrino / Insulinoterapia",
    resumo: "Protocolo farmacêutico para orientar a conversão segura da Insulina NPH (intermediária) para a Insulina Glargina U-100 (análogo de longa ação sem pico), indicado em casos de hipoglicemia noturna de repetição, grande variabilidade glicêmica ou controle subótimo com NPH em 2 aplicações. Baseado nas Diretrizes da SBD 2024 e Protocolos do Ministério da Saúde.",
    metas: "Reduzir eventos hipoglicêmicos noturnos e ao amanhecer; melhorar controle glicêmico de jejum; simplificar o esquema de aplicação (1x/dia); minimizar ganho de peso.",
    primeiraLinha: "Iniciar Glargina na dose equivalente a 80% da dose total diária de NPH (se NPH em 2 aplicações) ou 100% (se NPH apenas ao deitar). Ajustar conforme glicemia de jejum com o algoritmo de titulação TREAT-TO-TARGET.",
    linkOficial: "https://diretriz.diabetes.org.br/"
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
  },

  pe_diabetico: {
    titulo: "Avaliação do Pé Diabético — Rastreamento e Estratificação de Risco (IWGDF/SBD)",
    passos: {
      inicio: {
        pergunta: "O paciente tem diagnóstico de Diabetes Mellitus (DM1 ou DM2) há mais de 5 anos, ou com DM2 de qualquer duração e mau controle glicêmico (HbA1c > 7,5%) ou outros fatores de risco?",
        opcoes: [
          { texto: "Sim — Realizar avaliação completa do pé", proximo: "inspecao_visual" },
          { texto: "Não — Rastreamento anual de rotina", proximo: "rastreamento_rotina" }
        ]
      },
      rastreamento_rotina: {
        final: true,
        tipo: "success",
        titulo: "Rastreamento Anual do Pé Diabético (Risco Baixo)",
        conduta: "Realizar avaliação completa dos pés a cada 12 meses: inspeção visual, monofilamento 10g e palpação de pulsos. Reforçar educação em saúde: inspeção diária dos pés pelo paciente, calçado fechado adequado, hidratação da pele, corte correto das unhas. Registrar CIAP-2: T89."
      },
      inspecao_visual: {
        pergunta: "Na inspeção visual (com calçado retirado), há presença de: úlcera ativa, ferida aberta, necrose, gangrena, rubor persistente ou edema intenso?",
        opcoes: [
          { texto: "Sim — Lesão Ativa Identificada", proximo: "lesao_ativa" },
          { texto: "Não — Continuar avaliação", proximo: "deformidades" }
        ]
      },
      lesao_ativa: {
        final: true,
        tipo: "danger",
        titulo: "⚠️ Lesão Ativa no Pé Diabético — Encaminhamento Urgente",
        conduta: "ENCAMINHAR IMEDIATAMENTE ao médico da equipe eSF. Emitir Parecer de Matriciamento urgente. Classificar pela Escala de Wagner: Grau 1 (úlcera superficial) a Grau 5 (gangrena extensa). NÃO realizar desbridamento sem treinamento específico. Enquanto aguarda, cobrir a lesão com curativo estéril seco, elevar o membro e orientar descarga total de peso. Código SIGTAP 01.01.01.003-6 e CIAP-2 T89."
      },
      deformidades: {
        pergunta: "Há presença de deformidades clinicamente relevantes? (Hálux valgo, dedos em garra/martelo, proeminências ósseas, pé de Charcot, amputação prévia ou calosidades de alto risco)",
        opcoes: [
          { texto: "Sim", proximo: "monofilamento_com_deformidade" },
          { texto: "Não", proximo: "monofilamento_sem_deformidade" }
        ]
      },
      monofilamento_com_deformidade: {
        pergunta: "Avaliação com Monofilamento 10g (4 pontos plantares, olhos fechados): O paciente FALHOU em 2 ou mais pontos (não sentiu o toque)?",
        opcoes: [
          { texto: "Sim — Perda de sensibilidade protetora + deformidade", proximo: "alto_risco" },
          { texto: "Não — Sensibilidade preservada", proximo: "pulsos_com_deformidade" }
        ]
      },
      pulsos_com_deformidade: {
        pergunta: "Os pulsos periféricos (pediosos e tibial posterior) estão AUSENTES ou fortemente diminuídos em pelo menos um dos pés?",
        opcoes: [
          { texto: "Sim — Suspeita de DAP + deformidade", proximo: "alto_risco" },
          { texto: "Não — Pulsos presentes", proximo: "risco_moderado_deformidade" }
        ]
      },
      risco_moderado_deformidade: {
        final: true,
        tipo: "warning",
        titulo: "Risco Moderado a Alto — Deformidade sem Neuropatia/DAP (IWGDF Risco 2)",
        conduta: "Revisar a cada 1 a 3 meses. Encaminhar para podólogo (quando disponível na rede) para avaliação de órteses, palmilhas de descarga e cuidado especial com calosidades. Reforçar uso de calçado extra-largo ou ortopédico. Orientar inspeção diária e hidratação. Registrar CIAP-2 T89 + SIGTAP 01.01.01.003-6."
      },
      monofilamento_sem_deformidade: {
        pergunta: "Avaliação com Monofilamento 10g (4 pontos plantares, olhos fechados): O paciente FALHOU em 2 ou mais pontos (não sentiu o toque)?",
        opcoes: [
          { texto: "Sim — Perda de sensibilidade protetora", proximo: "avaliar_dap" },
          { texto: "Não — Sem neuropatia detectada", proximo: "sem_risco_adicional" }
        ]
      },
      sem_risco_adicional: {
        final: true,
        tipo: "success",
        titulo: "Baixo Risco (IWGDF Risco 0) — Pé Diabético sem Alterações",
        conduta: "Risco baixo. Manter acompanhamento anual. Reforçar educação em saúde: inspeção diária dos pés, hidratação da pele com ureia 10% (exceto entre os dedos), calçado fechado sem costuras internas, corte das unhas reto sem arredondar bordas. CONTRAINDICAR: andar descalço, bolsas de água quente, remoção caseira de calos. Meta HbA1c < 7%."
      },
      avaliar_dap: {
        pergunta: "Os pulsos periféricos (pediosos e tibial posterior) estão AUSENTES ou fortemente diminuídos?",
        opcoes: [
          { texto: "Sim — Neuropatia + DAP suspeita (IWGDF Risco 3)", proximo: "alto_risco" },
          { texto: "Não — Neuropatia isolada (IWGDF Risco 1)", proximo: "risco_moderado_neuropatia" }
        ]
      },
      risco_moderado_neuropatia: {
        final: true,
        tipo: "warning",
        titulo: "Risco Moderado — Neuropatia Periférica Sem DAP (IWGDF Risco 1)",
        conduta: "Revisar a cada 3 a 6 meses. Reforçar educação intensiva sobre inspeção diária dos pés (uso de espelho ou celular), calçado adequado e hidratação da pele. Avaliar controle glicêmico e pressórico. Encaminhar ao médico da equipe para confirmação diagnóstica de neuropatia. Considerar Gabapentina ou Amitriptilina em baixa dose se dor neuropática presente (Parecer de Matriciamento). Registrar CIAP-2 T89."
      },
      alto_risco: {
        final: true,
        tipo: "danger",
        titulo: "Alto Risco de Ulceração / Amputação (IWGDF Risco 2 ou 3)",
        conduta: "ENCAMINHAR ao médico da equipe para avaliação e ao serviço de referência vascular se DAP confirmada. Revisão mensal na farmácia clínica. Reforçar adesão ao controle glicêmico (HbA1c < 7%), anti-hipertensivo e cessação do tabagismo. Checar vacinação antitetânica. Orientar que qualquer pequena ferida, bolha ou vermelhidão deve ser avaliada no mesmo dia na USF. Emitir Parecer de Matriciamento para a equipe médica/cirurgia vascular. Código CIAP-2 T89 + SIGTAP 01.01.01.003-6."
      }
    }
  },

  transicao_nph_glargina: {
    titulo: "Transição da Insulina NPH para Glargina U-100 — Algoritmo Farmacêutico de Conversão",
    passos: {
      inicio: {
        pergunta: "Qual é a principal indicação clínica para considerar a transição de NPH para Glargina U-100?",
        opcoes: [
          { texto: "Hipoglicemia noturna ou ao amanhecer (Fenômeno do Alvorecer) com NPH", proximo: "hipoglicemia_noturna" },
          { texto: "Variabilidade glicêmica intensa / HbA1c fora da meta apesar de boa adesão", proximo: "variabilidade_glicemica" },
          { texto: "Dificuldade de adesão ao esquema de 2 aplicações diárias de NPH", proximo: "adesao_multiplas_doses" }
        ]
      },
      hipoglicemia_noturna: {
        pergunta: "O paciente relata episódios recorrentes de hipoglicemia (< 70 mg/dL) entre 0h e 6h da manhã, confirmados por glicemia capilar ou sintomas clínicos?",
        opcoes: [
          { texto: "Sim — Hipoglicemia noturna confirmada", proximo: "calcular_dose_conversao" },
          { texto: "Não — Hipoglicemia em outros horários", proximo: "revisar_ajuste_nph" }
        ]
      },
      revisar_ajuste_nph: {
        final: true,
        tipo: "warning",
        titulo: "Ajuste Posológico da NPH Antes da Transição",
        conduta: "Se hipoglicemia em outros horários, revisar a dose atual de NPH: reduzir 10-20% a dose que cobre o período do evento. Orientar sobre: horário correto da aplicação, mistura adequada (homogeneização suave), alimentação regular e ajuste de carboidratos na refeição anterior. Reavaliar em 7-14 dias antes de decidir pela transição para Glargina."
      },
      variabilidade_glicemica: {
        pergunta: "O paciente está em uso de NPH em 2 aplicações (manhã e noite) com HbA1c > 7,5% ou variabilidade glicêmica > 40 mg/dL entre medições de jejum?",
        opcoes: [
          { texto: "Sim — Indicação forte para transição", proximo: "calcular_dose_conversao" },
          { texto: "Não — Avaliar adesão e técnica de aplicação antes", proximo: "avaliar_adesao" }
        ]
      },
      adesao_multiplas_doses: {
        pergunta: "O paciente confirma que consegue fazer apenas 1 aplicação por dia? A indicação foi discutida com o médico prescritor e está registrada em prontuário?",
        opcoes: [
          { texto: "Sim — Decisão compartilhada registrada", proximo: "calcular_dose_conversao" },
          { texto: "Não — Aguardar discussão com a equipe médica", proximo: "matriciamento_necessario" }
        ]
      },
      matriciamento_necessario: {
        final: true,
        tipo: "warning",
        titulo: "Matriciamento Farmacêutico Necessário",
        conduta: "A transição de insulinas requer prescrição médica atualizada com o novo medicamento. Emitir Parecer de Matriciamento à equipe médica solicitando avaliação para transição para Glargina U-100, fundamentando com os dados clínicos (HbA1c, registros de hipoglicemia, histórico de adesão). Aguardar nova prescrição antes de orientar a conversão."
      },
      avaliar_adesao: {
        final: true,
        tipo: "success",
        titulo: "Otimizar NPH Antes de Considerar Transição",
        conduta: "Revisar a técnica de aplicação (homogeneização do frasco leitoso por 20 inversões lentas, rodízio dos locais, ângulo correto de 90°). Avaliar se o paciente está homogeneizando corretamente — falha na homogeneização causa variabilidade de até 50% na absorção. Reforçar adesão e alimentação regular. Reavaliar HbA1c em 3 meses."
      },
      calcular_dose_conversao: {
        pergunta: "Qual é o esquema atual de NPH do paciente?",
        opcoes: [
          { texto: "NPH apenas ao deitar (bedtime) — 1 aplicação noturna", proximo: "conversao_nph_1_dose" },
          { texto: "NPH manhã + noite — 2 aplicações diárias", proximo: "conversao_nph_2_doses" }
        ]
      },
      conversao_nph_1_dose: {
        pergunta: "A dose atual de NPH ao deitar é conhecida e o controle de jejum tem sido satisfatório (glicemia de jejum 80-130 mg/dL na maioria dos dias)?",
        opcoes: [
          { texto: "Sim — Converter em dose igual (1:1)", proximo: "orientacao_glargina_igual" },
          { texto: "Não — Controle de jejum insatisfatório", proximo: "orientacao_glargina_igual" }
        ]
      },
      orientacao_glargina_igual: {
        final: true,
        tipo: "success",
        titulo: "Conversão NPH → Glargina: Dose Igual (1:1) — NPH 1 Aplicação",
        conduta: "DOSE INICIAL DE GLARGINA: idêntica à dose atual de NPH ao deitar (conversão 1:1). Exemplo: NPH 20 UI ao deitar → Glargina 20 UI ao deitar. HORÁRIO: Glargina pode ser aplicada em qualquer horário fixo do dia, preferencialmente ao deitar para manter o mesmo hábito. TITULAÇÃO: Ajustar 2 UI a cada 3 dias se glicemia de jejum estiver > 130 mg/dL (ALGORITMO TREAT-TO-TARGET). Reduzir 2 UI se glicemia de jejum < 80 mg/dL em 2 dias consecutivos. TÉCNICA: NÃO homogeneizar (Glargina é solução cristalina — não tem precipitado). Rodízio obrigatório de locais. ARMAZENAMENTO: Geladeira 2-8°C (lacrado); temperatura ambiente < 30°C por até 28 dias (após aberto). MONITORAMENTO: Glicemia de jejum diária por 2 semanas, depois 3x/semana. HbA1c em 3 meses."
      },
      conversao_nph_2_doses: {
        final: true,
        tipo: "warning",
        titulo: "Conversão NPH → Glargina: Redução de 20% — NPH 2 Aplicações",
        conduta: "DOSE INICIAL DE GLARGINA: 80% da DOSE TOTAL DIÁRIA de NPH, aplicada em DOSE ÚNICA. Exemplo: NPH 20 UI manhã + 10 UI noite (total = 30 UI) → Glargina 24 UI ao deitar (30 × 0,8 = 24 UI). A redução de 20% é necessária para prevenir hipoglicemia na transição, pois a Glargina não tem pico e sua ação é mais uniforme. TITULAÇÃO ASCENDENTE: Aumentar 2 UI a cada 3 dias se glicemia de jejum persistir > 130 mg/dL. TITULAÇÃO DESCENDENTE: Reduzir 2 UI se glicemia de jejum < 80 mg/dL em 2 dias consecutivos ou em qualquer hipoglicemia < 70 mg/dL. ORIENTAÇÃO ESSENCIAL: Reforçar que a Glargina é TRANSPARENTE (diferente da NPH leitosa) — paciente NÃO deve homogeneizar. Alertar que NÃO pode misturar Glargina com outras insulinas na mesma seringa. MONITORAMENTO: Glicemia capilar diária por 2 semanas e HbA1c em 3 meses."
      }
    }
  }
};
