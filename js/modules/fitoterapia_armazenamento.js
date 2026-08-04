// =================================================================
// MÓDULO DE FITOTERAPIA DO SUS & CHECKLIST DE ARMAZENAMENTO DOMICILIAR
// FarmaUSF - Residência Multiprofissional UEMS/SESAU
// =================================================================

(function () {
    "use strict";

    // -------------------------------------------------------------
    // 1. GUIA INTERATIVO DE FITOTERAPIA & PLANTAS MEDICINAIS
    // -------------------------------------------------------------
    window.renderFitoterapiaGuia = function (containerId, filterCategory = "todas", searchTerm = "") {
        const container = document.getElementById(containerId);
        if (!container || !window.PLANTAS_MEDICINAIS_SUS) return;

        let plantas = window.PLANTAS_MEDICINAIS_SUS;

        // Filtrar por Categoria
        if (filterCategory && filterCategory !== "todas") {
            plantas = plantas.filter(p => p.categoria.toLowerCase() === filterCategory.toLowerCase());
        }

        // Filtrar por Termo de Busca
        if (searchTerm && searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase().trim();
            plantas = plantas.filter(p =>
                p.nomePopular.toLowerCase().includes(term) ||
                p.nomeCientifico.toLowerCase().includes(term) ||
                p.indicacoes.toLowerCase().includes(term) ||
                p.interacoesRisco.toLowerCase().includes(term)
            );
        }

        if (plantas.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card" style="padding: 30px; text-align: center;">
                    <i data-lucide="search-x" style="width: 36px; height: 36px; color: var(--text-tertiary);"></i>
                    <h4 style="margin: 8px 0 4px 0; font-size: 15px; color: var(--text-primary);">Nenhuma planta medicinal encontrada</h4>
                    <p style="font-size: 12px; color: var(--text-secondary);">Tente buscar por termos como "gastrite", "ansiedade", "tosse" ou o nome popular/científico.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">';

        plantas.forEach(p => {
            let badgeBg = "rgba(16, 185, 129, 0.1)";
            let badgeColor = "#10b981";
            let alertBorder = "1px solid var(--border-color)";

            if (p.nivelAlerta === "grave") {
                badgeBg = "rgba(225, 29, 72, 0.12)";
                badgeColor = "var(--danger-color)";
                alertBorder = "1px solid rgba(225, 29, 72, 0.3)";
            } else if (p.nivelAlerta === "moderado") {
                badgeBg = "rgba(234, 88, 12, 0.12)";
                badgeColor = "var(--warning-color)";
                alertBorder = "1px solid rgba(234, 88, 12, 0.3)";
            }

            html += `
                <div class="card fito-card" style="padding: 16px; border: ${alertBorder}; border-radius: var(--radius-md); background: var(--bg-secondary); display: flex; flex-direction: column; justify-content: space-between; gap: 12px; transition: var(--transition);">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
                            <div>
                                <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: var(--text-primary); font-family: 'Outfit', sans-serif;">${p.nomePopular}</h4>
                                <span style="font-size: 11px; font-style: italic; color: var(--text-tertiary); display: block;">${p.nomeCientifico}</span>
                            </div>
                            <span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; font-size: 10px; font-weight: 700; border-radius: var(--radius-full); padding: 3px 8px; flex-shrink: 0;">
                                ${p.categoria}
                            </span>
                        </div>

                        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.4;">
                            <strong>Indicação Clínica:</strong> ${p.indicacoes}
                        </div>

                        <div style="background: var(--bg-tertiary); padding: 8px 10px; border-radius: var(--radius-sm); font-size: 11px; margin-bottom: 8px; border: 1px solid var(--border-color);">
                            <span style="color: var(--color-primary); font-weight: 700;">☕ Preparo (${p.partesUsadas}):</span>
                            <p style="margin: 2px 0 0 0; color: var(--text-secondary);">${p.metodoPreparo}</p>
                            <span style="display: block; margin-top: 4px; font-weight: 600; color: var(--text-primary);">Posologia: ${p.posologia}</span>
                        </div>

                        ${p.interacoesRisco ? `
                            <div style="background: ${badgeBg}; border-left: 3px solid ${badgeColor}; padding: 6px 10px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 11px; color: var(--text-primary);">
                                <strong style="color: ${badgeColor}; display: flex; align-items: center; gap: 4px;">
                                    <i data-lucide="alert-triangle" style="width: 12px; height: 12px;"></i> Interação / Alerta:
                                </strong>
                                <p style="margin: 2px 0 0 0; line-height: 1.3;">${p.interacoesRisco}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div style="font-size: 10px; color: var(--text-tertiary); border-top: 1px solid var(--border-color); padding-top: 6px; text-align: right;">
                        Fonte: Memento de Fitoterápicos ANVISA / SUS
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
        if (window.lucide) lucide.createIcons();
    };

    // Abre o Modal do Guia Completo de Fitoterapia
    window.openFitoterapiaModal = function () {
        const modal = document.getElementById("fitoterapia-modal-overlay");
        if (!modal) return;
        modal.style.display = "flex";
        modal.classList.add("active");
        window.renderFitoterapiaGuia("fitoterapia-modal-grid", "todas", "");
    };

    window.closeFitoterapiaModal = function () {
        const modal = document.getElementById("fitoterapia-modal-overlay");
        if (modal) {
            modal.classList.remove("active");
            modal.style.display = "none";
        }
    };

    // -------------------------------------------------------------
    // 2. CHECKLIST DE CONSERVAÇÃO E ARMAZENAMENTO DOMICILIAR
    // -------------------------------------------------------------
    window.calcularChecklistArmazenamento = function () {
        const checkboxes = document.querySelectorAll(".chk-armazenamento-item");
        if (!checkboxes || checkboxes.length === 0) return;

        let totalScore = 100;
        let riscosIdentificados = [];
        let praticasBoas = [];

        checkboxes.forEach(cb => {
            const peso = parseInt(cb.getAttribute("data-peso") || "0");
            const label = cb.getAttribute("data-label") || "";
            const recomendacao = cb.getAttribute("data-rec") || "";

            if (cb.checked) {
                if (peso < 0) {
                    totalScore += peso; // subtrai risco
                    riscosIdentificados.push({ label, recomendacao, gravidade: Math.abs(peso) });
                } else {
                    praticasBoas.push(label);
                }
            }
        });

        // Garantir score entre 0 e 100
        totalScore = Math.max(0, Math.min(100, totalScore));

        // Elementos de tela
        const scoreVal = document.getElementById("arm-score-value");
        const scoreBadge = document.getElementById("arm-score-badge");
        const scoreBar = document.getElementById("arm-score-bar-fill");
        const resultBox = document.getElementById("arm-result-box");
        const parecerText = document.getElementById("arm-parecer-texto");

        if (scoreVal) scoreVal.textContent = `${totalScore}%`;

        let statusText = "Excelente / Seguro";
        let statusColor = "var(--success-color)";
        let barColor = "var(--success-color)";

        if (totalScore < 50) {
            statusText = "Risco Crítico / Armazenamento Inadequado";
            statusColor = "var(--danger-color)";
            barColor = "var(--danger-color)";
        } else if (totalScore < 80) {
            statusText = "Risco Moderado / Necessita Ajustes";
            statusColor = "var(--warning-color)";
            barColor = "var(--warning-color)";
        }

        if (scoreBadge) {
            scoreBadge.textContent = statusText;
            scoreBadge.style.color = statusColor;
            scoreBadge.style.background = (totalScore < 50) ? "rgba(225,29,72,0.12)" : (totalScore < 80 ? "rgba(234,88,12,0.12)" : "rgba(16,185,129,0.12)");
        }

        if (scoreBar) {
            scoreBar.style.width = `${totalScore}%`;
            scoreBar.style.backgroundColor = barColor;
        }

        // Construir Parecer de Orientação
        let parecer = `[AUDITORIA DE ARMAZENAMENTO DOMICILIAR DE MEDICAMENTOS]\n`;
        parecer += `Pontuação de Segurança: ${totalScore}% (${statusText})\n`;
        parecer += `Data da Avaliação: ${new Date().toLocaleDateString("pt-BR")}\n\n`;

        if (riscosIdentificados.length > 0) {
            parecer += `⚠️ ALERTAS E RISCOS IDENTIFICADOS NO DOMICÍLIO:\n`;
            riscosIdentificados.forEach(r => {
                parecer += `- ${r.label}\n  -> Orientação: ${r.recomendacao}\n`;
            });
            parecer += `\n`;
        } else {
            parecer += `✓ NENHUM RISCO CRÍTICO IDENTIFICADO: O paciente armazena seus medicamentos de acordo com as boas práticas sanitárias da Atenção Primária.\n\n`;
        }

        parecer += `📋 ORIENTAÇÕES GERAIS FORNECIDAS AO PACIENTE:\n`;
        parecer += `1. Manter remédios em local seco, arejado e protegido da luz solar direta.\n`;
        parecer += `2. Nunca guardar medicamentos no banheiro (umidade) ou perto do fogão (calor).\n`;
        parecer += `3. Insulinas abertas: manter em temp. ambiente (< 30°C) por até 28 dias. Lacradas: na geladeira (2°C a 8°C - nunca no congelador!).\n`;
        parecer += `4. Manter sempre fora do alcance de crianças e animais.\n`;

        if (parecerText) parecerText.textContent = parecer;
        if (resultBox) resultBox.style.display = "block";
    };

    window.openArmazenamentoModal = function () {
        const modal = document.getElementById("armazenamento-modal-overlay");
        if (!modal) return;
        modal.style.display = "flex";
        modal.classList.add("active");
        window.calcularChecklistArmazenamento();
    };

    window.closeArmazenamentoModal = function () {
        const modal = document.getElementById("armazenamento-modal-overlay");
        if (modal) {
            modal.classList.remove("active");
            modal.style.display = "none";
        }
    };

    window.copiarParecerArmazenamento = function (btn) {
        const text = document.getElementById("arm-parecer-texto")?.textContent;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px;"></i> Copiado!`;
                setTimeout(() => { btn.innerHTML = originalHTML; if (window.lucide) lucide.createIcons(); }, 2000);
            } else {
                alert("Parecer copiado para a área de transferência!");
            }
        });
    };

    window.inserirParecerArmazenamentoNoSOAP = function () {
        const text = document.getElementById("arm-parecer-texto")?.textContent;
        if (!text) return;
        if (typeof window.sendResultToSOAP === "function") {
            window.sendResultToSOAP(text);
            window.closeArmazenamentoModal();
        } else {
            alert("Abra a aba de Consulta SOAP para colar o parecer.");
        }
    };

})();
