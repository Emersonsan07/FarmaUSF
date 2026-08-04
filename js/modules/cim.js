// =================================================================
// MÓDULO CIM (CENTRO DE INFORMAÇÕES DE MEDICAMENTOS E INTERAÇÕES)
// =================================================================

function initCimSection() {
    // Gerenciador de Sub-Abas do CIM
    window.switchCimSubTab = function (subTab) {
        document.querySelectorAll(".cim-tabs-area .tab-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".cim-tabs-area .tab-content").forEach(content => content.classList.remove("active"));

        const tabBtn = document.getElementById(`tab-btn-${subTab}`);
        const tabContent = document.getElementById(`cim-tab-${subTab}`);

        if (tabBtn) tabBtn.classList.add("active");
        if (tabContent) tabContent.classList.add("active");
    };

    // Sub-Aba 1: Busca de Medicamentos
    const searchInput = document.getElementById("med-search-input");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    const filterTagsContainer = document.getElementById("class-filter-tags");
    const medListContainer = document.getElementById("med-list-container");
    const medCountBadge = document.getElementById("med-count");
    const medDetailContainer = document.getElementById("med-detail-container");

    if (!searchInput || !medListContainer) return;

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
            if (window.lucide) lucide.createIcons();
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
            if (window.lucide) lucide.createIcons();
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
        if (window.lucide) lucide.createIcons();
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

    if (selectMedA && selectMedB) {
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

        if (btnAnalisar) {
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
                    if (window.lucide) lucide.createIcons();
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
                if (window.lucide) lucide.createIcons();
            });
        }

        if (btnLimpar) {
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
                if (window.lucide) lucide.createIcons();
            });
        }
    }

    // Notícias na Home
    const newsContainer = document.getElementById("news-container");
    if (newsContainer && typeof NOTICIAS !== "undefined") {
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
