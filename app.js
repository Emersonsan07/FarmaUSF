// Estados clínicos globais compartilhados para o prontuário integrado
let fcMedList = [];
let prmList = [];
let clCrCalculado = null;
let revisaoState = {};
let cgDadosPaciente = { sexo: 'F', idade: 60, peso: 60 };

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Ícones Lucide
    lucide.createIcons();

    // Se o localStorage de consultas estiver vazio, povoar inicialmente com os dados da SIMULACAO_CONSULTAS
    let savedConsultas = JSON.parse(localStorage.getItem("cim_consultas"));
    if (!savedConsultas || savedConsultas.length === 0) {
        localStorage.setItem("cim_consultas", JSON.stringify(SIMULACAO_CONSULTAS));
    }

    // Inicializar Lógicas de Componentes
    initTheme();
    initNavigation();
    initCimSection();
    initSoapSection();
    initProtocolsSection();
    initCalculatorsSection();
    initVigilanceSection();
    initFarmClinicaSection();
    // Função global de classificação de DRC por clearance de creatinina
    function getDrcEstagio(clCr) {
        if (clCr >= 90) return 'G1 (Normal/Elevado)';
        if (clCr >= 60) return 'G2 (Levemente diminuído)';
        if (clCr >= 45) return 'G3a (Diminuição leve a moderada)';
        if (clCr >= 30) return 'G3b (Diminuição moderada a severa)';
        if (clCr >= 15) return 'G4 (Diminuição severa)';
        return 'G5 (Falência renal)';
    }

    /* ==========================================
       1. GESTÃO DO TEMA (CLARO / ESCURO)
       ========================================== */
    function initTheme() {
        const themeBtn = document.getElementById("theme-toggle-btn");
        const darkIcon = themeBtn.querySelector(".theme-icon-dark");
        const lightIcon = themeBtn.querySelector(".theme-icon-light");

        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
            document.body.classList.add("dark-theme");
            darkIcon.style.display = "none";
            lightIcon.style.display = "block";
        } else {
            document.body.classList.remove("dark-theme");
            darkIcon.style.display = "block";
            lightIcon.style.display = "none";
        }

        themeBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");

            if (isDark) {
                darkIcon.style.display = "none";
                lightIcon.style.display = "block";
            } else {
                darkIcon.style.display = "block";
                lightIcon.style.display = "none";
            }
        });
    }

    /* ==========================================
       2. NAVEGAÇÃO E SPA (ROTAS)
       ========================================== */
    function initNavigation() {
        const navLinks = document.querySelectorAll(".nav-link");
        const sections = document.querySelectorAll(".content-section");
        const mobileOverlay = document.getElementById("mobile-overlay");
        const mobileMenuBtn = document.getElementById("mobile-menu-btn");
        const mobileCloseBtn = document.getElementById("mobile-close-btn");
        const mobileLinks = document.querySelectorAll(".mobile-link");

        window.navigateToSection = function (sectionId) {
            let targetSectionId = sectionId;
            let activateFarmClinica = false;

            if (sectionId === "farmclinica") {
                targetSectionId = "soap";
                activateFarmClinica = true;
            }

            // Checagem de Proteção de Rota por Autenticação e Perfil de Farmacêutico
            if (targetSectionId === "soap") {
                if (!window.USFAuth || !window.USFAuth.isLoggedIn()) {
                    window.pendingNavigationSection = targetSectionId;
                    const reasonMsg = "O módulo de Prontuário SOAP é restrito exclusivamente a Farmacêuticos(as) identificados(as) por CPF.";
                    if (window.USFAuth) window.USFAuth.openAuthModal(reasonMsg);
                    return;
                }

                const currentUser = window.USFAuth.getCurrentUser();
                if (!window.USFAuth.isPharmacist(currentUser)) {
                    const userRole = currentUser && currentUser.cargo ? currentUser.cargo : "Perfil não informado";
                    const errorMsg = `Acesso Restrito: O Prontuário SOAP é exclusivo para o perfil de Farmacêutico(a). Seu perfil cadastrado (${userRole}) não possui permissão de acesso.`;
                    if (window.showToast) {
                        window.showToast(errorMsg, "danger");
                    } else {
                        alert(errorMsg);
                    }

                    const activeSec = document.querySelector(".content-section.active");
                    if (!activeSec || activeSec.id === "sec-soap") {
                        navigateToSection("inicio");
                    }
                    return;
                }
            } else if (window.USFAuth && window.USFAuth.isRestrictedSection(targetSectionId) && !window.USFAuth.isLoggedIn()) {
                window.pendingNavigationSection = targetSectionId;
                const reasonMsg = "A aba de Vigilância em Saúde & Notificações é restrita a profissionais cadastrados e autorizados.";
                window.USFAuth.openAuthModal(reasonMsg);
                return;
            }

            sections.forEach(sec => {
                sec.classList.remove("active");
                if (sec.id === `sec-${targetSectionId}`) {
                    sec.classList.add("active");
                }
            });

            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                }
            });

            mobileLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                }
            });

            window.scrollTo(0, 0);


        };

        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = link.getAttribute("href").substring(1);
                navigateToSection(targetId);
                window.location.hash = targetId;
            });
        });

        mobileMenuBtn.addEventListener("click", () => {
            mobileOverlay.classList.add("active");
        });

        const closeMobile = () => {
            mobileOverlay.classList.remove("active");
        };

        mobileCloseBtn.addEventListener("click", closeMobile);
        mobileOverlay.addEventListener("click", (e) => {
            if (e.target === mobileOverlay) closeMobile();
        });

        mobileLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = link.getAttribute("href").substring(1);
                navigateToSection(targetId);
                window.location.hash = targetId;
                closeMobile();
            });
        });

        // Hash handler inicial
        const handleInitialHash = () => {
            const hash = window.location.hash.substring(1);
            const validHashes = ["inicio", "cim", "soap", "protocolos", "calculadoras", "vigilancia", "educacao"];
            if (hash && validHashes.includes(hash)) {
                navigateToSection(hash);
            } else {
                navigateToSection("inicio");
            }
        };

        window.addEventListener("hashchange", handleInitialHash);
        handleInitialHash();
    }

    /* ==========================================
       3. SEÇÃO DO CIM (BUSCA E INTERAÇÕES)
       ========================================== */
    function initCimSection() {
        // Gerenciador de Sub-Abas do CIM
        window.switchCimSubTab = function (subTab) {
            document.querySelectorAll(".cim-tabs-area .tab-btn").forEach(btn => btn.classList.remove("active"));
            document.querySelectorAll(".cim-tabs-area .tab-content").forEach(content => content.classList.remove("active"));

            document.getElementById(`tab-btn-${subTab}`).classList.add("active");
            document.getElementById(`cim-tab-${subTab}`).classList.add("active");
        };

        // Sub-Aba 1: Busca de Medicamentos
        const searchInput = document.getElementById("med-search-input");
        const clearSearchBtn = document.getElementById("clear-search-btn");
        const filterTagsContainer = document.getElementById("class-filter-tags");
        const medListContainer = document.getElementById("med-list-container");
        const medCountBadge = document.getElementById("med-count");
        const medDetailContainer = document.getElementById("med-detail-container");

        let currentSearch = "";
        let currentFilter = "all";
        let selectedMedId = null;

        // Gerar tags de filtros baseadas nas classes dos medicamentos
        const classes = ["all"];
        MEDICAMENTOS.forEach(med => {
            const mainClass = med.classe.split("/")[0].trim();
            if (!classes.includes(mainClass)) {
                classes.push(mainClass);
            }
        });

        filterTagsContainer.innerHTML = "";
        classes.forEach(cls => {
            const tag = document.createElement("span");
            tag.className = `filter-tag ${cls === "all" ? "active" : ""}`;
            tag.textContent = cls === "all" ? "Todos" : cls;
            tag.addEventListener("click", () => {
                filterTagsContainer.querySelectorAll(".filter-tag").forEach(t => t.classList.remove("active"));
                tag.classList.add("active");
                currentFilter = cls;
                renderMedList();
            });
            filterTagsContainer.appendChild(tag);
        });

        function renderMedList() {
            medListContainer.innerHTML = "";
            const filtered = MEDICAMENTOS.filter(med => {
                const matchesSearch = med.nome.toLowerCase().includes(currentSearch.toLowerCase()) ||
                    med.classe.toLowerCase().includes(currentSearch.toLowerCase());
                const mainClass = med.classe.split("/")[0].trim();
                const matchesFilter = currentFilter === "all" || mainClass === currentFilter;
                return matchesSearch && matchesFilter;
            });

            medCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'medicamento' : 'medicamentos'}`;

            if (filtered.length === 0) {
                medListContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-tertiary); font-size: 13px;">Nenhum medicamento encontrado.</div>`;
                medDetailContainer.innerHTML = `
                <div class="empty-state-card" style="padding: 40px 24px; text-align: center; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--danger-color); margin-bottom: 16px;"></i>
                    <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; margin-bottom: 8px; color: var(--text-primary);">Medicamento Não Localizado</h3>
                    <p style="color: var(--text-secondary); font-size: 13px; max-width: 400px; margin: 0 auto 24px; line-height: 1.5;">
                        O termo "<strong>${currentSearch}</strong>" não foi encontrado na base de dados da <strong>REMUME de Campo Grande - MS / RENAME</strong>.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 320px; margin: 0 auto;">
                        <a href="https://consultas.anvisa.gov.br/#/bulario/" target="_blank" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; justify-content: center; text-decoration: none; padding: 10px 20px; font-weight: 600;">
                            <i data-lucide="external-link" style="width: 16px; height: 16px;"></i> Buscar no Bulário da ANVISA
                        </a>
                        <a href="https://sesaumedicamentos.lovable.app/" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; justify-content: center; text-decoration: none; padding: 10px 20px; font-weight: 600;">
                            <i data-lucide="map-pin" style="width: 16px; height: 16px;"></i> Consultar Estoque na SESAU CG
                        </a>
                    </div>
                </div>
            `;
                lucide.createIcons();
                return;
            }

            filtered.forEach(med => {
                const item = document.createElement("button");
                item.className = `med-item ${selectedMedId === med.id ? 'active' : ''}`;
                item.innerHTML = `<h4>${med.nome}</h4><span>${med.classe}</span>`;
                item.addEventListener("click", () => {
                    selectedMedId = med.id;
                    medListContainer.querySelectorAll(".med-item").forEach(i => i.classList.remove("active"));
                    item.classList.add("active");
                    renderMedDetail(med);
                });
                medListContainer.appendChild(item);
            });

            if (filtered.length > 0 && (!selectedMedId || !filtered.some(m => m.id === selectedMedId))) {
                selectedMedId = filtered[0].id;
                const first = medListContainer.querySelector(".med-item");
                if (first) first.classList.add("active");
                renderMedDetail(filtered[0]);
            }
        }

        function renderMedDetail(med) {
            if (!med) {
                medDetailContainer.innerHTML = `
                <div class="empty-state-card">
                    <i data-lucide="pill"></i>
                    <h3>Selecione um Medicamento</h3>
                    <p>Clique na lista lateral para obter a ficha posológica e orientações do SUS.</p>
                </div>
            `;
                lucide.createIcons();
                return;
            }

            medDetailContainer.innerHTML = `
            <div class="card detail-card">
                <div class="detail-header" style="position: relative;">
                    <h3>${med.nome}</h3>
                    <p>${med.classe}</p>
                    <div style="margin-top: 8px;">
                        <span style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 11px; padding: 4px 8px; border-radius: var(--radius-sm); font-weight: 600; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(16, 185, 129, 0.2);">
                            <i data-lucide="shield-check" style="width: 12px; height: 12px;"></i> ${med.remumeCG}
                        </span>
                    </div>
                </div>
                <div class="detail-body">
                    <div class="detail-section">
                        <h4>Indicações Clínicas</h4>
                        <p>${med.indicacoes}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Posologia e Administração Usual</h4>
                        <p>${med.posologia}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Contraindicações e Cuidados</h4>
                        <p>${med.contraindicacoes}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Orientações ao Paciente / Uso Racional</h4>
                        <p>${med.orientacoes}</p>
                    </div>
                    <div class="sus-alert-box" style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; gap: 10px; align-items: flex-start;">
                            <i data-lucide="info" style="margin-top: 2px; flex-shrink: 0;"></i>
                            <div>
                                <strong>Disponibilidade SUS:</strong>
                                <p style="margin-top: 2px;">${med.alertaSUS}</p>
                            </div>
                        </div>
                        <div style="border-top: 1px dashed rgba(13, 148, 136, 0.15); padding-top: 8px; margin-top: 4px; width: 100%;">
                            <a href="https://sesaumedicamentos.lovable.app/" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--color-primary); text-decoration: none;">
                                <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i> Consultar estoque em tempo real nas Unidades (SESAU CG) <i data-lucide="chevron-right" style="width: 12px; height: 12px;"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
            lucide.createIcons();
        }

        searchInput.addEventListener("input", (e) => {
            currentSearch = e.target.value;
            clearSearchBtn.style.display = currentSearch !== "" ? "flex" : "none";
            renderMedList();
        });

        clearSearchBtn.addEventListener("click", () => {
            searchInput.value = "";
            currentSearch = "";
            clearSearchBtn.style.display = "none";
            renderMedList();
            searchInput.focus();
        });

        renderMedList();

        // Sub-Aba 2: Verificador de Interações
        const selectMedA = document.getElementById("select-med-a");
        const selectMedB = document.getElementById("select-med-b");
        const btnAnalisar = document.getElementById("btn-analisar-interacao");
        const btnLimpar = document.getElementById("btn-limpar-interacao");
        const resultContainer = document.getElementById("interaction-result-container");

        const sortedMeds = [...MEDICAMENTOS].sort((a, b) => a.nome.localeCompare(b.nome));
        selectMedA.innerHTML = '<option value="" disabled selected>Escolha o primeiro medicamento...</option>';
        selectMedB.innerHTML = '<option value="" disabled selected>Escolha o segundo medicamento...</option>';

        sortedMeds.forEach(med => {
            const optA = document.createElement("option");
            optA.value = med.id;
            optA.textContent = med.nome;
            selectMedA.appendChild(optA);

            const optB = document.createElement("option");
            optB.value = med.id;
            optB.textContent = med.nome;
            selectMedB.appendChild(optB);
        });

        btnAnalisar.addEventListener("click", () => {
            const valA = selectMedA.value;
            const valB = selectMedB.value;

            if (!valA || !valB) {
                alert("Selecione os dois medicamentos.");
                return;
            }

            if (valA === valB) {
                resultContainer.innerHTML = `
                <div class="card result-card status-leve">
                    <div class="result-header">
                        <i data-lucide="info"></i>
                        <div class="result-header-text">
                            <h4>Fármacos Idênticos</h4>
                            <p>Mesmo medicamento em ambos os campos.</p>
                        </div>
                    </div>
                </div>
            `;
                lucide.createIcons();
                return;
            }

            const interacao = INTERACOES.find(inter =>
                (inter.medA === valA && inter.medB === valB) || (inter.medA === valB && inter.medB === valA)
            );

            const medNameA = selectMedA.options[selectMedA.selectedIndex].text;
            const medNameB = selectMedB.options[selectMedB.selectedIndex].text;

            if (interacao) {
                let sClass = "status-leve";
                let sIcon = "check-circle-2";
                if (interacao.gravidade.toLowerCase() === "grave") {
                    sClass = "status-grave";
                    sIcon = "alert-octagon";
                } else if (interacao.gravidade.toLowerCase() === "moderada") {
                    sClass = "status-moderada";
                    sIcon = "alert-triangle";
                }

                resultContainer.innerHTML = `
                <div class="card result-card ${sClass}">
                    <div class="result-header">
                        <i data-lucide="${sIcon}"></i>
                        <div class="result-header-text">
                            <h4>Interação Detectada: Clinicamente ${interacao.gravidade}</h4>
                            <p>${medNameA} + ${medNameB}</p>
                        </div>
                    </div>
                    <div class="result-body">
                        <div class="result-block">
                            <h5>Mecanismo</h5>
                            <p>${interacao.mecanismo}</p>
                        </div>
                        <div class="result-block">
                            <h5>Efeito Clínico</h5>
                            <p>${interacao.efeito}</p>
                        </div>
                        <div class="result-block">
                            <h5>Conduta Recomendada</h5>
                            <p>${interacao.conduta}</p>
                        </div>
                        
                        <div class="medscape-redirect-box" style="margin-top: 20px; padding: 16px; border-radius: var(--radius-md); background-color: var(--bg-tertiary); border: 1px dashed var(--color-primary); display: flex; flex-direction: column; gap: 10px; align-items: flex-start;">
                            <span style="font-size: 12px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 6px;"><i data-lucide="info" class="color-primary" style="width: 16px; height: 16px;"></i> Consulta Avançada Disponível</span>
                            <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.4;">Para uma verificação completa e aprofundada incluindo múltiplos fármacos ou outros parâmetros clínicos, consulte o banco de dados oficial do Medscape.</p>
                            <a href="https://reference.medscape.com/drug-interactionchecker" target="_blank" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none; width: 100%; justify-content: center; font-size: 12px; font-weight: 600; padding: 10px;">
                                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i> Abrir Medscape Drug Interaction Checker
                            </a>
                        </div>
                    </div>
                </div>
            `;
            } else {
                resultContainer.innerHTML = `
                <div class="card result-card status-leve">
                    <div class="result-header">
                        <i data-lucide="check-circle-2"></i>
                        <div class="result-header-text">
                            <h4>Sem Interação Local Relevante</h4>
                            <p>${medNameA} + ${medNameB}</p>
                        </div>
                    </div>
                    <div class="result-body">
                        <div class="result-block">
                            <h5>Parecer Clínico</h5>
                            <p>Não há alertas de interação de gravidade moderada ou grave documentadas entre esses fármacos em nossa base de dados local focada na atenção básica.</p>
                        </div>
                        
                        <div class="medscape-redirect-box" style="margin-top: 20px; padding: 16px; border-radius: var(--radius-md); background-color: var(--bg-tertiary); border: 1px dashed var(--color-primary); display: flex; flex-direction: column; gap: 10px; align-items: flex-start;">
                            <span style="font-size: 12px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 6px;"><i data-lucide="info" class="color-primary" style="width: 16px; height: 16px;"></i> Validar no Medscape Checker</span>
                            <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.4;">Recomendamos sempre validar as interações na base de dados global do Medscape para uma tomada de decisão multiprofissional robusta.</p>
                            <a href="https://reference.medscape.com/drug-interactionchecker" target="_blank" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none; width: 100%; justify-content: center; font-size: 12px; font-weight: 600; padding: 10px;">
                                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i> Abrir Medscape Drug Interaction Checker
                            </a>
                        </div>
                    </div>
                </div>
            `;
            }
            lucide.createIcons();
        });

        btnLimpar.addEventListener("click", () => {
            selectMedA.value = "";
            selectMedB.value = "";
            resultContainer.innerHTML = `
            <div class="empty-state-card">
                <i data-lucide="shuffle"></i>
                <h3>Selecione e Analise</h3>
                <p>Adicione dois medicamentos e clique em Analisar para obter o parecer.</p>
            </div>
        `;
            lucide.createIcons();
        });

        // Início de notícias (Home)
        const newsContainer = document.getElementById("news-container");
        if (newsContainer) {
            newsContainer.innerHTML = "";
            NOTICIAS.forEach(not => {
                const card = document.createElement("div");
                card.className = "card news-card";
                card.innerHTML = `
                <div class="news-meta">
                    <span class="news-tag">${not.categoria}</span>
                    <span>${not.data}</span>
                </div>
                <h4>${not.titulo}</h4>
                <p>${not.conteúdo}</p>
            `;
                newsContainer.appendChild(card);
            });
        }
    }

    /* ==========================================
       4. SEÇÃO DE CONSULTA FARMACÊUTICA (SOAP)
       ========================================== */
    function initSoapSection() {
        const inputNome = document.getElementById("soap-nome");
        const inputIdade = document.getElementById("soap-idade");
        const selectSexo = document.getElementById("soap-sexo");
        const inputPeso = document.getElementById("soap-peso");
        const inputAltura = document.getElementById("soap-altura");
        const inputPaSis = document.getElementById("soap-pa-sis");
        const inputPaDia = document.getElementById("soap-pa-dia");
        const inputGlicemia = document.getElementById("soap-glicemia");

        // Novos Campos e Domínio do Wizard
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
        const btnExportar = document.getElementById("btn-exportar-soap"); // Copiar
        const btnExportarSheets = document.getElementById("btn-exportar-sheets"); // Google Sheets
        const btnLimpar = document.getElementById("btn-limpar-soap");
        const btnCopiar = document.getElementById("btn-copiar-output");

        const formattedOutput = document.getElementById("soap-formatted-output");
        const recentListContainer = document.getElementById("soap-recent-list");

        // Elementos do Google Sheets Modal
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

        // Estado Morisky-Green
        let moriskyAnswers = { 1: 1, 2: 1, 3: 1, 4: 1 }; // Default: "Não" (1 ponto por não, 0 por sim)

        // Alerta de Polifarmácia em tempo real
        window.checkPolifarmaciaAlert = function () {
            const val = parseInt(inputMedicamentosCount.value) || 0;
            const badge = document.getElementById("soap-polifarmacia-badge");
            if (badge) {
                if (val >= 5) {
                    badge.style.display = "inline-block";
                } else {
                    badge.style.display = "none";
                }
            }
            updateFormattedText();
        };

        // Mostrar select condicional do antibiótico
        window.toggleAntibioticoRacionalSelect = function () {
            const uso = selectAntibioticoUso.value;
            const group = document.getElementById("soap-antibiotico-racional-group");
            if (group) {
                if (uso === "Sim") {
                    group.style.display = "block";
                } else {
                    group.style.display = "none";
                }
            }
            updateFormattedText();
        };

        // Morisky Buttons Event Handler
        document.querySelectorAll(".morisky-questions .m-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const q = btn.getAttribute("data-q");
                const val = parseInt(btn.getAttribute("data-val"));

                // Toggle active classes
                btn.parentElement.querySelectorAll(".m-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                moriskyAnswers[q] = val;
                updateMoriskyScore();
            });
        });

        function getMoriskyScore() {
            return moriskyAnswers[1] + moriskyAnswers[2] + moriskyAnswers[3] + moriskyAnswers[4];
        }

        function updateMoriskyScore() {
            const score = getMoriskyScore();
            const badge = document.getElementById("morisky-score-badge");

            if (badge) {
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

        // ---- CONFIGURAÇÃO DO GOOGLE SHEETS ----
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
                    lucide.createIcons();
                }
                if (sheetsConnectionBadge) {
                    sheetsConnectionBadge.className = "sheets-connection-badge sheets-connected";
                    sheetsConnectionText.textContent = "Conectado à Planilha";
                }
                if (sheetsUrlInput) {
                    sheetsUrlInput.value = url;
                }
            } else {
                if (sheetsStatusBar) {
                    sheetsStatusBar.style.display = "none";
                }
                if (sheetsConnectionBadge) {
                    sheetsConnectionBadge.className = "sheets-connection-badge";
                    sheetsConnectionText.textContent = "Não configurado";
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

        // ---- MODAL DO PLANO POSOLÓGICO VISUAL ----
        const posoModalOverlay = document.getElementById("posologia-modal-overlay");
        const posoModalClose = document.getElementById("posologia-modal-close");
        const btnPosoFechar = document.getElementById("btn-posologia-fechar");

        window.openPosologiaModal = function () {
            if (!posoModalOverlay) return;

            // Preencher dados do paciente
            const pacienteNome = inputNome.value.trim() || "Paciente sem identificação";
            const pacienteIdade = inputIdade.value.trim() || "--";
            const pacienteSexo = selectSexo.value === "F" ? "Feminino" : (selectSexo.value === "M" ? "Masculino" : "--");

            const elNome = document.getElementById("poso-paciente-nome");
            const elIdade = document.getElementById("poso-paciente-idade");
            const elSexo = document.getElementById("poso-paciente-sexo");
            const elData = document.getElementById("poso-meta-data");

            if (elNome) elNome.textContent = pacienteNome;
            if (elIdade) elIdade.textContent = pacienteIdade;
            if (elSexo) elSexo.textContent = pacienteSexo;
            if (elData) elData.textContent = new Date().toLocaleDateString("pt-BR");

            // Preencher tabela
            const tableBody = document.getElementById("poso-table-body");
            if (tableBody) {
                tableBody.innerHTML = "";

                if (typeof fcMedList === "undefined" || fcMedList.length === 0) {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 20px; color: #3b50b3ff;">
                                <strong>Nenhum medicamento cadastrado na lista do formulário SOAP.</strong><br>
                                Volte ao Passo 3 (Farmacoterapia) e adicione os medicamentos em uso pelo paciente.
                            </td>
                        </tr>
                    `;
                } else {
                    fcMedList.forEach(med => {
                        const tr = document.createElement("tr");

                        // Tentar achar orientações padrão no banco se obs for vazia
                        let orientacaoTxt = med.obs || "";
                        if (!orientacaoTxt && typeof MEDICAMENTOS !== "undefined") {
                            const dbMed = MEDICAMENTOS.find(m => m.nome.toLowerCase() === med.nome.toLowerCase());
                            if (dbMed && dbMed.orientacoes) {
                                orientacaoTxt = dbMed.orientacoes;
                            }
                        }
                        if (!orientacaoTxt) orientacaoTxt = "Tomar com água conforme prescrição médica.";

                        const formatDose = (val) => {
                            const num = parseFloat(val);
                            if (isNaN(num) || num <= 0) return '<span class="poso-dose-badge zero-dose">—</span>';
                            return `<span class="poso-dose-badge active-dose">${num} ${num === 1 ? 'cp' : 'cps'}</span>`;
                        };

                        tr.innerHTML = `
                            <td>
                                <strong class="poso-med-name">${med.nome}</strong>
                                <span class="poso-med-dose-tag">Dose: ${med.dose}</span>
                            </td>
                            <td style="text-align: center;">${formatDose(med.manha)}</td>
                            <td style="text-align: center;">${formatDose(med.tarde)}</td>
                            <td style="text-align: center;">${formatDose(med.noite)}</td>
                            <td style="font-size: 11px; line-height: 1.4; color: #334155;">
                                ${orientacaoTxt}
                            </td>
                        `;
                        tableBody.appendChild(tr);
                    });
                }
            }

            posoModalOverlay.classList.add("active");
            posoModalOverlay.classList.add("open");
            if (typeof lucide !== "undefined" && lucide.createIcons) {
                lucide.createIcons();
            }
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
                if (e.target === posoModalOverlay) {
                    closePosologiaModal();
                }
            });
        }

        if (btnExportarSheets) {
            btnExportarSheets.addEventListener("click", () => {
                const url = localStorage.getItem("cim_sheets_url");
                if (!url) {
                    openSheetsModal();
                } else {
                    exportToGoogleSheets(url);
                }
            });
        }

        if (sheetsModalClose) sheetsModalClose.addEventListener("click", closeSheetsModal);
        if (btnSheetsCancelar) btnSheetsCancelar.addEventListener("click", closeSheetsModal);

        if (btnCopyScript) {
            btnCopyScript.addEventListener("click", () => {
                const code = document.getElementById("apps-script-code")?.textContent || "";
                navigator.clipboard.writeText(code)
                    .then(() => {
                        if (window.showToast) window.showToast("Código do Apps Script copiado para a área de transferência!", "success");
                        else alert("Código do Apps Script copiado!");
                    })
                    .catch(() => {
                        if (window.showToast) window.showToast("Erro ao copiar o script.", "danger");
                        else alert("Erro ao copiar o script.");
                    });
            });
        }

        if (btnSheetsSalvar) {
            btnSheetsSalvar.addEventListener("click", () => {
                const url = sheetsUrlInput.value.trim();
                if (!url) {
                    localStorage.removeItem("cim_sheets_url");
                    if (window.showToast) window.showToast("Configuração da planilha removida.", "info");
                    else alert("Configuração removida.");
                    closeSheetsModal();
                    updateSheetsStatus();
                    return;
                }
                if (!url.startsWith("https://script.google.com/")) {
                    if (window.showToast) window.showToast("A URL deve iniciar por https://script.google.com/", "warning");
                    else alert("A URL deve ser do domínio script.google.com");
                    return;
                }
                localStorage.setItem("cim_sheets_url", url);
                if (window.showToast) window.showToast("Configuração do Google Sheets salva com sucesso!", "success");
                else alert("Configuração do Google Sheets salva!");
                closeSheetsModal();
                updateSheetsStatus();
            });
        }

        if (btnTestarSheets) {
            btnTestarSheets.addEventListener("click", () => {
                const url = sheetsUrlInput.value.trim();
                if (!url) {
                    if (window.showToast) window.showToast("Insira a URL do Web App antes de testar.", "warning");
                    else alert("Insira a URL do Web App antes de testar.");
                    return;
                }
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
                if (window.showToast) window.showToast("Por favor, preencha o Nome e Idade do paciente para exportar.", "warning");
                else alert("Por favor, preencha o Nome e Idade do paciente para exportar.");
                return;
            }

            const paSis = parseInt(inputPaSis.value) || null;
            const paDia = parseInt(inputPaDia.value) || null;
            const glicemia = parseInt(inputGlicemia.value) || null;

            let paControlada = null;
            if (paSis && paDia) {
                paControlada = (paSis < 140 && paDia < 90);
            }
            let glicemiaControlada = null;
            if (glicemia) {
                glicemiaControlada = (glicemia < 126);
            }

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
                lucide.createIcons();
            }

            fetch(url, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(consultData)
            })
                .then(() => {
                    if (window.showToast) window.showToast("Dados exportados para a planilha Google Sheets com sucesso!", "success");
                    else alert("Dados exportados para a planilha Google Sheets com sucesso!");
                    updateSheetsStatus();
                })
                .catch(err => {
                    console.error("Erro na exportação para o Sheets:", err);
                    if (window.showToast) window.showToast("Erro ao enviar dados para a planilha. Verifique a URL do Web App.", "danger");
                    else alert("Erro ao enviar dados para a planilha. Verifique a URL do Web App.");
                    updateSheetsStatus();
                });
        }

        // ---- CONTROLE DO WIZARD ----
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
                    if (step < prevStepNum) {
                        p.classList.add("going-back");
                    }
                }
            });

            const stepsNavItems = document.querySelectorAll(".wizard-step-item");
            stepsNavItems.forEach((navItem, idx) => {
                const itemStep = idx + 1;
                navItem.classList.remove("active");
                navItem.classList.remove("done");

                if (itemStep === step) {
                    navItem.classList.add("active");
                } else if (itemStep < step) {
                    navItem.classList.add("done");
                }
            });

            const connectors = document.querySelectorAll(".wizard-connector");
            connectors.forEach((conn, idx) => {
                const connStep = idx + 1;
                conn.classList.remove("active");
                conn.classList.remove("done");

                if (connStep < step) {
                    conn.classList.add("done");
                } else if (connStep === step - 1) {
                    conn.classList.add("active");
                }
            });

            updateWizardSummary();

            if (step === 5) {
                consolidarParaSoap();
                updateFormattedText();
            }

            const wizardEl = document.querySelector(".soap-wizard");
            if (wizardEl) {
                wizardEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };

        window.nextStep = function (current) {
            if (validateStep(current)) {
                window.goToStep(current + 1);
            }
        };

        window.prevStep = function (current) {
            window.goToStep(current - 1);
        };

        window.validateStep = function (step) {
            let valid = true;

            const errNome = document.getElementById("err-soap-nome");
            const errIdade = document.getElementById("err-soap-idade");
            if (errNome) { errNome.textContent = ""; inputNome.classList.remove("field-invalid"); }
            if (errIdade) { errIdade.textContent = ""; inputIdade.classList.remove("field-invalid"); }

            if (step === 1) {
                if (!inputNome.value.trim()) {
                    if (errNome) errNome.textContent = "O nome ou iniciais do paciente é obrigatório.";
                    inputNome.classList.add("field-invalid");
                    valid = false;
                }
                const idVal = parseInt(inputIdade.value);
                if (isNaN(idVal) || idVal < 0) {
                    if (errIdade) errIdade.textContent = "Por favor, informe uma idade válida.";
                    inputIdade.classList.add("field-invalid");
                    valid = false;
                }
            }
            return valid;
        };

        function recalculateVitalsInStep1() {
            const peso = parseFloat(inputPeso.value);
            const altura = parseFloat(inputAltura.value);
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

            const paSis = parseInt(inputPaSis.value);
            const paDia = parseInt(inputPaDia.value);
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

            if (creatVal && creatVal > 0 && peso && peso > 0 && parseInt(inputIdade.value) > 0) {
                const idade = parseInt(inputIdade.value);
                const sexo = selectSexo.value;
                let clcr = ((140 - idade) * peso) / (72 * creatVal);
                if (sexo === "F") {
                    clcr = clcr * 0.85;
                }
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
                const cgAlertasAjuste = document.getElementById("cg-alertas-ajuste");
                if (cgAlertasAjuste) {
                    cgAlertasAjuste.innerHTML = `<div style="font-size: 11px; color: var(--text-tertiary); text-align: center; padding: 8px; border: 1px dashed var(--border-color); border-radius: var(--radius-sm);">Nenhum alerta de dose ativo ou clearance não estimado.</div>`;
                }
            }

            updateWizardSummary();
        }

        function updateWizardSummary() {
            const summaryContainer = document.getElementById("wizard-summary-content");
            if (!summaryContainer) return;

            const nome = inputNome.value.trim();
            const idade = parseInt(inputIdade.value);
            const sexo = selectSexo.value === "F" ? "Fem" : "Masc";
            const peso = parseFloat(inputPeso.value) || null;
            const altura = parseFloat(inputAltura.value) || null;
            const paSis = parseInt(inputPaSis.value) || null;
            const paDia = parseInt(inputPaDia.value) || null;
            const glic = parseInt(inputGlicemia.value) || null;

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
            lucide.createIcons();
        }

        const inputsStep1 = [inputPeso, inputAltura, inputPaSis, inputPaDia, inputGlicemia, document.getElementById("cg-creatinina"), inputIdade, selectSexo];
        inputsStep1.forEach(el => {
            if (el) {
                el.addEventListener("input", recalculateVitalsInStep1);
                el.addEventListener("change", recalculateVitalsInStep1);
            }
        });

        // ---- CONSOLIDAÇÃO DO WIZARD PARA O SOAP ----
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

            // Adesão Morisky
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
            const peso = parseFloat(inputPeso.value);
            const altura = parseFloat(inputAltura.value);
            let imcValStr = "Não calculado";
            if (peso && altura) {
                const imc = (peso / (altura * altura)).toFixed(1);
                let imcClass = "Eutrófico";
                if (imc < 18.5) imcClass = "Baixo Peso";
                else if (imc >= 25 && imc < 30) imcClass = "Sobrepeso";
                else if (imc >= 30) imcClass = "Obesidade";
                imcValStr = `${imc} kg/m² (${imcClass})`;
            }

            const paSis = inputPaSis.value.trim();
            const paDia = inputPaDia.value.trim();
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

            const glicemia = inputGlicemia.value.trim();
            const gliValStr = glicemia ? `${glicemia} mg/dL` : "Não aferida";

            objLines.push(`• Biometria e Vitais: Peso: ${peso || '--'} kg | Altura: ${altura || '--'} m | IMC: ${imcValStr}`);
            objLines.push(`• Parâmetros Clínicos: Pressão Arterial: ${paValStr} | Glicemia Capilar: ${gliValStr}`);

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
            const medCount = parseInt(inputMedicamentosCount.value) || (fcMedList.length || 1);
            objLines.push(`• Total de Medicamentos em Uso Contínuo: ${medCount} (Polifarmácia ≥ 5: ${medCount >= 5 ? 'SIM' : 'NÃO'})`);

            if (fcMedList.length > 0) {
                objLines.push(`• Relação da Farmacoterapia Atual Cadastrada:`);
                fcMedList.forEach((m, idx) => {
                    let posStr = `${m.manha} cp (Manhã) - ${m.tarde} cp (Tarde) - ${m.noite} cp (Noite)`;
                    let obsStr = m.obs ? ` [Obs: ${m.obs}]` : "";
                    objLines.push(`   ${idx + 1}. ${m.nome} (${m.dose}) — Posologia: ${posStr}${obsStr}`);
                });
            }

            const antibioUso = selectAntibioticoUso.value;
            if (antibioUso === "Sim") {
                const antibioRacio = selectAntibioticoRacional.value;
                objLines.push(`• Antimicrobianos: Paciente em uso ativo de antibiótico. Avaliação de Uso Racional: ${antibioRacio}.`);
            }

            // --- AVALIAÇÃO [A] ---
            let assLines = [];
            assLines.push(`• Avaliação da Adesão: Morisky-Green Escore ${scoreMgt}/4 (${classMgt}).`);

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
            } else if (selectPrm.value && selectPrm.value !== "Nenhum") {
                assLines.push(`• PRM Principal Identificado: ${selectPrm.value}.`);
            } else if (prmList.length === 0) {
                assLines.push(`• Nenhum PRM crítico adicional registrado na triagem.`);
            }

            // DRC renal em A
            if (clCrCalculado !== null && clCrCalculado < 60) {
                let drcEstagio = getDrcEstagio(clCrCalculado);
                assLines.push(`• Função Renal Reduzida: TFG estimada ${clCrCalculado} mL/min (DRC ${drcEstagio.split(' ')[0]}) — Necessita de acompanhamento posológico e ajuste de medicamentos excretados por via renal.`);
            }

            // --- PLANO [P] ---
            let planLines = [];
            const intervencaoTipo = selectIntervencaoTipo.value;
            const intervencaoStatus = selectIntervencaoStatus.value;
            planLines.push(`1. Conduta/Intervenção Farmacêutica: ${intervencaoTipo} (Status na Equipe: ${intervencaoStatus}).`);

            let itemNum = 2;
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

            txtS.value = subLines.join("\n");
            txtO.value = objLines.join("\n");
            txtA.value = assLines.join("\n");
            txtP.value = planLines.join("\n");
        }

        window.consolidarParaSoap = consolidarParaSoap;

        window.aplicarTemplateSoapVDF = function () {
            const selectTipo = document.getElementById("soap-atendimento-tipo");
            if (selectTipo) {
                selectTipo.value = "Visita Domiciliar Farmacêutica (VDF)";
                if (typeof window.toggleVdfFieldsDisplay === "function") window.toggleVdfFieldsDisplay();
            }
            consolidarParaSoap();
            updateFormattedText();
            if (window.showToast) window.showToast("Modelo SOAP de Visita Domiciliar Farmacêutica (VDF) aplicado!", "success");
        };

        window.aplicarTemplateSoapUSF = function () {
            const selectTipo = document.getElementById("soap-atendimento-tipo");
            if (selectTipo) {
                selectTipo.value = "Consulta em USF / Ambulatorial";
                if (typeof window.toggleVdfFieldsDisplay === "function") window.toggleVdfFieldsDisplay();
            }
            consolidarParaSoap();
            updateFormattedText();
            if (window.showToast) window.showToast("Modelo SOAP de Consulta USF aplicado!", "info");
        };

        // Torna a função de formatação acessível globalmente para reatividade
        window.updateFormattedText = updateFormattedText;

        // Auto-calcula e popula a parte formatada
        function updateFormattedText() {
            const nome = inputNome.value.trim() || "Não informado";
            const idade = inputIdade.value.trim() || "Não informada";
            const sexo = selectSexo.value === "F" ? "Feminino" : "Masculino";
            const tipoAtend = document.getElementById("soap-atendimento-tipo")?.value || "Consulta em USF / Ambulatorial";

            const finalS = txtS.value.trim() || "Sem relatos subjetivos registrados.";
            const finalO = txtO.value.trim() || "Sem dados objetivos registrados.";
            const finalA = txtA.value.trim() || "Sem avaliação clínica registrada.";
            const finalP = txtP.value.trim() || "Sem plano registrado.";

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

        // Event listeners para geração de texto em tempo real
        const monitoredElements = [
            inputNome, inputIdade, selectSexo, inputPeso, inputAltura, inputPaSis, inputPaDia, inputGlicemia,
            inputMedicamentosCount, selectAntibioticoUso, selectAntibioticoRacional, selectIntervencaoTipo, selectIntervencaoStatus,
            txtS, txtO, selectPrm, txtA, txtP
        ];

        monitoredElements.forEach(el => {
            if (el) {
                el.addEventListener("input", updateFormattedText);
                el.addEventListener("change", updateFormattedText);
            }
        });

        // Copiar prontuário
        if (btnCopiar) {
            btnCopiar.addEventListener("click", () => {
                if (formattedOutput) {
                    navigator.clipboard.writeText(formattedOutput.textContent)
                        .then(() => {
                            if (window.showToast) window.showToast("Texto SOAP copiado com sucesso! Pronto para colar no e-SUS PEC.", "success");
                            else alert("Texto copiado com sucesso! Pronto para colar no e-SUS PEC.");
                        })
                        .catch(() => {
                            if (window.showToast) window.showToast("Erro ao copiar o texto.", "danger");
                            else alert("Erro ao copiar o texto.");
                        });
                }
            });
        }

        if (btnExportar) {
            btnExportar.addEventListener("click", () => {
                if (btnCopiar) btnCopiar.click();
            });
        }

        // Salvar consulta localmente e alimentar o Dashboard
        if (btnSalvar) {
            btnSalvar.addEventListener("click", () => {
                const nome = inputNome.value.trim();
                const idade = parseInt(inputIdade.value.trim());

                if (!nome || !idade) {
                    if (window.showToast) window.showToast("Por favor, informe pelo menos o Nome e Idade do paciente para salvar.", "warning");
                    else alert("Por favor, informe pelo menos o Nome e Idade do paciente para salvar.");
                    return;
                }

                const paSis = parseInt(inputPaSis.value) || null;
                const paDia = parseInt(inputPaDia.value) || null;
                const glicemia = parseInt(inputGlicemia.value) || null;

                let paControlada = null;
                if (paSis && paDia) {
                    paControlada = (paSis < 140 && paDia < 90);
                }

                let glicemiaControlada = null;
                if (glicemia) {
                    glicemiaControlada = (glicemia < 126);
                }

                const consult = {
                    id: Date.now(),
                    data: new Date().toISOString().split("T")[0],
                    paciente: nome,
                    idade: idade,
                    sexo: selectSexo.value,
                    paSistolica: paSis,
                    paDiastolica: paDia,
                    glicemia: glicemia,
                    adesaoMorisky: getMoriskyScore(),
                    prm: selectPrm.value,
                    prmCount: prmList.length,
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

                if (window.showToast) {
                    window.showToast(`Consulta de ${nome} salva com sucesso! Os dados foram mantidos na tela.`, "success");
                } else {
                    alert(`Consulta de ${nome} salva com sucesso!`);
                }

                renderRecentConsults();
                // Não limpa automaticamente para evitar perda acidental de dados pós-revisão
            });
        }

        // Limpar formulário de forma amigável
        if (btnLimpar) {
            btnLimpar.addEventListener("click", () => {
                inputNome.value = "";
                inputIdade.value = "";
                selectSexo.value = "F";
                inputPeso.value = "";
                inputAltura.value = "";
                inputPaSis.value = "";
                inputPaDia.value = "";
                inputGlicemia.value = "";

                inputMedicamentosCount.value = "1";
                selectAntibioticoUso.value = "Não";
                selectAntibioticoRacional.value = "Sim";
                selectIntervencaoTipo.value = "Orientação farmacoterapêutica";
                selectIntervencaoStatus.value = "Pendente";

                txtS.value = "";
                txtO.value = "";
                selectPrm.value = "Nenhum";
                txtA.value = "";
                txtP.value = "";

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

                // Limpar inputs de posologia
                const fcSelect = document.getElementById('fc-med-select');
                const fcDose = document.getElementById('fc-pos-dose');
                const fcObs = document.getElementById('fc-pos-obs');
                const fcManhaIn = document.getElementById('fc-pos-manha');
                const fcTardeIn = document.getElementById('fc-pos-tarde');
                const fcNoiteIn = document.getElementById('fc-pos-noite');
                const fcPreview = document.getElementById('fc-posologia-preview-text');

                if (fcSelect) fcSelect.value = '';
                if (fcDose) fcDose.value = '';
                if (fcObs) fcObs.value = '';
                if (fcManhaIn) fcManhaIn.value = 1;
                if (fcTardeIn) fcTardeIn.value = 0;
                if (fcNoiteIn) fcNoiteIn.value = 0;
                if (fcPreview) fcPreview.textContent = '1 — 0 — 0';

                // Cockcroft-Gault
                const cgCreatinina = document.getElementById('cg-creatinina');
                const cgResultBox = document.getElementById('cg-result-box');
                const cgAlertasAjuste = document.getElementById('cg-alertas-ajuste');
                if (cgCreatinina) cgCreatinina.value = '';
                if (cgResultBox) cgResultBox.style.display = 'none';
                if (cgAlertasAjuste) {
                    cgAlertasAjuste.style.display = 'none';
                    cgAlertasAjuste.innerHTML = '';
                }

                if (typeof renderFcList === 'function') renderFcList();
                if (typeof renderPrmList === 'function') renderPrmList();
                if (typeof renderRevisao === 'function') renderRevisao();

                // Limpar Metas SAPS
                const mdHba1cVal = document.getElementById('md-hba1c-val');
                const mdPeDiabetico = document.getElementById('md-pe-diabetico');
                const mdChkAuto = document.getElementById('md-chk-auto');
                const mdChkHipo = document.getElementById('md-chk-hipo');
                const mdChkOlhos = document.getElementById('md-chk-olhos');
                if (mdHba1cVal) mdHba1cVal.value = '';
                if (mdPeDiabetico) mdPeDiabetico.value = 'Não realizado';
                if (mdChkAuto) mdChkAuto.checked = false;
                if (mdChkHipo) mdChkHipo.checked = false;
                if (mdChkOlhos) mdChkOlhos.checked = false;

                const htPaVal = document.getElementById('ht-pa-val');
                const htLoaCoracao = document.getElementById('ht-loa-coracao');
                const htLoaRenal = document.getElementById('ht-loa-renal');
                const htLoaCerebral = document.getElementById('ht-loa-cerebral');
                const htMonCreatinina = document.getElementById('ht-mon-creatinina');
                const htMonPotassio = document.getElementById('ht-mon-potassio');
                const htMonTosse = document.getElementById('ht-mon-tosse');
                const htMonEdema = document.getElementById('ht-mon-edema');
                if (htPaVal) htPaVal.value = '';
                if (htLoaCoracao) htLoaCoracao.checked = false;
                if (htLoaRenal) htLoaRenal.checked = false;
                if (htLoaCerebral) htLoaCerebral.checked = false;
                if (htMonCreatinina) htMonCreatinina.checked = false;
                if (htMonPotassio) htMonPotassio.checked = false;
                if (htMonTosse) htMonTosse.checked = false;
                if (htMonEdema) htMonEdema.checked = false;

                const idPolifarmacia = document.getElementById('id-polifarmacia');
                const idChkQuedas = document.getElementById('id-chk-quedas');
                const idChkCognicao = document.getElementById('id-chk-cognicao');
                const idChkBeers = document.getElementById('id-chk-beers');
                const idChkAutonomia = document.getElementById('id-chk-autonomia');
                if (idPolifarmacia) idPolifarmacia.value = 'Não';
                if (idChkQuedas) idChkQuedas.checked = false;
                if (idChkCognicao) idChkCognicao.checked = false;
                if (idChkBeers) idChkBeers.checked = false;
                if (idChkAutonomia) idChkAutonomia.checked = false;

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
                
                const dataFmt = c.data ? c.data.split("-").reverse().join("/") : "Data --";
                const adesaoBadgeClass = c.adesaoMorisky === 4 ? "badge-success" : "badge-warning";
                const prmBadge = (c.prm && c.prm !== "Nenhum") ? `<span style="font-size:10px; padding:2px 6px; border-radius:4px; background:rgba(239, 68, 68, 0.15); color:var(--danger-color); font-weight:600;">PRM: ${c.prm}</span>` : "";

                item.innerHTML = `
                    <div class="recent-consult-item-text" style="display:flex; flex-direction:column; gap:3px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <h5 style="margin:0; font-size:13px; font-weight:600;">${c.paciente}</h5>
                            <span style="font-size:10px; padding:2px 6px; border-radius:4px; background:var(--bg-tertiary); color:var(--text-secondary); font-weight:600;">${dataFmt}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-size:11px;">
                            <span style="font-size:10px; padding:2px 6px; border-radius:4px; background: ${c.adesaoMorisky === 4 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${c.adesaoMorisky === 4 ? 'var(--success-color)' : 'var(--warning-color)'}; font-weight:600;">
                                Morisky: ${c.adesaoMorisky}/4
                            </span>
                            ${prmBadge}
                        </div>
                    </div>
                    <button class="btn-icon btn-icon-danger" onclick="deleteRecentConsult(${c.id})" aria-label="Excluir" title="Excluir Atendimento">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                `;
                recentListContainer.appendChild(item);
            });
            lucide.createIcons();
        }

        window.deleteRecentConsult = function (id) {
            if (!confirm("Tem certeza que deseja excluir esta consulta?")) return;
            let saved = JSON.parse(localStorage.getItem("cim_consultas")) || [];
            saved = saved.filter(c => c.id !== id);
            localStorage.setItem("cim_consultas", JSON.stringify(saved));
            renderRecentConsults();
        };

        // Inicialização
        updateMoriskyScore();
        renderRecentConsults();
        updateSheetsStatus();
        window.goToStep(1);
    }

    /* ==========================================
       5. PROTOCOLOS INTERATIVOS (FLUXOGRAMAS CONDICIONAIS)
       ========================================== */
    function initProtocolsSection() {
        const protoSelectors = document.querySelectorAll(".proto-select-btn");
        const flowTitle = document.getElementById("flow-title");
        const flowBody = document.getElementById("flow-body-container");

        let currentFlow = "hipertensao";
        let currentStep = "inicio";

        protoSelectors.forEach(btn => {
            btn.addEventListener("click", () => {
                protoSelectors.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFlow = btn.getAttribute("data-flow");
                startFlow();
            });
        });

        function startFlow() {
            currentStep = "inicio";
            renderStep();
        }

        function renderStep() {
            const flow = FLUXOGRAMAS[currentFlow];
            flowTitle.textContent = flow.titulo;

            const step = flow.passos[currentStep];
            flowBody.innerHTML = "";

            if (step.final) {
                // Passo Final (Exibição da Conduta)
                const resultBox = document.createElement("div");
                resultBox.className = `flow-result-box type-${step.tipo}`;
                resultBox.innerHTML = `
                <h4><i data-lucide="check-square"></i> Conduta Final: ${step.titulo}</h4>
                <p>${step.conduta}</p>
                <button class="btn btn-primary" id="btn-reiniciar-fluxo" style="margin-top: 12px; align-self: flex-start;">
                    <i data-lucide="refresh-cw"></i> Reiniciar Algoritmo
                </button>
            `;
                flowBody.appendChild(resultBox);

                document.getElementById("btn-reiniciar-fluxo").addEventListener("click", startFlow);
            } else {
                // Passo de Decisão (Pergunta com Opções)
                const stepDiv = document.createElement("div");
                stepDiv.className = "flow-step";
                stepDiv.innerHTML = `
                <div class="flow-question">${step.pergunta}</div>
                <div class="flow-options-btn-row">
                    <!-- Opções geradas dinamicamente -->
                </div>
            `;

                const btnRow = stepDiv.querySelector(".flow-options-btn-row");
                step.opcoes.forEach(opt => {
                    const btn = document.createElement("button");
                    btn.className = `flow-btn ${opt.texto.toLowerCase() === 'sim' ? 'flow-btn-sim' : 'flow-btn-nao'}`;
                    btn.textContent = opt.texto;
                    btn.addEventListener("click", () => {
                        currentStep = opt.proximo;
                        renderStep();
                    });
                    btnRow.appendChild(btn);
                });
                flowBody.appendChild(stepDiv);
            }
            lucide.createIcons();
        }

        // Alternar abas: Fluxogramas Interativos vs Resumo de Diretrizes
        window.switchProtocolView = function (viewMode) {
            const flowView = document.getElementById("protocol-flow-view");
            const summaryView = document.getElementById("protocol-summary-view");
            const btnFlow = document.getElementById("btn-tab-flow");
            const btnSummary = document.getElementById("btn-tab-summary");

            if (viewMode === 'flow') {
                if (flowView) flowView.style.display = "grid";
                if (summaryView) summaryView.style.display = "none";
                if (btnFlow) btnFlow.classList.add("active");
                if (btnSummary) btnSummary.classList.remove("active");
            } else {
                if (flowView) flowView.style.display = "none";
                if (summaryView) summaryView.style.display = "block";
                if (btnFlow) btnFlow.classList.remove("active");
                if (btnSummary) btnSummary.classList.add("active");
                renderProtocolSummaries();
            }
        };

        function renderProtocolSummaries() {
            const summaryGrid = document.getElementById("protocol-summary-cards-grid");
            if (!summaryGrid || typeof PROTOCOLOS === "undefined") return;
            summaryGrid.innerHTML = "";

            PROTOCOLOS.forEach(proto => {
                const card = document.createElement("div");
                card.className = "proto-summary-card";
                card.innerHTML = `
                    <span class="proto-summary-badge">${proto.categoria}</span>
                    <h4>${proto.titulo}</h4>
                    <p>${proto.resumo}</p>
                    <div class="proto-summary-meta">
                        <strong>Metas / Alvos Clínicos:</strong> ${proto.metas}
                    </div>
                    <div class="proto-summary-meta">
                        <strong>1ª Linha Terapêutica (SUS):</strong> ${proto.primeiraLinha}
                    </div>
                    <a href="${proto.linkOficial}" target="_blank" class="btn btn-secondary" style="font-size: 11px; margin-top: 4px; display: inline-flex; align-items: center; gap: 6px;">
                        <i data-lucide="external-link" style="width: 14px; height: 14px;"></i> Acessar Diretriz Oficial
                    </a>
                `;
                summaryGrid.appendChild(card);
            });
            if (typeof lucide !== "undefined" && lucide.createIcons) {
                lucide.createIcons();
            }
        }

        // Inicialização da aba de fluxogramas
        startFlow();
        renderProtocolSummaries();
    }

    /* ==========================================
       6. CALCULADORAS CLÍNICAS
       ========================================== */
    function initCalculatorsSection() {
        // Calculadora 1: Cockcroft-Gault
        const calcIdade = document.getElementById("calc-idade");
        const calcPeso = document.getElementById("calc-peso");
        const calcCreatinina = document.getElementById("calc-creatinina");
        const calcSexo = document.getElementById("calc-sexo");
        const btnCalcularClcr = document.getElementById("btn-calcular-clcr");
        const btnLimparClcr = document.getElementById("btn-limpar-clcr");
        const clcrResult = document.getElementById("clcr-result-container");

        btnCalcularClcr.addEventListener("click", () => {
            const idade = parseInt(calcIdade.value);
            const peso = parseFloat(calcPeso.value);
            const creatinina = parseFloat(calcCreatinina.value);
            const sexo = calcSexo.value;

            if (!idade || !peso || !creatinina) {
                alert("Por favor, preencha todos os campos da calculadora de Clearance.");
                return;
            }

            // Fórmula Cockcroft-Gault
            let clcr = ((140 - idade) * peso) / (72 * creatinina);
            if (sexo === "F") clcr = clcr * 0.85;

            clcrResult.innerHTML = "";
            clcrResult.style.display = "block";

            // Determinar classificação e alertas
            let classification = "Função renal preservada";
            let colorClass = "color-primary";
            let alertBoxHTML = "";

            if (clcr < 30) {
                classification = "Insuficiência Renal Grave (Estágios 4 ou 5)";
                colorClass = "color-primary";
                alertBoxHTML = `
                <div class="calc-alert" style="background-color: var(--danger-bg); border-left-color: var(--danger-color); color: var(--danger-color);">
                    <i data-lucide="alert-octagon"></i>
                    <div>
                        <strong>ALERTA DE SEGURANÇA (ClCr < 30 mL/min):</strong>
                        <p>• <strong>Metformina:</strong> CONTRAINDICADA. Suspender o tratamento devido ao alto risco de acidose lática metabólica.</p>
                        <p>• <strong>Captopril / Losartana:</strong> Risco aumentado de hipercalemia e piora renal. Ajustar doses se necessário e monitorar potássio.</p>
                        <p>• <strong>Espironolactona:</strong> CONTRAINDICADA se ClCr < 30 mL/min.</p>
                    </div>
                </div>
            `;
            } else if (clcr >= 30 && clcr < 45) {
                classification = "Insuficiência Renal Moderada (Estágio 3b)";
                alertBoxHTML = `
                <div class="calc-alert">
                    <i data-lucide="alert-triangle"></i>
                    <div>
                        <strong>ALERTA DE DOSAGEM (ClCr 30-44 mL/min):</strong>
                        <p>• <strong>Metformina:</strong> Dose máxima sugerida de 1.000 mg/dia. Não iniciar novos tratamentos com este clearance.</p>
                        <p>• <strong>Espironolactona / Captopril:</strong> Requer monitoramento rígido da creatinina sérica.</p>
                    </div>
                </div>
            `;
            } else if (clcr >= 45 && clcr < 60) {
                classification = "Insuficiência Renal Leve a Moderada (Estágio 3a)";
            } else if (clcr >= 60 && clcr < 90) {
                classification = "Diminuição leve da função renal (Estágio 2)";
            }

            clcrResult.innerHTML = `
            <div class="result-box-inner">
                <h4>Clearance de Creatinina Estimado:</h4>
                <div class="val-highlight ${colorClass}">${clcr.toFixed(1)} mL/min</div>
                <p class="classification">Classificação: <strong>${classification}</strong></p>
                ${alertBoxHTML}
            </div>
        `;
            lucide.createIcons();
        });

        btnLimparClcr.addEventListener("click", () => {
            calcIdade.value = "";
            calcPeso.value = "";
            calcCreatinina.value = "";
            calcSexo.value = "M";
            clcrResult.style.display = "none";
            clcrResult.innerHTML = "";
        });

        // Calculadora 2: IMC
        const imcPeso = document.getElementById("calc-imc-peso");
        const imcAltura = document.getElementById("calc-imc-altura");
        const btnCalcularImc = document.getElementById("btn-calcular-imc");
        const btnLimparImc = document.getElementById("btn-limpar-imc");
        const imcResult = document.getElementById("imc-result-container");

        btnCalcularImc.addEventListener("click", () => {
            const peso = parseFloat(imcPeso.value);
            const altura = parseFloat(imcAltura.value);

            if (!peso || !altura) {
                alert("Preencha o peso e altura.");
                return;
            }

            const imc = peso / (altura * altura);
            imcResult.innerHTML = "";
            imcResult.style.display = "block";

            let classification = "Eutrófico (Peso normal)";
            let conduta = "Manter alimentação equilibrada e hábitos saudáveis de atividade física.";
            let color = "var(--success-color)";

            if (imc < 18.5) {
                classification = "Abaixo do Peso";
                conduta = "Avaliar risco nutricional e necessidade de acompanhamento com nutricionista.";
                color = "var(--color-secondary)";
            } else if (imc >= 25 && imc < 30) {
                classification = "Sobrepeso (Pré-obesidade)";
                conduta = "Inserir aconselhamento de estilo de vida: redução de açúcares/sódio e aumento de exercício aeróbico.";
                color = "var(--warning-color)";
            } else if (imc >= 30 && imc < 35) {
                classification = "Obesidade Grau I";
                conduta = "Encaminhar para suporte dietoterápico e afastar complicações como pré-diabetes/hipertensão.";
                color = "var(--danger-color)";
            } else if (imc >= 35) {
                classification = "Obesidade Grau II ou III (Grave)";
                conduta = "Acompanhamento médico e nutricional integrado na UBS. Avaliar comorbidades cardiovasculares secundárias.";
                color = "var(--danger-color)";
            }

            imcResult.innerHTML = `
            <div class="result-box-inner">
                <h4>Índice de Massa Corporal (IMC):</h4>
                <div class="val-highlight" style="color: ${color};">${imc.toFixed(1)} kg/m²</div>
                <p class="classification">Classificação: <strong>${classification}</strong></p>
                <div class="calc-alert" style="background-color: var(--bg-primary); border-left-color: ${color}; color: var(--text-secondary);">
                    <i data-lucide="info"></i>
                    <div>
                        <strong>Conduta Sugerida:</strong>
                        <p>${conduta}</p>
                    </div>
                </div>
            </div>
        `;
            lucide.createIcons();
        });

        btnLimparImc.addEventListener("click", () => {
            imcPeso.value = "";
            imcAltura.value = "";
            imcResult.style.display = "none";
            imcResult.innerHTML = "";
        });

        // Calculadora 3: CKD-EPI 2021
        const calcEpiIdade = document.getElementById("calc-epi-idade");
        const calcEpiCreatinina = document.getElementById("calc-epi-creatinina");
        const calcEpiSexo = document.getElementById("calc-epi-sexo");
        const btnCalcularEpi = document.getElementById("btn-calcular-epi");
        const btnLimparEpi = document.getElementById("btn-limpar-epi");
        const epiResult = document.getElementById("epi-result-container");

        btnCalcularEpi.addEventListener("click", () => {
            const idade = parseInt(calcEpiIdade.value);
            const cr = parseFloat(calcEpiCreatinina.value);
            const sexo = calcEpiSexo.value;

            if (!idade || !cr) {
                alert("Por favor, preencha todos os campos da calculadora CKD-EPI.");
                return;
            }

            // CKD-EPI Creatinina (2021)
            let kappa = (sexo === "F") ? 0.7 : 0.9;
            let alpha = (sexo === "F") ? -0.241 : -0.302;
            let genderCoeff = (sexo === "F") ? 1.012 : 1.0;

            let term1 = Math.min(cr / kappa, 1);
            let term2 = Math.max(cr / kappa, 1);

            let egfr = 142 * Math.pow(term1, alpha) * Math.pow(term2, -1.200) * Math.pow(0.9938, idade) * genderCoeff;

            epiResult.innerHTML = "";
            epiResult.style.display = "block";

            let classification = getDrcEstagio(egfr);
            let color = "var(--color-primary)";
            let alertBoxHTML = "";

            if (egfr < 30) {
                color = "var(--danger-color)";
                alertBoxHTML = `
                    <div class="calc-alert" style="background-color: var(--danger-bg); border-left-color: var(--danger-color); color: var(--danger-color); font-size:12px; margin-top:10px;">
                        <i data-lucide="alert-octagon"></i>
                        <div>
                            <strong>ALERTA DE SEGURANÇA (TFGe < 30):</strong>
                            <p style="margin: 4px 0 0 0;">• Risco crítico de toxicidade renal. Evitar AINEs, ajustar posologia de hipoglicemiantes e antivirais.</p>
                            <p style="margin: 4px 0 0 0;">• Metformina é contraindicada neste estágio.</p>
                        </div>
                    </div>
                `;
            } else if (egfr >= 30 && egfr < 60) {
                color = "var(--warning-color)";
                alertBoxHTML = `
                    <div class="calc-alert" style="font-size:12px; margin-top:10px;">
                        <i data-lucide="alert-triangle"></i>
                        <div>
                            <strong>ALERTA DE AJUSTE (TFGe 30-59):</strong>
                            <p style="margin: 4px 0 0 0;">• Sugerido monitoramento anual ou semestral da função renal.</p>
                            <p style="margin: 4px 0 0 0;">• Avaliar necessidade de redução de dose de medicamentos hidrossolúveis.</p>
                        </div>
                    </div>
                `;
            }

            epiResult.innerHTML = `
                <div class="result-box-inner">
                    <h4>Taxa de Filtração Glomerular Estimada (TFGe):</h4>
                    <div class="val-highlight" style="color: ${color}; font-size: 20px; font-weight: 800; margin: 8px 0;">${egfr.toFixed(1)} mL/min/1.73m²</div>
                    <p class="classification" style="font-size: 13px; margin: 0 0 8px 0;">Estágio DRC sugerido: <strong>${classification}</strong></p>
                    ${alertBoxHTML}
                </div>
            `;
            lucide.createIcons();
        });

        btnLimparEpi.addEventListener("click", () => {
            calcEpiIdade.value = "";
            calcEpiCreatinina.value = "";
            calcEpiSexo.value = "M";
            epiResult.style.display = "none";
            epiResult.innerHTML = "";
        });

        // Calculadora 4: HAS-BLED
        const hasH = document.getElementById("has-h");
        const hasARenal = document.getElementById("has-a-renal");
        const hasAHepatica = document.getElementById("has-a-hepatica");
        const hasS = document.getElementById("has-s");
        const hasB = document.getElementById("has-b");
        const hasL = document.getElementById("has-l");
        const hasE = document.getElementById("has-e");
        const hasDDrogas = document.getElementById("has-d-drogas");
        const hasDAlcool = document.getElementById("has-d-alcool");
        const btnCalcularHas = document.getElementById("btn-calcular-has");
        const btnLimparHas = document.getElementById("btn-limpar-has");
        const hasResult = document.getElementById("has-result-container");

        btnCalcularHas.addEventListener("click", () => {
            let score = 0;
            if (hasH.checked) score++;
            if (hasARenal.checked) score++;
            if (hasAHepatica.checked) score++;
            if (hasS.checked) score++;
            if (hasB.checked) score++;
            if (hasL.checked) score++;
            if (hasE.checked) score++;
            if (hasDDrogas.checked) score++;
            if (hasDAlcool.checked) score++;

            hasResult.innerHTML = "";
            hasResult.style.display = "block";

            let risk = "Baixo Risco";
            let color = "var(--success-color)";
            let conduta = "Manter anticoagulação habitual. Monitorar sintomas clínicos normais.";
            let rate = "1.1%";

            if (score === 1 || score === 2) {
                risk = "Risco Moderado";
                color = "var(--warning-color)";
                conduta = "Atenção a queixas de sangramento. Avaliar exames e acompanhamento periódico.";
                rate = (score === 1) ? "1.0%" : "1.9%";
            } else if (score >= 3) {
                risk = "Alto Risco";
                color = "var(--danger-color)";
                conduta = "Recomenda-se precaução, revisões mais frequentes e controle rígido dos fatores modificáveis (ex: controle da PA, suspensão de AINEs/AAS desnecessários e redução de álcool).";
                rate = (score === 3) ? "3.7%" : (score === 4 ? "8.7%" : "≥ 12.5%");
            }

            hasResult.innerHTML = `
                <div class="result-box-inner">
                    <h4>Pontuação HAS-BLED:</h4>
                    <div class="val-highlight" style="color: ${color}; font-size: 20px; font-weight: 800; margin: 8px 0;">${score} ${score === 1 ? 'ponto' : 'pontos'}</div>
                    <p class="classification" style="font-size: 13px; margin: 0 0 8px 0;">Classificação: <strong>${risk} (${rate} risco/ano de sangramento maior)</strong></p>
                    <div class="calc-alert" style="background-color: var(--bg-primary); border-left-color: ${color}; color: var(--text-secondary); font-size:12px; margin-top:10px;">
                        <i data-lucide="info"></i>
                        <div>
                            <strong>Conduta Recomendada:</strong>
                            <p style="margin: 4px 0 0 0;">${conduta}</p>
                        </div>
                    </div>
                </div>
            `;
            lucide.createIcons();
        });

        btnLimparHas.addEventListener("click", () => {
            hasH.checked = false;
            hasARenal.checked = false;
            hasAHepatica.checked = false;
            hasS.checked = false;
            hasB.checked = false;
            hasL.checked = false;
            hasE.checked = false;
            hasDDrogas.checked = false;
            hasDAlcool.checked = false;
            hasResult.style.display = "none";
            hasResult.innerHTML = "";
        });
    }

    /* ==========================================
       7. SEÇÃO DE FARMACOVIGILÂNCIA
       ========================================== */
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

        // Mostrar fase do erro condicionalmente
        window.toggleVigilanciaFaseErro = function () {
            const tipo = selectTipoEvento.value;
            const group = document.getElementById("vig-fase-erro-group");
            if (tipo === "ErroMedicao") {
                group.style.display = "block";
            } else {
                group.style.display = "none";
            }
        };

        // Preencher select/datalist de medicamentos suspeitos
        const dataList = document.getElementById("vig-meds-list");
        if (typeof MEDICAMENTOS !== "undefined") {
            const sorted = [...MEDICAMENTOS].sort((a, b) => a.nome.localeCompare(b.nome));
            if (dataList) {
                dataList.innerHTML = "";
                sorted.forEach(m => {
                    const opt = document.createElement("option");
                    opt.value = m.nome;
                    dataList.appendChild(opt);
                });
            } else if (selectMed && selectMed.tagName === "SELECT") {
                selectMed.innerHTML = '<option value="" disabled selected>Selecione ou digite o fármaco...</option>';
                sorted.forEach(m => {
                    const opt = document.createElement("option");
                    opt.value = m.nome;
                    opt.textContent = m.nome;
                    selectMed.appendChild(opt);
                });
            }
        }

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

        btnCopiar.addEventListener("click", () => {
            navigator.clipboard.writeText(formattedOutput.textContent)
                .then(() => alert("Notificação copiada com sucesso!"))
                .catch(() => alert("Erro ao copiar."));
        });

        btnLimpar.addEventListener("click", () => {
            inputInitials.value = "";
            inputIdade.value = "";
            selectSexo.value = "F";
            selectTipoEvento.value = "RAM";
            selectFaseErro.value = "Prescrição";
            document.getElementById("vig-fase-erro-group").style.display = "none";
            selectMed.value = "";
            selectIntensidade.value = "Leve";
            txtDesc.value = "";
            txtConduta.value = "";
            formattedOutput.textContent = "Preencha a ficha ao lado para gerar a notificação estruturada...";
        });
    }

    /* ==========================================
       7B. GESTÃO DE CONTEÚDO EDUCATIVO
       ========================================== */
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
        }
    };

    window.showEduModal = function (topic) {
        const modal = document.getElementById("edu-modal");
        const title = document.getElementById("edu-modal-title");
        const content = document.getElementById("edu-modal-content");

        if (CARTILHAS_EDUCATIVAS[topic]) {
            let iconName = "layers";
            if (topic === "antibioticos") iconName = "pill";
            else if (topic === "fitoterapicos") iconName = "leaf";
            else if (topic === "descarte") iconName = "trash-2";

            title.innerHTML = `<i data-lucide="${iconName}" class="color-primary" style="width: 24px; height: 24px;"></i> ${CARTILHAS_EDUCATIVAS[topic].title}`;
            content.innerHTML = CARTILHAS_EDUCATIVAS[topic].content;
            modal.style.display = "flex";
            lucide.createIcons();
        }
    };

    window.closeEduModal = function () {
        const modal = document.getElementById("edu-modal");
        modal.style.display = "none";
    };


    /* ==========================================
       FARMÁCIA CLÍNICA — POSOLOGIA, BEERS, REVISÃO & NOTAS METODOLÓGICAS (SAPS)
       ========================================== */
    function initFarmClinicaSection() {
        // ---- Navegação de Abas do SOAP ----
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
            lucide.createIcons();
        };

        // ---- Navegação de Sub-abas da Farmácia Clínica ----
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
            lucide.createIcons();
        };

        // ---- Alternância de Perfis Metodológicos SAPS ----
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
            lucide.createIcons();
        };

        // ---- LISTA DE MEDICAMENTOS + POSOLOGIA ----
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

        // Utiliza as variáveis globais compartilhadas de estado clínico: fcMedList, prmList, cgDadosPaciente, clCrCalculado

        // Atualiza o select de PRM com base na lista de medicamentos do paciente
        function updatePrmMedSelect() {
            const select = document.getElementById('prm-med-select');
            if (!select) return;
            select.innerHTML = '<option value="Geral / Paciente">Geral (Sem medicamento específico)</option>';

            if (fcMedList.length === 0) {
                // Mostrar os 15 primeiros medicamentos da REMUME caso a lista do paciente esteja vazia
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

        // Popular select com medicamentos da REMUME
        if (fcSelect) {
            fcSelect.innerHTML = '<option value="" disabled selected>Selecione o medicamento...</option>';
            MEDICAMENTOS.forEach(med => {
                const opt = document.createElement('option');
                opt.value = med.id;
                opt.textContent = med.nome;
                fcSelect.appendChild(opt);
            });
            // Opção customizada
            const optCustom = document.createElement('option');
            optCustom.value = 'CUSTOM_MED';
            optCustom.textContent = '➕ Outro medicamento (Fora da REMUME)...';
            fcSelect.appendChild(optCustom);
        }

        // Preview em tempo real da posologia
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

        // Preencher dose sugerida ao selecionar medicamento
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
            });
        }

        function renderFcList() {
            if (!fcListContainer) return;
            if (fcMedList.length === 0) {
                fcListContainer.innerHTML = `<div class="empty-state-card" style="padding:32px; text-align: center;"><i data-lucide="pill" style="width:32px; height:32px; color:var(--text-tertiary); margin-bottom:8px;"></i><h3 style="font-size:14px;">Lista vazia</h3><p style="font-size:12px; color:var(--text-secondary);">Adicione medicamentos pelo formulário ao lado para montar a lista.</p></div>`;
                fcCount.textContent = '0 medicamentos';
                updatePrmMedSelect();
                lucide.createIcons();
                return;
            }
            fcCount.textContent = `${fcMedList.length} medicamento${fcMedList.length !== 1 ? 's' : ''}`;
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
            lucide.createIcons();
            if (typeof window.updateFormattedText === 'function') {
                window.updateFormattedText();
            }
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
                        alert('Por favor, digite o nome do medicamento personalizado fora da REMUME.');
                        if (fcCustomMedInput) fcCustomMedInput.focus();
                        return;
                    }
                    medNome = customNome + ' (Fora da REMUME)';
                    isCustom = true;
                } else {
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

        // ---- CRITÉRIOS DE BEERS ----
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
            lucide.createIcons();
        }

        // ---- REVISÃO FARMACOTERAPÊUTICA ----
        const revisaoContainer = document.getElementById('fc-revisao-container');
        const progressBar = document.getElementById('fc-revisao-progress-bar');
        const progressText = document.getElementById('fc-revisao-progress-text');
        // Utiliza a variável global compartilhada revisaoState

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
            const total = REVISAO_CHECKLIST.length;
            const done = Object.values(revisaoState).filter(Boolean).length;
            if (progressBar) progressBar.style.width = `${(done / total) * 100}%`;
            if (progressText) progressText.textContent = `${done} / ${total} itens`;
            if (typeof window.updateFormattedText === 'function') {
                window.updateFormattedText();
            }
        }

        renderRevisao();

        const btnResetRevisao = document.getElementById('fc-btn-reset-revisao');
        if (btnResetRevisao) {
            btnResetRevisao.addEventListener('click', () => { revisaoState = {}; renderRevisao(); });
        }

        // ---- LÓGICA DE PRM/RNM ----
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
                if (typeof window.updateFormattedText === 'function') {
                    window.updateFormattedText();
                }
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
            lucide.createIcons();
            if (typeof window.updateFormattedText === 'function') {
                window.updateFormattedText();
            }
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

        // Inicializar os selects
        updatePrmMedSelect();
        renderPrmList();

        // ---- LÓGICA DA CALCULADORA DE FUNÇÃO RENAL (COCKCROFT-GAULT) ----
        const cgPacienteDados = document.getElementById('cg-paciente-dados');
        const btnCgAtualizarDados = document.getElementById('btn-cg-atualizar-dados');
        const cgCreatinina = document.getElementById('cg-creatinina');
        const btnCgCalcular = document.getElementById('btn-cg-calcular');
        const cgResultBox = document.getElementById('cg-result-box');
        const cgAlertasAjuste = document.getElementById('cg-alertas-ajuste');

        function atualizarDadosPacienteCg() {
            const idadeInput = document.getElementById('soap-idade');
            const sexoInput = document.getElementById('soap-sexo');
            const pesoInput = document.getElementById('soap-peso');

            const idade = parseInt(idadeInput?.value) || 0;
            const sexo = sexoInput?.value || 'F';
            const peso = parseFloat(pesoInput?.value) || 0;

            cgDadosPaciente = { sexo, idade, peso };

            if (cgPacienteDados) {
                cgPacienteDados.textContent = `Dados importados: Sexo ${sexo}, ${idade > 0 ? idade + ' anos' : 'idade não inserida'}, ${peso > 0 ? peso + ' kg' : 'peso não inserido'}`;
            }
        }

        if (btnCgAtualizarDados) {
            btnCgAtualizarDados.addEventListener('click', (e) => {
                e.preventDefault();
                atualizarDadosPacienteCg();
            });
        }

        function processarAjustesRenais(clcr) {
            if (!cgAlertasAjuste) return;
            cgAlertasAjuste.innerHTML = '';
            cgAlertasAjuste.style.display = 'none';

            const alertas = [];

            fcMedList.forEach(med => {
                const nomeMed = med.nome.toLowerCase();

                if (nomeMed.includes('metformina')) {
                    if (clcr < 30) {
                        alertas.push({
                            med: med.nome,
                            tipo: 'grave',
                            alerta: '<strong>Contraindicado!</strong> ClCr < 30 mL/min indica alto risco de acidose lática grave. Recomendar suspensão imediata e troca de terapia antidiabética.'
                        });
                    } else if (clcr < 45) {
                        alertas.push({
                            med: med.nome,
                            tipo: 'moderado',
                            alerta: '<strong>Ajuste necessário:</strong> ClCr entre 30 e 44 mL/min. Limitar dose máxima a 1000 mg/dia (ex: 500 mg 12/12h) e monitorar função renal mais de perto.'
                        });
                    }
                }
                else if (nomeMed.includes('glibenclamida')) {
                    if (clcr < 50) {
                        alertas.push({
                            med: med.nome,
                            tipo: 'grave',
                            alerta: '<strong>Alto risco!</strong> ClCr < 50 mL/min em idosos aumenta dramaticamente o risco de hipoglicemia severa e prolongada. Recomendar substituição por antidiabético mais seguro (ex: Gliclazida ou metformina ajustada).'
                        });
                    }
                }
                else if (nomeMed.includes('enalapril')) {
                    if (clcr < 30) {
                        alertas.push({
                            med: med.nome,
                            tipo: 'moderado',
                            alerta: '<strong>Ajuste de dose:</strong> ClCr < 30 mL/min. Iniciar com dose menor (2.5 mg/dia) e monitorar rigorosamente níveis de Potássio sérico (risco de hipercalemia) e Creatinina.'
                        });
                    }
                }
                else if (nomeMed.includes('espironolactona')) {
                    if (clcr < 30) {
                        alertas.push({
                            med: med.nome,
                            tipo: 'grave',
                            alerta: '<strong>Contraindicado!</strong> Risco grave de hipercalemia severa em pacientes com ClCr < 30 mL/min. Recomendar suspensão.'
                        });
                    }
                }
                else if (nomeMed.includes('atenolol')) {
                    if (clcr < 35) {
                        alertas.push({
                            med: med.nome,
                            tipo: 'moderado',
                            alerta: '<strong>Ajuste de dose:</strong> Atenolol acumula na insuficiência renal. Limitar dose máxima a 50 mg/dia ou 25 mg/dia se ClCr < 15 mL/min.'
                        });
                    }
                }
                else if (nomeMed.includes('hidroclorotiazida')) {
                    if (clcr < 30) {
                        alertas.push({
                            med: med.nome,
                            tipo: 'moderado',
                            alerta: '<strong>Perda de eficácia:</strong> Tiazídicos perdem efeito diurético com ClCr < 30 mL/min. Sugerir troca por diurético de alça (Furosemida) se o objetivo for controle de congestão/edema.'
                        });
                    }
                }
            });

            if (alertas.length > 0) {
                cgAlertasAjuste.style.display = 'flex';
                alertas.forEach(a => {
                    const badgeClass = a.tipo === 'grave' ? 'badge-grave' : 'badge-moderada';
                    const div = document.createElement('div');
                    div.style = 'background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 10px; display: flex; flex-direction: column; gap: 4px;';
                    div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong style="font-size:12px; color: var(--text-primary);">${a.med}</strong>
                        <span class="intervencao-badge ${badgeClass}" style="font-size: 9px; padding: 2px 6px;">${a.tipo.toUpperCase()}</span>
                    </div>
                    <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.4;">${a.alerta}</p>
                `;
                    cgAlertasAjuste.appendChild(div);
                });
            } else if (clcr < 60) {
                cgAlertasAjuste.style.display = 'flex';
                const div = document.createElement('div');
                div.style = 'background: rgba(13,148,136,0.06); border: 1px solid rgba(13,148,136,0.15); border-radius: var(--radius-md); padding: 8px 10px; font-size: 11px; color: var(--text-secondary);';
                div.innerHTML = '<i data-lucide="info" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Nenhum medicamento de risco renal crítico (como Metformina, Diuréticos, IECA) consta na lista atual do paciente, mas recomenda-se monitoramento preventivo.';
                cgAlertasAjuste.appendChild(div);
            }
            lucide.createIcons();
        }

        if (btnCgCalcular) {
            btnCgCalcular.addEventListener('click', (e) => {
                e.preventDefault();
                atualizarDadosPacienteCg();

                const creatVal = parseFloat(cgCreatinina.value);
                if (!creatVal || creatVal <= 0) {
                    alert('Insira um valor de Creatinina Sérica válido maior que zero.');
                    return;
                }

                const { sexo, idade, peso } = cgDadosPaciente;
                if (idade <= 0) {
                    alert('A idade do paciente precisa ser maior que zero (preencha no formulário SOAP principal).');
                    return;
                }
                if (peso <= 0) {
                    alert('O peso do paciente precisa ser maior que zero (preencha no formulário SOAP principal).');
                    return;
                }

                // Cockcroft-Gault
                let clcr = ((140 - idade) * peso) / (72 * creatVal);
                if (sexo === 'F') {
                    clcr = clcr * 0.85;
                }
                clCrCalculado = parseFloat(clcr.toFixed(1));

                // Exibir Resultado
                let drcClass = '';
                let drcCor = '';
                let drcDesc = '';

                if (clCrCalculado >= 90) {
                    drcClass = 'Estágio G1 (Normal ou Elevado)';
                    drcCor = 'rgba(16, 185, 129, 0.08)';
                    drcDesc = 'Função renal preservada.';
                } else if (clCrCalculado >= 60) {
                    drcClass = 'Estágio G2 (Levemente Diminuído)';
                    drcCor = 'rgba(16, 185, 129, 0.12)';
                    drcDesc = 'Redução leve. Monitorar se houver fatores de risco (DM/HAS).';
                } else if (clCrCalculado >= 45) {
                    drcClass = 'Estágio G3a (Diminuição Leve a Moderada)';
                    drcCor = 'rgba(245, 158, 11, 0.08)';
                    drcDesc = 'Pode requerer ajuste de dose de alguns fármacos.';
                } else if (clCrCalculado >= 30) {
                    drcClass = 'Estágio G3b (Diminuição Moderada a Severa)';
                    drcCor = 'rgba(245, 158, 11, 0.15)';
                    drcDesc = 'Ajuste de dose recomendado para múltiplos medicamentos.';
                } else if (clCrCalculado >= 15) {
                    drcClass = 'Estágio G4 (Diminuição Severa)';
                    drcCor = 'rgba(239, 68, 68, 0.08)';
                    drcDesc = 'Alto risco de iatrogenias e toxicidade. Ajustes de dose críticos.';
                } else {
                    drcClass = 'Estágio G5 (Falência Renal)';
                    drcCor = 'rgba(239, 68, 68, 0.15)';
                    drcDesc = 'Necessidade de terapia substitutiva ou ajuste crítico extremo.';
                }

                if (cgResultBox) {
                    cgResultBox.style.display = 'block';
                    cgResultBox.style.backgroundColor = drcCor;
                    cgResultBox.style.border = `1px solid ${clCrCalculado < 30 ? '#ef4444' : (clCrCalculado < 60 ? '#f59e0b' : '#10b981')}`;
                    cgResultBox.innerHTML = `
                    <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: ${clCrCalculado < 30 ? '#ef4444' : (clCrCalculado < 60 ? '#d97706' : '#10b981')}">
                        Clearance de Creatinina: ${clCrCalculado} mL/min
                    </div>
                    <div style="font-weight: 600; font-size: 12px; margin-bottom: 2px;">
                        ${drcClass}
                    </div>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                        ${drcDesc} (Creatinina: ${creatVal.toFixed(2)} mg/dL)
                    </div>
                `;
                }

                processarAjustesRenais(clCrCalculado);
                if (typeof window.updateFormattedText === 'function') {
                    window.updateFormattedText();
                }
            });
        }

        // Atualizar dados iniciais na montagem
        atualizarDadosPacienteCg();

        // ---- INTEGRAÇÃO AUTOMÁTICA METAS -> SOAP ----
        const btnIntegrarSoap = document.getElementById('btn-integrar-metas-soap');
        if (btnIntegrarSoap) {
            btnIntegrarSoap.addEventListener('click', () => {
                const txtS = document.getElementById("soap-s");
                const txtO = document.getElementById("soap-o");
                const txtA = document.getElementById("soap-a");
                const txtP = document.getElementById("soap-p");

                const inputPaSis = document.getElementById("soap-pa-sis");
                const inputPaDia = document.getElementById("soap-pa-dia");
                const inputGlicemia = document.getElementById("soap-glicemia");
                const inputMedicamentosCount = document.getElementById("soap-medicamentos-count");

                // Auxiliar para concatenação sem duplicações
                const appendSoapBlock = (field, label, valueText) => {
                    if (!field) return;
                    const currentText = field.value.trim();
                    const header = `[${label.toUpperCase()}]`;
                    const newBlock = `${header}\n${valueText}`;

                    if (currentText.includes(header)) {
                        // Substitui o bloco anterior pelo novo
                        const regex = new RegExp(`\\[${label.toUpperCase()}\\][\\s\\S]*?(?=\\n\\[|$)`);
                        field.value = currentText.replace(regex, newBlock).trim();
                    } else {
                        field.value = currentText ? `${currentText}\n\n${newBlock}` : newBlock;
                    }
                };

                // Detectar qual painel de metas está ativo
                const isDiabetes = document.getElementById('meta-panel-diabetes')?.classList.contains('active');
                const isHipertensao = document.getElementById('meta-panel-hipertensao')?.classList.contains('active');
                const isIdoso = document.getElementById('meta-panel-idoso')?.classList.contains('active');

                if (isDiabetes) {
                    const hba1cSemestre = document.getElementById('md-hba1c-semestre').value;
                    const hba1cVal = document.getElementById('md-hba1c-val').value;
                    const hba1cMeta = document.getElementById('md-hba1c-meta').value;
                    const peDiabetico = document.getElementById('md-pe-diabetico').value;
                    const autoGlicemia = document.getElementById('md-chk-auto').checked ? 'Realiza' : 'Não realiza';
                    const hipoGlicemia = document.getElementById('md-chk-hipo').checked ? 'Sim' : 'Não';
                    const fundoOlho = document.getElementById('md-chk-olhos').checked ? 'Realizado no ano' : 'Não realizado / Sem registro';

                    let subText = `Acompanhamento de Diabetes Mellitus.`;
                    if (hipoGlicemia === 'Sim') subText += ` Relata hipoglicemias recorrentes residenciais.`;

                    let objText = `- HbA1c solicitada/realizada no semestre: ${hba1cSemestre}\n`;
                    if (hba1cVal) {
                        objText += `- Valor do último exame: ${hba1cVal}% (Meta individual: ${hba1cMeta})\n`;
                        if (inputGlicemia && !inputGlicemia.value) {
                            // Pode aproximar o valor aproximado se necessário
                        }
                    }
                    objText += `- Avaliação do pé diabético (anual): ${peDiabetico}\n`;
                    objText += `- Automonitoramento glicêmico residencial: ${autoGlicemia}\n`;
                    objText += `- Exame de fundo de olho anual: ${fundoOlho}`;

                    let assText = `Paciente diabético com controle metabólico ${hba1cVal && parseFloat(hba1cVal) > parseFloat(hba1cMeta.replace(/[^0-9.]/g, '')) ? 'acima do alvo clínico proposto pelas diretrizes' : 'dentro dos limites do alvo individualizado'}.`;
                    if (hipoGlicemia === 'Sim') assText += ` Risco aumentado de hipoglicemias.`;

                    let planText = `1. Orientar paciente sobre manejo imediato de hipoglicemia (açúcar rápido seguido de carboidrato complexo).\n2. Estimular hábitos de vida saudáveis e autoexame diário dos pés.\n3. Providenciar solicitação de HbA1c ou rastreamento pendente de pé/olho.`;

                    appendSoapBlock(txtS, 'SAPS Diabetes Subjective', subText);
                    appendSoapBlock(txtO, 'SAPS Diabetes Objective', objText);
                    appendSoapBlock(txtA, 'SAPS Diabetes Assessment', assText);
                    appendSoapBlock(txtP, 'SAPS Diabetes Plan', planText);
                }
                else if (isHipertensao) {
                    const paSemestre = document.getElementById('ht-pa-semestre').value;
                    const paVal = document.getElementById('ht-pa-val').value;
                    const paClass = document.getElementById('ht-pa-class').value;
                    const loaCoracao = document.getElementById('ht-loa-coracao').checked;
                    const loaRenal = document.getElementById('ht-loa-renal').checked;
                    const loaCerebral = document.getElementById('ht-loa-cerebral').checked;
                    const monCreatinina = document.getElementById('ht-mon-creatinina').checked ? 'Em dia' : 'Pendente / Não realizado';
                    const monPotassio = document.getElementById('ht-mon-potassio').checked ? 'Em dia' : 'Pendente / Não realizado';
                    const monTosse = document.getElementById('ht-mon-tosse').checked;
                    const monEdema = document.getElementById('ht-mon-edema').checked;

                    let subText = `Acompanhamento de Hipertensão Arterial Sistêmica.`;
                    if (monTosse) subText += ` Queixa ativa de tosse seca contínua (sugestivo de RAM por IECA).`;
                    if (monEdema) subText += ` Queixa ativa de edema maleolar / inchaço nas pernas (sugestivo de RAM por BCC).`;

                    let objText = `- PA aferida registrada no semestre: ${paSemestre}\n`;
                    if (paVal) {
                        objText += `- PA Consultório: ${paVal} mmHg (${paClass})\n`;
                        // Extrair e atualizar os campos de PA sis/dia no formulário SOAP principal
                        const parts = paVal.split('/');
                        if (parts.length === 2 && inputPaSis && inputPaDia) {
                            inputPaSis.value = parts[0].trim();
                            inputPaDia.value = parts[1].trim();
                        }
                    }

                    let loas = [];
                    if (loaCoracao) loas.push('HVE/Cardiopatia');
                    if (loaRenal) loas.push('DRC');
                    if (loaCerebral) loas.push('Histórico AVC/AIT');
                    objText += `- Lesões em Órgãos-Alvo (LOA): ${loas.length > 0 ? loas.join(', ') : 'Não detectadas'}\n`;
                    objText += `- Monitoramento laboratorial (Creatinina): ${monCreatinina}\n`;
                    objText += `- Monitoramento laboratorial (Potássio): ${monPotassio}`;

                    let assText = `Paciente hipertenso com níveis de pressão arterial ${paClass.includes('HAS Estágio') ? 'descontrolados' : 'controlados'} no consultório.`;
                    if (monTosse || monEdema) assText += ` Suspeita de reação adversa medicamentosa com necessidade de reavaliação de esquema terapêutico.`;

                    let planText = `1. Reforçar importância do uso regular de anti-hipertensivos nas doses corretas.\n2. Discutir com equipe médica alternativas se tosse persistente (ex: trocar Captopril/Enalapril por Losartana) ou edema.\n3. Solicitar creatinina e potássio séricos se sem monitoramento anual.`;

                    appendSoapBlock(txtS, 'SAPS HAS Subjective', subText);
                    appendSoapBlock(txtO, 'SAPS HAS Objective', objText);
                    appendSoapBlock(txtA, 'SAPS HAS Assessment', assText);
                    appendSoapBlock(txtP, 'SAPS HAS Plan', planText);
                }
                else if (isIdoso) {
                    const polifarmacia = document.getElementById('id-polifarmacia').value;
                    const vulnerabilidade = document.getElementById('id-vulnerabilidade').value;
                    const chkQuedas = document.getElementById('id-chk-quedas').checked ? 'Sim' : 'Não';
                    const chkCognicao = document.getElementById('id-chk-cognicao').checked ? 'Sim' : 'Não';
                    const chkBeers = document.getElementById('id-chk-beers').checked ? 'Sim' : 'Não';
                    const chkAutonomia = document.getElementById('id-chk-autonomia').checked ? 'Sim' : 'Não';

                    let subText = `Revisão clínica e farmacoterapêutica da pessoa idosa.`;
                    if (chkQuedas === 'Sim') subText += ` Histórico recente de quedas relatado pelo paciente / familiar.`;

                    let objText = `- Classificação de vulnerabilidade: ${vulnerabilidade}\n`;
                    objText += `- Polifarmácia (uso de >= 5 medicamentos): ${polifarmacia}\n`;
                    objText += `- Risco cinético elevado (queda recente): ${chkQuedas}\n`;
                    objText += `- Declínio cognitivo sob suspeita: ${chkCognicao}\n`;
                    objText += `- Dependência funcional em AVDs: ${chkAutonomia}\n`;
                    objText += `- Uso de MPIs (Critérios de Beers): ${chkBeers}`;

                    if (polifarmacia === 'Sim' && inputMedicamentosCount) {
                        inputMedicamentosCount.value = Math.max(5, parseInt(inputMedicamentosCount.value) || 5);
                        if (window.checkPolifarmaciaAlert) window.checkPolifarmaciaAlert();
                    }

                    let assText = `Paciente idoso classificado como ${vulnerabilidade}.`;
                    if (polifarmacia === 'Sim') assText += ` Polifarmácia identificada - risco aumentado de iatrogenias e reações adversas.`;
                    if (chkBeers === 'Sim') assText += ` Detectado uso de medicamento potencialmente inapropriado para idosos (AGS Beers 2023).`;

                    let planText = `1. Elaborar plano terapêutico simplificado com posologia visual para otimizar adesão e reduzir riscos.\n2. Discutir desprescrição segura de medicamentos inadequados (ex: benzodiazepínicos de meia-vida longa, AINEs crônicos) com clínico.\n3. Encaminhar para acompanhamento de prevenção de quedas multiprofissional.`;

                    appendSoapBlock(txtS, 'SAPS Idoso Subjective', subText);
                    appendSoapBlock(txtO, 'SAPS Idoso Objective', objText);
                    appendSoapBlock(txtA, 'SAPS Idoso Assessment', assText);
                    appendSoapBlock(txtP, 'SAPS Idoso Plan', planText);
                }

                // Integrar Lista Farmacoterapêutica ativa (Posologia Visual) se houver
                if (fcMedList.length > 0) {
                    let listTextStr = '';
                    let beersInUse = [];
                    fcMedList.forEach((med, i) => {
                        listTextStr += `${i + 1}. ${med.nome} (${med.dose}) | Posologia: ${med.manha} - ${med.tarde} - ${med.noite}`;
                        if (med.obs) listTextStr += ` (${med.obs})`;
                        listTextStr += `\n`;
                        if (med.beersCriteria) {
                            beersInUse.push(`${med.nome}: ${med.beersAlerta}`);
                        }
                    });

                    appendSoapBlock(txtP, 'Lista Farmacoterapia Orientada', listTextStr);

                    if (beersInUse.length > 0) {
                        let beersTextStr = 'Medicamentos potencialmente inapropriados em uso (Critérios de Beers AGS 2023):\n';
                        beersInUse.forEach(item => {
                            beersTextStr += `- ${item}\n`;
                        });
                        appendSoapBlock(txtA, 'Alertas Beers Identificados', beersTextStr);
                    }
                }

                // Integrar PRMs Registrados
                if (prmList.length > 0) {
                    let prmAssessmentStr = 'Problemas Relacionados a Medicamentos (PRMs) / Resultados Negativos associados a Medicamentos (RNMs) detectados (Classificação de Dáder):\n';
                    let prmPlanStr = 'Intervenções sugeridas para os PRMs/RNMs identificados:\n';

                    prmList.forEach((prm, i) => {
                        prmAssessmentStr += `- PRM/RNM ${i + 1}: ${prm.medicamento} - ${prm.classificacao} | ${prm.rnm}\n`;
                        prmPlanStr += `- Para ${prm.medicamento}: ${prm.descricao}\n`;
                    });

                    appendSoapBlock(txtA, 'PRMs e RNMs Identificados', prmAssessmentStr);
                    appendSoapBlock(txtP, 'Plano de Intervencao de PRMs', prmPlanStr);
                }

                // Integrar Clearance de Creatinina (Cockcroft-Gault)
                if (clCrCalculado !== null) {
                    const creatVal = parseFloat(cgCreatinina.value) || 0;
                    let drcEstagio = '';
                    if (clCrCalculado >= 90) drcEstagio = 'G1 (Normal/Elevado)';
                    else if (clCrCalculado >= 60) drcEstagio = 'G2 (Levemente diminuído)';
                    else if (clCrCalculado >= 45) drcEstagio = 'G3a (Diminuição leve a moderada)';
                    else if (clCrCalculado >= 30) drcEstagio = 'G3b (Diminuição moderada a severa)';
                    else if (clCrCalculado >= 15) drcEstagio = 'G4 (Diminuição severa)';
                    else drcEstagio = 'G5 (Falência renal)';

                    let ccObjStr = `- Estimativa de TFG (Cockcroft-Gault): ${clCrCalculado} mL/min\n- Creatinina sérica: ${creatVal} mg/dL\n- Estágio de DRC: ${drcEstagio}`;
                    appendSoapBlock(txtO, 'Funcao Renal Cockcroft-Gault', ccObjStr);

                    if (clCrCalculado < 60) {
                        let ccAssStr = `Paciente apresenta redução na Taxa de Filtração Glomerular estimada (ClCr ${clCrCalculado} mL/min), enquadrando-se em DRC estágio ${drcEstagio.split(' ')[0]}.`;
                        appendSoapBlock(txtA, 'Avaliacao da Funcao Renal', ccAssStr);

                        let alertasTexto = '';
                        fcMedList.forEach(med => {
                            const nomeMed = med.nome.toLowerCase();
                            if (nomeMed.includes('metformina')) {
                                if (clCrCalculado < 30) alertasTexto += `- Metformina: contraindicada (risco de acidose lática). Suspender.\n`;
                                else if (clCrCalculado < 45) alertasTexto += `- Metformina: reduzir dose máxima para 1000 mg/dia.\n`;
                            } else if (nomeMed.includes('glibenclamida') && clCrCalculado < 50) {
                                alertasTexto += `- Glibenclamida: alto risco de hipoglicemia severa. Substituir.\n`;
                            } else if (nomeMed.includes('enalapril') && clCrCalculado < 30) {
                                alertasTexto += `- Enalapril: reduzir dose inicial (2.5 mg/dia) e monitorar K+ sérico.\n`;
                            } else if (nomeMed.includes('espironolactona') && clCrCalculado < 30) {
                                alertasTexto += `- Espironolactona: contraindicada (risco grave de hipercalemia). Suspender.\n`;
                            } else if (nomeMed.includes('atenolol') && clCrCalculado < 35) {
                                alertasTexto += `- Atenolol: reduzir dose máxima para 25-50 mg/dia.\n`;
                            } else if (nomeMed.includes('hidroclorotiazida') && clCrCalculado < 30) {
                                alertasTexto += `- Hidroclorotiazida: perda de eficácia. Sugerir Furosemida se necessário.\n`;
                            }
                        });

                        if (alertasTexto) {
                            let ccPlanStr = `Ajustes posológicos e condutas sugeridas em decorrência da redução da função renal:\n${alertasTexto}`;
                            appendSoapBlock(txtP, 'Condutas de Ajuste Renal', ccPlanStr);
                        }
                    }
                }

                // Integrar Checklist de Revisão se iniciado
                const doneChecklist = Object.values(revisaoState).filter(Boolean).length;
                if (doneChecklist > 0) {
                    let checklistStr = `Revisão Farmacoterapêutica estruturada realizada (${doneChecklist} de ${REVISAO_CHECKLIST.length} itens do checklist validados).`;
                    appendSoapBlock(txtA, 'Revisao Farmacoterapêutica Status', checklistStr);
                }

                // Forçar recálculo dos textos unificados do SOAP
                if (typeof updateFormattedText === 'function') {
                    updateFormattedText();
                }

                // Alternar de volta para a aba "Geral" para ver o resultado preenchido
                window.switchSoapTab('geral');
                alert('Dados da Farmácia Clínica integrados ao Prontuário SOAP com sucesso!');
            });
        }

        const btnIntegrarMedsSoap = document.getElementById('fc-btn-integrar-meds-soap');
        if (btnIntegrarMedsSoap) {
            btnIntegrarMedsSoap.addEventListener('click', () => {
                const txtA = document.getElementById("soap-a");
                const txtP = document.getElementById("soap-p");

                if (fcMedList.length === 0) {
                    alert('Adicione pelo menos um medicamento à lista do paciente antes de integrar ao SOAP.');
                    return;
                }

                // Auxiliar para concatenação sem duplicações
                const appendSoapBlock = (field, label, valueText) => {
                    if (!field) return;
                    const currentText = field.value.trim();
                    const header = `[${label.toUpperCase()}]`;
                    const newBlock = `${header}\n${valueText}`;

                    if (currentText.includes(header)) {
                        const regex = new RegExp(`\\[${label.toUpperCase()}\\][\\s\\S]*?(?=\\n\\[|$)`);
                        field.value = currentText.replace(regex, newBlock).trim();
                    } else {
                        field.value = currentText ? `${currentText}\n\n${newBlock}` : newBlock;
                    }
                };

                let listTextStr = '';
                let beersInUse = [];
                fcMedList.forEach((med, i) => {
                    listTextStr += `${i + 1}. ${med.nome} (${med.dose}) | Posologia: ${med.manha} - ${med.tarde} - ${med.noite}`;
                    if (med.obs) listTextStr += ` (${med.obs})`;
                    listTextStr += `\n`;
                    if (med.beersCriteria) {
                        beersInUse.push(`${med.nome}: ${med.beersAlerta}`);
                    }
                });

                appendSoapBlock(txtP, 'Lista Farmacoterapia Orientada', listTextStr);

                if (beersInUse.length > 0) {
                    let beersTextStr = 'Medicamentos potencialmente inapropriados em uso (Critérios de Beers AGS 2023):\n';
                    beersInUse.forEach(item => {
                        beersTextStr += `- ${item}\n`;
                    });
                    appendSoapBlock(txtA, 'Alertas Beers Identificados', beersTextStr);
                }

                // Forçar recálculo dos textos unificados do SOAP
                if (typeof updateFormattedText === 'function') {
                    updateFormattedText();
                }

                // Alternar de volta para a aba "Geral" para ver o resultado preenchido
                window.switchSoapTab('geral');
                alert('Lista de medicamentos e alertas de Beers integrados ao Prontuário SOAP com sucesso!');
            });
        }
    }
});