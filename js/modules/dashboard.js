// =================================================================
// MÓDULO DASHBOARD DE INDICADORES DE GESTÃO DA FARMÁCIA CLÍNICA
// =================================================================

const USFDashboard = (function () {
    let currentDashboardData = [];

    function initDashboardSection() {
        loadDashboardData();

        const btnRefresh = document.getElementById("dashboard-btn-refresh");
        const btnExportCsv = document.getElementById("dashboard-btn-export-csv");

        if (btnRefresh) {
            btnRefresh.addEventListener("click", () => {
                loadDashboardData(true);
            });
        }

        if (btnExportCsv) {
            btnExportCsv.addEventListener("click", () => {
                exportDashboardCSV();
            });
        }
    }

    async function loadDashboardData(showToastFeedback = false) {
        const badgeSource = document.getElementById("dashboard-data-source-badge");
        if (badgeSource) {
            badgeSource.className = "source-badge loading";
            badgeSource.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Carregando dados...`;
            if (window.lucide) lucide.createIcons();
        }

        let consults = [];
        let isFromSupabase = false;

        // 1. Tentar buscar no Supabase se configurado
        if (window.USFSupabase && window.USFSupabase.isConfigured()) {
            try {
                const sbData = await window.USFSupabase.fetchConsultasSOAP();
                if (sbData && sbData.length > 0) {
                    consults = sbData.map(item => ({
                        id: item.id,
                        data: new Date(item.created_at || Date.now()).toLocaleDateString("pt-BR"),
                        paciente: item.paciente || "Não informado",
                        idade: item.idade,
                        sexo: item.sexo,
                        modalidade: item.conduta?.includes("Visita Domiciliar") ? "VDF" : "USF",
                        polifarmacia: item.medicamentos_count >= 5,
                        medsCount: item.medicamentos_count || 0,
                        adesaoScore: item.adesao_morisky,
                        prm: item.prm || "Sem PRM",
                        clearanceRenal: item.clearance_renal,
                        drcEstagio: item.drc_estagio
                    }));
                    isFromSupabase = true;
                }
            } catch (err) {
                console.warn("Dashboard: Falha ao carregar do Supabase, usando backup local:", err);
            }
        }

        // 2. Fallback para localStorage local se Supabase não tiver retornado dados
        if (consults.length === 0) {
            try {
                const localData = JSON.parse(localStorage.getItem("cim_consultas") || localStorage.getItem("soap_recent_consults") || localStorage.getItem("soap_consultas_v2") || "[]");
                consults = localData.map(item => ({
                    id: item.id || Math.random().toString(36).substring(2),
                    data: item.date || item.data || new Date().toLocaleDateString("pt-BR"),
                    paciente: item.nome || item.paciente || "Não informado",
                    idade: item.idade,
                    sexo: item.sexo,
                    modalidade: item.tipoAtendimento?.includes("Visita") ? "VDF" : "USF",
                    polifarmacia: (item.medicamentosCount || item.medsCount || 0) >= 5,
                    medsCount: item.medicamentosCount || item.medsCount || 0,
                    adesaoScore: item.moriskyScore !== undefined ? item.moriskyScore : 4,
                    prm: item.prm || "Sem PRM",
                    clearanceRenal: item.clCr,
                    drcEstagio: item.drcEstagio
                }));
            } catch (lErr) {
                console.error("Erro ao ler backup local para Dashboard:", lErr);
            }
        }

        currentDashboardData = consults;

        // Atualizar Badge de Origem
        if (badgeSource) {
            if (isFromSupabase) {
                badgeSource.className = "source-badge supabase";
                badgeSource.innerHTML = `<i data-lucide="cloud"></i> Nuvem Supabase (${consults.length} registros)`;
            } else {
                badgeSource.className = "source-badge local";
                badgeSource.innerHTML = `<i data-lucide="database"></i> Armazenamento Local (${consults.length} registros)`;
            }
            if (window.lucide) lucide.createIcons();
        }

        renderIndicators(consults);

        if (showToastFeedback && window.showToast) {
            window.showToast(`Dashboard atualizado com ${consults.length} atendimento(s)!`, "success");
        }
    }

    function renderIndicators(list) {
        const total = list.length;

        let totalPolifarmacia = 0;
        let totalVdf = 0;
        let totalAdesaoAlta = 0;
        let totalPrms = 0;
        let totalRiscoRenal = 0;

        let prmCategorias = { necessidade: 0, eficacia: 0, seguranca: 0, adesao: 0 };

        list.forEach(c => {
            if (c.polifarmacia) totalPolifarmacia++;
            if (c.modalidade === "VDF") totalVdf++;
            if (c.adesaoScore === 4 || (typeof c.adesaoScore === "string" && c.adesaoScore.includes("ALTA")) || parseFloat(c.adesaoScore) >= 5.0) {
                totalAdesaoAlta++;
            }
            if (c.prm && c.prm !== "Nenhum PRM Identificado" && c.prm !== "Sem PRM") {
                totalPrms++;
                const prmLower = c.prm.toLowerCase();
                if (prmLower.includes("necessidade")) prmCategorias.necessidade++;
                else if (prmLower.includes("eficácia") || prmLower.includes("inefetividade")) prmCategorias.eficacia++;
                else if (prmLower.includes("segurança") || prmLower.includes("reacao")) prmCategorias.seguranca++;
                else prmCategorias.adesao++;
            }
            if (c.clearanceRenal && parseFloat(c.clearanceRenal) < 60) {
                totalRiscoRenal++;
            }
        });

        // 1. Atualizar Cards KPI
        const elTotal = document.getElementById("dash-kpi-total");
        const elPolifarmacia = document.getElementById("dash-kpi-polifarmacia");
        const elAdesao = document.getElementById("dash-kpi-adesao");
        const elPrms = document.getElementById("dash-kpi-prms");

        if (elTotal) elTotal.textContent = total;
        if (elPolifarmacia) {
            const pctPoli = total > 0 ? ((totalPolifarmacia / total) * 100).toFixed(0) : 0;
            elPolifarmacia.textContent = `${totalPolifarmacia} (${pctPoli}%)`;
        }
        if (elAdesao) {
            const pctAdh = total > 0 ? ((totalAdesaoAlta / total) * 100).toFixed(0) : 0;
            elAdesao.textContent = `${pctAdh}%`;
        }
        if (elPrms) elPrms.textContent = totalPrms;

        // 2. Bars de Proporção
        renderProgressBar("dash-bar-vdf", total > 0 ? (totalVdf / total) * 100 : 0, `${totalVdf} VDFs (${total > 0 ? ((totalVdf / total) * 100).toFixed(0) : 0}%)`);
        renderProgressBar("dash-bar-polifarmacia", total > 0 ? (totalPolifarmacia / total) * 100 : 0, `${totalPolifarmacia} Pacientes (${total > 0 ? ((totalPolifarmacia / total) * 100).toFixed(0) : 0}%)`);
        renderProgressBar("dash-bar-adesao", total > 0 ? (totalAdesaoAlta / total) * 100 : 0, `${totalAdesaoAlta} Pacientes (${total > 0 ? ((totalAdesaoAlta / total) * 100).toFixed(0) : 0}%)`);
        renderProgressBar("dash-bar-renal", total > 0 ? (totalRiscoRenal / total) * 100 : 0, `${totalRiscoRenal} Pacientes (< 60 mL/min)`);

        // 3. Tabela de Registros Recentes
        renderTable(list);
    }

    function renderProgressBar(containerId, percentage, labelText) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const clampedPct = Math.min(100, Math.max(0, percentage));
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; font-weight: 600;">
                <span>Progresso</span>
                <span>${labelText}</span>
            </div>
            <div style="width: 100%; height: 8px; background: var(--bg-tertiary, #e2e8f0); border-radius: 4px; overflow: hidden;">
                <div style="width: ${clampedPct}%; height: 100%; background: linear-gradient(90deg, var(--color-primary, #0d9488), #3b82f6); transition: width 0.4s ease;"></div>
            </div>
        `;
    }

    function renderTable(list) {
        const tbody = document.getElementById("dash-table-body");
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-tertiary); padding: 24px;">
                        Nenhum atendimento registrado até o momento. Realize consultas no módulo SOAP para visualizar os indicadores.
                    </td>
                </tr>
            `;
            return;
        }

        let html = "";
        list.slice(0, 15).forEach(item => {
            const isVdf = item.modalidade === "VDF";
            const modBadge = isVdf ?
                `<span style="background: rgba(13,148,136,0.15); color: #0d9488; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;">VDF</span>` :
                `<span style="background: rgba(37,99,235,0.15); color: #2563eb; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;">USF</span>`;

            const poliBadge = item.polifarmacia ?
                `<span style="background: rgba(225,29,72,0.15); color: #e11d48; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;">Sim (&ge;5)</span>` :
                `<span style="color: var(--text-tertiary); font-size: 11px;">Não</span>`;

            html += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px 12px; font-size: 12px; font-weight: 600;">${item.data}</td>
                    <td style="padding: 10px 12px; font-size: 12px; font-weight: 700;">${item.paciente}</td>
                    <td style="padding: 10px 12px; font-size: 11px;">${item.idade ? item.idade + ' anos' : '--'}</td>
                    <td style="padding: 10px 12px;">${modBadge}</td>
                    <td style="padding: 10px 12px;">${poliBadge}</td>
                    <td style="padding: 10px 12px; font-size: 11px; color: var(--text-secondary); max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${item.prm}
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    function exportDashboardCSV() {
        if (currentDashboardData.length === 0) {
            if (window.showToast) window.showToast("Sem dados para exportar.", "warning");
            else alert("Sem dados para exportar.");
            return;
        }

        let csv = "ID,Data,Paciente,Idade,Sexo,Modalidade,Polifarmacia,PRM,ClearanceRenal\n";
        currentDashboardData.forEach(item => {
            csv += `"${item.id}","${item.data}","${item.paciente}","${item.idade || ''}","${item.sexo || ''}","${item.modalidade}","${item.polifarmacia ? 'Sim' : 'Nao'}","${(item.prm || '').replace(/"/g, '""')}","${item.clearanceRenal || ''}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `indicadores_farmacia_usf_${new Date().toISOString().substring(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (window.showToast) window.showToast("Relatório CSV de Indicadores baixado!", "success");
    }

    return {
        initDashboardSection,
        loadDashboardData,
        exportDashboardCSV
    };
})();

window.USFDashboard = USFDashboard;
