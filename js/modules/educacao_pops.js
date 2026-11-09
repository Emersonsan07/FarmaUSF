// =================================================================
// MÓDULO DE EDUCAÇÃO, BIBLIOTECA DE POPS & ESPELHO DE PRODUÇÃO SUS
// FarmaUSF - Farmácia Clínica e Apoio Decisório na Atenção Primária
// =================================================================

function initEducacaoPopsModule() {
    renderPopsList();
    renderVacinasPni("todos");
    setupEspelhoProducao();
}

// =================================================================
// 1. BIBLIOTECA DE POPS DA FARMÁCIA NA APS
// =================================================================

function renderPopsList() {
    const container = document.getElementById("pops-cards-container");
    if (!container || typeof POPS_FARMACIA_APS === "undefined") return;

    container.innerHTML = "";
    POPS_FARMACIA_APS.forEach(pop => {
        const card = document.createElement("div");
        card.className = "card";
        card.style = "padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-secondary); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;";
        card.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 10px; font-weight: 800; color: var(--color-primary); background: rgba(13, 148, 136, 0.12); padding: 2px 6px; border-radius: 4px;">${pop.codigo} · v.${pop.versao}</span>
                    <span style="font-size: 10px; font-weight: 700; color: var(--text-tertiary);">${pop.categoria}</span>
                </div>
                <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: var(--text-primary); line-height: 1.3;">${pop.titulo}</h4>
                <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 8px 0; line-height: 1.4;">${pop.objetivo}</p>
                <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 4px;">
                    <strong>Responsáveis:</strong> ${pop.responsaveis}
                </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 6px;">
                <button type="button" class="btn btn-primary btn-sm" onclick="openPopModal('${pop.id}')" style="flex: 1; font-size: 11.5px; padding: 6px 10px;">
                    <i data-lucide="book-open" style="width: 13px; height: 13px;"></i> Ler Procedimento
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

window.openPopModal = function (popId) {
    if (typeof POPS_FARMACIA_APS === "undefined") return;
    const pop = POPS_FARMACIA_APS.find(p => p.id === popId);
    if (!pop) return;

    const modal = document.getElementById("pop-view-modal-overlay");
    if (!modal) return;

    const elCodigo = document.getElementById("pop-modal-codigo");
    const elTitulo = document.getElementById("pop-modal-titulo");
    const elCat = document.getElementById("pop-modal-cat");
    const elObjetivo = document.getElementById("pop-modal-objetivo");
    const elResp = document.getElementById("pop-modal-resp");
    const elMat = document.getElementById("pop-modal-materiais");
    const elPassos = document.getElementById("pop-modal-passos");

    if (elCodigo) elCodigo.textContent = `${pop.codigo} · Versão ${pop.versao}`;
    if (elTitulo) elTitulo.textContent = pop.titulo;
    if (elCat) elCat.textContent = pop.categoria;
    if (elObjetivo) elObjetivo.textContent = pop.objetivo;
    if (elResp) elResp.textContent = pop.responsaveis;
    if (elMat) elMat.textContent = pop.materiais;

    if (elPassos) {
        elPassos.innerHTML = pop.passoAPasso.map(passo => `
            <li style="margin-bottom: 8px; line-height: 1.45;">${passo}</li>
        `).join("");
    }

    modal.style.display = "flex";
    requestAnimationFrame(() => {
        modal.classList.add("active");
        modal.classList.add("open");
    });
    if (window.lucide) lucide.createIcons();
};

window.closePopModal = function () {
    const modal = document.getElementById("pop-view-modal-overlay");
    if (modal) {
        modal.classList.remove("active");
        modal.classList.remove("open");
        setTimeout(() => {
            modal.style.display = "none";
        }, 150);
    }
};

// Event listener para fechar clicando no fundo escuro
document.addEventListener("DOMContentLoaded", () => {
    const popModal = document.getElementById("pop-view-modal-overlay");
    if (popModal) {
        popModal.addEventListener("click", (e) => {
            if (e.target === popModal) {
                window.closePopModal();
            }
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const m = document.getElementById("pop-view-modal-overlay");
            if (m && (m.classList.contains("open") || m.style.display === "flex")) {
                window.closePopModal();
            }
        }
    });
});

window.printPopDocument = function () {
    const area = document.getElementById("pop-printable-area");
    if (!area) return;
    const printWin = window.open("", "", "width=850,height=800");
    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Procedimento Operacional Padrão - FarmaUSF</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #0f172a; margin: 0; background: #fff; line-height: 1.5; font-size: 13px; }
                h2 { color: #0d9488; margin: 4px 0 10px 0; font-size: 18px; }
                ul, ol { padding-left: 20px; }
                li { margin-bottom: 6px; }
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
// 2. GUIA DE VACINAS DO PNI (CONSULTA RÁPIDA POR CICLO DE VIDA)
// =================================================================

window.renderVacinasPni = function (grupoFiltro = "todos") {
    const container = document.getElementById("vacinas-pni-container");
    if (!container || typeof CALENDARIO_VACINAL_PNI === "undefined") return;

    let grupos = CALENDARIO_VACINAL_PNI;
    if (grupoFiltro && grupoFiltro !== "todos") {
        grupos = grupos.filter(g => g.grupo.toLowerCase().includes(grupoFiltro.toLowerCase()));
    }

    container.innerHTML = "";
    grupos.forEach(g => {
        const groupCard = document.createElement("div");
        groupCard.className = "card";
        groupCard.style = "margin-bottom: 18px; padding: 18px; border-left: 4px solid " + g.cor + ";";

        let vacinasRows = g.vacinas.map(v => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid var(--border-color); font-weight: 700; color: var(--text-primary); font-size: 12px;">${v.nome}</td>
                <td style="padding: 8px; border-bottom: 1px solid var(--border-color); font-size: 11.5px; color: var(--color-primary); font-weight: 600;">${v.idade}</td>
                <td style="padding: 8px; border-bottom: 1px solid var(--border-color); font-size: 11.5px; color: var(--text-secondary);">${v.prevencao}</td>
                <td style="padding: 8px; border-bottom: 1px solid var(--border-color); font-size: 11.5px; font-weight: 600; color: var(--text-primary);">${v.dose}</td>
            </tr>
        `).join("");

        groupCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="background: ${g.cor}20; color: ${g.cor}; padding: 6px; border-radius: 8px; display: inline-flex;">
                    <i data-lucide="${g.icone}" style="width: 18px; height: 18px;"></i>
                </span>
                <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: var(--text-primary);">${g.grupo}</h4>
            </div>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="font-size: 11px; text-transform: uppercase; color: var(--text-tertiary); background: var(--bg-tertiary);">
                            <th style="padding: 6px 8px;">Vacina / Imunobiológico</th>
                            <th style="padding: 6px 8px;">Idade / Período Recomendado</th>
                            <th style="padding: 6px 8px;">Prevenção / Doenças Evitadas</th>
                            <th style="padding: 6px 8px;">Esquema de Doses</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vacinasRows}
                    </tbody>
                </table>
            </div>
        `;
        container.appendChild(groupCard);
    });

    if (window.lucide) lucide.createIcons();
};

// =================================================================
// 3. ESPELHO DE PRODUÇÃO SUS (CONFERÊNCIA e-SUS PEC / SISAB)
// =================================================================

function setupEspelhoProducao() {
    window.atualizarEspelhoProducao = function () {
        const saved = JSON.parse(localStorage.getItem("cim_consultas")) || [];
        
        let totalConsultas = saved.length;
        let totalVDF = saved.filter(c => c.tipoAtendimento && c.tipoAtendimento.includes("VDF")).length;
        let totalAmbulatorial = totalConsultas - totalVDF;
        let totalGlicemia = saved.filter(c => c.glicemia !== null && c.glicemia !== undefined && c.glicemia > 0).length;
        let totalPA = saved.filter(c => c.paSistolica !== null && c.paSistolica !== undefined && c.paSistolica > 0).length;
        let totalPrmIdentificados = saved.filter(c => c.prm && c.prm !== "Nenhum PRM Identificado").length;

        const elConsultas = document.getElementById("espelho-kpi-consultas");
        const elVdf = document.getElementById("espelho-kpi-vdf");
        const elGlicemia = document.getElementById("espelho-kpi-glicemia");
        const elPA = document.getElementById("espelho-kpi-pa");
        const elPrms = document.getElementById("espelho-kpi-prms");

        if (elConsultas) elConsultas.textContent = totalConsultas;
        if (elVdf) elVdf.textContent = totalVDF;
        if (elGlicemia) elGlicemia.textContent = totalGlicemia;
        if (elPA) elPA.textContent = totalPA;
        if (elPrms) elPrms.textContent = totalPrmIdentificados;
    };

    window.atualizarEspelhoProducao();
}

window.exportarEspelhoProducaoRelatorio = function () {
    const saved = JSON.parse(localStorage.getItem("cim_consultas")) || [];
    if (saved.length === 0) {
        alert("Nenhum atendimento registrado no histórico para gerar o espelho de produção.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID;Data;Paciente;Idade;Sexo;Tipo_Atendimento;Codigo_SIGTAP;PA_Sistolica;PA_Diastolica;Glicemia_mgdL;PRM;Conduta\n";

    saved.forEach(c => {
        const sigtap = c.tipoAtendimento && c.tipoAtendimento.includes("VDF") ? "01.01.02.003-1" : "01.01.01.003-6";
        const row = [
            c.id || "",
            c.data || "",
            `"${(c.paciente || "").replace(/"/g, '""')}"`,
            c.idade || "",
            c.sexo || "",
            `"${c.tipoAtendimento || "Consulta USF"}"`,
            sigtap,
            c.paSistolica || "",
            c.paDiastolica || "",
            c.glicemia || "",
            `"${(c.prm || "Nenhum").replace(/"/g, '""')}"`,
            `"${(c.conduta || "").replace(/"/g, '""')}"`
        ];
        csvContent += row.join(";") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `espelho_producao_farmacia_sus_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.switchEducacaoTab = function (tabName) {
    const tabBtns = document.querySelectorAll(".edu-nav-tab-btn");
    const tabPanels = document.querySelectorAll(".edu-tab-panel");

    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    tabPanels.forEach(panel => {
        if (panel.id === `edu-panel-${tabName}`) {
            panel.style.display = "block";
        } else {
            panel.style.display = "none";
        }
    });

    if (window.lucide) lucide.createIcons();
};

// Inicializa no DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    initEducacaoPopsModule();
});

