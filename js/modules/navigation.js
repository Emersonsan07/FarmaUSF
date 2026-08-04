// =================================================================
// MÓDULO DE NAVEGAÇÃO E SPA (ROTEAMENTO INTERNO POR ABAS)
// =================================================================

function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
    const mobileOverlay = document.getElementById("mobile-overlay");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileCloseBtn = document.getElementById("mobile-close-btn");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    window.navigateToSection = function (sectionId) {
        let targetSectionId = sectionId;

        if (sectionId === "farmclinica") {
            targetSectionId = "soap";
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

                // Se não houver seção ativa ou se já estiver na SOAP bloqueada, força redirecionamento para o Início
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

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => {
            if (mobileOverlay) mobileOverlay.classList.add("active");
        });
    }

    const closeMobile = () => {
        if (mobileOverlay) mobileOverlay.classList.remove("active");
    };

    if (mobileCloseBtn) mobileCloseBtn.addEventListener("click", closeMobile);
    if (mobileOverlay) {
        mobileOverlay.addEventListener("click", (e) => {
            if (e.target === mobileOverlay) closeMobile();
        });
    }

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
        const validHashes = ["inicio", "cim", "soap", "dashboard", "protocolos", "calculadoras", "educacao"];
        if (hash && validHashes.includes(hash)) {
            navigateToSection(hash);
        } else {
            navigateToSection("inicio");
        }
    };

    window.addEventListener("hashchange", handleInitialHash);
    handleInitialHash();
}
