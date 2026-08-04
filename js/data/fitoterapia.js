// =================================================================
// BANCO DE DADOS DE FITOTERAPIA E PLANTAS MEDICINAIS DO SUS
// Memento de Fitoterápicos da ANVISA / Ministério da Saúde (Farmácia Viva)
// =================================================================

window.PLANTAS_MEDICINAIS_SUS = [
    {
        id: "espinheira-santa",
        nomePopular: "Espinheira-Santa",
        nomeCientifico: "Maytenus ilicifolia Mart. ex Reissek",
        categoria: "Gastrointestinal",
        indicacoes: "Dispepsia, gastrite, coadjuvante no tratamento de úlcera péptica e azia.",
        partesUsadas: "Folhas secas.",
        metodoPreparo: "Infusão: Adicionar 1 colher de sopa (approx. 3g) de folhas secas em 150mL de água fervente. Abafar por 10 a 15 minutos.",
        posologia: "Tomar 1 xícara de chá 2 a 3 vezes ao dia, preferencialmente após as principais refeições.",
        contraindicacoes: "Contraindicado para gestantes (efeito emenagogo/abortivo), lactantes e crianças menores de 12 anos.",
        interacoesRisco: "Evitar uso concomitante com antiácidos potentes no mesmo horário para não prejudicar absorção de ativos.",
        nivelAlerta: "leve"
    },
    {
        id: "guaco",
        nomePopular: "Guaco",
        nomeCientifico: "Mikania glomerata Spreng.",
        categoria: "Respiratório",
        indicacoes: "Broncodilatador, expectorante, coadjuvante no tratamento da tosse, bronquite e afecções respiratórias.",
        partesUsadas: "Folhas.",
        metodoPreparo: "Infusão (3g de folhas secas em 150mL de água) ou Xarope padronizado do SUS.",
        posologia: "Xarope: 5mL a 10mL, 3 vezes ao dia. Chá: 1 xícara de chá, 3 vezes ao dia.",
        contraindicacoes: "Contraindicado para gestantes, lactantes, crianças menores de 2 anos e pacientes com doenças hepáticas graves.",
        interacoesRisco: "Atenção: Contém cumarinas. Pode potencializar o efeito de Anticoagulantes orais (Varfarina, AAS). Evitar no pré-operatório.",
        nivelAlerta: "grave"
    },
    {
        id: "passiflora",
        nomePopular: "Passiflora / Maracujá",
        nomeCientifico: "Passiflora incarnata L.",
        categoria: "Sistema Nervoso",
        indicacoes: "Ansiolítico leve, sedativo suave, tratamento da ansiedade moderada, insônia e irritabilidade.",
        partesUsadas: "Folhas e partes aéreas secas.",
        metodoPreparo: "Infusão: 1 a 2g de folhas secas em 150mL de água fervente. Abafar por 10 minutos.",
        posologia: "1 xícara à noite antes de deitar (para insônia) ou 2 a 3 vezes ao dia (para ansiedade).",
        contraindicacoes: "Contraindicado durante a gravidez e amamentação. Evitar associação com bebidas alcoólicas.",
        interacoesRisco: "Potencializa os efeitos de sedativos centrais, ansiolíticos (Clonazepam, Diazepam) e anti-histamínicos de 1ª geração.",
        nivelAlerta: "moderado"
    },
    {
        id: "carqueja",
        nomePopular: "Carqueja",
        nomeCientifico: "Baccharis trimera (Less.) DC.",
        categoria: "Gastrointestinal",
        indicacoes: "Dispepsias, má digestão, coadjuvante nos distúrbios hepatobiliares e má circulação.",
        partesUsadas: "Partes aéreas (hastes aladas).",
        metodoPreparo: "Infusão: 2g a 3g de hastes secas em 150mL de água fervente.",
        posologia: "1 xícara de chá, 2 a 3 vezes ao dia, antes das refeições.",
        contraindicacoes: "Contraindicado na gestação (risco de contração uterina), lactação e em hipotensos.",
        interacoesRisco: "Atenção: Possui efeito hipoglicemiante intrínseco. Pode somar efeito com Insulinas, Glibenclamida ou Metformina, gerando hipoglicemia.",
        nivelAlerta: "moderado"
    },
    {
        id: "quebra-pedra",
        nomePopular: "Quebra-Pedra",
        nomeCientifico: "Phyllanthus niruri L.",
        categoria: "Renal/Metabólico",
        indicacoes: "Prevenção da litíase renal (pedra nos rins), uricosúrico, relaxante da musculatura ureteral.",
        partesUsadas: "Partes aéreas ou planta inteira.",
        metodoPreparo: "Decocção: Ferver 3g da planta em 150mL de água por 5 a 10 minutos.",
        posologia: "1 xícara de chá, 2 a 3 vezes ao dia. Não utilizar por mais de 3 semanas contínuas.",
        contraindicacoes: "Gestação, lactação e crianças. Pacientes com insuficiência renal crônica em estágio avançado.",
        interacoesRisco: "Pode potencializar o efeito de diuréticos (Furosemida, Hidroclorotiazida) e anti-hipertensivos.",
        nivelAlerta: "leve"
    },
    {
        id: "capim-santo",
        nomePopular: "Capim-Santo / Capim-Limão",
        nomeCientifico: "Cymbopogon citratus (DC.) Stapf",
        categoria: "Sistema Nervoso",
        indicacoes: "Antiespasmódico, sedativo leve, alívio de cólicas gastrointestinais e ansiedade leve.",
        partesUsadas: "Folhas frescas ou secas.",
        metodoPreparo: "Infusão: 2g a 5g de folhas cortadas em 150mL de água fervente.",
        posologia: "1 xícara de chá, 2 a 3 vezes ao dia após as refeições.",
        contraindicacoes: "Em grandes doses pode causar hipotensão. Evitar em dores abdominais de causa desconhecida.",
        interacoesRisco: "Pode potencializar levemente o efeito de medicamentos anti-hipertensivos e sedativos.",
        nivelAlerta: "leve"
    },
    {
        id: "hortela-pimenta",
        nomePopular: "Hortelã-Pimenta",
        nomeCientifico: "Mentha x piperita L.",
        categoria: "Gastrointestinal",
        indicacoes: "Síndrome do intestino irritável, flatulência, espasmos digestivos, náuseas leves.",
        partesUsadas: "Folhas secas ou óleo essencial.",
        metodoPreparo: "Infusão: 1,5g a 3g de folhas secas em 150mL de água fervente.",
        posologia: "1 xícara de chá, 3 vezes ao dia entre as refeições.",
        contraindicacoes: "Evitar em pacientes com refluxo gastresofágico grave (relaxa esfíncter esofágico inferior) e cálculo biliar sem orientação.",
        interacoesRisco: "Pode alterar a velocidade de esvaziamento gástrico de alguns fármacos sintéticos.",
        nivelAlerta: "leve"
    },
    {
        id: "alcachofra",
        nomePopular: "Alcachofra",
        nomeCientifico: "Cynara scolymus L.",
        categoria: "Gastrointestinal",
        indicacoes: "Coadjuvante no tratamento de hiperlipidemia leve, dispepsia funcional e desordens hepatobiliares.",
        partesUsadas: "Folhas secas.",
        metodoPreparo: "Infusão: 2g a 3g em 150mL de água fervente.",
        posologia: "1 xícara, 2 a 3 vezes ao dia antes das refeições principais.",
        contraindicacoes: "Contraindicado em obstrução de vias biliares (colelitíase grave), gravidez e lactação.",
        interacoesRisco: "Pode interagir com anticoagulantes cumarínicos e alterar a eficácia de estatinas se usada em doses elevadas.",
        nivelAlerta: "moderado"
    },
    {
        id: "ginkgo",
        nomePopular: "Ginkgo Biloba",
        nomeCientifico: "Ginkgo biloba L.",
        categoria: "Sistema Nervoso",
        indicacoes: "Vertigens, zumbidos vasculares, distúrbios de memória leves de origem vascular.",
        partesUsadas: "Extrato seco padronizado (folhas).",
        metodoPreparo: "Usar preferencialmente extrato seco padronizado (80mg a 120mg/dia).",
        posologia: "Conforme prescrição médica/farmacêutica (geralmente 80mg a 120mg, 2x ao dia).",
        contraindicacoes: "Contraindicado em hemorragias ativas, pré-operatório (suspender 14 dias antes) e gestação.",
        interacoesRisco: "ALERTA CRÍTICO: Alto risco de sangramento quando associado à Varfarina, AAS, Clopidogrel, Rivaroxabana e AINEs.",
        nivelAlerta: "grave"
    },
    {
        id: "ginseng",
        nomePopular: "Ginseng",
        nomeCientifico: "Panax ginseng C.A. Mey.",
        categoria: "Renal/Metabólico",
        indicacoes: "Fadiga física e mental, adaptógeno para estados de astenia e convalescença.",
        partesUsadas: "Raízes secas.",
        metodoPreparo: "Decocção ou Extrato seco padronizado.",
        posologia: "100mg a 200mg de extrato padronizado ao dia, por no máximo 8 a 12 semanas.",
        contraindicacoes: "Hipertensão arterial não controlada, insônia severa, estados de agitação e gravidez.",
        interacoesRisco: "ALERTA: Aumenta severamente o risco de hipoglicemia em usuários de Insulina ou Sulfonilureias (Glibenclamida). Interage com Varfarina.",
        nivelAlerta: "grave"
    },
    {
        id: "erva-de-sao-joao",
        nomePopular: "Erva-de-São-João (Hipericão)",
        nomeCientifico: "Hypericum perforatum L.",
        categoria: "Sistema Nervoso",
        indicacoes: "Depressão leve a moderada, distúrbios psicovegetativos.",
        partesUsadas: "Partes aéreas floridas.",
        metodoPreparo: "Extrato seco padronizado (300mg, 2 a 3x/dia).",
        posologia: "Conforme prescrição habilitada.",
        contraindicacoes: "Gravidez, uso concomitante com antidepressivos inibidores da recaptação de serotonina.",
        interacoesRisco: "ALERTA MÁXIMO: Potente indutor do CYP3A4 e P-glicoproteína. Inativa anticoncepcionais orais (risco de gravidez), Varfarina, Digoxina e Sinvastatina.",
        nivelAlerta: "grave"
    }
];
