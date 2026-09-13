// =================================================================
// MÓDULO DE CALCULADORAS CLÍNICAS, FARMACOVIGILÂNCIA E EDUCAÇÃO
// =================================================================

function initCalculatorsSection() {
    // Sistema de Histórico da Sessão
    const sessionCalcHistory = [];
    const historyListContainer = document.getElementById("calc-history-list");
    const btnClearHistory = document.getElementById("btn-clear-calc-history");

    function addCalcToHistory(title, mainVal, fullText) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        sessionCalcHistory.unshift({ title, mainVal, fullText, timestamp });
        if (sessionCalcHistory.length > 15) sessionCalcHistory.pop();
        renderCalcHistory();
    }

    function renderCalcHistory() {
        if (!historyListContainer) return;
        if (sessionCalcHistory.length === 0) {
            historyListContainer.innerHTML = `
                <div style="font-size: 12px; color: var(--text-tertiary); text-align: center; padding: 12px;">
                    Nenhum cálculo realizado nesta sessão ainda.
                </div>
            `;
            return;
        }

        historyListContainer.innerHTML = sessionCalcHistory.map((item, idx) => `
            <div class="calc-history-item calc-pop-anim">
                <div>
                    <strong style="color: var(--text-primary);">${item.title}</strong>
                    <span style="color: var(--color-primary); font-weight: 700; margin-left: 6px;">${item.mainVal}</span>
                    <span style="font-size: 10px; color: var(--text-tertiary); margin-left: 8px;">(${item.timestamp})</span>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 11px;" onclick="window.copyToClipboardText('${item.fullText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width: 12px; height: 12px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" style="padding: 2px 6px; font-size: 11px;" onclick="window.sendResultToSOAP('${item.fullText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width: 12px; height: 12px;"></i> SOAP
                    </button>
                </div>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
    }

    if (btnClearHistory) {
        btnClearHistory.addEventListener("click", () => {
            sessionCalcHistory.length = 0;
            renderCalcHistory();
        });
    }

    // Helper Global Copiar
    window.copyToClipboardText = function (text, btnElement) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            if (btnElement) {
                const originalHTML = btnElement.innerHTML;
                btnElement.innerHTML = `<i data-lucide="check" style="width:12px;height:12px;"></i> Copiado!`;
                if (window.lucide) lucide.createIcons();
                setTimeout(() => {
                    btnElement.innerHTML = originalHTML;
                    if (window.lucide) lucide.createIcons();
                }, 2000);
            }
        }).catch(() => {
            alert("Resultado:\n" + text);
        });
    };

    // Helper Global Inserir SOAP
    window.sendResultToSOAP = function (textSummary) {
        const soapObjField = document.getElementById("soap-objetivo") || document.getElementById("soap-o-text") || document.getElementById("soap-evolucao");
        if (soapObjField) {
            if (soapObjField.value && soapObjField.value.trim().length > 0) {
                soapObjField.value += "\n\n" + textSummary;
            } else {
                soapObjField.value = textSummary;
            }
            alert("Resultado inserido com sucesso no campo de evolução/objetivos do SOAP!");
        } else {
            navigator.clipboard.writeText(textSummary);
            alert("Prontuário SOAP não detectado aberto. O resultado foi copiado para a Área de Transferência:\n\n" + textSummary);
        }
    };

    // -------------------------------------------------------------
    // CONTROLES DE INTERAÇÃO DOS CHECKBOX TILES
    // -------------------------------------------------------------
    document.querySelectorAll(".calc-checkbox-tile").forEach(tile => {
        const checkbox = tile.querySelector('input[type="checkbox"]');
        if (!checkbox) return;

        tile.addEventListener("click", (e) => {
            if (e.target !== checkbox && e.target.tagName !== "LABEL") {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
            tile.classList.toggle("checked", checkbox.checked);
        });

        checkbox.addEventListener("change", () => {
            tile.classList.toggle("checked", checkbox.checked);
        });
    });

    // -------------------------------------------------------------
    // CONTROLES DE FILTRO POR CATEGORIA E BUSCA
    // -------------------------------------------------------------
    const tabButtons = document.querySelectorAll(".calc-tab-btn");
    const searchInput = document.getElementById("calc-search-input");
    const calculatorCards = document.querySelectorAll("#calculators-container .calculator-card");

    function filterCalculators() {
        const activeTab = document.querySelector(".calc-tab-btn.active");
        const categoryFilter = activeTab ? activeTab.getAttribute("data-calc-cat") : "all";
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

        calculatorCards.forEach(card => {
            const cardCat = card.getAttribute("data-category");
            const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
            const titleText = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";

            const matchesCat = (categoryFilter === "all" || cardCat === categoryFilter || cardCat === "all");
            const matchesQuery = query === "" || keywords.includes(query) || titleText.includes(query);

            if (matchesCat && matchesQuery) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterCalculators();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", filterCalculators);
    }

    // Botão "Puxar Dados do SOAP"
    const btnSyncSoap = document.getElementById("btn-sync-soap-calcs");
    if (btnSyncSoap) {
        btnSyncSoap.addEventListener("click", () => {
            // Tenta puxar campos comuns do SOAP
            const sIdade = document.getElementById("soap-idade") || document.getElementById("patient-age");
            const sPeso = document.getElementById("soap-peso") || document.getElementById("patient-weight");
            const sAltura = document.getElementById("soap-altura") || document.getElementById("patient-height");
            const sCreatinina = document.getElementById("soap-creatinina") || document.getElementById("patient-creatinine");
            const sSexo = document.getElementById("soap-sexo") || document.getElementById("patient-gender");

            let updatedCount = 0;

            if (sIdade && sIdade.value) {
                ["calc-idade", "calc-epi-idade"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) { el.value = sIdade.value; updatedCount++; }
                });
            }
            if (sPeso && sPeso.value) {
                ["calc-peso", "calc-imc-peso", "calc-pi-peso", "calc-bsa-peso"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) { el.value = sPeso.value; updatedCount++; }
                });
            }
            if (sAltura && sAltura.value) {
                ["calc-imc-altura", "calc-pi-altura", "calc-bsa-altura"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) { el.value = sAltura.value; updatedCount++; }
                });
            }
            if (sCreatinina && sCreatinina.value) {
                ["calc-creatinina", "calc-epi-creatinina"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) { el.value = sCreatinina.value; updatedCount++; }
                });
            }
            if (sSexo && sSexo.value) {
                ["calc-sexo", "calc-epi-sexo", "calc-pi-sexo", "calc-pfe-sexo"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) { el.value = sSexo.value; updatedCount++; }
                });
            }
            // Sincronizar dados respiratórios (Idade, Altura, PFE)
            if (sIdade && sIdade.value) {
                const elPfeIdade = document.getElementById("calc-pfe-idade");
                if (elPfeIdade) { elPfeIdade.value = sIdade.value; updatedCount++; }
            }
            if (sAltura && sAltura.value) {
                const elPfeAltura = document.getElementById("calc-pfe-altura");
                if (elPfeAltura) {
                    let altVal = parseFloat(sAltura.value);
                    if (altVal < 3) altVal = Math.round(altVal * 100);
                    elPfeAltura.value = altVal;
                    updatedCount++;
                }
            }
            const sPfe = document.getElementById("soap-pfe");
            if (sPfe && sPfe.value) {
                const elPfeMedido = document.getElementById("calc-pfe-medido");
                if (elPfeMedido) { elPfeMedido.value = sPfe.value; updatedCount++; }
            }

            if (updatedCount > 0) {
                alert(`Dados sincronizados com sucesso do SOAP! (${updatedCount} campos atualizados)`);
                // Dispara auto-cálculos
                document.getElementById("btn-calcular-clcr")?.click();
                document.getElementById("btn-calcular-epi")?.click();
                document.getElementById("btn-calcular-imc")?.click();
                document.getElementById("btn-calcular-pfe")?.click();
            } else {
                alert("Preencha primeiro os dados do paciente no prontuário SOAP (Idade, Peso, Altura, Creatinina, Sexo) para puxar automaticamente para as calculadoras.");
            }
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 1: Cockcroft-Gault (Clearance de Creatinina)
    // -------------------------------------------------------------
    const calcIdade = document.getElementById("calc-idade");
    const calcPeso = document.getElementById("calc-peso");
    const calcCreatinina = document.getElementById("calc-creatinina");
    const calcSexo = document.getElementById("calc-sexo");
    const btnCalcularClcr = document.getElementById("btn-calcular-clcr");
    const btnLimparClcr = document.getElementById("btn-limpar-clcr");
    const clcrResult = document.getElementById("clcr-result-container");

    function calcularClcr(showError = false) {
        const idade = parseInt(calcIdade.value);
        const peso = parseFloat(calcPeso.value);
        const creatinina = parseFloat(calcCreatinina.value);
        const sexo = calcSexo ? calcSexo.value : "M";

        if (!idade || !peso || !creatinina || creatinina <= 0) {
            if (showError) {
                alert("Por favor, preencha a idade, peso e creatinina sérica para calcular o Clearance.");
            } else {
                clcrResult.style.display = "none";
            }
            return;
        }

        let clcr = ((140 - idade) * peso) / (72 * creatinina);
        if (sexo === "F") clcr = clcr * 0.85;

        clcrResult.innerHTML = "";
        clcrResult.style.display = "block";

        let classification = "Função renal preservada";
        let colorClass = "var(--success-color)";
        let estagio = "G1";
        let alertBoxHTML = "";

        if (clcr < 15) {
            classification = "Falência Renal (Estágio 5)";
            colorClass = "var(--danger-color)";
            estagio = "G5";
            alertBoxHTML = `
                <div class="calc-alert" style="background-color: var(--danger-bg); border-left-color: var(--danger-color); color: var(--danger-color);">
                    <i data-lucide="alert-octagon"></i>
                    <div>
                        <strong>ALERTA CRÍTICO (ClCr < 15 mL/min):</strong>
                        <p>• <strong>Metformina & Espironolactona:</strong> CONTRAINDICADAS.</p>
                        <p>• <strong>AINEs:</strong> Proibidos. Risco de precipitação de diálise.</p>
                    </div>
                </div>
            `;
        } else if (clcr >= 15 && clcr < 30) {
            classification = "Insuficiência Renal Grave (Estágio 4)";
            colorClass = "var(--danger-color)";
            estagio = "G4";
            alertBoxHTML = `
                <div class="calc-alert" style="background-color: var(--danger-bg); border-left-color: var(--danger-color); color: var(--danger-color);">
                    <i data-lucide="alert-octagon"></i>
                    <div>
                        <strong>ALERTA DE SEGURANÇA (ClCr < 30 mL/min):</strong>
                        <p>• <strong>Metformina:</strong> CONTRAINDICADA. Suspender pelo risco de acidose lática.</p>
                        <p>• <strong>Captopril / Losartana:</strong> Reduzir dose e monitorar K+.</p>
                    </div>
                </div>
            `;
        } else if (clcr >= 30 && clcr < 45) {
            classification = "Insuficiência Renal Moderada a Severa (Estágio 3b)";
            colorClass = "var(--warning-color)";
            estagio = "G3b";
            alertBoxHTML = `
                <div class="calc-alert" style="background-color: rgba(234, 88, 12, 0.08); border-left-color: var(--warning-color); color: var(--warning-color);">
                    <i data-lucide="alert-triangle"></i>
                    <div>
                        <strong>ALERTA DE DOSAGEM (ClCr 30-44 mL/min):</strong>
                        <p>• <strong>Metformina:</strong> Dose máxima de 1.000 mg/dia.</p>
                    </div>
                </div>
            `;
        } else if (clcr >= 45 && clcr < 60) {
            classification = "Insuficiência Renal Leve a Moderada (Estágio 3a)";
            colorClass = "var(--warning-color)";
            estagio = "G3a";
        } else if (clcr >= 60 && clcr < 90) {
            classification = "Diminuição Leve da Função Renal (Estágio 2)";
            colorClass = "var(--color-primary)";
            estagio = "G2";
        }

        const summaryText = `[CÁLCULO CLINICO] ClCr (Cockcroft-Gault): ${clcr.toFixed(1)} mL/min | Estágio ${estagio} (${classification})`;

        clcrResult.innerHTML = `
            <div class="result-box-inner calc-pop-anim">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 style="margin: 0; font-size: 12px; color: var(--text-secondary);">Clearance (Cockcroft-Gault):</h4>
                    <span class="badge" style="background: rgba(13, 148, 136, 0.1); color: var(--color-primary); font-weight: 700; margin: 0;">Estágio ${estagio}</span>
                </div>
                
                <div class="val-highlight" style="color: ${colorClass}; font-size: 26px; font-weight: 800; margin: 4px 0;">${clcr.toFixed(1)} <small style="font-size: 13px; font-weight: 500;">mL/min</small></div>
                
                <div class="drc-stage-pills" style="margin: 6px 0;">
                    <span class="drc-pill ${estagio === 'G1' ? 'active g1' : ''}">G1 (≥90)</span>
                    <span class="drc-pill ${estagio === 'G2' ? 'active g2' : ''}">G2 (60-89)</span>
                    <span class="drc-pill ${estagio === 'G3a' ? 'active g3a' : ''}">G3a (45-59)</span>
                    <span class="drc-pill ${estagio === 'G3b' ? 'active g3b' : ''}">G3b (30-44)</span>
                    <span class="drc-pill ${estagio === 'G4' ? 'active g4' : ''}">G4 (15-29)</span>
                    <span class="drc-pill ${estagio === 'G5' ? 'active g5' : ''}">G5 (<15)</span>
                </div>

                <p class="classification" style="font-size: 12px; margin-top: 4px;">Diagnóstico Sugerido: <strong>${classification}</strong></p>
                ${alertBoxHTML}

                <div class="calc-result-toolbar">
                    <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width:13px;height:13px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width:13px;height:13px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        if (showError) addCalcToHistory("ClCr (Cockcroft-Gault)", `${clcr.toFixed(1)} mL/min`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularClcr) {
        btnCalcularClcr.addEventListener("click", () => calcularClcr(true));
    }

    [calcIdade, calcPeso, calcCreatinina, calcSexo].forEach(el => {
        if (el) {
            el.addEventListener("input", () => calcularClcr(false));
            el.addEventListener("change", () => calcularClcr(false));
        }
    });

    if (btnLimparClcr) {
        btnLimparClcr.addEventListener("click", () => {
            calcIdade.value = "";
            calcPeso.value = "";
            calcCreatinina.value = "";
            if (calcSexo) calcSexo.value = "M";
            clcrResult.style.display = "none";
            clcrResult.innerHTML = "";
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 2: CKD-EPI 2021 (Filtração Glomerular)
    // -------------------------------------------------------------
    const calcEpiIdade = document.getElementById("calc-epi-idade");
    const calcEpiCreatinina = document.getElementById("calc-epi-creatinina");
    const calcEpiSexo = document.getElementById("calc-epi-sexo");
    const btnCalcularEpi = document.getElementById("btn-calcular-epi");
    const btnLimparEpi = document.getElementById("btn-limpar-epi");
    const epiResult = document.getElementById("epi-result-container");

    function calcularEpi(showError = false) {
        const idade = parseInt(calcEpiIdade.value);
        const cr = parseFloat(calcEpiCreatinina.value);
        const sexo = calcEpiSexo ? calcEpiSexo.value : "M";

        if (!idade || !cr || cr <= 0) {
            if (showError) alert("Por favor, preencha a idade e creatinina sérica para a fórmula CKD-EPI.");
            else epiResult.style.display = "none";
            return;
        }

        let kappa = (sexo === "F") ? 0.7 : 0.9;
        let alpha = (sexo === "F") ? -0.241 : -0.302;
        let genderCoeff = (sexo === "F") ? 1.012 : 1.0;

        let term1 = Math.min(cr / kappa, 1);
        let term2 = Math.max(cr / kappa, 1);

        let egfr = 142 * Math.pow(term1, alpha) * Math.pow(term2, -1.200) * Math.pow(0.9938, idade) * genderCoeff;

        epiResult.innerHTML = "";
        epiResult.style.display = "block";

        let classification = "";
        let estagio = "G1";
        if (egfr >= 90) { classification = "G1 (Normal/Elevado)"; estagio = "G1"; }
        else if (egfr >= 60) { classification = "G2 (Levemente diminuído)"; estagio = "G2"; }
        else if (egfr >= 45) { classification = "G3a (Diminuição leve a moderada)"; estagio = "G3a"; }
        else if (egfr >= 30) { classification = "G3b (Diminuição moderada a severa)"; estagio = "G3b"; }
        else if (egfr >= 15) { classification = "G4 (Diminuição severa)"; estagio = "G4"; }
        else { classification = "G5 (Falência renal)"; estagio = "G5"; }

        let color = "var(--color-primary)";
        let alertBoxHTML = "";

        if (egfr < 30) {
            color = "var(--danger-color)";
            alertBoxHTML = `
                <div class="calc-alert" style="background-color: var(--danger-bg); border-left-color: var(--danger-color); color: var(--danger-color); font-size:11px; margin-top:8px;">
                    <i data-lucide="alert-octagon"></i>
                    <div>
                        <strong>ALERTA DE SEGURANÇA (TFGe < 30):</strong>
                        <p style="margin: 2px 0 0 0;">• Risco crítico de toxicidade. Evitar AINEs e Metformina.</p>
                    </div>
                </div>
            `;
        } else if (egfr >= 30 && egfr < 60) {
            color = "var(--warning-color)";
            alertBoxHTML = `
                <div class="calc-alert" style="background-color: rgba(234, 88, 12, 0.08); border-left-color: var(--warning-color); color: var(--warning-color); font-size:11px; margin-top:8px;">
                    <i data-lucide="alert-triangle"></i>
                    <div>
                        <strong>ALERTA DE AJUSTE (TFGe 30-59):</strong>
                        <p style="margin: 2px 0 0 0;">• Avaliar ajuste de dose de fármacos com excreção renal dominante.</p>
                    </div>
                </div>
            `;
        }

        const summaryText = `[CÁLCULO CLINICO] TFGe (CKD-EPI 2021): ${egfr.toFixed(1)} mL/min/1.73m² | Estágio ${estagio} (${classification})`;

        epiResult.innerHTML = `
            <div class="result-box-inner calc-pop-anim">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 style="margin: 0; font-size: 12px; color: var(--text-secondary);">TFGe (CKD-EPI 2021):</h4>
                    <span class="badge" style="background: rgba(13, 148, 136, 0.1); color: var(--color-primary); font-weight: 700; margin:0;">Estágio ${estagio}</span>
                </div>
                
                <div class="val-highlight" style="color: ${color}; font-size: 26px; font-weight: 800; margin: 4px 0;">${egfr.toFixed(1)} <small style="font-size: 12px; font-weight: 500;">mL/min/1.73m²</small></div>
                
                <div class="drc-stage-pills" style="margin: 6px 0;">
                    <span class="drc-pill ${estagio === 'G1' ? 'active g1' : ''}">G1</span>
                    <span class="drc-pill ${estagio === 'G2' ? 'active g2' : ''}">G2</span>
                    <span class="drc-pill ${estagio === 'G3a' ? 'active g3a' : ''}">G3a</span>
                    <span class="drc-pill ${estagio === 'G3b' ? 'active g3b' : ''}">G3b</span>
                    <span class="drc-pill ${estagio === 'G4' ? 'active g4' : ''}">G4</span>
                    <span class="drc-pill ${estagio === 'G5' ? 'active g5' : ''}">G5</span>
                </div>

                <p class="classification" style="font-size: 12px; margin-top: 4px;">Classificação DRC: <strong>${classification}</strong></p>
                ${alertBoxHTML}

                <div class="calc-result-toolbar">
                    <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width:13px;height:13px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width:13px;height:13px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        if (showError) addCalcToHistory("TFGe (CKD-EPI 2021)", `${egfr.toFixed(1)} mL/min/1.73m²`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularEpi) {
        btnCalcularEpi.addEventListener("click", () => calcularEpi(true));
    }

    [calcEpiIdade, calcEpiCreatinina, calcEpiSexo].forEach(el => {
        if (el) {
            el.addEventListener("input", () => calcularEpi(false));
            el.addEventListener("change", () => calcularEpi(false));
        }
    });

    if (btnLimparEpi) {
        btnLimparEpi.addEventListener("click", () => {
            calcEpiIdade.value = "";
            calcEpiCreatinina.value = "";
            if (calcEpiSexo) calcEpiSexo.value = "M";
            epiResult.style.display = "none";
            epiResult.innerHTML = "";
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 3: IMC (Índice de Massa Corporal)
    // -------------------------------------------------------------
    const imcPeso = document.getElementById("calc-imc-peso");
    const imcAltura = document.getElementById("calc-imc-altura");
    const btnCalcularImc = document.getElementById("btn-calcular-imc");
    const btnLimparImc = document.getElementById("btn-limpar-imc");
    const imcResult = document.getElementById("imc-result-container");

    function calcularImc(showError = false) {
        const peso = parseFloat(imcPeso.value);
        let altura = parseFloat(imcAltura.value);

        if (altura > 3) altura = altura / 100; // auto converte cm para m

        if (!peso || !altura || altura <= 0) {
            if (showError) alert("Preencha o peso e a altura corretamente.");
            else imcResult.style.display = "none";
            return;
        }

        const imc = peso / (altura * altura);
        imcResult.innerHTML = "";
        imcResult.style.display = "block";

        let classification = "Eutrófico (Peso normal)";
        let conduta = "Manter alimentação equilibrada e atividade física regular.";
        let color = "var(--success-color)";
        let gaugePct = 35;

        if (imc < 18.5) {
            classification = "Abaixo do Peso";
            conduta = "Avaliar risco nutricional e necessidade de rastreio alimentar.";
            color = "var(--color-secondary)";
            gaugePct = Math.max(8, (imc / 18.5) * 25);
        } else if (imc >= 18.5 && imc < 25) {
            classification = "Eutrófico (Peso Normal)";
            color = "var(--success-color)";
            gaugePct = 25 + ((imc - 18.5) / 6.5) * 25;
        } else if (imc >= 25 && imc < 30) {
            classification = "Sobrepeso (Pré-obesidade)";
            conduta = "Aconselhamento sobre redução de açúcares/sódio e hábito aeróbico.";
            color = "var(--warning-color)";
            gaugePct = 50 + ((imc - 25) / 5) * 25;
        } else if (imc >= 30 && imc < 35) {
            classification = "Obesidade Grau I";
            conduta = "Encaminhar para suporte dietoterápico e rastrear comorbidades.";
            color = "var(--danger-color)";
            gaugePct = 75 + ((imc - 30) / 5) * 12.5;
        } else {
            classification = "Obesidade Grau II/III (Grave)";
            conduta = "Acompanhamento multiprofissional integrado na UBS.";
            color = "var(--danger-color)";
            gaugePct = Math.min(98, 87.5 + ((imc - 35) / 10) * 12.5);
        }

        const summaryText = `[ANTROPOMETRIA] IMC: ${imc.toFixed(1)} kg/m² (${classification})`;

        imcResult.innerHTML = `
            <div class="result-box-inner calc-pop-anim">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 style="margin: 0; font-size: 12px; color: var(--text-secondary);">IMC Calculado:</h4>
                </div>

                <div class="val-highlight" style="color: ${color}; font-size: 26px; font-weight: 800; margin: 4px 0;">${imc.toFixed(1)} <small style="font-size: 13px; font-weight: 500;">kg/m²</small></div>

                <div class="imc-gauge-container">
                    <div class="imc-gauge-bar">
                        <div class="imc-gauge-pin" style="left: ${gaugePct}%; border-top-color: ${color};"></div>
                    </div>
                    <div class="imc-gauge-labels">
                        <span style="color: var(--color-secondary); ${imc < 18.5 ? 'font-weight:800;' : ''}">Abaixo</span>
                        <span style="color: var(--success-color); ${imc >= 18.5 && imc < 25 ? 'font-weight:800;' : ''}">Normal</span>
                        <span style="color: var(--warning-color); ${imc >= 25 && imc < 30 ? 'font-weight:800;' : ''}">Sobrepeso</span>
                        <span style="color: var(--danger-color); ${imc >= 30 ? 'font-weight:800;' : ''}">Obesidade</span>
                    </div>
                </div>

                <p class="classification" style="font-size: 12px; margin-top: 6px;">Classificação: <strong>${classification}</strong></p>
                <div class="calc-alert" style="background-color: var(--bg-tertiary); border-left-color: ${color}; color: var(--text-secondary); margin-top: 8px;">
                    <i data-lucide="info"></i>
                    <div>
                        <strong>Conduta Sugerida:</strong>
                        <p style="margin: 2px 0 0 0;">${conduta}</p>
                    </div>
                </div>

                <div class="calc-result-toolbar">
                    <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width:13px;height:13px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width:13px;height:13px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        if (showError) addCalcToHistory("IMC", `${imc.toFixed(1)} kg/m²`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularImc) {
        btnCalcularImc.addEventListener("click", () => calcularImc(true));
    }

    [imcPeso, imcAltura].forEach(el => {
        if (el) {
            el.addEventListener("input", () => calcularImc(false));
            el.addEventListener("change", () => calcularImc(false));
        }
    });

    if (btnLimparImc) {
        btnLimparImc.addEventListener("click", () => {
            imcPeso.value = "";
            imcAltura.value = "";
            imcResult.style.display = "none";
            imcResult.innerHTML = "";
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 4: HAS-BLED (Risco de Sangramento)
    // -------------------------------------------------------------
    const hasCheckboxes = ["has-h", "has-a-renal", "has-a-hepatica", "has-s", "has-b", "has-l", "has-e", "has-d-drogas", "has-d-alcool"]
        .map(id => document.getElementById(id));
    const btnCalcularHas = document.getElementById("btn-calcular-has");
    const btnLimparHas = document.getElementById("btn-limpar-has");
    const hasResult = document.getElementById("has-result-container");

    function calcularHas() {
        let score = 0;
        hasCheckboxes.forEach(cb => {
            if (cb && cb.checked) score++;
        });

        hasResult.innerHTML = "";
        hasResult.style.display = "block";

        let risk = "Baixo Risco";
        let color = "var(--success-color)";
        let conduta = "Manter anticoagulação habitual. Monitorar sintomas clínicos normais.";
        let rate = "1.1%";

        if (score === 1 || score === 2) {
            risk = "Risco Moderado";
            color = "var(--warning-color)";
            conduta = "Atenção a queixas de sangramento. Monitoramento periódico.";
            rate = (score === 1) ? "1.0%" : "1.9%";
        } else if (score >= 3) {
            risk = "ALTO RISCO DE SANGRAMENTO";
            color = "var(--danger-color)";
            conduta = "Precaução reforçada, revisões frequentes e controle de fatores modificáveis (PA, AINEs/AAS desnecessários, álcool).";
            rate = (score === 3) ? "3.7%" : (score === 4 ? "8.7%" : "≥ 12.5%");
        }

        const summaryText = `[ESCORE CLÍNICO] HAS-BLED: ${score} ponto(s) | ${risk} (${rate}/ano de sangramento grave)`;

        hasResult.innerHTML = `
            <div class="result-box-inner calc-pop-anim">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 style="margin: 0; font-size: 12px; color: var(--text-secondary);">HAS-BLED:</h4>
                    <span class="badge" style="background: ${score >= 3 ? 'var(--danger-bg)' : 'rgba(13,148,136,0.1)'}; color: ${color}; font-weight: 700; margin:0;">
                        ${score} ${score === 1 ? 'ponto' : 'pontos'}
                    </span>
                </div>

                <div class="val-highlight" style="color: ${color}; font-size: 22px; font-weight: 800; margin: 4px 0;">
                    ${risk} <small style="font-size: 12px; font-weight: 500; opacity: 0.9;">(${rate}/ano)</small>
                </div>

                <div class="calc-alert" style="background-color: var(--bg-tertiary); border-left-color: ${color}; color: var(--text-secondary); margin-top: 8px;">
                    <i data-lucide="info"></i>
                    <div>
                        <strong>Conduta Recomendada:</strong>
                        <p style="margin: 2px 0 0 0;">${conduta}</p>
                    </div>
                </div>

                <div class="calc-result-toolbar">
                    <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width:13px;height:13px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width:13px;height:13px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        addCalcToHistory("HAS-BLED", `${score} pts (${risk})`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularHas) btnCalcularHas.addEventListener("click", calcularHas);
    hasCheckboxes.forEach(cb => { if (cb) cb.addEventListener("change", calcularHas); });

    if (btnLimparHas) {
        btnLimparHas.addEventListener("click", () => {
            hasCheckboxes.forEach(cb => {
                if (cb) {
                    cb.checked = false;
                    const tile = cb.closest('.calc-checkbox-tile');
                    if (tile) tile.classList.remove('checked');
                }
            });
            hasResult.style.display = "none";
            hasResult.innerHTML = "";
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 5: CHA₂DS₂-VASc (Risco de AVC em Fibrilação Atrial)
    // -------------------------------------------------------------
    const chadsCheckboxes = ["chads-c", "chads-h", "chads-a2", "chads-d", "chads-s2", "chads-v", "chads-a", "chads-sc"]
        .map(id => document.getElementById(id));
    const btnCalcularChads = document.getElementById("btn-calcular-chads");
    const btnLimparChads = document.getElementById("btn-limpar-chads");
    const chadsResult = document.getElementById("chads-result-container");

    function calcularChads() {
        let score = 0;
        const c = document.getElementById("chads-c")?.checked;
        const h = document.getElementById("chads-h")?.checked;
        const a2 = document.getElementById("chads-a2")?.checked;
        const d = document.getElementById("chads-d")?.checked;
        const s2 = document.getElementById("chads-s2")?.checked;
        const v = document.getElementById("chads-v")?.checked;
        const a = document.getElementById("chads-a")?.checked;
        const sc = document.getElementById("chads-sc")?.checked;

        if (c) score += 1;
        if (h) score += 1;
        if (a2) score += 2;
        if (d) score += 1;
        if (s2) score += 2;
        if (v) score += 1;
        if (!a2 && a) score += 1; // ignora A se A2 ativado
        if (sc) score += 1;

        chadsResult.innerHTML = "";
        chadsResult.style.display = "block";

        let riskLevel = "Baixo Risco";
        let color = "var(--success-color)";
        let rec = "Sem indicação formal de Anticoagulação Oral (ACO). Avaliar perfil do paciente.";
        let annualRate = "< 1.0%";

        if (score === 1) {
            riskLevel = sc ? "Baixo Risco (Devido apenas ao Sexo Feminino)" : "Risco Intermediário";
            color = sc ? "var(--success-color)" : "var(--warning-color)";
            rec = sc ? "Sem necessidade de ACO." : "Considerar Anticoagulação Oral (DOAC / Varfarina) após análise de risco/benefício.";
            annualRate = "1.3%";
        } else if (score >= 2) {
            riskLevel = (score === 2 && sc) ? "Risco Intermediário" : "ALTO RISCO DE AVC / TROMBOEMBOLISMO";
            color = (score === 2 && sc) ? "var(--warning-color)" : "var(--danger-color)";
            rec = "Anticoagulação Oral RECOMENDADA (preferencialmente DOACs: Apixabana, Rivaroxabana, Dabigatrana ou Varfarina se valvar).";
            annualRate = score === 2 ? "2.2%" : (score === 3 ? "3.2%" : (score === 4 ? "4.0%" : "≥ 6.7%"));
        }

        const summaryText = `[ESCORE CLÍNICO] CHA₂DS₂-VASc: ${score} ponto(s) | ${riskLevel} (${annualRate}/ano risco de AVC)`;

        chadsResult.innerHTML = `
            <div class="result-box-inner calc-pop-anim">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 style="margin: 0; font-size: 12px; color: var(--text-secondary);">CHA₂DS₂-VASc:</h4>
                    <span class="badge" style="background: ${score >= 2 ? 'rgba(225,29,72,0.15)' : 'rgba(14,165,233,0.15)'}; color: ${color}; font-weight: 700; margin:0;">
                        ${score} ${score === 1 ? 'ponto' : 'pontos'}
                    </span>
                </div>

                <div class="val-highlight" style="color: ${color}; font-size: 22px; font-weight: 800; margin: 4px 0;">
                    ${riskLevel} <small style="font-size: 12px; font-weight: 500; opacity: 0.9;">(${annualRate}/ano)</small>
                </div>

                <div class="calc-alert" style="background-color: var(--bg-tertiary); border-left-color: ${color}; color: var(--text-secondary); margin-top: 8px;">
                    <i data-lucide="shield-check"></i>
                    <div>
                        <strong>Recomendação de Anticoagulação:</strong>
                        <p style="margin: 2px 0 0 0;">${rec}</p>
                    </div>
                </div>

                <div class="calc-result-toolbar">
                    <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width:13px;height:13px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width:13px;height:13px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        addCalcToHistory("CHA₂DS₂-VASc", `${score} pts (${annualRate}/ano)`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularChads) btnCalcularChads.addEventListener("click", calcularChads);
    chadsCheckboxes.forEach(cb => { if (cb) cb.addEventListener("change", calcularChads); });

    if (btnLimparChads) {
        btnLimparChads.addEventListener("click", () => {
            chadsCheckboxes.forEach(cb => {
                if (cb) {
                    cb.checked = false;
                    const tile = cb.closest('.calc-checkbox-tile');
                    if (tile) tile.classList.remove('checked');
                }
            });
            chadsResult.style.display = "none";
            chadsResult.innerHTML = "";
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 6: Peso Ideal & Peso Ajustado (Devine / Robinson)
    // -------------------------------------------------------------
    const piAltura = document.getElementById("calc-pi-altura");
    const piPeso = document.getElementById("calc-pi-peso");
    const piSexo = document.getElementById("calc-pi-sexo");
    const btnCalcularPi = document.getElementById("btn-calcular-pi");
    const btnLimparPi = document.getElementById("btn-limpar-pi");
    const piResult = document.getElementById("pi-result-container");

    function calcularPi(showError = false) {
        let hVal = parseFloat(piAltura.value);
        const pVal = parseFloat(piPeso.value);
        const sexo = piSexo ? piSexo.value : "M";

        if (!hVal) {
            if (showError) alert("Preencha a altura do paciente.");
            else piResult.style.display = "none";
            return;
        }

        let hCm = hVal < 3 ? hVal * 100 : hVal; // converte metros para cm se preciso
        let inchesOver5ft = Math.max(0, (hCm - 152.4) / 2.54);

        let pesoIdeal = (sexo === "M") ? (50 + 2.3 * inchesOver5ft) : (45.5 + 2.3 * inchesOver5ft);
        let pesoAjustado = pesoIdeal;
        let isObese = false;

        if (pVal && pVal > (1.2 * pesoIdeal)) {
            isObese = true;
            pesoAjustado = pesoIdeal + 0.4 * (pVal - pesoIdeal);
        }

        piResult.innerHTML = "";
        piResult.style.display = "block";

        const summaryText = isObese
            ? `[NUTRIÇÃO/DOSAGEM] Peso Ideal: ${pesoIdeal.toFixed(1)} kg | Peso Ajustado (Devine): ${pesoAjustado.toFixed(1)} kg (Paciente com sobrepeso/obesidade)`
            : `[NUTRIÇÃO/DOSAGEM] Peso Ideal (Devine): ${pesoIdeal.toFixed(1)} kg`;

        piResult.innerHTML = `
            <div class="result-box-inner calc-pop-anim">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 style="margin: 0; font-size: 12px; color: var(--text-secondary);">Estimativa de Peso Corporal:</h4>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 6px 0;">
                    <div style="background: var(--bg-secondary); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        <span style="font-size: 10px; color: var(--text-tertiary); display: block;">Peso Ideal (Devine):</span>
                        <strong style="font-size: 18px; color: var(--color-primary);">${pesoIdeal.toFixed(1)} <small style="font-size:11px;">kg</small></strong>
                    </div>

                    <div style="background: var(--bg-secondary); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        <span style="font-size: 10px; color: var(--text-tertiary); display: block;">Peso Ajustado (Dose):</span>
                        <strong style="font-size: 18px; color: ${isObese ? 'var(--warning-color)' : 'var(--color-primary)'};">${pesoAjustado.toFixed(1)} <small style="font-size:11px;">kg</small></strong>
                    </div>
                </div>

                ${isObese ? `
                    <div class="calc-alert" style="background-color: rgba(234,88,12,0.08); border-left-color: var(--warning-color); color: var(--warning-color); font-size: 11px;">
                        <i data-lucide="info"></i>
                        <div>
                            <strong>Recomendação para Pacientes Obesos:</strong>
                            <p style="margin: 2px 0 0 0;">Utilize o <strong>Peso Ajustado (${pesoAjustado.toFixed(1)} kg)</strong> para calcular doses de aminoglicosídeos, vancomicina ou anticoagulantes evitando sobredosagem.</p>
                        </div>
                    </div>
                ` : ''}

                <div class="calc-result-toolbar">
                    <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width:13px;height:13px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width:13px;height:13px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        if (showError) addCalcToHistory("Peso Ideal/Ajustado", `${pesoIdeal.toFixed(1)} / ${pesoAjustado.toFixed(1)} kg`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularPi) btnCalcularPi.addEventListener("click", () => calcularPi(true));
    [piAltura, piPeso, piSexo].forEach(el => {
        if (el) {
            el.addEventListener("input", () => calcularPi(false));
            el.addEventListener("change", () => calcularPi(false));
        }
    });

    if (btnLimparPi) {
        btnLimparPi.addEventListener("click", () => {
            piAltura.value = "";
            piPeso.value = "";
            if (piSexo) piSexo.value = "M";
            piResult.style.display = "none";
            piResult.innerHTML = "";
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 7: BSA (Superfície Corporal) & Dosagem mg/kg
    // -------------------------------------------------------------
    const bsaPeso = document.getElementById("calc-bsa-peso");
    const bsaAltura = document.getElementById("calc-bsa-altura");
    const bsaDose = document.getElementById("calc-bsa-dose");
    const bsaFreq = document.getElementById("calc-bsa-frequencia");
    const btnCalcularBsa = document.getElementById("btn-calcular-bsa");
    const btnLimparBsa = document.getElementById("btn-limpar-bsa");
    const bsaResult = document.getElementById("bsa-result-container");

    function calcularBsa(showError = false) {
        const pVal = parseFloat(bsaPeso.value);
        let hVal = parseFloat(bsaAltura.value);
        const doseMgKg = parseFloat(bsaDose ? bsaDose.value : 0);
        const freq = parseInt(bsaFreq ? bsaFreq.value : 1);

        if (hVal && hVal < 3) hVal = hVal * 100; // converte para cm

        if (!pVal || !hVal) {
            if (showError) alert("Preencha o peso e altura para calcular a Superfície Corporal.");
            else bsaResult.style.display = "none";
            return;
        }

        // Fórmula de Mosteller: BSA = sqrt( (peso * altura_cm) / 3600 )
        const bsa = Math.sqrt((pVal * hVal) / 3600);
        let doseTotalDiaria = doseMgKg ? (pVal * doseMgKg) : 0;
        let dosePorTomada = doseTotalDiaria ? (doseTotalDiaria / freq) : 0;

        bsaResult.innerHTML = "";
        bsaResult.style.display = "block";

        let doseInfoHTML = "";
        if (doseTotalDiaria > 0) {
            doseInfoHTML = `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-color);">
                    <div style="font-size: 11px; color: var(--text-secondary);">Dose Total Calculada (${doseMgKg} mg/kg/dia):</div>
                    <strong style="font-size: 16px; color: #8b5cf6;">${doseTotalDiaria.toFixed(1)} mg/dia</strong>
                    <span style="font-size: 11px; color: var(--text-tertiary);"> (&rarr; ${dosePorTomada.toFixed(1)} mg a cada ${24 / freq}h)</span>
                </div>
            `;
        }

        const summaryText = doseTotalDiaria > 0
            ? `[DOSAGEM/BSA] Superfície Corporal: ${bsa.toFixed(2)} m² | Dose (${doseMgKg} mg/kg): ${doseTotalDiaria.toFixed(1)} mg/dia (${dosePorTomada.toFixed(1)} mg de ${24 / freq} em ${24 / freq}h)`
            : `[DOSAGEM/BSA] Superfície Corporal (Mosteller): ${bsa.toFixed(2)} m²`;

        bsaResult.innerHTML = `
            <div class="result-box-inner calc-pop-anim">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 style="margin: 0; font-size: 12px; color: var(--text-secondary);">Superfície Corporal (BSA Mosteller):</h4>
                </div>

                <div class="val-highlight" style="color: #8b5cf6; font-size: 24px; font-weight: 800; margin: 4px 0;">
                    ${bsa.toFixed(2)} <small style="font-size: 13px; font-weight: 500;">m²</small>
                </div>

                ${doseInfoHTML}

                <div class="calc-result-toolbar">
                    <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width:13px;height:13px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width:13px;height:13px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        if (showError) addCalcToHistory("Superfície Corporal (BSA)", `${bsa.toFixed(2)} m²`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularBsa) btnCalcularBsa.addEventListener("click", () => calcularBsa(true));
    [bsaPeso, bsaAltura, bsaDose, bsaFreq].forEach(el => {
        if (el) {
            el.addEventListener("input", () => calcularBsa(false));
            el.addEventListener("change", () => calcularBsa(false));
        }
    });

    if (btnLimparBsa) {
        btnLimparBsa.addEventListener("click", () => {
            bsaPeso.value = "";
            bsaAltura.value = "";
            if (bsaDose) bsaDose.value = "";
            if (bsaFreq) bsaFreq.value = "1";
            bsaResult.style.display = "none";
            bsaResult.innerHTML = "";
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 9: Teste de Controle da Asma (ACT)
    // -------------------------------------------------------------
    const btnCalcularAct = document.getElementById("btn-calcular-act");
    const btnLimparAct = document.getElementById("btn-limpar-act");
    const actResult = document.getElementById("act-result-container");

    function calcularAct(showError = true) {
        if (!actResult) return;
        const q1 = parseInt(document.getElementById("calc-act-q1")?.value) || 5;
        const q2 = parseInt(document.getElementById("calc-act-q2")?.value) || 5;
        const q3 = parseInt(document.getElementById("calc-act-q3")?.value) || 5;
        const q4 = parseInt(document.getElementById("calc-act-q4")?.value) || 5;
        const q5 = parseInt(document.getElementById("calc-act-q5")?.value) || 5;

        const totalScore = q1 + q2 + q3 + q4 + q5;
        let classStr = "";
        let colorClass = "";
        let borderClass = "";
        let condutaStr = "";

        if (totalScore === 25) {
            classStr = "Asma Totalmente Controlada";
            colorClass = "var(--success-color)";
            borderClass = "#10b981";
            condutaStr = "Excelente controle dos sintomas nas últimas 4 semanas. Manter plano atual e reforçar adesão e hábitos de vida saudáveis.";
        } else if (totalScore >= 20) {
            classStr = "Asma Bem Controlada";
            colorClass = "#0284c7";
            borderClass = "#0284c7";
            condutaStr = "Bom controle dos sintomas. Avaliar se a técnica inalatória e o bochecho pós-corticoide estão sendo mantidos adequadamente.";
        } else {
            classStr = "Asma NÃO Controlada";
            colorClass = "var(--danger-color)";
            borderClass = "#ef4444";
            condutaStr = "Alto risco de exacerbação grave. Checar adesão diária ao corticoide inalatório, corrigir erros na técnica inalatória e discutir com a equipe médica escalonamento (STEP terapêutico).";
        }

        const summaryText = `[Calculadora ACT - Teste de Controle da Asma]
• Escore Total: ${totalScore} / 25 pontos
• Classificação: ${classStr}
• Conduta Farmacêutica: ${condutaStr}`;

        actResult.style.display = "block";
        actResult.innerHTML = `
            <div class="result-box" style="border-left: 5px solid ${borderClass}; padding: 14px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-size: 18px; font-weight: 800; color: ${colorClass}; font-family: 'Outfit', sans-serif;">
                        Escore ACT: ${totalScore} <span style="font-size: 13px; font-weight: 500; color: var(--text-tertiary);">/ 25 pontos</span>
                    </div>
                    <span class="badge" style="background-color: ${borderClass}20; color: ${borderClass}; font-weight: 700; font-size: 11px;">
                        ${classStr}
                    </span>
                </div>
                <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
                    <div style="width: ${(totalScore / 25) * 100}%; height: 100%; background: ${borderClass}; transition: width 0.3s;"></div>
                </div>
                <p style="font-size: 12.5px; line-height: 1.5; color: var(--text-primary); margin: 0 0 10px 0;">
                    <strong>Conduta Recomendada:</strong> ${condutaStr}
                </p>
                <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px;">
                    <button class="btn btn-secondary btn-sm" type="button" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width: 12px; height: 12px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" type="button" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width: 12px; height: 12px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        if (showError) addCalcToHistory("Teste de Controle da Asma (ACT)", `${totalScore}/25 (${classStr})`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularAct) btnCalcularAct.addEventListener("click", () => calcularAct(true));
    if (btnLimparAct) {
        btnLimparAct.addEventListener("click", () => {
            ["calc-act-q1", "calc-act-q2", "calc-act-q3", "calc-act-q4", "calc-act-q5"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = "5";
            });
            if (actResult) {
                actResult.style.display = "none";
                actResult.innerHTML = "";
            }
        });
    }

    // -------------------------------------------------------------
    // CALCULADORA 10: Pico de Fluxo Expiratório Previsto (Peak Flow / PFE)
    // -------------------------------------------------------------
    const pfeSexo = document.getElementById("calc-pfe-sexo");
    const pfeIdade = document.getElementById("calc-pfe-idade");
    const pfeAltura = document.getElementById("calc-pfe-altura");
    const pfeMedido = document.getElementById("calc-pfe-medido");
    const btnCalcularPfe = document.getElementById("btn-calcular-pfe");
    const btnLimparPfe = document.getElementById("btn-limpar-pfe");
    const pfeResult = document.getElementById("pfe-result-container");

    function calcularPfe(showError = true) {
        if (!pfeResult) return;
        const sexo = pfeSexo?.value || "M";
        const idade = parseInt(pfeIdade?.value);
        let altura = parseFloat(pfeAltura?.value);
        const medido = parseFloat(pfeMedido?.value) || null;

        if (!idade || !altura || idade <= 0 || altura <= 0) {
            if (showError) alert("Por favor, preencha Idade e Altura para calcular o Peak Flow previsto.");
            return;
        }

        // Se altura informada em metros (ex: 1.70), converte para cm (170)
        if (altura < 3) altura = altura * 100;

        let previsto = 0;
        if (idade < 18) {
            // Equação pediátrica de Polgar
            previsto = (altura - 100) * 5 + 100;
        } else {
            // Equações de referência padrão (Knudson / Gregg & Nunn)
            if (sexo === "M") {
                previsto = (altura * 5.48) - (idade * 1.7) - 355;
            } else {
                previsto = (altura * 3.72) - (idade * 1.25) - 145;
            }
        }

        previsto = Math.round(Math.max(100, Math.min(850, previsto)));

        const zonaVerdeMin = Math.round(previsto * 0.80);
        const zonaAmarelaMin = Math.round(previsto * 0.50);

        let zonaTexto = "";
        let pctMedidoStr = "";
        let zonaCor = "#10b981";

        if (medido && medido > 0) {
            const pct = Math.round((medido / previsto) * 100);
            pctMedidoStr = `\n• PFE Medido: ${medido} L/min (${pct}% do previsto)`;
            if (pct >= 80) {
                zonaTexto = "🟢 ZONA VERDE (Segurança - Asma Estável)";
                zonaCor = "#10b981";
            } else if (pct >= 50) {
                zonaTexto = "🟡 ZONA AMARELA (Alerta - Sintomas Piorando / Usar Salbutamol)";
                zonaCor = "#d97706";
            } else {
                zonaTexto = "🔴 ZONA VERMELHA (Perigo - Crise Grave / Procurar UPA / SAMU)";
                zonaCor = "#ef4444";
            }
        }

        const summaryText = `[Pico de Fluxo Expiratório - Peak Flow Previsto]
• Sexo: ${sexo === 'M' ? 'Masculino' : 'Feminino'} | Idade: ${idade} anos | Altura: ${Math.round(altura)} cm
• PFE Previsto: ${previsto} L/min${pctMedidoStr}
• Zonas de Segurança:
  - 🟢 Verde (≥ 80%): ≥ ${zonaVerdeMin} L/min (Estável)
  - 🟡 Amarela (50-79%): ${zonaAmarelaMin} a ${zonaVerdeMin - 1} L/min (Alerta de crise)
  - 🔴 Vermelha (< 50%): < ${zonaAmarelaMin} L/min (Emergência)
${zonaTexto ? '• Situação Atual: ' + zonaTexto : ''}`;

        pfeResult.style.display = "block";
        pfeResult.innerHTML = `
            <div class="result-box" style="border-left: 5px solid ${zonaCor}; padding: 14px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <span style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; font-weight: 700;">Peak Flow Previsto</span>
                        <div style="font-size: 22px; font-weight: 800; color: #0284c7; font-family: 'Outfit', sans-serif;">
                            ${previsto} <span style="font-size: 13px; font-weight: 500;">L/min</span>
                        </div>
                    </div>
                    ${medido ? `
                        <div style="text-align: right;">
                            <span style="font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; font-weight: 700;">Aferido na Consulta</span>
                            <div style="font-size: 20px; font-weight: 800; color: ${zonaCor}; font-family: 'Outfit', sans-serif;">
                                ${medido} L/min (${Math.round((medido / previsto) * 100)}%)
                            </div>
                        </div>
                    ` : ''}
                </div>

                ${zonaTexto ? `
                    <div style="padding: 8px 12px; background: ${zonaCor}15; border-radius: var(--radius-sm); border: 1px solid ${zonaCor}40; margin-bottom: 12px; font-weight: 700; font-size: 12px; color: ${zonaCor};">
                        ${zonaTexto}
                    </div>
                ` : ''}

                <!-- Tabela das Zonas do Plano de Ação -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 11.5px;">
                    <div class="asthma-zone-card asthma-zone-green" style="padding: 8px; margin: 0;">
                        <strong style="color: #10b981;">🟢 Verde (≥ 80%)</strong>
                        <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">≥ ${zonaVerdeMin} L/min</div>
                        <span style="font-size: 10px; color: var(--text-tertiary);">Manter terapia diária</span>
                    </div>
                    <div class="asthma-zone-card asthma-zone-yellow" style="padding: 8px; margin: 0;">
                        <strong style="color: #d97706;">🟡 Amarela (50-79%)</strong>
                        <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">${zonaAmarelaMin} - ${zonaVerdeMin - 1} L/min</div>
                        <span style="font-size: 10px; color: var(--text-tertiary);">Usar resgate / Alerta</span>
                    </div>
                    <div class="asthma-zone-card asthma-zone-red" style="padding: 8px; margin: 0;">
                        <strong style="color: #ef4444;">🔴 Vermelha (< 50%)</strong>
                        <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">< ${zonaAmarelaMin} L/min</div>
                        <span style="font-size: 10px; color: var(--text-tertiary);">Emergência / UPA 192</span>
                    </div>
                </div>

                <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px;">
                    <button class="btn btn-secondary btn-sm" type="button" onclick="window.copyToClipboardText('${summaryText.replace(/'/g, "\\'")}', this)">
                        <i data-lucide="copy" style="width: 12px; height: 12px;"></i> Copiar
                    </button>
                    <button class="btn btn-primary btn-sm" type="button" onclick="window.sendResultToSOAP('${summaryText.replace(/'/g, "\\'")}')">
                        <i data-lucide="file-text" style="width: 12px; height: 12px;"></i> Inserir no SOAP
                    </button>
                </div>
            </div>
        `;

        if (showError) addCalcToHistory("Peak Flow Previsto (PFE)", `${previsto} L/min`, summaryText);
        if (window.lucide) lucide.createIcons();
    }

    if (btnCalcularPfe) btnCalcularPfe.addEventListener("click", () => calcularPfe(true));
    [pfeSexo, pfeIdade, pfeAltura, pfeMedido].forEach(el => {
        if (el) {
            el.addEventListener("input", () => calcularPfe(false));
            el.addEventListener("change", () => calcularPfe(false));
        }
    });

    if (btnLimparPfe) {
        btnLimparPfe.addEventListener("click", () => {
            if (pfeIdade) pfeIdade.value = "";
            if (pfeAltura) pfeAltura.value = "";
            if (pfeMedido) pfeMedido.value = "";
            if (pfeResult) {
                pfeResult.style.display = "none";
                pfeResult.innerHTML = "";
            }
        });
    }
}

// -------------------------------------------------------------
// SEÇÃO DE FARMACOVIGILÂNCIA
// -------------------------------------------------------------
function initVigilanceSection() {
    const inputInitials = document.getElementById("vig-paciente");
    const inputIdade = document.getElementById("vig-idade");
    const selectSexo = document.getElementById("vig-sexo");

    const selectTipoEvento = document.getElementById("vig-tipo-evento");
    const selectFaseErro = document.getElementById("vig-fase-erro");
    const selectMed = document.getElementById("vig-med-suspeito");
    const selectIntensidade = document.getElementById("vig-intensidade");
    const txtDesc = document.getElementById("vig-descricao");
    const txtConduta = document.getElementById("vig-conduta");

    const btnGerar = document.getElementById("btn-gerar-notificacao");
    const btnLimpar = document.getElementById("btn-limpar-vigilancia");
    const formattedOutput = document.getElementById("vig-formatted-output");
    const btnCopiar = document.getElementById("btn-copiar-vig");

    if (!selectMed) return;

    window.toggleVigilanciaFaseErro = function () {
        const tipo = selectTipoEvento.value;
        const group = document.getElementById("vig-fase-erro-group");
        if (group) {
            group.style.display = (tipo === "ErroMedicao") ? "block" : "none";
        }
    };

    const dataList = document.getElementById("vig-meds-list");
    if (window.MEDICAMENTOS) {
        const sorted = [...MEDICAMENTOS].sort((a, b) => a.nome.localeCompare(b.nome));
        if (dataList) {
            dataList.innerHTML = "";
            sorted.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.nome;
                dataList.appendChild(opt);
            });
        } else if (selectMed.tagName === "SELECT") {
            selectMed.innerHTML = '<option value="" disabled selected>Selecione ou digite o fármaco...</option>';
            sorted.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.nome;
                opt.textContent = m.nome;
                selectMed.appendChild(opt);
            });
        }
    }

    if (btnGerar) {
        btnGerar.addEventListener("click", () => {
            const initials = inputInitials.value.trim() || "N. I.";
            const idade = inputIdade.value.trim() || "N. I.";
            const sexo = selectSexo.value === "F" ? "Feminino" : "Masculino";
            const tipo = selectTipoEvento.value;
            const faseErro = tipo === "ErroMedicao" ? selectFaseErro.value : "Não aplicável";
            const med = selectMed.value;
            const intensidade = selectIntensidade.value;
            const desc = txtDesc.value.trim();
            const conduta = txtConduta.value.trim();

            if (!med || !desc) {
                alert("Por favor, selecione pelo menos o medicamento envolvido e preencha a descrição do evento.");
                return;
            }

            let out = "";
            if (tipo === "RAM") {
                out = `=== NOTIFICAÇÃO DE FARMACOVIGILÂNCIA (RAM) ===
[IDENTIFICAÇÃO]
Iniciais: ${initials} | Idade: ${idade} anos | Sexo: ${sexo}

[DADOS DA REAÇÃO ADVERSA (RAM)]
Fármaco Suspeito: ${med}
Gravidade/Intensidade: ${intensidade}

[DESCRIÇÃO DOS SINTOMAS]
${desc}

[CONDUTA FARMACÊUTICA ADOTADA]
${conduta}
==============================================`;
            } else if (tipo === "ErroMedicao") {
                out = `=== NOTIFICAÇÃO DE FARMACOVIGILÂNCIA (ERRO DE MEDICAÇÃO) ===
[IDENTIFICAÇÃO]
Iniciais: ${initials} | Idade: ${idade} anos | Sexo: ${sexo}

[DADOS DO ERRO DE MEDICAÇÃO]
Medicamento Envolvido: ${med}
Fase em que ocorreu: ${faseErro}
Risco/Severidade: ${intensidade}

[DESCRIÇÃO DO ERRO E CIRCUNSTÂNCIAS]
${desc}

[AÇÕES PREVENTIVAS / CONDUTA FARMACÊUTICA]
${conduta}
==============================================`;
            } else {
                out = `=== NOTIFICAÇÃO DE FARMACOVIGILÂNCIA (QUEIXA TÉCNICA) ===
[IDENTIFICAÇÃO]
Iniciais: ${initials} | Idade: ${idade} anos | Sexo: ${sexo}

[DADOS DA QUEIXA TÉCNICA]
Produto Envolvido: ${med}
Tipo de desvio: Queixa Técnica (Embalagem, aspecto, validade)
Risco estimado: ${intensidade}

[DESCRIÇÃO DO DESVIO DE QUALIDADE]
${desc}

[MEDIDAS ADOTADAS / SEQUESTRO DO LOTE]
${conduta}
==============================================`;
            }

            formattedOutput.textContent = out;
        });
    }

    if (btnCopiar) {
        btnCopiar.addEventListener("click", () => {
            navigator.clipboard.writeText(formattedOutput.textContent)
                .then(() => alert("Notificação copiada com sucesso!"))
                .catch(() => alert("Erro ao copiar."));
        });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            inputInitials.value = "";
            inputIdade.value = "";
            selectSexo.value = "F";
            selectTipoEvento.value = "RAM";
            selectFaseErro.value = "Prescrição";
            const errGroup = document.getElementById("vig-fase-erro-group");
            if (errGroup) errGroup.style.display = "none";
            selectMed.value = "";
            selectIntensidade.value = "Leve";
            txtDesc.value = "";
            txtConduta.value = "";
            formattedOutput.textContent = "Preencha a ficha ao lado para gerar a notificação estruturada...";
        });
    }
}

// -------------------------------------------------------------
// EDUCAÇÃO EM SAÚDE / CARTILHAS
// -------------------------------------------------------------
const CARTILHAS_EDUCATIVAS = {
    polifarmacia: {
        title: "Guia de Sobrevivência na Polifarmácia",
        content: `
        <p><strong>Definição:</strong> Polifarmácia é o uso concomitante de 5 ou mais medicamentos pelo mesmo paciente. É muito comum em idosos e portadores de múltiplas condições crônicas.</p>
        <h4 style="margin-top: 12px; color: var(--color-primary); font-family: 'Outfit', sans-serif;">Riscos Associados:</h4>
        <ul style="padding-left: 20px; margin-bottom: 12px;">
            <li>Maior risco de reações adversas a medicamentos (RAM).</li>
            <li>Interações medicamentosas potencialmente perigosas.</li>
            <li>Redução da adesão devido à complexidade do regime terapêutico.</li>
            <li>Risco de "cascata de prescrição" (prescrever um novo fármaco para tratar efeito colateral de outro).</li>
        </ul>
        <h4 style="margin-top: 12px; color: var(--color-primary); font-family: 'Outfit', sans-serif;">Dicas Práticas de Organização:</h4>
        <ol style="padding-left: 20px;">
            <li><strong>Porta-comprimidos semanal:</strong> Ajuda a separar visualmente as tomadas por períodos do dia (Manhã, Almoço, Tarde, Noite).</li>
            <li><strong>Associação com rotinas:</strong> Tomar o remédio sempre junto com uma atividade diária fixa (ex: logo após escovar os dentes ou tomar o café da manhã).</li>
            <li><strong>Lista Atualizada:</strong> Manter sempre na carteira uma folha impressa com o nome de todos os remédios, dosagens e horários.</li>
            <li><strong>Cores e Badges:</strong> Se necessário, cole adesivos coloridos nas caixas para diferenciar os medicamentos de uso contínuo dos de uso esporádico.</li>
        </ol>
    `
    },
    antibioticos: {
        title: "Cartilha do Uso Racional de Antibióticos",
        content: `
        <p><strong>Importante:</strong> Antibióticos combatem exclusivamente infecções causadas por bactérias. Eles não funcionam contra gripes, resfriados ou outras infecções virais.</p>
        <h4 style="margin-top: 12px; color: var(--color-primary); font-family: 'Outfit', sans-serif;">Regras de Ouro do Tratamento:</h4>
        <ul style="padding-left: 20px; margin-bottom: 12px;">
            <li><strong>Respeite rigidamente os horários:</strong> O atraso nas tomadas permite que as bactérias se recuperem e se multipliquem, aumentando o risco de resistência.</li>
            <li><strong>Complete todo o período prescrito:</strong> Nunca interrompa o uso antes do prazo determinado pelo médico, mesmo que os sintomas tenham desaparecido por completo. As bactérias mais resistentes são eliminadas por último.</li>
            <li><strong>Evite a automedicação:</strong> Usar sobras de antibióticos guardados em casa pode ser ineficaz ou perigoso.</li>
        </ul>
        <h4 style="margin-top: 12px; color: var(--color-primary); font-family: 'Outfit', sans-serif;">Consequência da Resistência Bacteriana:</h4>
        <p>A resistência bacteriana torna as infecções comuns difíceis ou impossíveis de tratar, aumentando o tempo de internação, custos hospitalares e a taxa de mortalidade global.</p>
    `
    },
    fitoterapicos: {
        title: "Interações de Plantas Medicinais com Alopáticos",
        content: `
        <p><strong>Mito:</strong> "Se é natural, não faz mal." Muitas plantas medicinais possuem compostos químicos ativos potentes que interagem perigosamente com os medicamentos sintéticos da Atenção Primária.</p>
        <h4 style="margin-top: 12px; color: var(--color-primary); font-family: 'Outfit', sans-serif;">Interações Clínicas Críticas:</h4>
        <ul style="padding-left: 20px; margin-bottom: 12px;">
            <li><strong>Ginkgo Biloba + Aspirina/Varfarina:</strong> O Ginkgo inibe a agregação plaquetária, elevando severamente o risco de hemorragias internas graves.</li>
            <li><strong>Ginseng + Metformina/Insulina:</strong> O Ginseng possui atividade hipoglicemiante intrínseca e pode causar crises de hipoglicemia severa quando associado aos antidiabéticos.</li>
            <li><strong>Erva-de-São-João (Hipericão) + Anticoncepcionais/Anticoagulantes:</strong> Potente indutor enzimático do CYP3A4, podendo inativar ou reduzir drasticamente o efeito de anticoncepcionais orais, levando a gravidez indesejada.</li>
            <li><strong>Chá Verde + Varfarina:</strong> O chá verde é rico em vitamina K, o que inibe diretamente o efeito anticoagulante da Varfarina.</li>
        </ul>
        <p style="margin-top: 12px; font-weight: 500;">Sempre pergunte ao paciente durante a consulta se ele faz uso de chás, garrafadas ou suplementos naturais.</p>
    `
    },
    descarte: {
        title: "Manual do Descarte Ecológico de Medicamentos",
        content: `
        <p><strong>Impacto Ambiental:</strong> Descartar sobras de medicamentos ou produtos vencidos no lixo comum ou na descarga (vaso sanitário) polui os lençóis freáticos e a água potável, afetando a fauna aquática e propiciando a proliferação de superbactérias no meio ambiente.</p>
        <h4 style="margin-top: 12px; color: var(--color-primary); font-family: 'Outfit', sans-serif;">Como Proceder Corretamente:</h4>
        <ul style="padding-left: 20px;">
            <li><strong>Separe a caixa do medicamento:</strong> As caixas de papelão e as bulas de papel limpas podem ser recicladas no lixo de papel comum.</li>
            <li><strong>Mantenha em blisters/frascos originais:</strong> Nunca esvazie os comprimidos no lixo. Leve a cartela (blister) ou frasco de plástico/vidro diretamente ao ponto de descarte.</li>
            <li><strong>Procure um Ponto de Coleta na UBS:</strong> Quase todas as Unidades Básicas de Saúde possuem caixas coletoras específicas de logística reversa.</li>
            <li><strong>Medicamentos Controlados:</strong> Devem ser devolvidos diretamente na farmácia da UBS portando a receita para o devido descarte supervisionado pelo Farmacêutico Responsável Técnico.</li>
        </ul>
    `
    },
    inaladores: {
        title: "Guia Visual da Técnica Inalatória & Dispositivos (SUS)",
        content: `
        <p><strong>Fato Clínico:</strong> Mais de 70% dos pacientes asmáticos na Atenção Primária cometem erros críticos de inalação, o que impede que o medicamento atinja os brônquios distais.</p>
        <h4 style="margin-top: 12px; color: #0284c7; font-family: 'Outfit', sans-serif;">Passo a Passo: Spray (MDI) com Espaçador Valvulado (Padrão-Ouro SUS)</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            <div class="tech-step-item">
                <span class="tech-step-num">1</span>
                <div><strong>Destampar e agitar:</strong> Retire a tampa e agite o frasco energicamente por 5 a 10 segundos na vertical.</div>
            </div>
            <div class="tech-step-item">
                <span class="tech-step-num">2</span>
                <div><strong>Acoplar no espaçador:</strong> Encaixe a bombinha firmemente no orifício traseiro do espaçador.</div>
            </div>
            <div class="tech-step-item">
                <span class="tech-step-num">3</span>
                <div><strong>Soltar o ar dos pulmões:</strong> Expire completamente todo o ar pela boca, longe do espaçador.</div>
            </div>
            <div class="tech-step-item">
                <span class="tech-step-num">4</span>
                <div><strong>Posicionar e vedar:</strong> Coloque o bocal do espaçador entre os dentes e feche bem os lábios (sem morder). Se usar máscara facial, vede firmemente sobre nariz e boca.</div>
            </div>
            <div class="tech-step-item">
                <span class="tech-step-num">5</span>
                <div><strong>Disparar 1 jato e inalar:</strong> Aperte a bombinha uma única vez. Inspire de forma <em>lenta e profunda</em> pela boca (ou respire calmamente 5 vezes na máscara).</div>
            </div>
            <div class="tech-step-item">
                <span class="tech-step-num">6</span>
                <div><strong>Segurar a respiração por 10 segundos:</strong> Tire o bocal da boca e prenda a respiração por 10 segundos (ou até o limite do conforto).</div>
            </div>
            <div class="tech-step-item" style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981;">
                <span class="tech-step-num" style="background: #10b981;">7</span>
                <div><strong>Higiene Oral Obrigatória:</strong> Ao usar corticoide inalatório (Beclometasona ou Budesonida), enxágue e bocheche água e cuspa fora para evitar candidíase oral (sapinho) e rouquidão.</div>
            </div>
        </div>
        <h4 style="margin-top: 14px; color: #ef4444; font-family: 'Outfit', sans-serif;">Erros Críticos Frequentes que Anulam o Efeito:</h4>
        <ul style="padding-left: 20px; line-height: 1.5; font-size: 13px;">
            <li><strong>Disparar 2 jatos de uma vez só:</strong> As partículas colidem e grudam nas paredes do espaçador. Dispare sempre 1 jato por vez!</li>
            <li><strong>Inspirar rápido demais em spray:</strong> O medicamento bate na parede da garganta e não desce aos pulmões.</li>
            <li><strong>Não fazer bochecho pós-corticoide:</strong> Favorece o surgimento de fungos na cavidade oral.</li>
        </ul>
        `
    },
    mitos_asma: {
        title: "Mitos e Verdades sobre as 'Bombinhas' de Asma",
        content: `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: rgba(239, 68, 68, 0.06); padding: 12px; border-radius: var(--radius-md); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 4px 0; color: #ef4444; font-size: 14px; font-family: 'Outfit', sans-serif;">1. 'A bombinha vicia ou causa dependência?'</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.5;"><strong>MITO ABSOLUTO:</strong> As bombinhas NÃO causam dependência química nem vício. A asma é uma doença inflamatória crônica que exige controle contínuo, exatamente como a hipertensão e o diabetes precisam de remédio diário.</p>
            </div>

            <div style="background: rgba(245, 158, 11, 0.06); padding: 12px; border-radius: var(--radius-md); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 4px 0; color: #d97706; font-size: 14px; font-family: 'Outfit', sans-serif;">2. 'A bombinha ataca o coração?'</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.5;"><strong>MITO:</strong> O broncodilatador de alívio (Salbutamol) pode causar tremor ou taquicardia leve e passageira, especialmente em doses altas. Esse efeito colateral diminui drasticamente quando a asma é tratada corretamente com o corticoide inalatório preventivo, pois o paciente não precisará de doses excessivas de resgate.</p>
            </div>

            <div style="background: rgba(16, 185, 129, 0.06); padding: 12px; border-radius: var(--radius-md); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 4px 0; color: #059669; font-size: 14px; font-family: 'Outfit', sans-serif;">3. 'O corticoide inalatório engorda ou faz mal como cortisona em comprimido?'</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.5;"><strong>MITO:</strong> A dose inalada é minúscula (medida em microgramas) e atua diretamente nos pulmões com absorção sistêmica insignificante. Ao contrário dos comprimidos orais prolongados, o corticoide inalatório não provoca ganho de peso, osteoporose ou síndrome de Cushing.</p>
            </div>

            <div style="background: rgba(2, 132, 199, 0.06); padding: 12px; border-radius: var(--radius-md); border-left: 4px solid #0284c7;">
                <h4 style="margin: 0 0 4px 0; color: #0284c7; font-size: 14px; font-family: 'Outfit', sans-serif;">4. 'Se não sinto falta de ar hoje, posso deixar de tomar a bombinha preventiva?'</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.5;"><strong>PERIGO:</strong> Não! A ausência de sintomas é a prova de que a medicação está desinflamando seus brônquios. Parar o corticoide faz a inflamação voltar sem aviso, abrindo portas para uma crise grave e imprevisível.</p>
            </div>
        </div>
        `
    }
};

window.showEduModal = function (topic) {
    const modal = document.getElementById("edu-modal");
    const title = document.getElementById("edu-modal-title");
    const content = document.getElementById("edu-modal-content");

    if (CARTILHAS_EDUCATIVAS[topic] && modal && title && content) {
        let iconName = "layers";
        if (topic === "antibioticos") iconName = "pill";
        else if (topic === "fitoterapicos") iconName = "leaf";
        else if (topic === "descarte") iconName = "trash-2";
        else if (topic === "inaladores") iconName = "wind";
        else if (topic === "mitos_asma") iconName = "help-circle";

        title.innerHTML = `<i data-lucide="${iconName}" class="color-primary" style="width: 24px; height: 24px;"></i> ${CARTILHAS_EDUCATIVAS[topic].title}`;
        content.innerHTML = CARTILHAS_EDUCATIVAS[topic].content;
        modal.style.display = "flex";
        if (window.lucide) lucide.createIcons();
    }
};

window.closeEduModal = function () {
    const modal = document.getElementById("edu-modal");
    if (modal) modal.style.display = "none";
};
