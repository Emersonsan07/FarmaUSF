// =================================================================
// CATÁLOGO E REGRAS DE INTERPRETAÇÃO DE TESTES RÁPIDOS (POINT-OF-CARE)
// Padrão RDC Anvisa & Protocolos Clínicos do Ministério da Saúde
// =================================================================

const CATALOGO_TESTES_RAPIDOS = [
    {
        id: "glicemia_capilar",
        nome: "Glicemia Capilar",
        categoria: "Metabólico",
        sigtap: "02.14.01.001-5",
        ciap2: "T90",
        tipoResultado: "numerico",
        unidade: "mg/dL",
        referencia: "Jejum: 70 a 99 mg/dL | Pós-prandial (2h): < 140 mg/dL",
        interpretar: function (valor, tipoRef) {
            const v = parseFloat(valor);
            if (isNaN(v)) return { status: "Indefinido", cor: "neutral", orientacao: "Valor inválido" };
            if (tipoRef === "jejum") {
                if (v < 70) return { status: "Hipoglicemia", cor: "danger", badge: "#ef4444", orientacao: "Consumir carboidrato simples imediato (15g de glicose) e reavaliar em 15 min." };
                if (v <= 99) return { status: "Glicemia Normal (Jejum)", cor: "success", badge: "#10b981", orientacao: "Manter hábitos saudáveis e acompanhamento de rotina." };
                if (v <= 125) return { status: "Glicemia de Jejum Alterada (Pré-Diabetes)", cor: "warning", badge: "#f59e0b", orientacao: "Sugerir confirmação laboratorial (glicemia de jejum / HbA1c) e mudança de estilo de vida." };
                return { status: "Hiperglicemia / Suspeita de Diabetes", cor: "danger", badge: "#ef4444", orientacao: "Encaminhar para avaliação médica na USF para confirmação diagnóstica." };
            } else {
                if (v < 70) return { status: "Hipoglicemia", cor: "danger", badge: "#ef4444", orientacao: "Corrigir com 15g de carboidrato e monitorar." };
                if (v < 140) return { status: "Glicemia Normal (Casual/Pós-prandial)", cor: "success", badge: "#10b981", orientacao: "Valor dentro da meta." };
                if (v < 200) return { status: "Tolerância à Glicose Diminuída", cor: "warning", badge: "#f59e0b", orientacao: "Orientar dieta e solicitar avaliação médica na USF." };
                return { status: "Hiperglicemia Franca", cor: "danger", badge: "#ef4444", orientacao: "Alerta clínico. Se apresentar sintomas de cetoacidose/desidratação, procurar atendimento imediato." };
            }
        }
    },
    {
        id: "hba1c_poc",
        nome: "Hemoglobina Glicada (HbA1c Point-of-Care)",
        categoria: "Metabólico",
        sigtap: "02.02.01.050-3",
        ciap2: "T90",
        tipoResultado: "numerico",
        unidade: "%",
        referencia: "Meta terapêutica usual DM: < 7.0% | Idoso frágil: < 8.0%",
        interpretar: function (valor) {
            const v = parseFloat(valor);
            if (isNaN(v)) return { status: "Indefinido", cor: "neutral" };
            if (v < 5.7) return { status: "Normal (< 5,7%)", cor: "success", badge: "#10b981", orientacao: "Sem indicativo de diabetes." };
            if (v <= 6.4) return { status: "Pré-Diabetes (5,7 a 6,4%)", cor: "warning", badge: "#f59e0b", orientacao: "Risco aumentado. Iniciar orientações de alimentação e atividade física." };
            if (v <= 7.0) return { status: "Diabetes Controlado (Meta Terapêutica)", cor: "success", badge: "#10b981", orientacao: "Bom controle glicêmico nos últimos 3 meses." };
            if (v <= 8.5) return { status: "Diabetes Não-Controlado Moderado", cor: "warning", badge: "#f59e0b", orientacao: "Avaliar adesão, ajuste de posologia de hipoglicemiantes e hábitos." };
            return { status: "Descontrole Glicêmico Grave (> 8,5%)", cor: "danger", badge: "#ef4444", orientacao: "Alto risco micro e macrovascular. Priorizar reavaliação médica para intensificação do tratamento." };
        }
    },
    {
        id: "perfil_lipidico",
        nome: "Colesterol Total & Lipídios Point-of-Care",
        categoria: "Cardiovascular",
        sigtap: "02.14.01.002-3",
        ciap2: "T93",
        tipoResultado: "lipideos",
        unidade: "mg/dL",
        referencia: "Colesterol Total: < 190 mg/dL | Triglicerídeos: < 150 mg/dL (jejum)",
        interpretar: function (colTotal, triglic, hdl) {
            const ct = parseFloat(colTotal) || 0;
            const tg = parseFloat(triglic) || 0;
            let status = [];
            let cor = "success";
            let badge = "#10b981";

            if (ct >= 190) {
                status.push(`Colesterol Total Elevado (${ct} mg/dL)`);
                cor = "warning";
                badge = "#f59e0b";
            }
            if (tg >= 150) {
                status.push(`Triglicerídeos Elevados (${tg} mg/dL)`);
                cor = "warning";
                badge = "#f59e0b";
            }
            if (ct >= 240 || tg >= 400) {
                cor = "danger";
                badge = "#ef4444";
            }
            const desc = status.length > 0 ? status.join(" + ") : "Perfil Lipídico Adequado";
            return {
                status: desc,
                cor: cor,
                badge: badge,
                orientacao: cor !== "success" ? "Orientar restrição de gorduras saturadas/açúcares e checar uso regular de Estatinas." : "Manter acompanhamento de rotina."
            };
        }
    },
    {
        id: "tr_sifilis",
        nome: "Teste Rápido de Sífilis (Treponêmico)",
        categoria: "Infectologia / IST",
        sigtap: "02.14.01.004-0",
        ciap2: "A85",
        tipoResultado: "qualitativo",
        referencia: "Não Reagente",
        interpretar: function (resultado) {
            if (resultado === "Reagente") {
                return {
                    status: "REAGENTE (Presença de Anticorpos Anti-Treponema)",
                    cor: "danger",
                    badge: "#ef4444",
                    orientacao: "Notificar, realizar teste não treponêmico (VDRL se disponível) ou iniciar tratamento com Penicilina Benzatina conforme protocolo clínico municipal. Convocar parceiro(s) sexual(is)."
                };
            }
            if (resultado === "Não Reagente") {
                return {
                    status: "NÃO REAGENTE",
                    cor: "success",
                    badge: "#10b981",
                    orientacao: "Orientar prevenção, uso de preservativos e retestagem se houver exposição sexual recente (janela imunológica de até 30 dias)."
                };
            }
            return { status: "Inconclusivo / Repetir Teste", cor: "warning", badge: "#f59e0b", orientacao: "Coletar nova amostra com novo kit." };
        }
    },
    {
        id: "tr_hiv",
        nome: "Teste Rápido de HIV 1/2",
        categoria: "Infectologia / IST",
        sigtap: "02.14.01.004-0",
        ciap2: "A85",
        tipoResultado: "qualitativo",
        referencia: "Não Reagente",
        interpretar: function (resultado) {
            if (resultado === "Reagente") {
                return {
                    status: "REAGENTE (Requer 2º Teste Confirmatório)",
                    cor: "danger",
                    badge: "#ef4444",
                    orientacao: "Realizar imediatamente o 2º teste rápido de marca/metodologia diferente (TR2) conforme Portaria MS/SVS nº 29. Acolhimento sigiloso e encaminhamento para TARV."
                };
            }
            if (resultado === "Não Reagente") {
                return {
                    status: "NÃO REAGENTE",
                    cor: "success",
                    badge: "#10b981",
                    orientacao: "Orientar PrEP/PEP, prevenção combinada e atentar para janela imunológica de 30 dias."
                };
            }
            return { status: "Inconclusivo / Repetir Teste", cor: "warning", badge: "#f59e0b", orientacao: "Repetir com novo dispositivo." };
        }
    },
    {
        id: "tr_gravidez",
        nome: "Teste Rápido de Gravidez (Beta-hCG Urina)",
        categoria: "Saúde da Mulher",
        sigtap: "02.14.01.004-0",
        ciap2: "W78",
        tipoResultado: "qualitativo",
        referencia: "Negativo",
        interpretar: function (resultado) {
            if (resultado === "Reagente") {
                return {
                    status: "POSITIVO / REAGENTE (Gravidez Confirmada)",
                    cor: "success",
                    badge: "#0284c7",
                    orientacao: "Iniciar captação precoce para Pré-Natal na USF, prescrever Ácido Fólico (RENAME), checar vacinas (dTpa, Hepatite B, Influenza) e revisar medicamentos contraindicados na gestação (ex: IECA, BRA, Estatinas)."
                };
            }
            return {
                status: "NEGATIVO / NÃO REAGENTE",
                cor: "neutral",
                badge: "#64748b",
                orientacao: "Orientar sobre planejamento familiar e métodos contraceptivos disponíveis na farmácia da USF."
            };
        }
    },
    {
        id: "tr_dengue",
        nome: "Teste Rápido de Dengue (NS1 / IgM / IgG)",
        categoria: "Infectologia / Arbovirose",
        sigtap: "02.14.01.004-0",
        ciap2: "A85",
        tipoResultado: "qualitativo",
        referencia: "Não Reagente",
        interpretar: function (resultado) {
            if (resultado === "Reagente NS1 / IgM") {
                return {
                    status: "POSITIVO PARA DENGUE (Infecção Aguda)",
                    cor: "danger",
                    badge: "#ef4444",
                    orientacao: "Orientar hidratação oral vigorosa (60 mL/kg/dia), prescrever Dipirona/Paracetamol para dor/febre. CONTRAINDICAR expressamente AAS e Anti-inflamatórios (AINEs). Alertar sobre sinais de alarme (dor abdominal intensa, vômitos, sangramentos)."
                };
            }
            return {
                status: "NÃO REAGENTE",
                cor: "neutral",
                badge: "#10b981",
                orientacao: "Se sintomas persistirem há menos de 3 dias, atentar para sensibilidade do teste. Manter hidratação preventiva."
            };
        }
    },
    {
        id: "tr_hepatite_c",
        nome: "Teste Rápido de Hepatite C (Anti-HCV)",
        categoria: "Infectologia / Hepatologia",
        sigtap: "02.14.01.004-0",
        ciap2: "D72",
        tipoResultado: "qualitativo",
        referencia: "Não Reagente",
        interpretar: function (resultado) {
            if (resultado === "Reagente") {
                return {
                    status: "REAGENTE (Presença de Anticorpos Anti-HCV)",
                    cor: "danger",
                    badge: "#ef4444",
                    orientacao: "Resultado reagente NÃO confirma infecção ativa. Solicitar exame confirmatório (RNA do HCV / carga viral) e encaminhar ao hepatologista. Orientar sobre transmissão (compartilhamento de seringas/agulhas, materiais perfurocortantes, relações sexuais sem proteção). Notificar conforme SINAN. Não há vacina disponível para Hepatite C."
                };
            }
            if (resultado === "Não Reagente") {
                return {
                    status: "NÃO REAGENTE",
                    cor: "success",
                    badge: "#10b981",
                    orientacao: "Resultado negativo. Reforçar prevenção (uso de preservativos, não compartilhamento de perfurocortantes). Atentar para janela imunológica de até 60 dias após exposição de risco."
                };
            }
            return { status: "Inconclusivo / Repetir Teste", cor: "warning", badge: "#f59e0b", orientacao: "Coletar nova amostra com novo dispositivo. Verificar integridade do kit e validade." };
        }
    },
    {
        id: "tr_chikungunya",
        nome: "Teste Rápido de Chikungunya / Zika (IgM / IgG)",
        categoria: "Infectologia / Arbovirose",
        sigtap: "02.14.01.004-0",
        ciap2: "A85",
        tipoResultado: "qualitativo",
        referencia: "Não Reagente",
        interpretar: function (resultado) {
            if (resultado === "Reagente IgM (Fase Aguda)") {
                return {
                    status: "POSITIVO — Infecção Aguda por Chikungunya/Zika (IgM+)",
                    cor: "danger",
                    badge: "#ef4444",
                    orientacao: "Tratamento sintomático: repouso, hidratação oral. CONTRAINDICAR AAS e AINEs (risco de sangramento). Para Chikungunya com artralgia intensa, Paracetamol ou Dipirona. Notificar ao SINAN. Orientar eliminação de criadouros de Aedes aegypti. Para gestantes com suspeita de Zika, encaminhar com urgência ao pré-natal de alto risco (rastreio de microcefalia/síndrome congênita)."
                };
            }
            if (resultado === "Reagente IgG (Infecção Prévia)") {
                return {
                    status: "IgG REAGENTE — Infecção Prévia (Imunidade Adquirida)",
                    cor: "warning",
                    badge: "#f59e0b",
                    orientacao: "Indica contato anterior com o vírus. Avaliar clinicamente se há artralgia crônica residual pós-Chikungunya (pode persistir por meses). Acompanhamento com NASF/eMulti se necessário."
                };
            }
            return {
                status: "NÃO REAGENTE",
                cor: "neutral",
                badge: "#10b981",
                orientacao: "Avaliar janela imunológica: IgM detectável a partir do 3º-5º dia de sintomas. Se suspeita clínica forte e menos de 5 dias de sintomas, considerar RT-PCR. Reforçar prevenção e controle de vetores."
            };
        }
    }
];
