// =================================================================
// BASE DE CÓDIGOS OFICIAIS e-SUS PEC (SIGTAP, CIAP-2 & CID-10)
// Mapeamento e Apoio ao Registro de Atenção Primária à Saúde
// =================================================================

const ESUS_CODIGOS = {
    // Procedimentos SIGTAP comuns na atuação do Farmacêutico na APS
    procedimentos: [
        {
            codigo: "01.01.01.003-6",
            sigla: "ABP001",
            nome: "Consulta / Atendimento Farmacêutico",
            descricao: "Atendimento farmacêutico individual para avaliação farmacoterapêutica e plano de cuidado.",
            destaque: true
        },
        {
            codigo: "02.14.01.001-5",
            sigla: "GLICEMIA",
            nome: "Teste Rápido de Glicemia Capilar",
            descricao: "Dosagem de glicose no sangue capilar para rastreamento ou monitoramento.",
            destaque: true
        },
        {
            codigo: "03.01.10.003-9",
            sigla: "PA",
            nome: "Aferição de Pressão Arterial",
            descricao: "Medição da pressão arterial sistólica e diastólica.",
            destaque: true
        },
        {
            codigo: "01.01.02.003-1",
            sigla: "VDF",
            nome: "Visita Domiciliar por Prof. Nível Superior",
            descricao: "Atendimento ou visita domiciliar farmacêutica (VDF).",
            destaque: true
        },
        {
            codigo: "01.01.01.002-8",
            sigla: "ACOLH",
            nome: "Acolhimento à Demanda Espontânea",
            descricao: "Primeira escuta e acolhimento de necessidades imediatas na farmácia da USF.",
            destaque: false
        },
        {
            codigo: "02.14.01.004-0",
            sigla: "TR_IMUNO",
            nome: "Teste Rápido Imunocromatográfico",
            descricao: "Triagem para infecções ou teste de gravidez (Beta-hCG).",
            destaque: false
        },
        {
            codigo: "01.01.04.004-0",
            sigla: "ATIV_COL",
            nome: "Atividade Coletiva / Educação em Saúde",
            descricao: "Grupo educativo de hiperdia, uso racional ou oficina com a comunidade.",
            destaque: false
        }
    ],

    // Classificação Internacional de Atenção Primária (CIAP-2)
    ciap2: [
        { codigo: "T90", nome: "Diabetes não-insulino/insulino dependente", categoria: "Endócrino", destaque: true },
        { codigo: "K86", nome: "Hipertensão arterial sem complicações", categoria: "Cardiovascular", destaque: true },
        { codigo: "K87", nome: "Hipertensão arterial com complicações", categoria: "Cardiovascular", destaque: false },
        { codigo: "P17", nome: "Uso indevido de medicação / Não-adesão", categoria: "Psicológico/Comportamental", destaque: true },
        { codigo: "A98", nome: "Medicina preventiva / Manutenção da saúde", categoria: "Geral", destaque: true },
        { codigo: "T93", nome: "Hiperlipidemia / Dislipidemia", categoria: "Endócrino", destaque: true },
        { codigo: "R96", nome: "Asma brônquica / DPOC", categoria: "Respiratório", destaque: true },
        { codigo: "U99", nome: "Doença Renal Crônica / Outras doenças renais", categoria: "Urológico", destaque: true },
        { codigo: "A85", nome: "Efeito adverso de medicamento / Reação adversa", categoria: "Geral", destaque: true },
        { codigo: "W78", nome: "Planejamento familiar / Gravidez", categoria: "Feminino", destaque: false },
        { codigo: "D97", nome: "Doença do fígado / Esteatose / Hepatopatia", categoria: "Digestivo", destaque: false },
        { codigo: "P76", nome: "Perturbação depressiva / Ansiedade", categoria: "Psicológico", destaque: false }
    ],

    // Código Internacional de Doenças (CID-10)
    cid10: [
        { codigo: "I10", nome: "Hipertensão essencial (primária)", categoria: "Cardiovascular" },
        { codigo: "E11", nome: "Diabetes mellitus tipo 2", categoria: "Endócrino" },
        { codigo: "E78", nome: "Dislipidemia / Distúrbios de lipoproteínas", categoria: "Endócrino" },
        { codigo: "J45", nome: "Asma", categoria: "Respiratório" },
        { codigo: "N18", nome: "Doença renal crônica (DRC)", categoria: "Renal" },
        { codigo: "Z71.8", nome: "Outro aconselhamento especificado (Uso de Medicação)", categoria: "Geral" },
        { codigo: "Y57.9", nome: "Efeitos adversos de drogas/medicamentos não especificados", categoria: "Causa Externa" }
    ]
};
