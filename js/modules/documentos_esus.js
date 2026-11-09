// =================================================================
// MÓDULO DE DOCUMENTOS E-SUS PEC & MATRICIAMENTO INTERPROFISSIONAL
// Declaração de Serviço Farmacêutico (DSF), Parecer Clínico & Códigos SUS
// =================================================================

let esusSelectedProcedimentos = ["01.01.01.003-6"]; // Padrão: Consulta Farmacêutica
let esusSelectedCiap2 = ["A98"]; // Padrão: Manutenção da saúde

function initEsusDocumentosModule() {
    renderEsusCodeSelectors();
}

// Renderiza os seletores de códigos CIAP-2 e SIGTAP no Step 4/5 do SOAP
function renderEsusCodeSelectors() {
    const ciapContainer = document.getElementById("esus-ciap-chips-container");
    const procedContainer = document.getElementById("esus-proced-chips-container");

    if (ciapContainer && typeof ESUS_CODIGOS !== "undefined") {
        ciapContainer.innerHTML = "";
        ESUS_CODIGOS.ciap2.forEach(item => {
            const isSelected = esusSelectedCiap2.includes(item.codigo);
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = `esus-code-chip ${isSelected ? "active" : ""}`;
            chip.innerHTML = `<strong>${item.codigo}</strong> <span>${item.nome}</span>`;
            chip.addEventListener("click", () => {
                if (esusSelectedCiap2.includes(item.codigo)) {
                    esusSelectedCiap2 = esusSelectedCiap2.filter(c => c !== item.codigo);
                } else {
                    esusSelectedCiap2.push(item.codigo);
                }
                renderEsusCodeSelectors();
                if (typeof window.updateFormattedText === "function") window.updateFormattedText();
            });
            ciapContainer.appendChild(chip);
        });
    }

    if (procedContainer && typeof ESUS_CODIGOS !== "undefined") {
        procedContainer.innerHTML = "";
        ESUS_CODIGOS.procedimentos.forEach(item => {
            const isSelected = esusSelectedProcedimentos.includes(item.codigo);
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = `esus-code-chip ${isSelected ? "active" : ""}`;
            chip.innerHTML = `<strong>${item.codigo}</strong> <span>${item.nome}</span>`;
            chip.addEventListener("click", () => {
                if (esusSelectedProcedimentos.includes(item.codigo)) {
                    esusSelectedProcedimentos = esusSelectedProcedimentos.filter(c => c !== item.codigo);
                } else {
                    esusSelectedProcedimentos.push(item.codigo);
                }
                renderEsusCodeSelectors();
                if (typeof window.updateFormattedText === "function") window.updateFormattedText();
            });
            procedContainer.appendChild(chip);
        });
    }
}

// Retorna o bloco textual dos códigos e-SUS selecionados para anexar no SOAP
window.getEsusCodigosText = function () {
    if (typeof ESUS_CODIGOS === "undefined") return "";

    const procedNames = esusSelectedProcedimentos.map(c => {
        const found = ESUS_CODIGOS.procedimentos.find(p => p.codigo === c);
        return found ? `${found.codigo} (${found.nome})` : c;
    });

    const ciapNames = esusSelectedCiap2.map(c => {
        const found = ESUS_CODIGOS.ciap2.find(p => p.codigo === c);
        return found ? `${found.codigo} - ${found.nome}` : c;
    });

    return [
        "[CÓDIGOS e-SUS PEC SUGERIDOS]",
        `• Procedimento(s) SIGTAP: ${procedNames.length > 0 ? procedNames.join("; ") : "01.01.01.003-6 (Consulta Farmacêutica)"}`,
        `• Condição/Problema CIAP-2: ${ciapNames.length > 0 ? ciapNames.join("; ") : "A98 - Manutenção da saúde"}`
    ].join("\n");
};

// =================================================================
// 1. DECLARAÇÃO DE SERVIÇO FARMACÊUTICO (DSF / COMPROVANTE SUS)
// =================================================================

window.openDsfModal = function () {
    const modal = document.getElementById("dsf-modal-overlay");
    if (!modal) return;

    const nome = document.getElementById("soap-nome")?.value.trim() || "Cidadão(ã) / Usuário(a) SUS";
    const idade = document.getElementById("soap-idade")?.value.trim() || "--";
    const sexo = document.getElementById("soap-sexo")?.value === "F" ? "Feminino" : (document.getElementById("soap-sexo")?.value === "M" ? "Masculino" : "--");
    const paSis = document.getElementById("soap-pa-sis")?.value.trim();
    const paDia = document.getElementById("soap-pa-dia")?.value.trim();
    const glicemia = document.getElementById("soap-glicemia")?.value.trim();
    const peso = document.getElementById("soap-peso")?.value.trim();
    const altura = document.getElementById("soap-altura")?.value.trim();
    const conduta = document.getElementById("soap-p")?.value.trim() || "Orientação farmacêutica sobre o uso correto e seguro dos medicamentos prescritos.";

    const currentUser = window.USFAuth ? window.USFAuth.getCurrentUser() : null;
    const farmaNome = currentUser ? currentUser.nome : "Farmacêutico(a) da USF";
    const farmaUsf = currentUser ? currentUser.usf : "Unidade de Saúde da Família (USF)";

    // Preenche campos do modal
    const elNome = document.getElementById("dsf-paciente-nome");
    const elIdade = document.getElementById("dsf-paciente-idade");
    const elSexo = document.getElementById("dsf-paciente-sexo");
    const elData = document.getElementById("dsf-data-emissao");
    const elFarma = document.getElementById("dsf-farma-nome");
    const elUsf = document.getElementById("dsf-usf-nome");
    const elAssinaturaFarma = document.getElementById("dsf-assinatura-farma");
    const elAssinaturaUsf = document.getElementById("dsf-assinatura-usf");

    if (elNome) elNome.textContent = nome;
    if (elIdade) elIdade.textContent = `${idade} anos`;
    if (elSexo) elSexo.textContent = sexo;
    if (elData) elData.textContent = new Date().toLocaleDateString("pt-BR");
    if (elFarma) elFarma.textContent = farmaNome;
    if (elUsf) elUsf.textContent = farmaUsf;
    if (elAssinaturaFarma) elAssinaturaFarma.textContent = farmaNome;
    if (elAssinaturaUsf) elAssinaturaUsf.textContent = farmaUsf;

    // Tabela de Parâmetros Aferidos
    const paramsList = document.getElementById("dsf-params-list");
    if (paramsList) {
        let rows = "";
        if (paSis && paDia) {
            const sis = parseInt(paSis);
            const dia = parseInt(paDia);
            let statusPa = "Normal (< 120/80 mmHg)";
            let corBadge = "#10b981";
            if (sis >= 140 || dia >= 90) {
                statusPa = "Pressão Elevada / Hipertensão";
                corBadge = "#ef4444";
            } else if (sis >= 120 || dia >= 80) {
                statusPa = "Pré-Hipertensão";
                corBadge = "#f59e0b";
            }
            rows += `
                <tr>
                    <td><strong>Pressão Arterial (PA)</strong></td>
                    <td style="font-weight: 700; color: ${corBadge};">${paSis}/${paDia} mmHg</td>
                    <td>Normal: < 120/80 mmHg | Meta HAS: < 140/90</td>
                    <td><span class="dsf-badge" style="background: ${corBadge}20; color: ${corBadge};">${statusPa}</span></td>
                </tr>
            `;
        }
        if (glicemia) {
            const g = parseInt(glicemia);
            let statusGli = "Glicemia Normal";
            let corBadge = "#10b981";
            if (g >= 126) {
                statusGli = "Elevada / Hiperglicemia";
                corBadge = "#ef4444";
            } else if (g < 70) {
                statusGli = "Baixa / Hipoglicemia";
                corBadge = "#f59e0b";
            }
            rows += `
                <tr>
                    <td><strong>Glicemia Capilar</strong></td>
                    <td style="font-weight: 700; color: ${corBadge};">${glicemia} mg/dL</td>
                    <td>Jejum: 70 a 99 mg/dL | Pós-prandial: < 140 mg/dL</td>
                    <td><span class="dsf-badge" style="background: ${corBadge}20; color: ${corBadge};">${statusGli}</span></td>
                </tr>
            `;
        }
        if (peso && altura) {
            const p = parseFloat(peso);
            const a = parseFloat(altura);
            if (a > 0) {
                const imc = (p / (a * a)).toFixed(1);
                let statusImc = "Eutrofia / Peso Adequado";
                if (imc >= 30) statusImc = "Obesidade";
                else if (imc >= 25) statusImc = "Sobrepeso";
                else if (imc < 18.5) statusImc = "Baixo Peso";
                rows += `
                    <tr>
                        <td><strong>Antropometria (IMC)</strong></td>
                        <td style="font-weight: 700;">${imc} kg/m² (${peso} kg / ${altura} m)</td>
                        <td>Eutrofia: 18,5 a 24,9 kg/m²</td>
                        <td><span class="dsf-badge" style="background: #3b82f620; color: #3b82f6;">${statusImc}</span></td>
                    </tr>
                `;
            }
        }
        if (!rows) {
            rows = `<tr><td colspan="4" style="text-align: center; color: var(--text-tertiary);">Nenhum parâmetro fisiológico aferido nesta consulta.</td></tr>`;
        }
        paramsList.innerHTML = rows;
    }

    // Orientações ao Paciente
    const elConduta = document.getElementById("dsf-orientacoes-text");
    if (elConduta) elConduta.textContent = conduta;

    // Lista de Medicamentos em Uso
    const elMedsList = document.getElementById("dsf-meds-summary");
    if (elMedsList) {
        if (typeof fcMedList !== "undefined" && fcMedList.length > 0) {
            elMedsList.innerHTML = fcMedList.map(m => `
                <li style="margin-bottom: 4px;">
                    <strong>${m.nome}</strong> (${m.dose || "Dose usual"}) — Tomada: ${m.manha ? "Manhã " : ""}${m.tarde ? "Tarde " : ""}${m.noite ? "Noite" : ""} ${m.observacoes ? `<em>(${m.observacoes})</em>` : ""}
                </li>
            `).join("");
        } else {
            elMedsList.innerHTML = "<li>Nenhum medicamento contínuo listado no momento da consulta.</li>";
        }
    }

    modal.classList.add("active");
    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
};

window.closeDsfModal = function () {
    const modal = document.getElementById("dsf-modal-overlay");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.remove("open");
    }
};

window.printDsfDocument = function () {
    const area = document.getElementById("dsf-printable-document");
    if (!area) return;
    const printWin = window.open("", "", "width=850,height=800");
    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Declaração de Serviço Farmacêutico - FarmaUSF</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #0f172a; margin: 0; background: #fff; line-height: 1.45; font-size: 13px; }
                .dsf-header { border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
                .dsf-title { font-size: 16px; font-weight: 800; color: #0d9488; margin: 0; text-transform: uppercase; }
                .dsf-subtitle { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }
                .dsf-section { margin-bottom: 14px; }
                .dsf-section-title { font-size: 12px; font-weight: 700; color: #0f172a; background: #f1f5f9; padding: 6px 10px; border-left: 3px solid #0d9488; margin-bottom: 8px; text-transform: uppercase; }
                .dsf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11.5px; }
                th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
                th { background: #f8fafc; font-weight: 700; }
                .dsf-badge { padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 10.5px; }
                .dsf-footer { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center; }
                .dsf-sign-line { border-top: 1px solid #475569; margin-top: 35px; padding-top: 4px; font-size: 11px; color: #334155; }
                @media print {
                    body { padding: 10px; font-size: 12px; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            ${area.innerHTML}
        </body>
        </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
        printWin.print();
        printWin.close();
    }, 300);
};

// =================================================================
// 2. PARECER / MATRICIAMENTO INTERPROFISSIONAL FARMACÊUTICO
// =================================================================

window.openParecerModal = function () {
    const modal = document.getElementById("parecer-modal-overlay");
    if (!modal) return;

    const nome = document.getElementById("soap-nome")?.value.trim() || "Paciente";
    const idade = document.getElementById("soap-idade")?.value.trim() || "--";
    const sexo = document.getElementById("soap-sexo")?.value === "F" ? "Feminino" : "Masculino";
    const sub = document.getElementById("soap-s")?.value.trim() || "Paciente em acompanhamento farmacoterapêutico.";
    const conduta = document.getElementById("soap-p")?.value.trim() || "";

    const currentUser = window.USFAuth ? window.USFAuth.getCurrentUser() : null;
    const farmaNome = currentUser ? currentUser.nome : "Farmacêutico(a) da USF";
    const farmaUsf = currentUser ? currentUser.usf : "USF Saúde da Família";

    // Preenche cabeçalho
    const elNome = document.getElementById("parecer-paciente-nome");
    const elIdade = document.getElementById("parecer-paciente-idade");
    const elData = document.getElementById("parecer-data");
    const elFarma = document.getElementById("parecer-farma-nome");
    const elUsf = document.getElementById("parecer-usf-nome");
    const elAssina = document.getElementById("parecer-assinatura-farma");

    if (elNome) elNome.textContent = nome;
    if (elIdade) elIdade.textContent = `${idade} anos (${sexo})`;
    if (elData) elData.textContent = new Date().toLocaleDateString("pt-BR");
    if (elFarma) elFarma.textContent = farmaNome;
    if (elUsf) elUsf.textContent = farmaUsf;
    if (elAssina) elAssina.textContent = farmaNome;

    // Resumo de Alertas Clínicos
    let alertasClinicos = [];
    if (typeof clCrCalculado !== "undefined" && clCrCalculado !== null && clCrCalculado < 60) {
        const drcEst = typeof getDrcEstagio === "function" ? getDrcEstagio(clCrCalculado) : (typeof window.getDrcEstagio === "function" ? window.getDrcEstagio(clCrCalculado) : "DRC");
        alertasClinicos.push(`• <strong>Função Renal Comprometida:</strong> ClCr estimado em ${clCrCalculado} mL/min (${drcEst}). Recomenda-se vigilância ou ajuste de fármacos de excreção renal.`);
    }
    if (typeof fcMedList !== "undefined") {
        const beers = fcMedList.filter(m => m.beersCriteria);
        if (beers.length > 0) {
            beers.forEach(b => {
                alertasClinicos.push(`• <strong>Critério de Beers / Idoso:</strong> Uso de ${b.nome}. Risco de sedação/quedas/efeitos adversos. Alternativa sugerida: ${b.beersAlternativa || "Avaliar desprescrição gradual ou substituição"}.`);
            });
        }
        if (fcMedList.length >= 5) {
            alertasClinicos.push(`• <strong>Polifarmácia Ativa:</strong> Uso simultâneo de ${fcMedList.length} medicamentos contínuos. Elevado risco de interações e cascata iatrogênica.`);
        }
    }
    if (typeof prmList !== "undefined" && prmList.length > 0) {
        prmList.forEach(p => {
            alertasClinicos.push(`• <strong>PRM [${p.classificacao} - ${p.rnm}]:</strong> ${p.medicamento} — ${p.descricao}`);
        });
    }

    const elAlertasBox = document.getElementById("parecer-alertas-content");
    if (elAlertasBox) {
        if (alertasClinicos.length > 0) {
            elAlertasBox.innerHTML = `<ul style="margin: 0; padding-left: 18px; line-height: 1.5; font-size: 12px;">${alertasClinicos.map(a => `<li>${a}</li>`).join("")}</ul>`;
        } else {
            elAlertasBox.innerHTML = `<p style="font-size: 12px; color: var(--text-tertiary); margin: 0;">Nenhum alerta de toxicidade ou PRM grave registrado nesta sessão.</p>`;
        }
    }

    // Campo de Proposta / Conduta Sugerida
    const inputConduta = document.getElementById("parecer-proposta-texto");
    if (inputConduta && !inputConduta.value.trim()) {
        inputConduta.value = conduta || "Solicita-se avaliação médica/multiprofissional para discussão das oportunidades de otimização farmacoterapêutica e adequação posológica.";
    }

    modal.classList.add("active");
    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
};

window.closeParecerModal = function () {
    const modal = document.getElementById("parecer-modal-overlay");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.remove("open");
    }
};

window.copyParecerParaEsus = function () {
    const nome = document.getElementById("parecer-paciente-nome")?.textContent || "Paciente";
    const idade = document.getElementById("parecer-paciente-idade")?.textContent || "--";
    const data = document.getElementById("parecer-data")?.textContent || new Date().toLocaleDateString("pt-BR");
    const farma = document.getElementById("parecer-farma-nome")?.textContent || "Farmacêutico(a)";
    const usf = document.getElementById("parecer-usf-nome")?.textContent || "USF";
    const proposta = document.getElementById("parecer-proposta-texto")?.value.trim() || "";

    const alertasEl = document.getElementById("parecer-alertas-content");
    const alertasText = alertasEl ? alertasEl.innerText.trim() : "";

    const textoParecer = `=== PARECER / MATRICIAMENTO FARMACÊUTICO (e-SUS PEC) ===
Data: ${data} | USF: ${usf}
Profissional Emissor: ${farma}
Paciente: ${nome} (${idade})

[JUSTIFICATIVA & ACHADOS CLÍNICOS]
${alertasText || "Avaliação de rotina em cuidado farmacêutico."}

[PROPOSTA DE CONDUTA / ENCAMINHAMENTO À EQUIPE eSF]
${proposta}
======================================================`;

    navigator.clipboard.writeText(textoParecer).then(() => {
        if (window.showToast) window.showToast("Parecer Farmacêutico copiado com sucesso para o e-SUS PEC!", "success");
        else alert("Parecer Farmacêutico copiado com sucesso!");
    }).catch(() => alert("Erro ao copiar parecer."));
};

window.printParecerDocument = function () {
    const area = document.getElementById("parecer-printable-document");
    if (!area) return;
    const propostaTexto = document.getElementById("parecer-proposta-texto")?.value.trim() || "";
    const elPropostaView = document.getElementById("parecer-proposta-view");
    if (elPropostaView) elPropostaView.textContent = propostaTexto;

    const printWin = window.open("", "", "width=850,height=800");
    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Parecer Farmacêutico / Matriciamento eSF - FarmaUSF</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #0f172a; margin: 0; background: #fff; line-height: 1.5; font-size: 13px; }
                .par-header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px; }
                .par-title { font-size: 16px; font-weight: 800; color: #0284c7; margin: 0; text-transform: uppercase; }
                .par-subtitle { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }
                .par-section { margin-bottom: 16px; }
                .par-section-title { font-size: 12px; font-weight: 700; color: #0f172a; background: #f0f9ff; padding: 6px 10px; border-left: 3px solid #0284c7; margin-bottom: 8px; text-transform: uppercase; }
                .par-footer { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center; }
                .par-sign-line { border-top: 1px solid #475569; margin-top: 40px; padding-top: 4px; font-size: 11px; color: #334155; }
                @media print {
                    body { padding: 10px; font-size: 12px; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            ${area.innerHTML}
        </body>
        </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
        printWin.print();
        printWin.close();
    }, 300);
};

// Inicializa no DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    initEsusDocumentosModule();
});
