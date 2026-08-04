// =================================================================
// PONTO DE ENTRADA PRINCIPAL DA APLICAÇÃO (MAIN.JS)
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Ícones Lucide
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }

    // Se o localStorage de consultas estiver vazio, povoar inicialmente com os dados da SIMULACAO_CONSULTAS
    let savedConsultas = JSON.parse(localStorage.getItem("cim_consultas"));
    if ((!savedConsultas || savedConsultas.length === 0) && typeof SIMULACAO_CONSULTAS !== "undefined") {
        localStorage.setItem("cim_consultas", JSON.stringify(SIMULACAO_CONSULTAS));
    }

    // Inicializar Lógicas de Componentes Modulares
    if (typeof initTheme === "function") initTheme();
    if (typeof initNavigation === "function") initNavigation();
    if (typeof initCimSection === "function") initCimSection();
    if (typeof initSoapSection === "function") initSoapSection();
    if (typeof initProtocolsSection === "function") initProtocolsSection();
    if (typeof initCalculatorsSection === "function") initCalculatorsSection();
    if (typeof initFarmClinicaSection === "function") initFarmClinicaSection();
    if (window.USFDashboard && typeof window.USFDashboard.initDashboardSection === "function") {
        window.USFDashboard.initDashboardSection();
    }
});
