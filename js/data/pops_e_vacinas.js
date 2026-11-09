// =================================================================
// BASE DE DADOS: PROCEDIMENTOS OPERACIONAIS PADRÃO (POPs) & PNI VACINAS
// Farmácia Clínica na Atenção Primária à Saúde · FarmaUSF
// =================================================================

const POPS_FARMACIA_APS = [
    {
        id: "pop-01",
        codigo: "POP-FAR-01",
        versao: "2.0/2026",
        titulo: "Consulta e Acompanhamento Farmacoterapêutico (Método SOAP)",
        categoria: "Cuidado Clínico",
        objetivo: "Padronizar o atendimento e a evolução clínica farmacêutica na Unidade de Saúde da Família pelo método SOAP.",
        responsaveis: "Farmacêuticos da USF e Residentes Multiprofissionais.",
        materiais: "Prontuário e-SUS PEC, plataforma FarmaUSF, tensiômetro, glicosímetro, escala de Morisky (MMAS-4/MAT).",
        passoAPasso: [
            "1. Acolhimento e Identificação: Chamar o paciente pelo nome social/civil, acolher e explicar o objetivo da consulta farmacêutica.",
            "2. Subjetivo (S): Investigar a queixa principal, sintomas relatados, rotina de vida e histórico de automedicação ou chás/fitoterápicos.",
            "3. Objetivo (O): Aferir pressão arterial, glicemia capilar, antropometria (peso/altura) e calcular o clearance de creatinina (Cockcroft-Gault) se houver creatinina sérica.",
            "4. Farmacoterapia: Realizar o Brown Bag Test (conferência da sacola de medicamentos), mapeando doses, horários e indicação.",
            "5. Avaliação (A): Identificar Problemas Relacionados a Medicamentos (PRMs de necessidade, eficácia e segurança), Critérios de Beers em idosos e escore de adesão Morisky.",
            "6. Plano (P): Pactuar metas de autocuidado, emitir o Plano Posológico Visual, gerar a Declaração de Serviço Farmacêutico (DSF) e, se necessário, emitir Parecer Interprofissional à equipe eSF.",
            "7. Registro: Copiar o prontuário SOAP estruturado para o e-SUS PEC vinculando o procedimento SIGTAP 01.01.01.003-6 e o CIAP-2 correspondente."
        ]
    },
    {
        id: "pop-02",
        codigo: "POP-FAR-02",
        versao: "2.0/2026",
        titulo: "Execução e Rastreabilidade de Testes Rápidos Point-of-Care",
        categoria: "Triagem Diagnóstica",
        objetivo: "Estabelecer as boas práticas sanitárias para a realização de testes rápidos na farmácia da USF conforme RDC Anvisa nº 786/2023.",
        responsaveis: "Farmacêuticos habilitados e equipe técnica treinada.",
        materiais: "Kits de testes rápidos validados pelo MS, lancetas retráteis descartáveis, álcool 70%, algodão, caixa Descarpack, EPIs.",
        passoAPasso: [
            "1. Higienização e EPIs: Lavar as mãos e calçar luvas de procedimento descartáveis.",
            "2. Verificação do Kit: Checar integridade da embalagem, lote, validade e controle interno de qualidade do dispositivo.",
            "3. Coleta Capilar: Higienizar a polpa digital do paciente com álcool 70% e esperar secar. Realizar punção com lanceta retrátil descartável.",
            "4. Aplicação da Amostra: Coletar a gota de sangue com capilar/pipeta do kit, dispensar no poço de amostra e adicionar o tampão de corrida no volume exato preconizado pelo fabricante.",
            "5. Cronometragem: Aguardar o tempo estrito de leitura (geralmente 15 a 20 minutos). Leituras antes ou após o intervalo são inválidas.",
            "6. Registro e Descarte: Registrar o resultado, número de lote e validade no FarmaUSF/e-SUS PEC. Descartar material biológico perfurocortante na caixa Descarpack.",
            "7. Emissão de Laudo: Emitir a Declaração/Laudo de Teste Rápido para o cidadão e adotar o fluxo de conduta do Ministério da Saúde."
        ]
    },
    {
        id: "pop-03",
        codigo: "POP-FAR-03",
        versao: "2.0/2026",
        titulo: "Visita Domiciliar Farmacêutica (VDF) e Descarte Consciente",
        categoria: "Atenção Domiciliar",
        objetivo: "Orientar o planejamento e execução da Visita Domiciliar Farmacêutica para pacientes restritos ao leito ou com polifarmácia complexa.",
        responsaveis: "Farmacêutico da eSF/eMulti em conjunto com Agente Comunitário de Saúde (ACS).",
        materiais: "Prancheta/Tablet com FarmaUSF offline, maleta clínica com esfigmomanômetro, glicosímetro e sacola para recolhimento de medicamentos vencidos.",
        passoAPasso: [
            "1. Triagem e Agendamento: Priorizar pacientes indicados pela reunião de matrizamento da eSF (acamados, pós-alta com >5 medicamentos, idosos frágeis).",
            "2. Abordagem no Domicílio: Apresentar-se ao paciente e cuidador responsável; solicitar visualização do local real de armazenamento dos remédios.",
            "3. Aplicação do Checklist: Checar se há remédios guardados no banheiro (umidade), na cozinha (calor) ou ao alcance de crianças/animais.",
            "4. Auditoria de Sobras e Validades: Inspecionar todos os frascos/cartelas; segregar medicamentos vencidos ou em desuso para descarte correto na USF.",
            "5. Orientação ao Cuidador: Explicar a tabela de horários simplificada e esclarecer dúvidas sobre trituração ou partição de comprimidos.",
            "6. Registro no PEC: Lançar a Ficha de Visita Domiciliar e Territorial com procedimento 01.01.02.003-1 e compartilhar o parecer com a equipe."
        ]
    },
    {
        id: "pop-04",
        codigo: "POP-FAR-04",
        versao: "2.0/2026",
        titulo: "Cadeia de Frio, Armazenamento e Dispensação de Insulinas",
        categoria: "Logística & Conservação",
        objetivo: "Garantir a integridade físico-química e a eficácia biológica de insulinas e medicamentos termolábeis na farmácia e no domicílio.",
        responsaveis: "Farmacêutico e equipe da farmácia da USF.",
        materiais: "Refrigerador exclusivo com termômetro de máxima e mínima, mapa de controle diário de temperatura (2°C a 8°C).",
        passoAPasso: [
            "1. Monitoramento Diário: Registrar a temperatura da geladeira no início e fim do expediente (manter estritamente entre +2°C e +8°C).",
            "2. Organização Interna: Armazenar as insulinas nas prateleiras centrais. NUNCA colocar insulinas na porta (variação térmica) ou no congelador (inativação).",
            "3. Dispensação ao Usuário: Orientar que o frasco/caneta LACRADO deve ficar na geladeira; o frasco EM USO pode ficar em temperatura ambiente (<30°C) por até 28 dias.",
            "4. Transporte: Recomendar o transporte em bolsa térmica ou recipiente com gelo reutilizável sem contato direto com o frasco.",
            "5. Orientação de Aplicação: Instruir o rodízio de locais de aplicação (abdômen, coxas, braços) para prevenir lipodistrofia e falha terapêutica."
        ]
    },
    {
        id: "pop-05",
        codigo: "POP-FAR-05",
        versao: "1.0/2026",
        titulo: "Gerenciamento de Resíduos de Serviços de Saúde (GRSS) na Farmácia",
        categoria: "Biossegurança & Meio Ambiente",
        objetivo: "Estabelecer procedimentos seguros para segregação, acondicionamento, armazenamento e descarte de resíduos gerados na farmácia clínica da USF, em conformidade com a RDC Anvisa nº 222/2018 e as normas ABNT NBR 10004.",
        responsaveis: "Farmacêutico responsável e toda equipe da farmácia da USF. Responsabilidade compartilhada com vigilância sanitária municipal.",
        materiais: "Caixas Descarpack rígidas (perfurocortantes, capacidade máxima 2/3), sacos brancos leitosos para resíduos infectantes (Grupo A), sacos pretos para resíduos comuns (Grupo D), EPIs (luvas, avental, óculos de proteção), freezer ou geladeira exclusiva para resíduos químicos se aplicável.",
        passoAPasso: [
            "1. Identificação e Segregação: Separar os resíduos na origem em 5 grupos: (A) Infectantes — sangue, kits de teste rápido usados, luvas contaminadas; (B) Químicos — medicamentos vencidos, soluções com risco químico; (C) Radioativos — não aplicável na rotina da farmácia básica; (D) Comuns — papel, embalagens limpas; (E) Perfurocortantes — lancetas, agulhas, lâminas.",
            "2. Perfurocortantes (Grupo E): Descartar IMEDIATAMENTE após uso em caixa Descarpack rígida e resistente à perfuração. NÃO reencapar agulhas. Fechar e identificar a caixa ao atingir 2/3 de sua capacidade.",
            "3. Resíduos Infectantes (Grupo A): Acondicionar em sacos brancos leitosos, resistentes e identificados com o símbolo de risco biológico. Lacrar e encaminhar ao abrigo de resíduos da unidade para coleta especial.",
            "4. Medicamentos Vencidos e em Desuso (Grupo B): NUNCA descartar no lixo comum ou na pia/esgoto. Segregar em recipiente resistente e identificado como 'Resíduo Químico — Medicamento'. Encaminhar ao Programa de Recolhimento da Secretaria de Saúde ou pontos autorizados Anvisa (ex: programa DESCARTE CONSCIENTE em parceria com farmácias comerciais).",
            "5. Registro e Rastreabilidade: Preencher o Manifesto de Transporte de Resíduos (MTR) quando o volume exigir. Manter registro mensal do quantitativo gerado para o Plano de Gerenciamento de RSS (PGRSS) da unidade.",
            "6. EPIs e Higiene: Todo manuseio de resíduos biológicos e perfurocortantes exige luvas de procedimento, avental e, quando indicado, óculos de proteção. Higienizar as mãos após remoção dos EPIs.",
            "7. Educação da Equipe: Orientar pacientes que utilizam lancetas e insulina no domicílio sobre o descarte correto: coletar os perfurocortantes em garrafa PET rígida com tampa rosqueável e entregar na USF ou farmácia parceira para descarte adequado."
        ]
    },
    {
        id: "pop-06",
        codigo: "POP-FAR-06",
        versao: "1.0/2026",
        titulo: "Avaliação do Pé Diabético e Prevenção de Amputações",
        categoria: "Complicações do Diabetes",
        objetivo: "Sistematizar o rastreamento anual e periódico do pé diabético na farmácia clínica da USF, estratificar o risco de ulceração/amputação conforme a Classificação Internacional do Pé Diabético (CIPD / IWGDF) e orientar condutas preventivas ou de encaminhamento oportuno, em conformidade com as Diretrizes da SBD 2024.",
        responsaveis: "Farmacêutico clínico da eSF/eMulti (rastreamento e estratificação de risco); Enfermeiro e Médico (diagnóstico e tratamento de lesões ativas); Podólogo quando disponível na rede.",
        materiais: "Monofilamento de Semmes-Weinstein 10g (5,07), diapasão de 128 Hz, martelo de reflexos, termômetro cutâneo (opcional), régua milimetrada, álcool 70%, luvas de procedimento, lamparina/foco de luz, Classificação IWGDF impressa.",
        passoAPasso: [
            "1. Anamnese Dirigida: Questionar presença de dormência, formigamento, queimação, dor em repouso, claudicação intermitente, feridas ou calosidades prévias, amputações anteriores e hábito de andar descalço. Registrar tempo de DM, controle glicêmico (HbA1c) e tabagismo.",
            "2. Inspeção Visual (com calçado retirado): Observar coloração da pele (eritema, cianose, palidez), ressecamento/descamação, fissuras, hiperqueratose, calosidades, deformidades (hálux valgo, dedos em garra/martelo, pé de Charcot), onicomicose, corte inadequado das unhas e higiene geral.",
            "3. Avaliação da Sensibilidade Protetora (Neuropatia): Aplicar o monofilamento 10g em 4 pontos plantares (1º pododáctilo, 1ª, 3ª e 5ª cabeças dos metatarsos). O paciente de olhos fechados deve indicar QUANDO e ONDE sente o toque. DUAS ou mais falhas = perda de sensibilidade protetora (PSP).",
            "4. Avaliação Vibratória: Aplicar o diapasão de 128 Hz sobre a proeminência dorsal da falange distal do hálux. Sensibilidade ausente ou muito reduzida indica neuropatia de fibras grossas.",
            "5. Avaliação Vascular (Doença Arterial Periférica): Palpar os pulsos pediosos (dorsal do pé) e tibial posterior bilateralmente. Pulso diminuído/ausente, pele fria, palidez ao elevar o membro e rubor ao recoloca-lo = suspeita de DAP. Registrar o Índice Tornozelo-Braquial (ITB) se o aparelho Doppler estiver disponível (ITB < 0,9 = DAP confirmada).",
            "6. Estratificação de Risco pelo IWGDF/SBD: (0) Sem neuropatia + sem DAP = Baixo Risco (revisar anualmente); (1) Neuropatia OU DAP = Risco Moderado (revisar a cada 3-6 meses); (2) Neuropatia + DAP e/ou deformidade = Alto Risco (revisar a cada 1-3 meses); (3) Úlcera ativa OU amputação prévia = Muito Alto Risco (encaminhar URGENTE à equipe médica/cirurgia vascular).",
            "7. Condutas Preventivas e Educação: Demonstrar o corte correto das unhas (reto, sem arredondar as bordas). Orientar hidratação da pele com ureia 10% (exceto entre os dedos). Instruir a inspeção diária dos pés pelo paciente ou cuidador (usar espelho ou celular). Recomendar calçado fechado, sem costuras internas, com solado rígido e ponta larga. CONTRAINDICAR andar descalço, bolsas de água quente e remoção caseira de calos.",
            "8. Registro e Encaminhamento: Documentar no SOAP o risco IWGDF, achados do monofilamento e pulsos. Vincular código CIAP-2 T89 (Complicação de Diabetes) ou SIGTAP 01.01.01.003-6. Para lesões grau Wagner ≥ 1, emitir Parecer de Matriciamento à equipe médica imediatamente."
        ]
    }
];

const CALENDARIO_VACINAL_PNI = [
    {
        grupo: "Criança (0 a 10 anos)",
        icone: "baby",
        cor: "#0d9488",
        vacinas: [
            { nome: "BCG", idade: "Ao nascer", prevencao: "Formas graves de Tuberculose (meníngea e miliar)", dose: "Dose única" },
            { nome: "Hepatite B", idade: "Ao nascer (primeiras 12h)", prevencao: "Hepatite B neonatal", dose: "Dose única" },
            { nome: "Pentavalente (DTP/HB/Hib)", idade: "2, 4 e 6 meses", prevencao: "Difteria, Tétano, Coqueluche, Hepatite B e Meningite por Hib", dose: "3 doses" },
            { nome: "VIP (Poliomielite Inativada)", idade: "2, 4 e 6 meses", prevencao: "Paralisia Infantil", dose: "3 doses + reforços" },
            { nome: "Pneumocócica 10V", idade: "2 e 4 meses (+ reforço 12m)", prevencao: "Pneumonias, meningites e otites por pneumococo", dose: "2 doses + 1 reforço" },
            { nome: "Rotavírus Humano (VORH)", idade: "2 e 4 meses", prevencao: "Diarreia grave por rotavírus", dose: "2 doses" },
            { nome: "Meningocócica C / ACWY", idade: "3 e 5 meses (+ reforço 12m)", prevencao: "Meningite meningocócica", dose: "2 doses + 1 reforço" },
            { nome: "Tríplice Viral (SCR)", idade: "12 meses (+ Tetraviral aos 15m)", prevencao: "Sarampo, Caxumba e Rubéola", dose: "2 doses" }
        ]
    },
    {
        grupo: "Adolescente (11 a 19 anos)",
        icone: "user-check",
        cor: "#0284c7",
        vacinas: [
            { nome: "HPV Quadrivalente", idade: "9 a 14 anos (meninas e meninos)", prevencao: "Câncer de colo do útero, pênis, ânus e verrugas genitais", dose: "Dose única (novo esquema PNI)" },
            { nome: "Meningocócica ACWY", idade: "11 a 14 anos", prevencao: "Meningite por sorogrupos A, C, W e Y", dose: "1 dose / reforço" },
            { nome: "dT (Dupla Adulto)", idade: "A cada 10 anos", prevencao: "Difteria e Tétano", dose: "Reforço decenal" },
            { nome: "Hepatite B", idade: "Conforme histórico", prevencao: "Hepatite B", dose: "3 doses se não vacinado" }
        ]
    },
    {
        grupo: "Adulto & Idoso (20 a 60+ anos)",
        icone: "heart",
        cor: "#d97706",
        vacinas: [
            { nome: "dT (Dupla Adulto)", idade: "Adultos e Idosos", prevencao: "Tétano e Difteria", dose: "Reforço a cada 10 anos (ou 5 anos em ferimentos graves)" },
            { nome: "Influenza (Gripe)", idade: "Anual (Prioritário 60+, DM, HAS e imunossuprimidos)", prevencao: "Complicações e internações por vírus Influenza", dose: "1 dose anual na campanha" },
            { nome: "Pneumocócica 23V (CRIE/SUS)", idade: "Idosos 60+ acamados / institucionalizados / portadores de DRC e DM", prevencao: "Pneumonia grave e bacteremia", dose: "1 dose + 1 reforço após 5 anos" },
            { nome: "Covid-19 Bivalente / Atualizada", idade: "Grupos prioritários e idosos", prevencao: "Formas graves de Covid-19", dose: "Conforme recomendação vigente do MS" },
            { nome: "Febre Amarela", idade: "Até 59 anos (dose única se nunca vacinado)", prevencao: "Febre Amarela silvestre/urbana", dose: "Dose única" }
        ]
    },
    {
        grupo: "Gestante",
        icone: "sparkles",
        cor: "#db2777",
        vacinas: [
            { nome: "dTpa (Tríplice Acelular Adulto)", idade: "A partir da 20ª semana de gestação", prevencao: "Proteção do recém-nascido contra Coqueluche, Tétano neonatal e Difteria", dose: "1 dose a cada gestação" },
            { nome: "Hepatite B", idade: "Em qualquer trimestre", prevencao: "Transmissão vertical da Hepatite B", dose: "3 doses se não vacinada previamente" },
            { nome: "Influenza (Gripe)", idade: "Em qualquer período da gestação ou puerpério (até 45 dias)", prevencao: "Infecção respiratória grave", dose: "1 dose anual" }
        ]
    }
];
