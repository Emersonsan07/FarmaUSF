// =================================================================
// MÓDULO DE TESTES RÁPIDOS POINT-OF-CARE & CALENDÁRIO DE RENOVAÇÃO
// Registro Sanitário (RDC Anvisa), Interpretação Clínica e Laudos SUS
// =================================================================

let testesRealizadosList = [];

function initTestesRapidosModule() {
    renderSelectTestesCatalogo();
    setupCalculadoraRenovacao();
}

// Popula o select de catálogo de testes rápidos no Passo 1
function renderSelectTestesCatalogo() {
    const select = document.getElementById("tr-select-tipo");
    if (!select || typeof CATALOGO_TESTES_RAPIDOS === "undefined") return;

    select.innerHTML = '<option value="" disabled selected>Selecione o teste rápido...</option>';
    CATALOGO_TESTES_RAPIDOS.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = `[${t.categoria}] ${t.nome}`;
        select.appendChild(opt);
    });

    select.addEventListener("change", onSelectTesteChange);
}

function onSelectTesteChange() {
    const select = document.getElementById("tr-select-tipo");
    const testId = select ? select.value : "";
    const teste = (typeof CATALOGO_TESTES_RAPIDOS !== "undefined") ? CATALOGO_TESTES_RAPIDOS.find(t => t.id === testId) : null;
    if (!teste) return;

    const areaValores = document.getElementById("tr-inputs-valores-area");
    if (!areaValores) return;

    if (teste.tipoResultado === "numerico") {
        let extraOptions = "";
        if (teste.id === "glicemia_capilar") {
            extraOptions = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 11px; font-weight: 600;">Condição de Coleta:</label>
                    <select id="tr-input-condicao" class="slot-input" style="font-size: 12px; padding: 6px; width: 100%;">
                        <option value="jejum">Jejum (≥ 8h)</option>
                        <option value="pos_prandial">Casual / Pós-Prandial (2h após refeição)</option>
                    </select>
                </div>
            `;
        }
        areaValores.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 11px; font-weight: 600;">Resultado Numérico (${teste.unidade}):</label>
                    <input type="number" id="tr-input-valor-num" step="0.1" placeholder="Ex: ${teste.id === 'hba1c_poc' ? '6.5' : '110'}" class="slot-input" style="font-size: 12px; padding: 6px; width: 100%; font-weight: 700;">
                </div>
                ${extraOptions}
            </div>
        `;
    } else if (teste.tipoResultado === "lipideos") {
        areaValores.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 10.5px; font-weight: 600;">Colesterol Total (mg/dL):</label>
                    <input type="number" id="tr-input-col-total" placeholder="Ex: 210" class="slot-input" style="font-size: 12px; padding: 6px; width: 100%; font-weight: 700;">
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 10.5px; font-weight: 600;">Triglicerídeos (mg/dL):</label>
                    <input type="number" id="tr-input-triglic" placeholder="Ex: 160" class="slot-input" style="font-size: 12px; padding: 6px; width: 100%;">
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 10.5px; font-weight: 600;">HDL-c (mg/dL):</label>
                    <input type="number" id="tr-input-hdl" placeholder="Ex: 45" class="slot-input" style="font-size: 12px; padding: 6px; width: 100%;">
                </div>
            </div>
        `;
    } else {
        // Qualitativo (Reagente / Não Reagente)
        let optionsHtml = `
            <option value="Não Reagente">Não Reagente (Negativo)</option>
            <option value="Reagente">Reagente (Positivo)</option>
            <option value="Inconclusivo">Inconclusivo / Repetir</option>
        `;
        if (teste.id === "tr_dengue") {
            optionsHtml = `
                <option value="Não Reagente">Não Reagente</option>
                <option value="Reagente NS1 / IgM">Reagente para Antígeno NS1 / IgM (Fase Aguda)</option>
                <option value="Reagente IgG">Reagente apenas para IgG (Infecção Prévia)</option>
                <option value="Inconclusivo">Inconclusivo</option>
            `;
        }
        if (teste.id === "tr_chikungunya") {
            optionsHtml = `
                <option value="Não Reagente">Não Reagente</option>
                <option value="Reagente IgM (Fase Aguda)">Reagente IgM — Infecção Aguda (≥ 3º dia de sintomas)</option>
                <option value="Reagente IgG (Infecção Prévia)">Reagente IgG — Infecção Prévia / Imunidade Adquirida</option>
                <option value="Inconclusivo">Inconclusivo</option>
            `;
        }
        areaValores.innerHTML = `
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 11px; font-weight: 600;">Leitura do Dispositivo:</label>
                <select id="tr-input-qualitativo" class="slot-input" style="font-size: 12px; padding: 6px; width: 100%; font-weight: 700;">
                    ${optionsHtml}
                </select>
            </div>
        `;
    }
}

// Adiciona um teste rápido à lista da consulta
window.adicionarTesteRapido = function () {
    const select = document.getElementById("tr-select-tipo");
    const testId = select ? select.value : "";
    const teste = (typeof CATALOGO_TESTES_RAPIDOS !== "undefined") ? CATALOGO_TESTES_RAPIDOS.find(t => t.id === testId) : null;
    if (!teste) {
        alert("Por favor, selecione o tipo de teste rápido.");
        return;
    }

    const lote = document.getElementById("tr-input-lote")?.value.trim() || "LOTE-PADRÃO-SUS";
    const validade = document.getElementById("tr-input-validade")?.value || "";
    const fabricante = document.getElementById("tr-input-fabricante")?.value.trim() || "Biomanguinhos / Ministério da Saúde";

    let resultadoFormatado = "";
    let interpretacaoObj = { status: "", cor: "neutral", orientacao: "" };

    if (teste.tipoResultado === "numerico") {
        const val = document.getElementById("tr-input-valor-num")?.value.trim();
        if (!val) { alert("Informe o valor numérico obtido no teste."); return; }
        const cond = document.getElementById("tr-input-condicao")?.value || "jejum";
        interpretacaoObj = teste.interpretar(val, cond);
        resultadoFormatado = `${val} ${teste.unidade} (${cond === 'jejum' ? 'Jejum' : 'Pós-prandial'})`;

        // Se for glicemia capilar, já preenche automaticamente o campo principal de glicemia do SOAP
        if (teste.id === "glicemia_capilar") {
            const inputGli = document.getElementById("soap-glicemia");
            if (inputGli) {
                inputGli.value = val;
                if (typeof window.recalculateVitalsInStep1 === "function") window.recalculateVitalsInStep1();
            }
        }
    } else if (teste.tipoResultado === "lipideos") {
        const ct = document.getElementById("tr-input-col-total")?.value.trim();
        const tg = document.getElementById("tr-input-triglic")?.value.trim() || "--";
        const hdl = document.getElementById("tr-input-hdl")?.value.trim() || "--";
        if (!ct) { alert("Informe pelo menos o valor do Colesterol Total."); return; }
        interpretacaoObj = teste.interpretar(ct, tg, hdl);
        resultadoFormatado = `CT: ${ct} mg/dL | TG: ${tg} mg/dL | HDL: ${hdl} mg/dL`;
    } else {
        const qual = document.getElementById("tr-input-qualitativo")?.value;
        interpretacaoObj = teste.interpretar(qual);
        resultadoFormatado = qual;
    }

    testesRealizadosList.push({
        id: Date.now(),
        tipoId: teste.id,
        nome: teste.nome,
        categoria: teste.categoria,
        sigtap: teste.sigtap,
        ciap2: teste.ciap2,
        resultado: resultadoFormatado,
        status: interpretacaoObj.status,
        badgeColor: interpretacaoObj.badge || "#10b981",
        orientacao: interpretacaoObj.orientacao,
        lote: lote,
        validade: validade,
        fabricante: fabricante,
        dataHora: new Date().toLocaleString("pt-BR")
    });

    renderTestesRealizadosList();
    if (typeof window.updateFormattedText === "function") window.updateFormattedText();
    if (window.showToast) window.showToast(`Teste de ${teste.nome} registrado com sucesso!`, "success");
};

// Renderiza a lista de testes rápidos aplicados nesta consulta
function renderTestesRealizadosList() {
    const container = document.getElementById("tr-realizados-list-container");
    if (!container) return;

    if (testesRealizadosList.length === 0) {
        container.innerHTML = `<p style="font-size: 11px; color: var(--text-tertiary); text-align: center; margin: 8px 0;">Nenhum teste rápido registrado nesta consulta.</p>`;
        return;
    }

    container.innerHTML = "";
    testesRealizadosList.forEach((t, idx) => {
        const item = document.createElement("div");
        item.style = "background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px; margin-bottom: 8px; font-size: 12px;";
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <div>
                    <span style="font-size: 10px; font-weight: 700; color: var(--color-primary); text-transform: uppercase;">[${t.categoria}] SIGTAP: ${t.sigtap}</span>
                    <h5 style="margin: 2px 0 0 0; font-size: 13px; font-weight: 700; color: var(--text-primary);">${t.nome}</h5>
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <span style="background: ${t.badgeColor}20; color: ${t.badgeColor}; font-weight: 700; font-size: 10.5px; padding: 2px 8px; border-radius: 4px; border: 1px solid ${t.badgeColor}40;">
                        ${t.resultado}
                    </span>
                    <button type="button" onclick="removerTesteRapido(${idx})" style="background: transparent; border: none; color: var(--danger-color); cursor: pointer; padding: 2px;" title="Remover Teste">
                        <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                    </button>
                </div>
            </div>
            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">
                <strong>Interpretação:</strong> ${t.status}
            </div>
            <div style="font-size: 10.5px; color: #64748b; background: var(--bg-tertiary); padding: 4px 6px; border-radius: 4px; margin-bottom: 4px;">
                <em>Conduta: ${t.orientacao}</em>
            </div>
            <div style="font-size: 10px; color: var(--text-tertiary); display: flex; gap: 10px;">
                <span>Lote: <strong>${t.lote}</strong></span>
                <span>Val: <strong>${t.validade || 'Conforme kit'}</strong></span>
                <span>Fab: <strong>${t.fabricante}</strong></span>
            </div>
        `;
        container.appendChild(item);
    });

    if (window.lucide) lucide.createIcons();
}

window.removerTesteRapido = function (idx) {
    testesRealizadosList.splice(idx, 1);
    renderTestesRealizadosList();
    if (typeof window.updateFormattedText === "function") window.updateFormattedText();
};

// Retorna o bloco textual dos testes rápidos para inclusão no [O] Objetivo do SOAP
window.getTestesRapidosSoapText = function () {
    if (testesRealizadosList.length === 0) return "";
    const items = testesRealizadosList.map(t => {
        return `• [TESTE RÁPIDO POINT-OF-CARE] ${t.nome}: ${t.resultado} (${t.status}) | SIGTAP: ${t.sigtap} | Lote: ${t.lote}`;
    });
    return "\n" + items.join("\n");
};

// =================================================================
// 2. LAUDO / DECLARAÇÃO DE TESTES RÁPIDOS POINT-OF-CARE (PDF)
// =================================================================

window.openLaudoTestesModal = function () {
    if (testesRealizadosList.length === 0) {
        alert("Registre pelo menos um teste rápido antes de gerar o laudo point-of-care.");
        return;
    }
    const modal = document.getElementById("laudo-testes-modal-overlay");
    if (!modal) return;

    const nome = document.getElementById("soap-nome")?.value.trim() || "Cidadão(ã) / Usuário(a) SUS";
    const idade = document.getElementById("soap-idade")?.value.trim() || "--";
    const sexo = document.getElementById("soap-sexo")?.value === "F" ? "Feminino" : "Masculino";

    const currentUser = window.USFAuth ? window.USFAuth.getCurrentUser() : null;
    const farmaNome = currentUser ? currentUser.nome : "Farmacêutico(a) Responsável";
    const farmaUsf = currentUser ? currentUser.usf : "USF Saúde da Família";

    const elNome = document.getElementById("laudo-paciente-nome");
    const elIdade = document.getElementById("laudo-paciente-idade");
    const elData = document.getElementById("laudo-data-emissao");
    const elFarma = document.getElementById("laudo-farma-nome");
    const elUsf = document.getElementById("laudo-usf-nome");
    const elAssina = document.getElementById("laudo-assinatura-farma");

    if (elNome) elNome.textContent = nome;
    if (elIdade) elIdade.textContent = `${idade} anos (${sexo})`;
    if (elData) elData.textContent = new Date().toLocaleDateString("pt-BR");
    if (elFarma) elFarma.textContent = farmaNome;
    if (elUsf) elUsf.textContent = farmaUsf;
    if (elAssina) elAssina.textContent = farmaNome;

    const tbody = document.getElementById("laudo-testes-tbody");
    if (tbody) {
        tbody.innerHTML = testesRealizadosList.map(t => `
            <tr>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">
                    <strong>${t.nome}</strong><br>
                    <small style="color: #64748b;">SIGTAP: ${t.sigtap}</small>
                </td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: 700; color: ${t.badgeColor};">
                    ${t.resultado}
                </td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 11px;">
                    <strong>${t.status}</strong><br>
                    <span style="color: #475569;">${t.orientacao}</span>
                </td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 10px; color: #475569;">
                    Lote: ${t.lote}<br>
                    Fab: ${t.fabricante}
                </td>
            </tr>
        `).join("");
    }

    modal.classList.add("active");
    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
};

window.closeLaudoTestesModal = function () {
    const modal = document.getElementById("laudo-testes-modal-overlay");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.remove("open");
    }
};

window.printLaudoTestesDocument = function () {
    const area = document.getElementById("laudo-testes-printable-document");
    if (!area) return;
    const printWin = window.open("", "", "width=850,height=800");
    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Laudo de Testes Rápidos Point-of-Care - FarmaUSF</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #0f172a; margin: 0; background: #fff; line-height: 1.45; font-size: 13px; }
                table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11.5px; }
                th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
                th { background: #f8fafc; font-weight: 700; }
                @media print { body { padding: 10px; font-size: 12px; } }
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
// 3. CALCULADORA DE PREVISÃO DE TÉRMINO & RENOVAÇÃO DE RECEITAS
// =================================================================

function setupCalculadoraRenovacao() {
    const inputQtd = document.getElementById("fc-qtd-dispensada");
    const posManha = document.getElementById("fc-pos-manha");
    const posTarde = document.getElementById("fc-pos-tarde");
    const posNoite = document.getElementById("fc-pos-noite");

    function calcularPrevisao() {
        const qtd = parseFloat(inputQtd?.value) || 0;
        const m = parseFloat(posManha?.value) || 0;
        const t = parseFloat(posTarde?.value) || 0;
        const n = parseFloat(posNoite?.value) || 0;
        const totalDiario = m + t + n;

        const badgeDias = document.getElementById("fc-previsao-dias-badge");
        const badgeData = document.getElementById("fc-previsao-data-badge");

        if (qtd > 0 && totalDiario > 0) {
            const diasDuracao = Math.floor(qtd / totalDiario);
            const dataFim = new Date();
            dataFim.setDate(dataFim.getDate() + diasDuracao);

            if (badgeDias) badgeDias.textContent = `Duração: ${diasDuracao} dias`;
            if (badgeData) badgeData.textContent = `Término previsto: ${dataFim.toLocaleDateString('pt-BR')}`;
            const wrap = document.getElementById("fc-previsao-wrap");
            if (wrap) wrap.style.display = "flex";
        } else {
            const wrap = document.getElementById("fc-previsao-wrap");
            if (wrap) wrap.style.display = "none";
        }
    }

    [inputQtd, posManha, posTarde, posNoite].forEach(el => {
        if (el) {
            el.addEventListener("input", calcularPrevisao);
            el.addEventListener("change", calcularPrevisao);
        }
    });
}

// Inicializa no DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    initTestesRapidosModule();
});
