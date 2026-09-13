// =================================================================
// MÓDULO SOAP, PLANO POSOLÓGICO VISUAL, GOOGLE SHEETS & FARMÁCIA CLÍNICA
// =================================================================

// Estados clínicos globais compartilhados para o prontuário integrado
let fcMedList = [];
let prmList = [];
let clCrCalculado = null;
let revisaoState = {};
let cgDadosPaciente = { sexo: 'F', idade: 60, peso: 60 };

function getDrcEstagio(clCr) {
    if (clCr >= 90) return 'G1 (Normal/Elevado)';
    if (clCr >= 60) return 'G2 (Levemente diminuído)';
    if (clCr >= 45) return 'G3a (Diminuição leve a moderada)';
    if (clCr >= 30) return 'G3b (Diminuição moderada a severa)';
    if (clCr >= 15) return 'G4 (Diminuição severa)';
    return 'G5 (Falência renal)';
}

function initSoapSection() {
    const inputNome = document.getElementById("soap-nome");
    const inputIdade = document.getElementById("soap-idade");
    const selectSexo = document.getElementById("soap-sexo");
    const inputPeso = document.getElementById("soap-peso");
    const inputAltura = document.getElementById("soap-altura");
    const inputPaSis = document.getElementById("soap-pa-sis");
    const inputPaDia = document.getElementById("soap-pa-dia");
    const inputGlicemia = document.getElementById("soap-glicemia");

    const inputMedicamentosCount = document.getElementById("soap-medicamentos-count");
    const selectAntibioticoUso = document.getElementById("soap-antibiotico-uso");
    const selectAntibioticoRacional = document.getElementById("soap-antibiotico-racional");
    const selectIntervencaoTipo = document.getElementById("soap-intervencao-tipo");
    const selectIntervencaoStatus = document.getElementById("soap-intervencao-status");

    const txtS = document.getElementById("soap-s");
    const txtO = document.getElementById("soap-o");
    const selectPrm = document.getElementById("soap-a-prm");
    const txtA = document.getElementById("soap-a");
    const txtP = document.getElementById("soap-p");

    const btnSalvar = document.getElementById("btn-salvar-soap");
    const btnExportar = document.getElementById("btn-exportar-soap");
    const btnExportarSheets = document.getElementById("btn-exportar-sheets");
    const btnLimpar = document.getElementById("btn-limpar-soap");
    const btnCopiar = document.getElementById("btn-copiar-output");

    const formattedOutput = document.getElementById("soap-formatted-output");
    const recentListContainer = document.getElementById("soap-recent-list");

    const sheetsModalOverlay = document.getElementById("sheets-modal-overlay");
    const sheetsModalClose = document.getElementById("sheets-modal-close");
    const sheetsUrlInput = document.getElementById("sheets-url-input");
    const btnTestarSheets = document.getElementById("btn-testar-sheets");
    const sheetsTestResult = document.getElementById("sheets-test-result");
    const btnSheetsCancelar = document.getElementById("btn-sheets-cancelar");
    const btnSheetsSalvar = document.getElementById("btn-sheets-salvar");
    const btnCopyScript = document.getElementById("btn-copy-script");
    const sheetsStatusBar = document.getElementById("sheets-status-bar");
    const sheetsConnectionBadge = document.getElementById("sheets-connection-badge");
    const sheetsConnectionText = document.getElementById("sheets-connection-text");

    let activeAdherenceScale = 'morisky'; // 'morisky' ou 'mat'
    let moriskyAnswers = { 1: 1, 2: 1, 3: 1, 4: 1 };
    let matAnswers = { 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 6 };

    window.switchAdherenceScale = function (scale) {
        activeAdherenceScale = scale;
        const panelMorisky = document.getElementById("adherence-panel-morisky");
        const panelMat = document.getElementById("adherence-panel-mat");
        const btnMorisky = document.getElementById("tab-adh-morisky");
        const btnMat = document.getElementById("tab-adh-mat");

        if (scale === "morisky") {
            if (panelMorisky) panelMorisky.style.display = "block";
            if (panelMat) panelMat.style.display = "none";
            if (btnMorisky) {
                btnMorisky.classList.add("active");
                btnMorisky.style.background = "var(--color-primary, #0d9488)";
                btnMorisky.style.color = "white";
            }
            if (btnMat) {
                btnMat.classList.remove("active");
                btnMat.style.background = "transparent";
                btnMat.style.color = "var(--text-secondary, #64748b)";
            }
            updateMoriskyScore();
        } else {
            if (panelMorisky) panelMorisky.style.display = "none";
            if (panelMat) panelMat.style.display = "block";
            if (btnMat) {
                btnMat.classList.add("active");
                btnMat.style.background = "var(--color-primary, #0d9488)";
                btnMat.style.color = "white";
            }
            if (btnMorisky) {
                btnMorisky.classList.remove("active");
                btnMorisky.style.background = "transparent";
                btnMorisky.style.color = "var(--text-secondary, #64748b)";
            }
            updateMatScore();
        }
        if (typeof window.consolidarParaSoap === "function") window.consolidarParaSoap();
    };

    window.checkPolifarmaciaAlert = function () {
        const val = parseInt(inputMedicamentosCount?.value) || 0;
        const badge = document.getElementById("soap-polifarmacia-badge");
        if (badge) {
            badge.style.display = (val >= 5) ? "inline-block" : "none";
        }
        updateFormattedText();
    };

    window.toggleAntibioticoRacionalSelect = function () {
        const uso = selectAntibioticoUso?.value;
        const group = document.getElementById("soap-antibiotico-racional-group");
        if (group) {
            group.style.display = (uso === "Sim") ? "block" : "none";
        }
        updateFormattedText();
    };

    document.querySelectorAll(".morisky-questions .m-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const q = btn.getAttribute("data-q");
            const val = parseInt(btn.getAttribute("data-val"));

            btn.parentElement.querySelectorAll(".m-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            moriskyAnswers[q] = val;
            updateMoriskyScore();
        });
    });

    document.querySelectorAll(".mat-questions .mat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const group = btn.closest(".mat-score-group");
            if (!group) return;
            const q = group.getAttribute("data-mat-q");
            const val = parseInt(btn.getAttribute("data-val"));

            group.querySelectorAll(".mat-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            matAnswers[q] = val;
            updateMatScore();
            if (typeof window.consolidarParaSoap === "function") window.consolidarParaSoap();
        });
    });

    function getMoriskyScore() {
        return moriskyAnswers[1] + moriskyAnswers[2] + moriskyAnswers[3] + moriskyAnswers[4];
    }

    function getMatAverageScore() {
        let total = 0;
        for (let i = 1; i <= 7; i++) {
            total += (matAnswers[i] || 6);
        }
        return (total / 7).toFixed(1);
    }

    function updateMoriskyScore() {
        const score = getMoriskyScore();
        const badge = document.getElementById("morisky-score-badge");

        if (badge && activeAdherenceScale === "morisky") {
            badge.className = "score-indicator";
            if (score === 4) {
                badge.textContent = `Adesão: ALTA (${score}/4)`;
                badge.classList.add("high");
            } else {
                badge.textContent = `Adesão: MÉDIA/BAIXA (${score}/4)`;
                badge.classList.add("medium-low");
            }
        }
        updateFormattedText();
    }

    function updateMatScore() {
        const avgScore = parseFloat(getMatAverageScore());
        const badge = document.getElementById("morisky-score-badge");

        if (badge && activeAdherenceScale === "mat") {
            badge.className = "score-indicator";
            if (avgScore >= 5.0) {
                badge.textContent = `MAT: ${avgScore}/6 (ALTA ADESÃO)`;
                badge.classList.add("high");
            } else {
                badge.textContent = `MAT: ${avgScore}/6 (MÉDIA/BAIXA ADESÃO)`;
                badge.classList.add("medium-low");
            }
        }
        updateFormattedText();
    }

    // Google Sheets Config
    function updateSheetsStatus() {
        const url = localStorage.getItem("cim_sheets_url") || "";
        if (url) {
            if (sheetsStatusBar) {
                sheetsStatusBar.style.display = "block";
                sheetsStatusBar.innerHTML = `<span style="color:var(--success-color); font-weight:600;"><i data-lucide="check-circle" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;"></i> Google Sheets Ativo</span> <a href="#" id="link-configurar-sheets" style="font-size:10px; color:var(--text-secondary); text-decoration:underline; margin-left:8px;">Alterar Planilha</a>`;
                const link = document.getElementById("link-configurar-sheets");
                if (link) {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        openSheetsModal();
                    });
                }
                if (window.lucide) lucide.createIcons();
            }
            if (sheetsConnectionBadge) {
                sheetsConnectionBadge.className = "sheets-connection-badge sheets-connected";
                if (sheetsConnectionText) sheetsConnectionText.textContent = "Conectado à Planilha";
            }
            if (sheetsUrlInput) sheetsUrlInput.value = url;
        } else {
            if (sheetsStatusBar) sheetsStatusBar.style.display = "none";
            if (sheetsConnectionBadge) {
                sheetsConnectionBadge.className = "sheets-connection-badge";
                if (sheetsConnectionText) sheetsConnectionText.textContent = "Não configurado";
            }
        }
    }

    function openSheetsModal() {
        if (sheetsModalOverlay) {
            sheetsModalOverlay.classList.add("active");
            const savedUrl = localStorage.getItem("cim_sheets_url") || "";
            if (sheetsUrlInput) sheetsUrlInput.value = savedUrl;
            if (sheetsTestResult) {
                sheetsTestResult.style.display = "none";
                sheetsTestResult.textContent = "";
            }
            updateSheetsStatus();
        }
    }

    function closeSheetsModal() {
        if (sheetsModalOverlay) sheetsModalOverlay.classList.remove("active");
    }

    // Modal Plano Posológico
    const posoModalOverlay = document.getElementById("posologia-modal-overlay");
    const posoModalClose = document.getElementById("posologia-modal-close");
    const btnPosoFechar = document.getElementById("btn-posologia-fechar");

    window.openPosologiaModal = function () {
        if (!posoModalOverlay) return;

        const pacienteNome = inputNome?.value.trim() || "Paciente sem identificação";
        const pacienteIdade = inputIdade?.value.trim() || "--";
        const pacienteSexo = selectSexo?.value === "F" ? "Feminino" : (selectSexo?.value === "M" ? "Masculino" : "--");

        // Dados do paciente
        const elNome = document.getElementById("poso-paciente-nome");
        const elIdade = document.getElementById("poso-paciente-idade");
        const elSexo = document.getElementById("poso-paciente-sexo");
        const elData = document.getElementById("poso-meta-data");
        const elTotalMeds = document.getElementById("poso-total-meds");

        if (elNome) elNome.textContent = pacienteNome;
        if (elIdade) elIdade.textContent = pacienteIdade;
        if (elSexo) elSexo.textContent = pacienteSexo;
        if (elData) {
            const hoje = new Date();
            elData.textContent = hoje.toLocaleDateString("pt-BR");
            const elDataAssinatura = document.getElementById("poso-data-assinatura");
            if (elDataAssinatura) elDataAssinatura.textContent = hoje.toLocaleDateString("pt-BR");
        }
        if (elTotalMeds) elTotalMeds.textContent = `${fcMedList.length} medicamento${fcMedList.length !== 1 ? "s" : ""}`;

        // Dados do farmacêutico logado
        const currentUser = window.USFAuth ? window.USFAuth.getCurrentUser() : null;
        const elFarma = document.getElementById("poso-meta-farma");
        const elFarmaAssinatura = document.getElementById("poso-assinatura-farma");
        const elUSF = document.getElementById("poso-meta-usf");
        if (currentUser) {
            if (elFarma) elFarma.textContent = currentUser.nome || "--";
            if (elFarmaAssinatura) elFarmaAssinatura.textContent = currentUser.nome || "Farmacêutico(a) Responsável";
            if (elUSF) elUSF.textContent = currentUser.usf || "USF Saúde da Família";
        }

        // Alertas especiais (Beers / Polifarmácia)
        const alertsBox = document.getElementById("poso-alerts-box");
        const alertsList = document.getElementById("poso-alerts-list");
        const beersAlerts = fcMedList.filter(m => m.beersCriteria);
        const polifarmacia = fcMedList.length >= 5;
        if (alertsList) alertsList.innerHTML = "";
        if (alertsBox) {
            const alertItems = [];
            if (polifarmacia) {
                alertItems.push(`<li><strong>Polifarmácia:</strong> Este paciente utiliza ${fcMedList.length} medicamentos contínuos. Maior risco de interações medicamentosas.</li>`);
            }
            beersAlerts.forEach(m => {
                alertItems.push(`<li><strong>${m.nome} (Critério de Beers):</strong> ${m.beersAlerta || "Medicamento potencialmente inapropriado para idosos."}</li>`);
            });
            if (alertItems.length > 0) {
                alertsBox.style.display = "block";
                if (alertsList) alertsList.innerHTML = alertItems.join("");
            } else {
                alertsBox.style.display = "none";
            }
        }

        // Pictogramas de identificação do medicamento
        const pictoBar = document.getElementById("poso-pictogram-bar");
        const pictoContent = document.getElementById("poso-pictogram-content");
        if (pictoBar && pictoContent && fcMedList.length > 0) {
            const formas = { comprimido: "🟡", capsula: "🔵", xarope: "🟢", solucao: "🔵", inalador: "💨", patch: "🟠", supositorio: "🟤" };
            const uniqueDoses = [...new Set(fcMedList.map(m => m.dose).filter(Boolean))];
            if (uniqueDoses.length > 0) {
                pictoBar.style.display = "block";
                pictoContent.innerHTML = fcMedList.map(m => {
                    const nomeLow = m.nome.toLowerCase();
                    const forma = nomeLow.includes("xar") || nomeLow.includes("solucao") ? "🟢 Líquido" :
                                  nomeLow.includes("inal") || nomeLow.includes("aerosol") ? "💨 Inalador" :
                                  nomeLow.includes("adesivo") || nomeLow.includes("patch") ? "🟠 Adesivo" :
                                  nomeLow.includes("cap") ? "🔵 Cápsula" : "🟡 Comprimido";
                    return `<span style="background:white;border:1px solid #bbf7d0;border-radius:6px;padding:4px 8px;display:inline-flex;align-items:center;gap:4px;">${forma} <strong>${m.nome.split(" ")[0]}</strong> — ${m.dose}</span>`;
                }).join("");
            } else {
                pictoBar.style.display = "none";
            }
        }

        // Popular tabela de medicamentos
        const tableBody = document.getElementById("poso-table-body");
        if (tableBody) {
            tableBody.innerHTML = "";

            if (!fcMedList || fcMedList.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">
                            <strong>Nenhum medicamento cadastrado.</strong><br>
                            Volte ao Passo 3 (Farmacoterapia) e adicione os medicamentos em uso pelo paciente.
                        </td>
                    </tr>
                `;
            } else {
                fcMedList.forEach((med, idx) => {
                    const tr = document.createElement("tr");

                    let orientacaoTxt = med.obs || "";
                    if (!orientacaoTxt && typeof MEDICAMENTOS !== "undefined") {
                        const dbMed = MEDICAMENTOS.find(m => m.nome.toLowerCase() === med.nome.toLowerCase());
                        if (dbMed && dbMed.orientacoes) {
                            orientacaoTxt = dbMed.orientacoes;
                        }
                    }
                    if (!orientacaoTxt) orientacaoTxt = "Tomar com água conforme prescrição médica.";

                    const beersTag = med.beersCriteria
                        ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;background:#fee2e2;color:#991b1b;padding:2px 7px;border-radius:5px;font-weight:800;margin-top:4px;">⚠️ CRITÉRIO DE BEERS</span>`
                        : "";

                    const formatDose = (val, period) => {
                        const num = parseFloat(val);
                        const periodColors = {
                            manha: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
                            tarde: { bg: '#fff7ed', border: '#f97316', text: '#9a3412' },
                            noite: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' }
                        };
                        const pc = periodColors[period] || {};
                        if (isNaN(num) || num <= 0) {
                            return `<span class="poso-dose-badge zero-dose" title="Não toma neste período">—</span>`;
                        }
                        const unit = num === 0.5 ? 'cp' : (num === 1 ? 'cp' : 'cps');
                        return `<span class="poso-dose-badge active-dose"><span class="dose-num">${num}</span><span class="dose-unit">${unit}</span></span>`;
                    };

                    tr.style.background = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
                    tr.innerHTML = `
                        <td style="min-width:140px;">
                            <strong class="poso-med-name">${med.nome}</strong>
                            <span class="poso-med-dose-tag">Dose: ${med.dose}</span>
                            ${beersTag}
                        </td>
                        <td style="text-align: center; background:#fffbeb; min-width:72px;">${formatDose(med.manha, 'manha')}</td>
                        <td style="text-align: center; background:#fff7ed; min-width:72px;">${formatDose(med.tarde, 'tarde')}</td>
                        <td style="text-align: center; background:#eff6ff; min-width:72px;">${formatDose(med.noite, 'noite')}</td>
                        <td style="font-size: 12.5px; line-height: 1.6; color: #1e293b; font-weight:500;">${orientacaoTxt}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            }
        }

        // Função para gerar texto WhatsApp
        const gerarTextoWhatsApp = () => {
            const hora_m = document.getElementById("poso-hora-manha")?.value || "07:00";
            const hora_t = document.getElementById("poso-hora-tarde")?.value || "12:00";
            const hora_n = document.getElementById("poso-hora-noite")?.value || "19:00";
            let texto = `*📋 PLANO POSOLÓGICO — FarmaUSF*\n`;
            texto += `*Paciente:* ${pacienteNome} | *Idade:* ${pacienteIdade} anos\n`;
            texto += `*Data:* ${new Date().toLocaleDateString("pt-BR")}\n\n`;
            texto += `*💊 Seus Medicamentos:*\n`;
            fcMedList.forEach(m => {
                texto += `\n*${m.nome}* (${m.dose})\n`;
                if (parseFloat(m.manha) > 0) texto += `  ☀️ Manhã (${hora_m}): ${m.manha} cp\n`;
                if (parseFloat(m.tarde) > 0) texto += `  🌤️ Tarde (${hora_t}): ${m.tarde} cp\n`;
                if (parseFloat(m.noite) > 0) texto += `  🌙 Noite (${hora_n}): ${m.noite} cp\n`;
                if (m.obs) texto += `  📌 ${m.obs}\n`;
            });
            texto += `\n⚠️ *Não interrompa nenhum medicamento sem avisar o médico ou farmacêutico.*\n`;
            texto += `_Dúvidas? Procure a farmácia da USF._`;
            return texto;
        };

        // Botões WhatsApp
        const setupWhatsappButton = (btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.onclick = () => {
                    const texto = gerarTextoWhatsApp();
                    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
                    window.open(url, "_blank");
                };
            }
        };
        setupWhatsappButton("btn-poso-whatsapp");
        setupWhatsappButton("btn-poso-whatsapp-footer");

        posoModalOverlay.classList.add("active");
        posoModalOverlay.classList.add("open");
        if (window.lucide) lucide.createIcons();
    };

    // Atualizar horários exibidos na legenda do plano
    window.atualizarHorariosPlano = function () {
        const hora_m = document.getElementById("poso-hora-manha")?.value || "07:00";
        const hora_t = document.getElementById("poso-hora-tarde")?.value || "12:00";
        const hora_n = document.getElementById("poso-hora-noite")?.value || "19:00";
        const labelM = document.getElementById("poso-label-manha");
        const labelT = document.getElementById("poso-label-tarde");
        const labelN = document.getElementById("poso-label-noite");
        if (labelM) labelM.textContent = `Café da manhã — ${hora_m}`;
        if (labelT) labelT.textContent = `Almoço — ${hora_t}`;
        if (labelN) labelN.textContent = `Jantar — ${hora_n}`;
        if (window.showToast) window.showToast("Horários do plano atualizados!", "success");
    };

    window.closePosologiaModal = function () {
        if (posoModalOverlay) {
            posoModalOverlay.classList.remove("active");
            posoModalOverlay.classList.remove("open");
        }
    };

    if (posoModalClose) posoModalClose.addEventListener("click", closePosologiaModal);
    if (btnPosoFechar) btnPosoFechar.addEventListener("click", closePosologiaModal);
    if (posoModalOverlay) {
        posoModalOverlay.addEventListener("click", (e) => {
            if (e.target === posoModalOverlay) closePosologiaModal();
        });
    }

    if (btnExportarSheets) {
        btnExportarSheets.addEventListener("click", () => {
            const url = localStorage.getItem("cim_sheets_url");
            if (!url) openSheetsModal();
            else exportToGoogleSheets(url);
        });
    }

    if (sheetsModalClose) sheetsModalClose.addEventListener("click", closeSheetsModal);
    if (btnSheetsCancelar) btnSheetsCancelar.addEventListener("click", closeSheetsModal);

    if (btnCopyScript) {
        btnCopyScript.addEventListener("click", () => {
            const code = document.getElementById("apps-script-code")?.textContent || "";
            navigator.clipboard.writeText(code)
                .then(() => alert("Código do Apps Script copiado!"))
                .catch(() => alert("Erro ao copiar."));
        });
    }

    if (btnSheetsSalvar) {
        btnSheetsSalvar.addEventListener("click", () => {
            const url = sheetsUrlInput.value.trim();
            if (!url) {
                localStorage.removeItem("cim_sheets_url");
                alert("Configuração removida.");
                closeSheetsModal();
                updateSheetsStatus();
                return;
            }
            if (!url.startsWith("https://script.google.com/")) {
                alert("A URL deve ser do domínio script.google.com");
                return;
            }
            localStorage.setItem("cim_sheets_url", url);
            alert("Configuração do Google Sheets salva!");
            closeSheetsModal();
            updateSheetsStatus();
        });
    }

    if (btnTestarSheets) {
        btnTestarSheets.addEventListener("click", () => {
            const url = sheetsUrlInput.value.trim();
            if (!url) { alert("Insira a URL do Web App antes de testar."); return; }
            if (sheetsTestResult) {
                sheetsTestResult.className = "sheets-test-result";
                sheetsTestResult.style.display = "block";
                sheetsTestResult.textContent = "Testando conexão...";
            }
            fetch(url)
                .then(res => {
                    if (sheetsTestResult) {
                        sheetsTestResult.className = "sheets-test-result success";
                        sheetsTestResult.style.display = "block";
                        sheetsTestResult.textContent = "Conexão estabelecida com sucesso!";
                    }
                })
                .catch(err => {
                    if (sheetsTestResult) {
                        sheetsTestResult.className = "sheets-test-result success";
                        sheetsTestResult.style.display = "block";
                        sheetsTestResult.textContent = "Conexão detectada! (Nota: Resposta recebida da API Google Apps Script).";
                    }
                });
        });
    }

    function exportToGoogleSheets(url) {
        const nome = inputNome.value.trim();
        const idade = parseInt(inputIdade.value.trim());

        if (!nome || !idade) {
            alert("Por favor, preencha o Nome e Idade do paciente para exportar.");
            return;
        }

        const paSis = parseInt(inputPaSis.value) || null;
        const paDia = parseInt(inputPaDia.value) || null;
        const glicemia = parseInt(inputGlicemia.value) || null;

        let paControlada = null;
        if (paSis && paDia) paControlada = (paSis < 140 && paDia < 90);
        let glicemiaControlada = null;
        if (glicemia) glicemiaControlada = (glicemia < 126);

        const consultData = {
            data: new Date().toLocaleDateString("pt-BR"),
            paciente: nome,
            idade: idade,
            sexo: selectSexo.value,
            paSistolica: paSis,
            paDiastolica: paDia,
            paControlada: paControlada,
            glicemia: glicemia,
            glicemiaControlada: glicemiaControlada,
            medicamentosCount: parseInt(inputMedicamentosCount.value) || 1,
            antibioticoUso: (selectAntibioticoUso.value === "Sim"),
            antibioticoRacional: (selectAntibioticoUso.value === "Sim") ? (selectAntibioticoRacional.value === "Sim") : null,
            adesaoMorisky: getMoriskyScore(),
            prm: selectPrm.value,
            intervencaoTipo: selectIntervencaoTipo.value,
            intervencaoStatus: selectIntervencaoStatus.value,
            clearanceRenal: clCrCalculado,
            drcEstagio: clCrCalculado !== null ? getDrcEstagio(clCrCalculado) : "",
            prmListString: prmList.map((p, idx) => `PRM ${idx + 1}: [${p.medicamento}] ${p.classificacao} - ${p.descricao}`).join(" | "),
            medListString: fcMedList.map((m, idx) => `${idx + 1}. ${m.nome} (${m.dose}) ${m.manha}-${m.tarde}-${m.noite}`).join(" | "),
            conduta: txtP.value.trim() || `Realizada intervenção: ${selectIntervencaoTipo.value}.`
        };

        if (sheetsStatusBar) {
            sheetsStatusBar.style.display = "block";
            sheetsStatusBar.innerHTML = `<span style="color:var(--warning-color); font-weight:600;"><i data-lucide="loader" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px; animation: spin 1s linear infinite;"></i> Enviando dados para o Google Sheets...</span>`;
            if (window.lucide) lucide.createIcons();
        }

        fetch(url, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(consultData)
        })
            .then(() => {
                alert("Dados exportados para a planilha Google Sheets com sucesso!");
                updateSheetsStatus();
            })
            .catch(err => {
                console.error("Erro na exportação para o Sheets:", err);
                alert("Erro ao enviar dados para a planilha. Verifique a URL do Web App.");
                updateSheetsStatus();
            });
    }

    // Wizard Control
    window.currentStep = 1;

    window.goToStep = function (step) {
        if (step < 1 || step > 5) return;
        const prevStepNum = window.currentStep;
        window.currentStep = step;

        const panels = document.querySelectorAll(".wizard-panel");
        panels.forEach(p => {
            p.classList.remove("active");
            p.classList.remove("going-back");
            if (p.id === `wizard-panel-${step}`) {
                p.classList.add("active");
                if (step < prevStepNum) p.classList.add("going-back");
            }
        });

        const stepsNavItems = document.querySelectorAll(".wizard-step-item");
        stepsNavItems.forEach((navItem, idx) => {
            const itemStep = idx + 1;
            navItem.classList.remove("active");
            navItem.classList.remove("done");
            if (itemStep === step) navItem.classList.add("active");
            else if (itemStep < step) navItem.classList.add("done");
        });

        const connectors = document.querySelectorAll(".wizard-connector");
        connectors.forEach((conn, idx) => {
            const connStep = idx + 1;
            conn.classList.remove("active");
            conn.classList.remove("done");
            if (connStep < step) conn.classList.add("done");
            else if (connStep === step - 1) conn.classList.add("active");
        });

        updateWizardSummary();

        if (step === 5) {
            consolidarParaSoap();
            updateFormattedText();
        }

        const wizardEl = document.querySelector(".soap-wizard");
        if (wizardEl) wizardEl.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.nextStep = function (current) {
        if (validateStep(current)) window.goToStep(current + 1);
    };

    window.prevStep = function (current) {
        window.goToStep(current - 1);
    };

    window.validateStep = function (step) {
        let valid = true;
        const errNome = document.getElementById("err-soap-nome");
        const errIdade = document.getElementById("err-soap-idade");
        if (errNome) { errNome.textContent = ""; inputNome?.classList.remove("field-invalid"); }
        if (errIdade) { errIdade.textContent = ""; inputIdade?.classList.remove("field-invalid"); }

        if (step === 1) {
            if (!inputNome?.value.trim()) {
                if (errNome) errNome.textContent = "O nome ou iniciais do paciente é obrigatório.";
                inputNome?.classList.add("field-invalid");
                valid = false;
            }
            const idVal = parseInt(inputIdade?.value);
            if (isNaN(idVal) || idVal < 0) {
                if (errIdade) errIdade.textContent = "Por favor, informe uma idade válida.";
                inputIdade?.classList.add("field-invalid");
                valid = false;
            }
        }
        return valid;
    };

    function recalculateVitalsInStep1() {
        const peso = parseFloat(inputPeso?.value);
        const altura = parseFloat(inputAltura?.value);
        const imcWrapper = document.getElementById("imc-badge-inline-wrapper");
        const imcValor = document.getElementById("imc-valor-inline");
        const imcLabel = document.getElementById("imc-class-inline-label");

        if (peso && altura && altura > 0) {
            const imc = peso / (altura * altura);
            if (imcValor) imcValor.textContent = `${imc.toFixed(1)} kg/m²`;
            if (imcWrapper) {
                imcWrapper.className = "imc-badge-inline";
                if (imc >= 30) {
                    imcWrapper.classList.add("imc-danger");
                    if (imcLabel) imcLabel.textContent = "IMC: Obesidade";
                } else if (imc >= 25) {
                    imcWrapper.classList.add("imc-warn");
                    if (imcLabel) imcLabel.textContent = "IMC: Sobrepeso";
                } else if (imc >= 18.5) {
                    imcWrapper.classList.add("imc-ok");
                    if (imcLabel) imcLabel.textContent = "IMC: Peso Ideal";
                } else {
                    imcWrapper.classList.add("imc-warn");
                    if (imcLabel) imcLabel.textContent = "IMC: Baixo Peso";
                }
            }
        } else {
            if (imcValor) imcValor.textContent = "-- kg/m²";
            if (imcLabel) imcLabel.textContent = "IMC: Aguardando dados";
            if (imcWrapper) imcWrapper.className = "imc-badge-inline";
        }

        const paSis = parseInt(inputPaSis?.value);
        const paDia = parseInt(inputPaDia?.value);
        const paBadge = document.getElementById("pa-badge-inline");
        const htPaVal = document.getElementById("ht-pa-val");
        const htPaClass = document.getElementById("ht-pa-class");

        if (paSis && paDia) {
            if (htPaVal) htPaVal.value = `${paSis}/${paDia}`;

            let paClassStr = "";
            let badgeClass = "";

            if (paSis >= 160 || paDia >= 100) {
                paClassStr = "HAS Estágio 2/3";
                badgeClass = "vitals-badge-danger";
                if (htPaClass) htPaClass.value = "HAS Estágio 2 ou 3 (>=160/100)";
            } else if (paSis >= 140 || paDia >= 90) {
                paClassStr = "HAS Estágio 1";
                badgeClass = "vitals-badge-danger";
                if (htPaClass) htPaClass.value = "HAS Estágio 1 (140-159/90-99)";
            } else if (paSis >= 130 || paDia >= 85) {
                paClassStr = "Pré-hipertensão";
                badgeClass = "vitals-badge-warning";
                if (htPaClass) htPaClass.value = "Pré-hipertensão (130-139/85-89)";
            } else {
                paClassStr = "Normal";
                badgeClass = "vitals-badge-ok";
                if (htPaClass) htPaClass.value = "Normal (<130/85)";
            }

            if (paBadge) {
                paBadge.className = `vitals-badge ${badgeClass}`;
                paBadge.textContent = `PA: ${paSis}/${paDia} mmHg (${paClassStr})`;
            }
        } else {
            if (paBadge) {
                paBadge.className = "vitals-badge vitals-badge-neutral";
                paBadge.textContent = "PA: Aguardando dados";
            }
        }

        const creatVal = parseFloat(document.getElementById("cg-creatinina")?.value);
        const clcrBadge = document.getElementById("clcr-badge-inline");
        const cgResultBox = document.getElementById("cg-result-box");

        if (creatVal && creatVal > 0 && peso && peso > 0 && parseInt(inputIdade?.value) > 0) {
            const idade = parseInt(inputIdade.value);
            const sexo = selectSexo?.value;
            let clcr = ((140 - idade) * peso) / (72 * creatVal);
            if (sexo === "F") clcr = clcr * 0.85;
            clCrCalculado = parseFloat(clcr.toFixed(1));

            let drcEst = "";
            let badgeClass = "";
            if (clCrCalculado >= 90) { drcEst = "G1"; badgeClass = "vitals-badge-ok"; }
            else if (clCrCalculado >= 60) { drcEst = "G2"; badgeClass = "vitals-badge-ok"; }
            else if (clCrCalculado >= 45) { drcEst = "G3a"; badgeClass = "vitals-badge-warning"; }
            else if (clCrCalculado >= 30) { drcEst = "G3b"; badgeClass = "vitals-badge-warning"; }
            else if (clCrCalculado >= 15) { drcEst = "G4"; badgeClass = "vitals-badge-danger"; }
            else { drcEst = "G5"; badgeClass = "vitals-badge-danger"; }

            if (clcrBadge) {
                clcrBadge.className = `vitals-badge ${badgeClass}`;
                clcrBadge.textContent = `TFG (ClCr): ${clCrCalculado} mL/min (${drcEst})`;
            }

            if (typeof processarAjustesRenais === "function") {
                processarAjustesRenais(clCrCalculado);
            }

            if (cgResultBox) {
                cgResultBox.style.display = "block";
                let drcClass = clCrCalculado >= 90 ? "G1 (Normal)" : (clCrCalculado >= 60 ? "G2 (Levemente Diminuído)" : (clCrCalculado >= 45 ? "G3a (Diminuição Leve-Mod)" : (clCrCalculado >= 30 ? "G3b (Diminuição Mod-Severa)" : (clCrCalculado >= 15 ? "G4 (Diminuição Severa)" : "G5 (Falência Renal)"))));
                cgResultBox.innerHTML = `
                    <div style="font-weight: 700; font-size: 13px; color: ${clCrCalculado < 30 ? 'var(--danger-color)' : (clCrCalculado < 60 ? 'var(--warning-color)' : 'var(--success-color)')}">
                        Clearance: ${clCrCalculado} mL/min
                    </div>
                    <div style="font-weight: 600; font-size: 11px;">${drcClass}</div>
                `;
            }
        } else {
            clCrCalculado = null;
            if (clcrBadge) {
                clcrBadge.className = "vitals-badge vitals-badge-neutral";
                clcrBadge.textContent = "Função Renal: Creatinina pendente";
            }
            if (cgResultBox) cgResultBox.style.display = "none";
        }

        // Avaliação Respiratória Dinâmica (SpO2 & Sinais de Alerta)
        const inputSpo2 = document.getElementById("soap-spo2");
        const spo2Badge = document.getElementById("spo2-badge-inline");
        if (spo2Badge && inputSpo2) {
            const spo2Val = parseInt(inputSpo2.value);
            if (!isNaN(spo2Val) && spo2Val > 0) {
                if (spo2Val < 92) {
                    spo2Badge.className = "vitals-badge vitals-badge-danger vitals-badge-spo2-perigo";
                    spo2Badge.textContent = `SpO₂: ${spo2Val}% (Hipoxemia Grave)`;
                } else if (spo2Val <= 94) {
                    spo2Badge.className = "vitals-badge vitals-badge-warning vitals-badge-spo2-alerta";
                    spo2Badge.textContent = `SpO₂: ${spo2Val}% (Alerta / Limítrofe)`;
                } else {
                    spo2Badge.className = "vitals-badge vitals-badge-ok vitals-badge-spo2-normal";
                    spo2Badge.textContent = `SpO₂: ${spo2Val}% (Adequada)`;
                }
            } else {
                spo2Badge.className = "vitals-badge vitals-badge-neutral";
                spo2Badge.textContent = "SpO₂: Aguardando";
            }
        }

        updateWizardSummary();
    }

    function updateWizardSummary() {
        const summaryContainer = document.getElementById("wizard-summary-content");
        if (!summaryContainer) return;

        const nome = inputNome?.value.trim();
        const idade = parseInt(inputIdade?.value);
        const sexo = selectSexo?.value === "F" ? "Fem" : "Masc";
        const peso = parseFloat(inputPeso?.value) || null;
        const altura = parseFloat(inputAltura?.value) || null;
        const paSis = parseInt(inputPaSis?.value) || null;
        const paDia = parseInt(inputPaDia?.value) || null;
        const glic = parseInt(inputGlicemia?.value) || null;

        if (!nome && isNaN(idade)) {
            summaryContainer.innerHTML = `<div style="font-size: 11px; color: var(--text-tertiary); text-align: center; padding: 12px;">Preencha a Identificação para ver o resumo.</div>`;
            return;
        }

        let html = `<div style="display:flex; flex-direction:column; gap:8px; font-size:12px;">`;
        html += `
            <div style="padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:6px; font-weight:700; color:var(--color-primary); margin-bottom:4px;">
                    <i data-lucide="user" style="width:12px;height:12px;"></i> Paciente
                </div>
                <strong>${nome || "Iniciais pendentes"}</strong>
                <div style="color:var(--text-secondary); font-size:11px;">Idade: ${isNaN(idade) ? "—" : idade + " anos"} | Sexo: ${sexo}</div>
            </div>
        `;

        if (peso || paSis || glic || clCrCalculado) {
            html += `
                <div style="padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="display:flex; align-items:center; gap:6px; font-weight:700; color:var(--color-secondary); margin-bottom:6px;">
                        <i data-lucide="activity" style="width:12px;height:12px;"></i> Sinais Vitais & Labs
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; font-size:11px;">
            `;
            if (paSis && paDia) html += `<div><strong>PA:</strong> ${paSis}/${paDia}</div>`;
            if (glic) html += `<div><strong>Glic:</strong> ${glic} mg/dL</div>`;
            if (peso && altura) {
                const imc = peso / (altura * altura);
                html += `<div><strong>IMC:</strong> ${imc.toFixed(1)}</div>`;
            }
            if (clCrCalculado) html += `<div><strong>ClCr:</strong> ${clCrCalculado} mL/min</div>`;
            html += `</div></div>`;
        }

        const medsCount = fcMedList.length;
        const prmsCount = prmList.length;
        const moriskyScore = getMoriskyScore();

        html += `
            <div style="padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:6px; font-weight:700; color:var(--warning-color); margin-bottom:4px;">
                    <i data-lucide="clipboard-list" style="width:12px;height:12px;"></i> Farmacoterapia & Segurança
                </div>
                <div style="display:flex; flex-direction:column; gap:4px; font-size:11px; color:var(--text-secondary);">
                    <div>Medicamentos: <strong>${medsCount}</strong></div>
                    <div>Adesão (Morisky): <strong>${moriskyScore}/4</strong></div>
                    <div>PRMs identificados: <strong>${prmsCount}</strong></div>
                </div>
            </div>
        `;

        html += `</div>`;
        summaryContainer.innerHTML = html;
        if (window.lucide) lucide.createIcons();
    }

    const inputsStep1 = [
        inputPeso, inputAltura, inputPaSis, inputPaDia, inputGlicemia,
        document.getElementById("cg-creatinina"), inputIdade, selectSexo,
        document.getElementById("soap-spo2"), document.getElementById("soap-fr"), document.getElementById("soap-pfe")
    ];
    inputsStep1.forEach(el => {
        if (el) {
            el.addEventListener("input", recalculateVitalsInStep1);
            el.addEventListener("change", recalculateVitalsInStep1);
        }
    });

    function consolidarParaSoap() {
        const tipoAtend = document.getElementById("soap-atendimento-tipo")?.value || "Consulta em USF / Ambulatorial";
        const isVDF = tipoAtend.includes("Visita Domiciliar");

        // --- SUBJETIVO [S] ---
        let subLines = [];
        if (isVDF) {
            const motivo = document.getElementById("soap-vdf-motivo")?.value || "Avaliação de Polifarmácia em Domicílio";
            const cuidador = document.getElementById("soap-vdf-cuidador")?.value || "Familiar / Cuidador principal responsável";
            subLines.push(`• Modalidade: Visita Domiciliar Farmacêutica (VDF). Motivo: ${motivo}. Acompanhamento por: ${cuidador}.`);
        } else {
            subLines.push(`• Modalidade: Consulta Farmacêutica Ambulatorial na USF.`);
        }

        // Adesão (Morisky-Green ou MAT)
        if (activeAdherenceScale === "mat") {
            const matScore = parseFloat(getMatAverageScore());
            const classMat = matScore >= 5.0 ? `Elevada Adesão (${matScore}/6)` : `Adesão Insuficiente (${matScore}/6)`;
            let matFactores = [];
            if (matAnswers[1] < 5) matFactores.push("Esquecimento eventual de doses");
            if (matAnswers[2] < 5) matFactores.push("Descuido com os horários das tomadas");
            if (matAnswers[3] < 5) matFactores.push("Interrupção da medicação quando se sente bem");
            if (matAnswers[4] < 5) matFactores.push("Interrupção por conta própria quando sente mal-estar");
            if (matAnswers[5] < 5) matFactores.push("Não toma os remédios quando sente mal-estar");
            if (matAnswers[6] < 5) matFactores.push("Aumento da dose por conta própria ao sentir piora");
            if (matAnswers[7] < 5) matFactores.push("Interrupção por término/falta do medicamento em casa");

            let adesaoStr = `• Perfil de Adesão (Escala MAT): ${classMat}.`;
            if (matFactores.length > 0) {
                adesaoStr += ` Barreira(s) observada(s): ${matFactores.join("; ")}.`;
            }
            subLines.push(adesaoStr);
        } else {
            const scoreMgt = getMoriskyScore();
            const classMgt = scoreMgt === 4 ? "Alta Adesão (4/4)" : `Média/Baixa Adesão (${scoreMgt}/4)`;
            let mgtRazao = [];
            if (moriskyAnswers[1] === 0) mgtRazao.push("Esquecimento eventual de doses");
            if (moriskyAnswers[2] === 0) mgtRazao.push("Descuidado com os horários das tomadas");
            if (moriskyAnswers[3] === 0) mgtRazao.push("Interrupção da medicação quando se sente bem");
            if (moriskyAnswers[4] === 0) mgtRazao.push("Interrupção por conta própria quando sente mal-estar");

            let adesaoStr = `• Perfil de Adesão (Morisky-Green): ${classMgt}.`;
            if (mgtRazao.length > 0) {
                adesaoStr += ` Fatores associados: ${mgtRazao.join("; ")}.`;
            }
            subLines.push(adesaoStr);
        }

        // Queixas ativas das Linhas de Cuidado
        const monTosse = document.getElementById('ht-mon-tosse')?.checked;
        const monEdema = document.getElementById('ht-mon-edema')?.checked;
        const hipoGlicemia = document.getElementById('md-chk-hipo')?.checked;
        const chkQuedas = document.getElementById('id-chk-quedas')?.checked;

        if (monTosse) subLines.push("• Queixa Ativa: Relato de tosse seca contínua (suspeita de reação adversa por IECA).");
        if (monEdema) subLines.push("• Queixa Ativa: Relato de edema em membros inferiores (suspeita de reação adversa por BCC).");
        if (hipoGlicemia) subLines.push("• Queixa Ativa: Relato de episódios recorrentes de hipoglicemia residencial.");
        if (chkQuedas) subLines.push("• Queixa Ativa: Histórico de queda no último ano relatado pelo paciente ou cuidador.");

        // --- OBJETIVO [O] ---
        let objLines = [];

        if (isVDF) {
            const armaz = document.getElementById("soap-vdf-armazenamento")?.value || "Adequado";
            const estoque = document.getElementById("soap-vdf-estoque")?.value || "Sem sobras excessivas";
            objLines.push(`• Avaliação do Domicílio: Armazenamento: ${armaz} | Estoque Residencial: ${estoque}.`);
        }

        // Sinais vitais e Antropometria
        const peso = parseFloat(inputPeso?.value);
        const altura = parseFloat(inputAltura?.value);
        let imcValStr = "Não calculado";
        if (peso && altura) {
            const imc = (peso / (altura * altura)).toFixed(1);
            let imcClass = "Eutrófico";
            if (imc < 18.5) imcClass = "Baixo Peso";
            else if (imc >= 25 && imc < 30) imcClass = "Sobrepeso";
            else if (imc >= 30) imcClass = "Obesidade";
            imcValStr = `${imc} kg/m² (${imcClass})`;
        }

        const paSis = inputPaSis?.value.trim();
        const paDia = inputPaDia?.value.trim();
        let paValStr = "Não aferida";
        if (paSis && paDia) {
            const s = parseInt(paSis);
            const d = parseInt(paDia);
            let paClass = "Normal (<130/85)";
            if (s >= 160 || d >= 100) paClass = "HAS Estágio 2/3 (≥160/100)";
            else if (s >= 140 || d >= 90) paClass = "HAS Estágio 1 (140-159/90-99)";
            else if (s >= 130 || d >= 85) paClass = "Pré-hipertensão (130-139/85-89)";
            paValStr = `${paSis}/${paDia} mmHg (${paClass})`;
        }

        const glicemia = inputGlicemia?.value.trim();
        const gliValStr = glicemia ? `${glicemia} mg/dL` : "Não aferida";

        objLines.push(`• Biometria e Vitais: Peso: ${peso || '--'} kg | Altura: ${altura || '--'} m | IMC: ${imcValStr}`);
        objLines.push(`• Parâmetros Clínicos: Pressão Arterial: ${paValStr} | Glicemia Capilar: ${gliValStr}`);

        // Parâmetros Respiratórios
        const spo2Val = document.getElementById("soap-spo2")?.value.trim();
        const frVal = document.getElementById("soap-fr")?.value.trim();
        const pfeVal = document.getElementById("soap-pfe")?.value.trim();
        let respVitais = [];
        if (spo2Val) respVitais.push(`SpO₂: ${spo2Val}%`);
        if (frVal) respVitais.push(`FR: ${frVal} irpm`);
        if (pfeVal) respVitais.push(`Peak Flow (PFE): ${pfeVal} L/min`);
        if (respVitais.length > 0) {
            objLines.push(`• Parâmetros Respiratórios: ${respVitais.join(" | ")}`);
        }
        const tecStatus = document.getElementById("soap-asthma-tecnica-status")?.value;
        const dispositivo = document.getElementById("soap-asthma-dispositivo")?.value;
        if (tecStatus && tecStatus !== "Não Avaliada") {
            objLines.push(`• Dispositivo Inalatório: ${dispositivo} (Técnica: ${tecStatus})`);
        }

        // Renal
        const creatVal = parseFloat(document.getElementById("cg-creatinina")?.value);
        if (clCrCalculado !== null) {
            let drcEstagio = getDrcEstagio(clCrCalculado);
            objLines.push(`• Função Renal (Cockcroft-Gault): ClCr estimado = ${clCrCalculado} mL/min (Creatinina: ${creatVal || '--'} mg/dL) — ${drcEstagio}`);
        }

        // Metas SAPS
        const isDiabetes = document.getElementById('meta-panel-diabetes')?.classList.contains('active');
        const isHipertensao = document.getElementById('meta-panel-hipertensao')?.classList.contains('active');
        const isIdoso = document.getElementById('meta-panel-idoso')?.classList.contains('active');

        if (isDiabetes) {
            const hba1cSemestre = document.getElementById('md-hba1c-semestre')?.value || "Não";
            const hba1cVal = document.getElementById('md-hba1c-val')?.value || "";
            const hba1cMeta = document.getElementById('md-hba1c-meta')?.value || "";
            const peDiabetico = document.getElementById('md-pe-diabetico')?.value || "Não realizado";
            const autoGlicemia = document.getElementById('md-chk-auto')?.checked ? 'Sim' : 'Não';
            const fundoOlho = document.getElementById('md-chk-olhos')?.checked ? 'Realizado' : 'Não realizado / Sem registro';

            let diabetesStr = `• Indicadores DM: HbA1c recente (${hba1cSemestre}): ${hba1cVal ? hba1cVal + '% (Meta: ' + hba1cMeta + ')' : 'Sem registro'}. Pé diabético: ${peDiabetico}. Automonitoramento: ${autoGlicemia}. Fundo de olho: ${fundoOlho}.`;
            objLines.push(diabetesStr);
        } else if (isHipertensao) {
            const paSemestre = document.getElementById('ht-pa-semestre')?.value || "Não";
            const loaCoracao = document.getElementById('ht-loa-coracao')?.checked;
            const loaRenal = document.getElementById('ht-loa-renal')?.checked;
            const loaCerebral = document.getElementById('ht-loa-cerebral')?.checked;
            let loas = [];
            if (loaCoracao) loas.push('HVE/Cardiopatia');
            if (loaRenal) loas.push('DRC');
            if (loaCerebral) loas.push('Histórico AVC/AIT');

            let hasStr = `• Indicadores HAS: Registrada no semestre: ${paSemestre}. Lesões em Órgãos-Alvo: ${loas.length > 0 ? loas.join(', ') : 'Não detectadas'}.`;
            objLines.push(hasStr);
        } else if (isIdoso) {
            const vulnerabilidade = document.getElementById('id-vulnerabilidade')?.value || "Robusto";
            const chkCognicao = document.getElementById('id-chk-cognicao')?.checked ? 'Sim' : 'Não';
            const chkAutonomia = document.getElementById('id-chk-autonomia')?.checked ? 'Sim' : 'Não';
            objLines.push(`• Avaliação Gerontológica: Vulnerabilidade: ${vulnerabilidade}. Suspeita de declínio cognitivo: ${chkCognicao}. Dependência AVDs: ${chkAutonomia}.`);
        }

        // Medicamentos em Uso
        const medCount = parseInt(inputMedicamentosCount?.value) || (fcMedList.length || 1);
        objLines.push(`• Total de Medicamentos em Uso Contínuo: ${medCount} (Polifarmácia ≥ 5: ${medCount >= 5 ? 'SIM' : 'NÃO'})`);

        if (fcMedList.length > 0) {
            objLines.push(`• Relação da Farmacoterapia Atual Cadastrada:`);
            fcMedList.forEach((m, idx) => {
                let posStr = `${m.manha} cp (Manhã) - ${m.tarde} cp (Tarde) - ${m.noite} cp (Noite)`;
                let obsStr = m.obs ? ` [Obs: ${m.obs}]` : "";
                objLines.push(`   ${idx + 1}. ${m.nome} (${m.dose}) — Posologia: ${posStr}${obsStr}`);
            });
        }

        const antibioUso = selectAntibioticoUso?.value || "Não";
        if (antibioUso === "Sim") {
            const antibioRacio = selectAntibioticoRacional?.value || "Sim";
            objLines.push(`• Antimicrobianos: Paciente em uso ativo de antibiótico. Avaliação de Uso Racional: ${antibioRacio}.`);
        }

        // --- AVALIAÇÃO [A] ---
        let assLines = [];
        if (activeAdherenceScale === "mat") {
            const matScore = parseFloat(getMatAverageScore());
            const classMat = matScore >= 5.0 ? `Elevada Adesão (${matScore}/6)` : `Adesão Insuficiente (${matScore}/6)`;
            assLines.push(`• Avaliação da Adesão (Escala MAT): ${classMat}.`);
        } else {
            const scoreMgt = getMoriskyScore();
            const classMgt = scoreMgt === 4 ? "Alta Adesão (4/4)" : `Média/Baixa Adesão (${scoreMgt}/4)`;
            assLines.push(`• Avaliação da Adesão (Morisky-Green): Escore ${scoreMgt}/4 (${classMgt}).`);
        }

        if (medCount >= 5) {
            assLines.push(`• Risco Clínico: Polifarmácia ativa (uso de ${medCount} medicamentos contínuos) — Risco elevado de interações, reações adversas e erros de administração.`);
        }

        // Beers
        let beersInUse = fcMedList.filter(m => m.beersCriteria);
        if (beersInUse.length > 0) {
            assLines.push(`• Medicamentos Potencialmente Inapropriados em Idosos (Critérios de Beers AGS 2023):`);
            beersInUse.forEach(m => {
                assLines.push(`   - ${m.nome}: ${m.beersAlerta}`);
            });
        }

        // PRMs
        if (prmList.length > 0) {
            assLines.push(`• Problemas Relacionados a Medicamentos / RNMs Detectados (Dáder):`);
            prmList.forEach((p, idx) => {
                assLines.push(`   - PRM ${idx + 1}: Fármaco [${p.medicamento}] | ${p.classificacao} | RNM: ${p.rnm}`);
            });
        } else if (selectPrm?.value && selectPrm.value !== "Nenhum") {
            assLines.push(`• PRM Principal Identificado: ${selectPrm.value}.`);
        } else if (prmList.length === 0) {
            assLines.push(`• Nenhum PRM crítico adicional registrado na triagem.`);
        }

        // DRC renal em A
        if (clCrCalculado !== null && clCrCalculado < 60) {
            let drcEstagio = getDrcEstagio(clCrCalculado);
            assLines.push(`• Função Renal Reduzida: TFG estimada ${clCrCalculado} mL/min (DRC ${drcEstagio.split(' ')[0]}) — Necessita de acompanhamento posológico e ajuste de medicamentos excretados por via renal.`);
        }

        // Avaliação Farmacoterapêutica da Asma (GINA / PCDT SUS)
        const temSalbutamol = fcMedList.some(m => m.nome.toLowerCase().includes("salbutamol"));
        const temCorticoideInal = fcMedList.some(m => m.nome.toLowerCase().includes("beclometasona") || m.nome.toLowerCase().includes("budesonida"));
        if (temSalbutamol && !temCorticoideInal) {
            assLines.push(`• ALERTA CRÍTICO GINA / PCDT: Paciente em uso isolado de Beta-2 Agonista de Curta Ação (Salbutamol) sem Corticoide Inalatório protetor de manutenção. Risco elevado de exacerbação grave e óbito por asma.`);
        }
        const temBetaBloq = fcMedList.some(m => m.nome.toLowerCase().includes("propranolol") || m.nome.toLowerCase().includes("timolol") || m.nome.toLowerCase().includes("carvedilol"));
        if (temBetaBloq && (temSalbutamol || ginaAvaliado)) {
            assLines.push(`• ALERTA DE SEGURANÇA: Betabloqueador prescrito em paciente com histórico ou sintomas de asma. Risco de desencadear broncoespasmo grave e diminuir efetividade dos broncodilatadores.`);
        }

        if (ginaAvaliado) {
            const totalSim = Object.values(ginaAnswers).filter(v => v === true).length;
            const statusGina = totalSim === 0 ? "Asma Controlada (0 critérios)" : (totalSim <= 2 ? `Asma Parcialmente Controlada (${totalSim} critérios)` : `Asma NÃO Controlada (${totalSim} critérios)`);
            assLines.push(`• Classificação de Controle Clínico da Asma (GINA - 4 semanas): ${statusGina}.`);
        }
        if (tecStatus === "Erros Críticos Detectados") {
            const checkedErrs = Array.from(document.querySelectorAll(".asthma-err-check:checked")).map(c => c.value);
            if (checkedErrs.length > 0) {
                assLines.push(`• Técnica Inalatória com Erros Críticos Detectados: ${checkedErrs.join("; ")}.`);
            } else {
                assLines.push(`• Técnica inalatória deficiente, necessitando retreinamento presencial.`);
            }
        }

        // --- PLANO [P] ---
        let planLines = [];
        const intervencaoTipo = selectIntervencaoTipo?.value || "Orientação farmacoterapêutica";
        const intervencaoStatus = selectIntervencaoStatus?.value || "Pendente";
        planLines.push(`1. Conduta/Intervenção Farmacêutica: ${intervencaoTipo} (Status na Equipe: ${intervencaoStatus}).`);

        let itemNum = 2;
        if (temSalbutamol && !temCorticoideInal) {
            planLines.push(`${itemNum}. Intervenção com a Equipe Médica: Sugerir prescrição de Corticoide Inalatório (Beclometasona) para manutenção e prevenção de crises, conforme diretrizes GINA / PCDT SUS.`);
            itemNum++;
        }

        if (tecStatus === "Erros Críticos Detectados" || ginaAvaliado) {
            planLines.push(`${itemNum}. Educação em Técnica Inalatória: Realizado treino prático presencial do dispositivo inalatório com espaçador valvulado (agitar, expirar antes, inspirar lento/profundo, apneia de 10 segundos e bochecho oral pós-corticoide para prevenção de candidíase e disfonia).`);
            itemNum++;
            planLines.push(`${itemNum}. Plano de Ação Escrito da Asma: Elaborado e entregue o plano personalizado de manejo (Zonas Verde, Amarela e Vermelha) para conduta precoce em crises.`);
            itemNum++;
        }

        if (prmList.length > 0) {
            planLines.push(`${itemNum}. Plano de Ação para os PRMs/RNMs Identificados:`);
            prmList.forEach(p => {
                planLines.push(`   - Para [${p.medicamento}]: ${p.descricao}`);
            });
            itemNum++;
        }

        if (clCrCalculado !== null && clCrCalculado < 60) {
            let alertasTexto = [];
            fcMedList.forEach(med => {
                const nomeMed = med.nome.toLowerCase();
                if (nomeMed.includes('metformina')) {
                    if (clCrCalculado < 30) alertasTexto.push("Metformina: Contraindicada (ClCr < 30 mL/min). Sugerir suspensão.");
                    else if (clCrCalculado < 45) alertasTexto.push("Metformina: Reduzir dose máxima para 1000 mg/dia.");
                } else if (nomeMed.includes('glibenclamida') && clCrCalculado < 50) {
                    alertasTexto.push("Glibenclamida: Risco de hipoglicemia grave em DRC. Sugerir substituição.");
                } else if (nomeMed.includes('enalapril') && clCrCalculado < 30) {
                    alertasTexto.push("Enalapril: Reduzir dose inicial (2,5 mg/dia) e monitorar K+ sérico.");
                } else if (nomeMed.includes('espironolactona') && clCrCalculado < 30) {
                    alertasTexto.push("Espironolactona: Contraindicada em ClCr < 30 mL/min por risco de hipercalemia.");
                }
            });

            if (alertasTexto.length > 0) {
                planLines.push(`${itemNum}. Proposta de Ajustes Posológicos por Função Renal Reduzida:`);
                alertasTexto.forEach(a => planLines.push(`   - ${a}`));
                itemNum++;
            }
        }

        planLines.push(`${itemNum}. Orientações ao Paciente: Explicado uso correto das medicações, acompanhamento de sintomas e hábitos de vida saudáveis.`);
        itemNum++;
        if (isVDF) {
            planLines.push(`${itemNum}. Conservação Domiciliar: Orientado guardar os remédios em local fresco, seco, fora do banheiro e do alcance de crianças/pets.`);
            itemNum++;
        }
        planLines.push(`${itemNum}. Registro e Agendamento: Prontuário disponibilizado para a eSF/eMulti e agendado acompanhamento conforme evolução clínica.`);

        if (txtS) txtS.value = subLines.join("\n");
        if (txtO) txtO.value = objLines.join("\n");
        if (txtA) txtA.value = assLines.join("\n");
        if (txtP) txtP.value = planLines.join("\n");
    }

    window.consolidarParaSoap = consolidarParaSoap;

    window.toggleVdfFieldsDisplay = function () {
        const selectTipo = document.getElementById("soap-atendimento-tipo");
        const block = document.getElementById("vdf-fields-block");
        if (selectTipo && block) {
            block.style.display = (selectTipo.value === "Visita Domiciliar Farmacêutica (VDF)") ? "block" : "none";
        }
        updateFormattedText();
    };

    window.aplicarTemplateSoapVDF = function () {
        const selectTipo = document.getElementById("soap-atendimento-tipo");
        if (selectTipo) {
            selectTipo.value = "Visita Domiciliar Farmacêutica (VDF)";
            window.toggleVdfFieldsDisplay();
        }
        consolidarParaSoap();
        updateFormattedText();
        if (window.showToast) window.showToast("Modelo SOAP de Visita Domiciliar Farmacêutica (VDF) aplicado!", "success");
    };

    window.aplicarTemplateSoapUSF = function () {
        const selectTipo = document.getElementById("soap-atendimento-tipo");
        if (selectTipo) {
            selectTipo.value = "Consulta em USF / Ambulatorial";
            window.toggleVdfFieldsDisplay();
        }
        consolidarParaSoap();
        updateFormattedText();
        if (window.showToast) window.showToast("Modelo SOAP de Consulta USF aplicado!", "info");
    };

    // ================================================================
    // CUIDADO FARMACÊUTICO NA ASMA (GINA / PCDT SUS)
    // ================================================================
    let ginaAnswers = { 1: false, 2: false, 3: false, 4: false };
    let ginaAvaliado = false;

    window.setGinaAnswer = function (q, isSim) {
        ginaAnswers[q] = isSim;
        ginaAvaliado = true;
        const btnSim = document.querySelector(`[data-gina-q="${q}"][data-val="sim"]`);
        const btnNao = document.querySelector(`[data-gina-q="${q}"][data-val="nao"]`);
        if (btnSim && btnNao) {
            if (isSim) {
                btnSim.className = "gina-btn active-sim";
                btnNao.className = "gina-btn";
            } else {
                btnSim.className = "gina-btn";
                btnNao.className = "gina-btn active-nao";
            }
        }
        updateGinaControl();
        consolidarParaSoap();
        updateFormattedText();
    };

    function updateGinaControl() {
        const totalSim = Object.values(ginaAnswers).filter(v => v === true).length;
        const badge = document.getElementById("soap-gina-result-badge");
        const condutaBox = document.getElementById("soap-gina-conduta-box");
        if (!badge) return;

        if (!ginaAvaliado) {
            badge.className = "badge";
            badge.style.backgroundColor = "var(--bg-tertiary)";
            badge.style.color = "var(--text-secondary)";
            badge.textContent = "Controle GINA: Não Avaliado";
            return;
        }

        if (totalSim === 0) {
            badge.className = "badge";
            badge.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
            badge.style.color = "#059669";
            badge.textContent = "Controle GINA: Controlada (0)";
            if (condutaBox) {
                condutaBox.style.background = "rgba(16, 185, 129, 0.08)";
                condutaBox.style.borderLeftColor = "#10b981";
                condutaBox.innerHTML = "<strong>Conduta GINA Sugerida:</strong> Asma Bem Controlada (0 respostas 'Sim'). Manter etapa atual de tratamento (STEP) e reforçar adesão diária e técnica correta.";
            }
        } else if (totalSim <= 2) {
            badge.className = "badge";
            badge.style.backgroundColor = "rgba(245, 158, 11, 0.15)";
            badge.style.color = "#d97706";
            badge.textContent = `Controle GINA: Parcialmente Controlada (${totalSim})`;
            if (condutaBox) {
                condutaBox.style.background = "rgba(245, 158, 11, 0.08)";
                condutaBox.style.borderLeftColor = "#f59e0b";
                condutaBox.innerHTML = `<strong>Conduta GINA Sugerida:</strong> Asma Parcialmente Controlada (${totalSim} critérios positivos). Checar adesão ao corticoide inalatório e técnica antes de escalar terapia.`;
            }
        } else {
            badge.className = "badge";
            badge.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
            badge.style.color = "#dc2626";
            badge.textContent = `Controle GINA: NÃO Controlada (${totalSim})`;
            if (condutaBox) {
                condutaBox.style.background = "rgba(239, 68, 68, 0.08)";
                condutaBox.style.borderLeftColor = "#ef4444";
                condutaBox.innerHTML = `<strong>Conduta GINA Sugerida:</strong> Asma NÃO Controlada (${totalSim} critérios positivos). Risco iminente de exacerbação grave. Checar técnica inalatória com urgência e encaminhar para escalonamento médico (STEP 3/4).`;
            }
        }
    }

    window.toggleAsthmaForm = function () {
        const form = document.getElementById("soap-asthma-form-content");
        const chevron = document.getElementById("asthma-form-chevron");
        const btn = document.getElementById("btn-toggle-asthma-form");
        if (!form) return;
        if (form.style.display === "none" || form.style.display === "") {
            form.style.display = "block";
            if (btn) btn.innerHTML = `<i data-lucide="chevron-up" style="width:12px;height:12px;"></i> Recolher`;
            ginaAvaliado = true;
            updateGinaControl();
        } else {
            form.style.display = "none";
            if (btn) btn.innerHTML = `<i data-lucide="chevron-down" style="width:12px;height:12px;"></i> Abrir`;
        }
        if (window.lucide) lucide.createIcons();
    };

    window.updateAsthmaTechState = function () {
        const selectStatus = document.getElementById("soap-asthma-tecnica-status");
        const errosWrapper = document.getElementById("soap-asthma-erros-wrapper");
        if (errosWrapper && selectStatus) {
            errosWrapper.style.display = selectStatus.value === "Erros Críticos Detectados" ? "block" : "none";
        }
        consolidarParaSoap();
        updateFormattedText();
    };

    window.aplicarTemplateSoapAsma = function () {
        const selectTipo = document.getElementById("soap-atendimento-tipo");
        if (selectTipo) {
            selectTipo.value = "Consulta em USF / Ambulatorial";
            window.toggleVdfFieldsDisplay();
        }

        // Abre o formulário GINA
        const form = document.getElementById("soap-asthma-form-content");
        if (form) form.style.display = "block";
        const btn = document.getElementById("btn-toggle-asthma-form");
        if (btn) btn.innerHTML = `<i data-lucide="chevron-up" style="width:12px;height:12px;"></i> Recolher`;
        ginaAvaliado = true;

        // Preenche valores vitais respiratórios caso estejam vazios
        const inputSpo2 = document.getElementById("soap-spo2");
        const inputFr = document.getElementById("soap-fr");
        if (inputSpo2 && !inputSpo2.value) inputSpo2.value = "96";
        if (inputFr && !inputFr.value) inputFr.value = "18";

        recalculateVitalsInStep1();
        updateGinaControl();

        // Inserir histórico no Subjetivo [S]
        const subText = [
            "• Queixa Principal: Acompanhamento farmacoterapêutico de Asma Brônquica na Atenção Primária.",
            "• Histórico Clínico: Paciente relata episódios recorrentes de dispneia e tosse seca, agravados em períodos de mudança climática ou contato com poeira/mofo.",
            "• Frequência de Sintomas: Despertares noturnos eventuais e sensação de aperto torácico ao subir ladeiras ou fazer esforços.",
            "• Uso de Resgate: Relata uso frequente de bombinha de alívio (Salbutamol) nas crises.",
            "• Histórico de Exacerbações: Nega internações prévias; 1 atendimento em pronto-socorro / UPA no último ano por broncoespasmo."
        ].join("\n");

        if (txtS) txtS.value = subText;

        consolidarParaSoap();
        updateFormattedText();
        if (window.showToast) window.showToast("Modelo SOAP de Asma (GINA / PCDT) aplicado com sucesso!", "success");
        else alert("Modelo SOAP de Asma aplicado com sucesso!");
        if (window.lucide) lucide.createIcons();
    };

    // MODAL PLANO DE AÇÃO DA ASMA
    window.openPlanoAsmaModal = function () {
        const modal = document.getElementById("plano-asma-modal-overlay");
        if (modal) {
            modal.style.display = "flex";
            window.puxarDadosSoapParaPlanoAsma();
            if (window.lucide) lucide.createIcons();
        }
    };

    window.closePlanoAsmaModal = function () {
        const modal = document.getElementById("plano-asma-modal-overlay");
        if (modal) modal.style.display = "none";
    };

    window.puxarDadosSoapParaPlanoAsma = function () {
        const nome = inputNome?.value.trim() || "Paciente";
        const pfe = document.getElementById("soap-pfe")?.value.trim() || "";
        const inputNomeModal = document.getElementById("plano-asma-nome");
        const inputPfeModal = document.getElementById("plano-asma-pfe-ref");
        const viewNome = document.getElementById("view-plano-nome");
        const viewPfe = document.getElementById("view-plano-pfe");

        if (inputNomeModal) inputNomeModal.value = nome !== "Paciente" ? nome : "";
        if (inputPfeModal && pfe) inputPfeModal.value = `${pfe} L/min`;
        if (viewNome) viewNome.textContent = nome;
        if (viewPfe) viewPfe.textContent = pfe ? `${pfe} L/min` : "A definir";
    };

    const inputNomePlano = document.getElementById("plano-asma-nome");
    const inputPfePlano = document.getElementById("plano-asma-pfe-ref");
    if (inputNomePlano) {
        inputNomePlano.addEventListener("input", () => {
            const v = document.getElementById("view-plano-nome");
            if (v) v.textContent = inputNomePlano.value.trim() || "Paciente";
        });
    }
    if (inputPfePlano) {
        inputPfePlano.addEventListener("input", () => {
            const v = document.getElementById("view-plano-pfe");
            if (v) v.textContent = inputPfePlano.value.trim() || "-- L/min";
        });
    }

    window.copyPlanoAsmaTexto = function () {
        const nome = document.getElementById("plano-asma-nome")?.value.trim() || "Paciente";
        const pfe = document.getElementById("plano-asma-pfe-ref")?.value.trim() || "Não definido";
        const texto = `=== PLANO DE AÇÃO ESCRITO DA ASMA (USF / SUS) ===
Paciente: ${nome} | Melhor PFE: ${pfe}

🟢 ZONA VERDE - ASMA CONTROLADA (PFE ≥ 80%):
- Sentindo-se bem, sem chiado ou falta de ar.
- Tomar o Corticoide Inalatório preventivo diariamente no mesmo horário. Lavar a boca após inalar.

🟡 ZONA AMARELA - SINAL DE ALERTA (PFE 50-79%):
- Sintomas piorando, tosse, chiado ou despertar noturno.
- Usar Salbutamol 100mcg (2 jatos com espaçador). Se não melhorar em 48h, comparecer à USF.

🔴 ZONA VERMELHA - EMERGÊNCIA MÉDICA (PFE < 50%):
- Falta de ar intensa, dificuldade para falar, lábios roxos.
- Usar Salbutamol 4 a 6 jatos com espaçador e procurar imediatamente UPA / SAMU 192.`;

        navigator.clipboard.writeText(texto).then(() => {
            if (window.showToast) window.showToast("Plano de Ação copiado com sucesso!", "success");
            else alert("Plano de Ação copiado!");
        });
    };

    window.printPlanoAsma = function () {
        const area = document.getElementById("plano-asma-printable-area");
        if (!area) return;
        const printWin = window.open('', '', 'width=800,height=600');
        printWin.document.write(`
            <html>
            <head>
                <title>Plano de Ação da Asma - FarmaUSF</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; }
                    h2 { margin: 0; font-size: 20px; }
                    ul { margin: 4px 0 0 16px; padding: 0; }
                    @media print { body { padding: 0; } }
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

    window.updateFormattedText = updateFormattedText;

    function updateFormattedText() {
        const nome = inputNome?.value.trim() || "Não informado";
        const idade = inputIdade?.value.trim() || "Não informada";
        const sexo = selectSexo?.value === "F" ? "Feminino" : "Masculino";
        const tipoAtend = document.getElementById("soap-atendimento-tipo")?.value || "Consulta em USF / Ambulatorial";

        const finalS = txtS?.value.trim() || "Sem relatos subjetivos registrados.";
        const finalO = txtO?.value.trim() || "Sem dados objetivos registrados.";
        const finalA = txtA?.value.trim() || "Sem avaliação clínica registrada.";
        const finalP = txtP?.value.trim() || "Sem plano registrado.";

        const outputText = `=== CONSULTA FARMACÊUTICA (MÉTODO SOAP) ===
[IDENTIFICAÇÃO & ATENDIMENTO]
Paciente: ${nome} | Idade: ${idade} anos | Sexo: ${sexo}
Modalidade: ${tipoAtend}

[S] SUBJECTIVE (Subjetivo)
${finalS}

[O] OBJECTIVE (Objetivo)
${finalO}

[A] ASSESSMENT (Avaliação)
${finalA}

[P] PLAN (Plano de Cuidado & Intervenções)
${finalP}
==========================================`;

        if (formattedOutput) {
            formattedOutput.textContent = outputText;
        }
    }

    const monitoredElements = [
        inputNome, inputIdade, selectSexo, inputPeso, inputAltura, inputPaSis, inputPaDia, inputGlicemia,
        inputMedicamentosCount, selectAntibioticoUso, selectAntibioticoRacional, selectIntervencaoTipo, selectIntervencaoStatus,
        txtS, txtO, selectPrm, txtA, txtP,
        document.getElementById("soap-atendimento-tipo"), document.getElementById("soap-vdf-motivo"),
        document.getElementById("soap-vdf-cuidador"), document.getElementById("soap-vdf-armazenamento"),
        document.getElementById("soap-vdf-estoque")
    ];

    monitoredElements.forEach(el => {
        if (el) {
            el.addEventListener("input", updateFormattedText);
            el.addEventListener("change", updateFormattedText);
        }
    });

    if (btnCopiar) {
        btnCopiar.addEventListener("click", () => {
            if (formattedOutput) {
                navigator.clipboard.writeText(formattedOutput.textContent)
                    .then(() => alert("Texto copiado com sucesso! Pronto para colar no e-SUS PEC."))
                    .catch(() => alert("Erro ao copiar o texto."));
            }
        });
    }

    if (btnExportar) {
        btnExportar.addEventListener("click", () => {
            if (btnCopiar) btnCopiar.click();
        });
    }

    if (btnSalvar) {
        btnSalvar.addEventListener("click", () => {
            const nome = inputNome?.value.trim();
            const idade = parseInt(inputIdade?.value.trim());

            if (!nome || !idade) {
                alert("Por favor, informe pelo menos o Nome e Idade do paciente para salvar.");
                return;
            }

            const paSis = parseInt(inputPaSis?.value) || null;
            const paDia = parseInt(inputPaDia?.value) || null;
            const glicemia = parseInt(inputGlicemia?.value) || null;

            let paControlada = null;
            if (paSis && paDia) paControlada = (paSis < 140 && paDia < 90);

            let glicemiaControlada = null;
            if (glicemia) glicemiaControlada = (glicemia < 126);

            const tipoAtend = document.getElementById("soap-atendimento-tipo")?.value || "Consulta em USF / Ambulatorial";

            const consult = {
                id: Date.now(),
                data: new Date().toISOString().split("T")[0],
                paciente: nome,
                idade: idade,
                sexo: selectSexo.value,
                tipoAtendimento: tipoAtend,
                vdfMotivo: document.getElementById("soap-vdf-motivo")?.value || "",
                vdfCuidador: document.getElementById("soap-vdf-cuidador")?.value || "",
                vdfArmazenamento: document.getElementById("soap-vdf-armazenamento")?.value || "",
                vdfEstoque: document.getElementById("soap-vdf-estoque")?.value || "",
                paSistolica: paSis,
                paDiastolica: paDia,
                glicemia: glicemia,
                adesaoMorisky: getMoriskyScore(),
                prm: selectPrm.value,
                conduta: txtP.value.trim() || `Realizada intervenção: ${selectIntervencaoTipo.value}.`,
                medicamentosCount: parseInt(inputMedicamentosCount.value) || 1,
                antibioticoUso: (selectAntibioticoUso.value === "Sim"),
                antibioticoRacional: (selectAntibioticoUso.value === "Sim") ? (selectAntibioticoRacional.value === "Sim") : null,
                paControlada: paControlada,
                glicemiaControlada: glicemiaControlada,
                intervencaoTipo: selectIntervencaoTipo.value,
                intervencaoStatus: selectIntervencaoStatus.value,
                clearanceRenal: clCrCalculado,
                drcEstagio: clCrCalculado !== null ? getDrcEstagio(clCrCalculado) : "",
                prmListString: prmList.map((p, idx) => `PRM ${idx + 1}: [${p.medicamento}] ${p.classificacao} - ${p.descricao}`).join(" | "),
                medListString: fcMedList.map((m, idx) => `${idx + 1}. ${m.nome} (${m.dose}) ${m.manha}-${m.tarde}-${m.noite}`).join(" | ")
            };

            let saved = JSON.parse(localStorage.getItem("cim_consultas")) || [];
            saved.unshift(consult);
            localStorage.setItem("cim_consultas", JSON.stringify(saved));

            // Sincronizar com o Supabase Cloud se conectado
            if (window.USFSupabase && window.USFSupabase.isConfigured()) {
                window.USFSupabase.syncConsultaSOAP(consult).then(res => {
                    if (res.success) {
                        if (window.showToast) window.showToast(`Consulta/VD de ${nome} salva localmente e no Supabase!`, "success");
                        else alert(`Consulta de ${nome} salva com sucesso localmente e na nuvem Supabase!`);
                    } else {
                        if (window.showToast) window.showToast(`Consulta de ${nome} salva localmente (Aviso Supabase: ${res.error || 'Não sincronizado'})`, "info");
                        else alert(`Consulta de ${nome} salva localmente!`);
                    }
                });
            } else {
                alert(`Consulta/VD de ${nome} salva com sucesso!`);
            }

            renderRecentConsults();
            if (window.USFDashboard && typeof window.USFDashboard.loadDashboardData === "function") {
                window.USFDashboard.loadDashboardData();
            }
            if (btnLimpar) btnLimpar.click();
        });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener("click", () => {
            if (inputNome) inputNome.value = "";
            if (inputIdade) inputIdade.value = "";
            if (selectSexo) selectSexo.value = "F";
            if (inputPeso) inputPeso.value = "";
            if (inputAltura) inputAltura.value = "";
            if (inputPaSis) inputPaSis.value = "";
            if (inputPaDia) inputPaDia.value = "";
            if (inputGlicemia) inputGlicemia.value = "";

            const selectTipo = document.getElementById("soap-atendimento-tipo");
            if (selectTipo) {
                selectTipo.value = "Consulta em USF / Ambulatorial";
                window.toggleVdfFieldsDisplay();
            }

            if (inputMedicamentosCount) inputMedicamentosCount.value = "1";
            if (selectAntibioticoUso) selectAntibioticoUso.value = "Não";
            if (selectAntibioticoRacional) selectAntibioticoRacional.value = "Sim";
            if (selectIntervencaoTipo) selectIntervencaoTipo.value = "Orientação farmacoterapêutica";
            if (selectIntervencaoStatus) selectIntervencaoStatus.value = "Pendente";

            if (txtS) txtS.value = "";
            if (txtO) txtO.value = "";
            if (selectPrm) selectPrm.value = "Nenhum";
            if (txtA) txtA.value = "";
            if (txtP) txtP.value = "";

            moriskyAnswers = { 1: 1, 2: 1, 3: 1, 4: 1 };
            document.querySelectorAll(".morisky-questions .m-btn-group").forEach(group => {
                group.querySelectorAll(".m-btn").forEach(b => b.classList.remove("active"));
                const defaultBtn = group.querySelector('button[data-val="1"]');
                if (defaultBtn) defaultBtn.classList.add("active");
            });

            const polyBadge = document.getElementById("soap-polifarmacia-badge");
            if (polyBadge) polyBadge.style.display = "none";
            const antiGroup = document.getElementById("soap-antibiotico-racional-group");
            if (antiGroup) antiGroup.style.display = "none";

            updateMoriskyScore();

            fcMedList = [];
            prmList = [];
            clCrCalculado = null;
            revisaoState = {};

            recalculateVitalsInStep1();
            window.goToStep(1);
        });
    }

    function renderRecentConsults() {
        if (!recentListContainer) return;
        recentListContainer.innerHTML = "";
        const saved = JSON.parse(localStorage.getItem("cim_consultas")) || [];

        if (saved.length === 0) {
            recentListContainer.innerHTML = `<div style="text-align: center; padding: 12px; font-size: 11px; color: var(--text-tertiary);">Nenhuma consulta salva.</div>`;
            return;
        }

        saved.slice(0, 5).forEach(c => {
            const item = document.createElement("div");
            item.className = "recent-consult-item";
            item.innerHTML = `
                <div class="recent-consult-item-text">
                    <h5>${c.paciente}</h5>
                    <span>${c.data} | Morisky: ${c.adesaoMorisky}/4</span>
                </div>
                <button class="btn-icon btn-icon-danger" onclick="deleteRecentConsult(${c.id})" aria-label="Excluir">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </button>
            `;
            recentListContainer.appendChild(item);
        });
        if (window.lucide) lucide.createIcons();
    }

    window.deleteRecentConsult = function (id) {
        if (!confirm("Tem certeza que deseja excluir esta consulta?")) return;
        let saved = JSON.parse(localStorage.getItem("cim_consultas")) || [];
        saved = saved.filter(c => c.id !== id);
        localStorage.setItem("cim_consultas", JSON.stringify(saved));
        renderRecentConsults();
    };

    updateMoriskyScore();
    renderRecentConsults();
    updateSheetsStatus();
    window.goToStep(1);
}

/* ==========================================
   FARMÁCIA CLÍNICA — POSOLOGIA, BEERS, REVISÃO & NOTAS METODOLÓGICAS (SAPS)
   ========================================== */
function initFarmClinicaSection() {
    window.switchSoapTab = function (tabName) {
        const btnGeral = document.getElementById("soap-tab-btn-geral");
        const btnFc = document.getElementById("soap-tab-btn-farmclinica");
        const tabGeral = document.getElementById("soap-tab-geral");
        const tabFc = document.getElementById("soap-tab-farmclinica");

        if (tabName === 'geral') {
            btnGeral?.classList.add("active");
            btnFc?.classList.remove("active");
            tabGeral?.classList.add("active");
            tabFc?.classList.remove("active");
        } else {
            btnGeral?.classList.remove("active");
            btnFc?.classList.add("active");
            tabGeral?.classList.remove("active");
            tabFc?.classList.add("active");
        }
        if (window.lucide) lucide.createIcons();
    };

    window.switchFcSubTab = function (subTabName) {
        const btnMetas = document.getElementById("fc-subtab-btn-metas");
        const btnPosologia = document.getElementById("fc-subtab-btn-posologia");
        const btnSeguranca = document.getElementById("fc-subtab-btn-seguranca");

        const contentMetas = document.getElementById("fc-subtab-metas");
        const contentPosologia = document.getElementById("fc-subtab-posologia");
        const contentSeguranca = document.getElementById("fc-subtab-seguranca");

        [btnMetas, btnPosologia, btnSeguranca].forEach(btn => btn?.classList.remove("active"));
        [contentMetas, contentPosologia, contentSeguranca].forEach(content => {
            if (content) {
                content.style.display = "none";
                content.classList.remove("active");
            }
        });

        if (subTabName === 'metas') {
            btnMetas?.classList.add("active");
            if (contentMetas) {
                contentMetas.style.display = "block";
                contentMetas.classList.add("active");
            }
        } else if (subTabName === 'posologia') {
            btnPosologia?.classList.add("active");
            if (contentPosologia) {
                contentPosologia.style.display = "block";
                contentPosologia.classList.add("active");
            }
        } else if (subTabName === 'seguranca') {
            btnSeguranca?.classList.add("active");
            if (contentSeguranca) {
                contentSeguranca.style.display = "block";
                contentSeguranca.classList.add("active");
            }
        }
        if (window.lucide) lucide.createIcons();
    };

    window.switchMetaProfile = function (profileName) {
        const btnDiabetes = document.getElementById("btn-prof-diabetes");
        const btnHipertensao = document.getElementById("btn-prof-hipertensao");
        const btnIdoso = document.getElementById("btn-prof-idoso");

        const panelDiabetes = document.getElementById("meta-panel-diabetes");
        const panelHipertensao = document.getElementById("meta-panel-hipertensao");
        const panelIdoso = document.getElementById("meta-panel-idoso");

        [btnDiabetes, btnHipertensao, btnIdoso].forEach(btn => btn?.classList.remove("active-meta-btn"));
        [panelDiabetes, panelHipertensao, panelIdoso].forEach(panel => {
            if (panel) {
                panel.style.display = "none";
                panel.classList.remove("active");
            }
        });

        if (profileName === 'diabetes') {
            btnDiabetes?.classList.add("active-meta-btn");
            if (panelDiabetes) {
                panelDiabetes.style.display = "block";
                panelDiabetes.classList.add("active");
            }
        } else if (profileName === 'hipertensao') {
            btnHipertensao?.classList.add("active-meta-btn");
            if (panelHipertensao) {
                panelHipertensao.style.display = "block";
                panelHipertensao.classList.add("active");
            }
        } else if (profileName === 'idoso') {
            btnIdoso?.classList.add("active-meta-btn");
            if (panelIdoso) {
                panelIdoso.style.display = "block";
                panelIdoso.classList.add("active");
            }
        }
        if (window.lucide) lucide.createIcons();
    };

    // Lista de Medicamentos + Posologia
    const fcSelect = document.getElementById('fc-select-med');
    const fcCustomMedInput = document.getElementById('fc-custom-med-input');
    const fcDose = document.getElementById('fc-dose-input');
    const fcObs = document.getElementById('fc-obs-input');
    const fcManhaIn = document.getElementById('fc-pos-manha');
    const fcTardeIn = document.getElementById('fc-pos-tarde');
    const fcNoiteIn = document.getElementById('fc-pos-noite');
    const fcPreview = document.getElementById('fc-posologia-preview-text');
    const fcListContainer = document.getElementById('fc-med-list-container');
    const fcCount = document.getElementById('fc-med-count');

    function updatePrmMedSelect() {
        const select = document.getElementById('prm-med-select');
        if (!select) return;
        select.innerHTML = '<option value="Geral / Paciente">Geral (Sem medicamento específico)</option>';

        if (fcMedList.length === 0 && typeof MEDICAMENTOS !== "undefined") {
            MEDICAMENTOS.slice(0, 15).forEach(med => {
                const opt = document.createElement('option');
                opt.value = med.nome;
                opt.textContent = `${med.nome} (REMUME)`;
                select.appendChild(opt);
            });
        } else {
            fcMedList.forEach(med => {
                const opt = document.createElement('option');
                opt.value = med.nome;
                opt.textContent = med.nome;
                select.appendChild(opt);
            });
        }
    }

    if (fcSelect && typeof MEDICAMENTOS !== "undefined") {
        fcSelect.innerHTML = '<option value="" disabled selected>Selecione o medicamento...</option>';
        MEDICAMENTOS.forEach(med => {
            const opt = document.createElement('option');
            opt.value = med.id;
            opt.textContent = med.nome;
            fcSelect.appendChild(opt);
        });
        const optCustom = document.createElement('option');
        optCustom.value = 'CUSTOM_MED';
        optCustom.textContent = '➕ Outro medicamento...';
        fcSelect.appendChild(optCustom);
    }

    function updatePreview() {
        if (!fcPreview) return;
        const m = parseFloat(fcManhaIn.value) || 0;
        const t = parseFloat(fcTardeIn.value) || 0;
        const n = parseFloat(fcNoiteIn.value) || 0;
        fcPreview.textContent = `${m} — ${t} — ${n}`;
    }
    if (fcManhaIn) fcManhaIn.addEventListener('input', updatePreview);
    if (fcTardeIn) fcTardeIn.addEventListener('input', updatePreview);
    if (fcNoiteIn) fcNoiteIn.addEventListener('input', updatePreview);

    if (fcSelect) {
        fcSelect.addEventListener('change', () => {
            if (fcSelect.value === 'CUSTOM_MED') {
                if (fcCustomMedInput) {
                    fcCustomMedInput.style.display = 'block';
                    fcCustomMedInput.value = '';
                    fcCustomMedInput.focus();
                }
                fcManhaIn.value = 1;
                fcTardeIn.value = 0;
                fcNoiteIn.value = 0;
                fcDose.value = '';
                fcObs.value = '';
                updatePreview();
                return;
            } else {
                if (fcCustomMedInput) {
                    fcCustomMedInput.style.display = 'none';
                    fcCustomMedInput.value = '';
                }
            }
            if (typeof MEDICAMENTOS !== "undefined") {
                const med = MEDICAMENTOS.find(m => m.id === fcSelect.value);
                if (!med) return;
                if (med.posologiaVisual) {
                    const pv = med.posologiaVisual;
                    fcManhaIn.value = pv.manha !== '0' ? 1 : 0;
                    fcTardeIn.value = pv.tarde !== '0' ? 1 : 0;
                    fcNoiteIn.value = pv.noite !== '0' ? 1 : 0;
                    fcDose.value = pv.manha !== '0' ? pv.manha : (pv.noite !== '0' ? pv.noite : pv.tarde);
                    fcObs.value = pv.obs || '';
                    updatePreview();
                }
            }
        });
    }

    function renderFcList() {
        if (!fcListContainer) return;
        if (fcMedList.length === 0) {
            fcListContainer.innerHTML = `<div class="empty-state-card" style="padding:32px; text-align: center;"><i data-lucide="pill" style="width:32px; height:32px; color:var(--text-tertiary); margin-bottom:8px;"></i><h3 style="font-size:14px;">Lista vazia</h3><p style="font-size:12px; color:var(--text-secondary);">Adicione medicamentos pelo formulário ao lado para montar a lista.</p></div>`;
            if (fcCount) fcCount.textContent = '0 medicamentos';
            updatePrmMedSelect();
            if (window.lucide) lucide.createIcons();
            return;
        }
        if (fcCount) fcCount.textContent = `${fcMedList.length} medicamento${fcMedList.length !== 1 ? 's' : ''}`;
        fcListContainer.innerHTML = '';
        fcMedList.forEach((item, idx) => {
            const row = document.createElement('div');
            row.className = 'fc-med-row' + (item.beersCriteria ? ' fc-med-row-beers' : '');
            row.innerHTML = `
            <div class="fc-med-row-info">
                <div class="fc-med-row-nome">
                    <strong>${item.nome}</strong>
                    ${item.beersCriteria ? '<span class="beers-badge" style="background: rgba(239,68,68,0.1); color: #ef4444; font-size:10px; padding:2px 6px; border-radius:4px; margin-left:6px;"><i data-lucide="alert-triangle" style="width:10px;height:10px;display:inline-block;vertical-align:middle;margin-right:2px;"></i> Beers</span>' : ''}
                </div>
                <div class="fc-med-row-dose">${item.dose}</div>
                ${item.obs ? `<div class="fc-med-row-obs">${item.obs}</div>` : ''}
                ${item.monitoramento && item.monitoramento.length > 0 ? `<div class="fc-med-row-monitor"><i data-lucide="activity" style="width:11px;height:11px;"></i> Monitorar: ${item.monitoramento.slice(0, 2).join(' • ')}</div>` : ''}
            </div>
            <div class="fc-posologia-display">
                <div class="posol-pill ${item.manha > 0 ? 'posol-active' : 'posol-zero'}">
                    <span class="posol-label">Manhã</span>
                    <span class="posol-val">${item.manha}</span>
                </div>
                <span class="posol-sep">—</span>
                <div class="posol-pill ${item.tarde > 0 ? 'posol-active' : 'posol-zero'}">
                    <span class="posol-label">Tarde</span>
                    <span class="posol-val">${item.tarde}</span>
                </div>
                <span class="posol-sep">—</span>
                <div class="posol-pill ${item.noite > 0 ? 'posol-active' : 'posol-zero'}">
                    <span class="posol-label">Noite</span>
                    <span class="posol-val">${item.noite}</span>
                </div>
            </div>
            <button class="fc-remove-btn" data-idx="${idx}" title="Remover"><i data-lucide="x"></i></button>
        `;
            fcListContainer.appendChild(row);
        });
        fcListContainer.querySelectorAll('.fc-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                fcMedList.splice(parseInt(btn.dataset.idx), 1);
                renderFcList();
            });
        });
        updatePrmMedSelect();
        if (window.lucide) lucide.createIcons();
        if (typeof window.updateFormattedText === 'function') window.updateFormattedText();
    }

    const btnAddMed = document.getElementById('fc-btn-add-med');
    if (btnAddMed) {
        btnAddMed.addEventListener('click', () => {
            const medId = fcSelect.value;
            if (!medId) { alert('Selecione ou digite um medicamento.'); return; }

            let medNome = '';
            let beers = false;
            let beersAlerta = '';
            let monitoramento = [];
            let isCustom = false;
            let doseSugerida = '';

            if (medId === 'CUSTOM_MED') {
                const customNome = fcCustomMedInput ? fcCustomMedInput.value.trim() : '';
                if (!customNome) {
                    alert('Por favor, digite o nome do medicamento personalizado.');
                    if (fcCustomMedInput) fcCustomMedInput.focus();
                    return;
                }
                medNome = customNome;
                isCustom = true;
            } else if (typeof MEDICAMENTOS !== "undefined") {
                const med = MEDICAMENTOS.find(m => m.id === medId);
                if (!med) return;
                medNome = med.nome;
                beers = med.beersCriteria || false;
                beersAlerta = med.beersAlerta || '';
                monitoramento = med.monitoramento || [];
                doseSugerida = med.posologiaVisual ? med.posologiaVisual.manha : '';
            }

            const m = parseFloat(fcManhaIn.value) || 0;
            const t = parseFloat(fcTardeIn.value) || 0;
            const n = parseFloat(fcNoiteIn.value) || 0;

            fcMedList.push({
                id: isCustom ? 'custom_' + Date.now() : medId,
                nome: medNome,
                dose: fcDose.value || doseSugerida,
                manha: m,
                tarde: t,
                noite: n,
                obs: fcObs.value,
                beersCriteria: beers,
                beersAlerta: beersAlerta,
                monitoramento: monitoramento,
                isCustom: isCustom
            });

            renderFcList();
            fcSelect.value = '';
            if (fcCustomMedInput) {
                fcCustomMedInput.value = '';
                fcCustomMedInput.style.display = 'none';
            }
            fcDose.value = '';
            fcObs.value = '';
            fcManhaIn.value = 1; fcTardeIn.value = 0; fcNoiteIn.value = 0;
            updatePreview();
        });
    }

    const btnClearList = document.getElementById('fc-btn-clear-list');
    if (btnClearList) btnClearList.addEventListener('click', () => { if (confirm('Limpar toda a lista?')) { fcMedList = []; renderFcList(); } });

    // Critérios de Beers
    const beersContainer = document.getElementById('fc-beers-container');
    if (beersContainer && typeof BEERS_CRITERIA !== 'undefined') {
        const cats = {};
        BEERS_CRITERIA.forEach(b => {
            if (!cats[b.categoria]) cats[b.categoria] = [];
            cats[b.categoria].push(b);
        });
        beersContainer.innerHTML = '';
        Object.entries(cats).forEach(([cat, items]) => {
            const catDiv = document.createElement('div');
            catDiv.className = 'beers-category';
            catDiv.innerHTML = `<h4 class="beers-cat-title" style="font-family:'Outfit', sans-serif; font-size:12px; font-weight:700; color:var(--color-primary); margin-top:14px; margin-bottom:8px; text-transform:uppercase;">${cat}</h4>`;
            items.forEach(b => {
                const card = document.createElement('div');
                card.className = 'beers-card';
                card.style = 'background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:10px; margin-bottom:8px;';
                card.innerHTML = `
                <div class="beers-card-header" style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                    <span class="beers-badge-icon" style="color:#ef4444;"><i data-lucide="alert-octagon" style="width:14px;height:14px;"></i></span>
                    <strong style="font-size:13px; color:var(--text-primary);">${b.farmaco}</strong>
                </div>
                <div class="beers-risco" style="font-size:11px; margin-bottom:4px; display:flex; align-items:flex-start; gap:4px;"><i data-lucide="x-circle" style="width:12px;height:12px;color:#ef4444;margin-top:2px;"></i> <span style="color:var(--text-secondary);"><strong>Risco:</strong> ${b.risco}</span></div>
                <div class="beers-alt" style="font-size:11px; display:flex; align-items:flex-start; gap:4px;"><i data-lucide="check-circle-2" style="width:12px;height:12px;color:#10b981;margin-top:2px;"></i> <span style="color:var(--text-secondary);"><strong>Alternativa:</strong> ${b.alternativa}</span></div>
            `;
                catDiv.appendChild(card);
            });
            beersContainer.appendChild(catDiv);
        });
        if (window.lucide) lucide.createIcons();
    }

    // Revisão Farmacoterapêutica
    const revisaoContainer = document.getElementById('fc-revisao-container');
    const progressBar = document.getElementById('fc-revisao-progress-bar');
    const progressText = document.getElementById('fc-revisao-progress-text');

    function renderRevisao() {
        if (!revisaoContainer || typeof REVISAO_CHECKLIST === 'undefined') return;
        revisaoContainer.innerHTML = '';
        const cats = {};
        REVISAO_CHECKLIST.forEach(r => { if (!cats[r.categoria]) cats[r.categoria] = []; cats[r.categoria].push(r); });
        const catColors = { 'Indicacao': '#6366f1', 'Dose': '#f59e0b', 'Seguranca': '#ef4444', 'Adesao': '#0d9488', 'Efetividade': '#10b981', 'Documentacao': '#3b82f6' };
        Object.entries(cats).forEach(([cat, items]) => {
            const sec = document.createElement('div');
            sec.className = 'revisao-section';
            sec.innerHTML = `<div class="revisao-cat-label" style="border-left: 3px solid ${catColors[cat] || 'var(--color-primary)'}; padding-left:6px; font-weight:700; color: ${catColors[cat] || 'var(--color-primary)'}; font-size:11px; text-transform:uppercase; margin-top:12px; margin-bottom:6px;">${cat}</div>`;
            items.forEach(r => {
                const item = document.createElement('label');
                item.className = 'revisao-item' + (revisaoState[r.id] ? ' revisao-checked' : '');
                item.style = 'display:flex; align-items:center; gap:8px; font-size:12px; padding:6px; border-radius:4px; cursor:pointer; margin-bottom:4px; transition:background 0.2s;';
                item.innerHTML = `<input type="checkbox" data-id="${r.id}" ${revisaoState[r.id] ? 'checked' : ''} style="accent-color:var(--color-primary);"> <span>${r.item}</span>`;
                item.querySelector('input').addEventListener('change', e => {
                    revisaoState[r.id] = e.target.checked;
                    item.classList.toggle('revisao-checked', e.target.checked);
                    updateRevisaoProgress();
                });
                sec.appendChild(item);
            });
            revisaoContainer.appendChild(sec);
        });
        updateRevisaoProgress();
    }

    function updateRevisaoProgress() {
        if (typeof REVISAO_CHECKLIST === 'undefined') return;
        const total = REVISAO_CHECKLIST.length;
        const done = Object.values(revisaoState).filter(Boolean).length;
        if (progressBar) progressBar.style.width = `${(done / total) * 100}%`;
        if (progressText) progressText.textContent = `${done} / ${total} itens`;
        if (typeof window.updateFormattedText === 'function') window.updateFormattedText();
    }

    renderRevisao();

    const btnResetRevisao = document.getElementById('fc-btn-reset-revisao');
    if (btnResetRevisao) {
        btnResetRevisao.addEventListener('click', () => { revisaoState = {}; renderRevisao(); });
    }

    // Lógica de PRM/RNM
    const prmListContainer = document.getElementById('prm-list-container');
    const prmMedSelect = document.getElementById('prm-med-select');
    const prmClassSelect = document.getElementById('prm-class-select');
    const rnmClassSelect = document.getElementById('rnm-class-select');
    const prmDescricao = document.getElementById('prm-descricao');
    const btnAddPrm = document.getElementById('btn-add-prm');

    function renderPrmList() {
        if (!prmListContainer) return;
        if (prmList.length === 0) {
            prmListContainer.innerHTML = '<p style="font-size: 11px; color: var(--text-tertiary); text-align: center; margin: 8px 0;">Nenhum PRM registrado nesta consulta.</p>';
            if (typeof window.updateFormattedText === 'function') window.updateFormattedText();
            return;
        }
        prmListContainer.innerHTML = '';
        prmList.forEach((prm, idx) => {
            const div = document.createElement('div');
            div.style = 'background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); border-radius: var(--radius-sm); padding: 8px 10px; font-size: 12px; display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;';
            div.innerHTML = `
            <div style="flex: 1; padding-right: 10px;">
                <div style="font-weight: 700; color: var(--warning-color); font-size: 11px; margin-bottom: 2px;">
                    ${prm.classificacao} | ${prm.rnm}
                </div>
                <div style="font-size: 12px; color: var(--text-primary); margin-bottom: 2px;">
                    <strong>Medicamento:</strong> ${prm.medicamento}
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
                    ${prm.descricao}
                </div>
            </div>
            <button class="btn-icon btn-icon-danger prm-remove-btn" data-idx="${idx}" style="color: var(--danger-color); padding: 2px; display: flex; align-items: center; border: none; background: transparent; cursor: pointer;" title="Excluir PRM">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
        `;
            prmListContainer.appendChild(div);
        });
        prmListContainer.querySelectorAll('.prm-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                prmList.splice(parseInt(btn.dataset.idx), 1);
                renderPrmList();
            });
        });
        if (window.lucide) lucide.createIcons();
        if (typeof window.updateFormattedText === 'function') window.updateFormattedText();
    }

    if (btnAddPrm) {
        btnAddPrm.addEventListener('click', () => {
            const med = prmMedSelect.value || 'Geral / Paciente';
            const cl = prmClassSelect.value;
            const rnm = rnmClassSelect.value;
            const desc = prmDescricao.value.trim();
            if (!desc) { alert('Digite uma descrição clínica ou conduta proposta para o PRM.'); return; }

            prmList.push({
                medicamento: med,
                classificacao: cl,
                rnm: rnm,
                descricao: desc
            });
            renderPrmList();
            prmDescricao.value = '';
        });
    }

    updatePrmMedSelect();
    renderPrmList();

    // Integrações
    const btnIntegrarSoap = document.getElementById('btn-integrar-metas-soap');
    if (btnIntegrarSoap) {
        btnIntegrarSoap.addEventListener('click', () => {
            if (typeof window.updateFormattedText === 'function') window.updateFormattedText();
            window.switchSoapTab('geral');
            alert('Dados da Farmácia Clínica integrados ao Prontuário SOAP com sucesso!');
        });
    }

    const btnIntegrarMedsSoap = document.getElementById('fc-btn-integrar-meds-soap');
    if (btnIntegrarMedsSoap) {
        btnIntegrarMedsSoap.addEventListener('click', () => {
            if (fcMedList.length === 0) {
                alert('Adicione pelo menos um medicamento à lista do paciente antes de integrar ao SOAP.');
                return;
            }
            if (typeof window.updateFormattedText === 'function') window.updateFormattedText();
            window.switchSoapTab('geral');
            alert('Lista de medicamentos e alertas de Beers integrados ao Prontuário SOAP com sucesso!');
        });
    }
}

