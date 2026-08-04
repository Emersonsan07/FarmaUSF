// =================================================================
// MÓDULO DE PROTOCOLOS E FLUXOGRAMAS DE DECISÃO CLÍNICA INTERATIVOS
// =================================================================

function initProtocolsSection() {
    let currentProtocol = "hipertensao";
    let activeProtoViewTab = "flow"; // 'flow' ou 'summary'

    // Trocar entre as abas: Fluxograma vs Resumo das Diretrizes
    window.switchProtocolView = function (tabName) {
        activeProtoViewTab = tabName;
        const btnFlow = document.getElementById("btn-tab-flow");
        const btnSummary = document.getElementById("btn-tab-summary");
        const areaFlow = document.getElementById("protocol-flow-view");
        const areaSummary = document.getElementById("protocol-summary-view");

        if (btnFlow && btnSummary && areaFlow && areaSummary) {
            if (tabName === "flow") {
                btnFlow.classList.add("active");
                btnSummary.classList.remove("active");
                areaFlow.style.display = "grid";
                areaSummary.style.display = "none";
                renderFlowchart(currentProtocol, "inicio");
            } else {
                btnSummary.classList.add("active");
                btnFlow.classList.remove("active");
                areaSummary.style.display = "block";
                areaFlow.style.display = "none";
                renderProtocolSummaries();
            }
        }
    };

    // Renderizar resumo de diretrizes em cards
    function renderProtocolSummaries() {
        const areaResumo = document.getElementById("protocol-summary-cards-grid");
        if (!areaResumo || typeof PROTOCOLOS === "undefined") return;

        areaResumo.innerHTML = "";
        PROTOCOLOS.forEach(p => {
            const card = document.createElement("div");
            card.className = "proto-summary-card";
            card.innerHTML = `
                <div class="proto-summary-badge">${p.categoria}</div>
                <h4>${p.titulo}</h4>
                <p>${p.resumo}</p>
                <div class="proto-summary-meta">
                    <strong>Metas Terapêuticas:</strong> ${p.metas}
                </div>
                <div class="proto-summary-meta">
                    <strong>1ª Linha Farmacológica:</strong> ${p.primeiraLinha}
                </div>
                <div style="margin-top: 10px;">
                    <a href="${p.linkOficial}" target="_blank" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px; font-size: 11px;">
                        <i data-lucide="external-link" style="width: 13px; height: 13px;"></i> Diretriz / Documento Oficial
                    </a>
                </div>
            `;
            areaResumo.appendChild(card);
        });
        if (window.lucide) lucide.createIcons();
    }

    // Selecionar o protocolo nos botões superiores
    window.selectProtocol = function (protoId) {
        currentProtocol = protoId;
        document.querySelectorAll(".proto-select-btn").forEach(btn => {
            const flowVal = btn.dataset.flow || btn.dataset.proto;
            if (flowVal === protoId) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        if (activeProtoViewTab === "flow") {
            renderFlowchart(protoId, "inicio");
        }
    };

    // Adicionar event listeners para os botões de seleção de protocolo (.proto-select-btn)
    document.querySelectorAll(".proto-select-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const protoId = btn.dataset.flow || btn.dataset.proto;
            if (protoId) selectProtocol(protoId);
        });
    });

    // Renderizar a etapa do fluxograma
    function renderFlowchart(protoId, passoKey) {
        const titleEl = document.getElementById("flow-title");
        const container = document.getElementById("flow-body-container");
        if (!titleEl || !container || typeof FLUXOGRAMAS === "undefined") return;

        const fluxData = FLUXOGRAMAS[protoId];
        if (!fluxData) return;

        titleEl.textContent = fluxData.titulo;
        const passo = fluxData.passos[passoKey];

        if (!passo) return;

        if (passo.final) {
            let bgStyle = "background: var(--bg-secondary); border-left: 4px solid var(--color-primary);";
            let icon = "check-circle-2";
            let iconColor = "var(--color-primary)";

            if (passo.tipo === "success") {
                bgStyle = "background: rgba(16, 185, 129, 0.1); border-left: 5px solid var(--success-color); color: var(--text-primary);";
                icon = "check-circle";
                iconColor = "var(--success-color)";
            } else if (passo.tipo === "warning") {
                bgStyle = "background: rgba(245, 158, 11, 0.1); border-left: 5px solid var(--warning-color); color: var(--text-primary);";
                icon = "alert-triangle";
                iconColor = "var(--warning-color)";
            } else if (passo.tipo === "danger") {
                bgStyle = "background: rgba(239, 68, 68, 0.1); border-left: 5px solid var(--danger-color); color: var(--text-primary);";
                icon = "alert-octagon";
                iconColor = "var(--danger-color)";
            }

            container.innerHTML = `
                <div style="${bgStyle} padding: 24px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); animation: fadeIn 0.3s ease;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <i data-lucide="${icon}" style="width: 28px; height: 28px; color: ${iconColor}; flex-shrink: 0;"></i>
                        <h3 style="font-size: 18px; font-weight: 700; margin: 0; color: var(--text-primary);">${passo.titulo}</h3>
                    </div>
                    <div style="font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px;">
                        <strong>Conduta Terapêutica Recomendada:</strong><br>
                        ${passo.conduta}
                    </div>
                    <button class="btn btn-secondary" onclick="renderFlowchart('${protoId}', 'inicio')">
                        <i data-lucide="rotate-ccw" style="width: 16px; height: 16px;"></i> Reiniciar Decisão Clínica
                    </button>
                </div>
            `;
        } else {
            let optionsHtml = "";
            passo.opcoes.forEach(opt => {
                optionsHtml += `
                    <button class="btn btn-primary" style="padding: 12px 24px; font-size: 14px; justify-content: center;" onclick="renderFlowchart('${protoId}', '${opt.proximo}')">
                        ${opt.texto} <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
                    </button>
                `;
            });

            container.innerHTML = `
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 24px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); animation: fadeIn 0.3s ease;">
                    <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px;">
                        <div style="background: var(--color-primary-light); color: var(--color-primary-dark); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700;">
                            ?
                        </div>
                        <div>
                            <h4 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: var(--text-primary);">Avaliação Clínica:</h4>
                            <p style="font-size: 15px; color: var(--text-secondary); margin: 0; line-height: 1.5;">${passo.pergunta}</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        }

        if (window.lucide) lucide.createIcons();
    }

    // Expor função globalmente
    window.renderFlowchart = renderFlowchart;

    // Inicialização
    selectProtocol("hipertensao");
}
