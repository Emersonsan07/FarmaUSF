// =================================================================
// MÓDULO DE AUTENTICAÇÃO E CADASTRO DE PROFISSIONAL (INTEGRADO AO SUPABASE)
// =================================================================

const USFAuth = (function () {
    const STORAGE_KEY_CURRENT_USER = "usf_current_user";
    const STORAGE_KEY_USERS_DB = "usf_users_db";

    // Seções da aplicação que exigem usuário autenticado/autorizado
    const RESTRICTED_SECTIONS = ["soap", "dashboard"];

    // Dicionário de Tokens Privados Individuais e regras de prefixo
    const PRIVATE_TOKEN_REGISTRY = {
        // Tokens de Farmacêutico (Acesso Completo SOAP)
        "FARMA_USF": { cargo: "Farmacêutico(a)", perfil: "Farmacêutico(a)", restrictedSOAP: true },
        "UEMS_FAR": { cargo: "Farmacêutico(a)", perfil: "Farmacêutico(a)", restrictedSOAP: true },
        "FARMA-2026": { cargo: "Farmacêutico(a)", perfil: "Farmacêutico(a)", restrictedSOAP: true },
        
        // Tokens da Equipe Multiprofissional
        "EQUIPE_USF": { cargo: "Residente Multiprofissional", perfil: "Equipe Multiprofissional", restrictedSOAP: false },
        "USF_GERAL": { cargo: "Estudante / Outro", perfil: "Equipe Multiprofissional", restrictedSOAP: false },
        "MED_USF": { cargo: "Médico(a)", perfil: "Médico(a)", restrictedSOAP: false },
        "ENF_USF": { cargo: "Enfermeiro(a)", perfil: "Enfermeiro(a)", restrictedSOAP: false }
    };

    // Inspeciona o código de acesso privado individual e retorna a categoria associada
    function inspectPrivateToken(codeInput) {
        if (!codeInput) {
            return { valid: false, message: "Por favor, digite seu código de acesso privado individual." };
        }

        const codeUpper = codeInput.trim().toUpperCase();

        // 1. Correspondência exata no registro de tokens
        if (PRIVATE_TOKEN_REGISTRY[codeUpper]) {
            const entry = PRIVATE_TOKEN_REGISTRY[codeUpper];
            return {
                valid: true,
                code: codeUpper,
                cargo: entry.cargo,
                perfil: entry.perfil,
                restrictedSOAP: entry.restrictedSOAP
            };
        }

        // 2. Correspondência por padrão de prefixo individual
        if (codeUpper.startsWith("FARMA") || codeUpper.startsWith("FAR-") || codeUpper.startsWith("UEMS-FAR")) {
            return {
                valid: true,
                code: codeUpper,
                cargo: "Farmacêutico(a)",
                perfil: "Farmacêutico(a)",
                restrictedSOAP: true
            };
        }

        if (codeUpper.startsWith("MED") || codeUpper.startsWith("MED-")) {
            return {
                valid: true,
                code: codeUpper,
                cargo: "Médico(a)",
                perfil: "Médico(a)",
                restrictedSOAP: false
            };
        }

        if (codeUpper.startsWith("ENF") || codeUpper.startsWith("ENF-")) {
            return {
                valid: true,
                code: codeUpper,
                cargo: "Enfermeiro(a)",
                perfil: "Enfermeiro(a)",
                restrictedSOAP: false
            };
        }

        if (codeUpper.startsWith("RES") || codeUpper.startsWith("RES-")) {
            return {
                valid: true,
                code: codeUpper,
                cargo: "Residente Multiprofissional",
                perfil: "Residente Multiprofissional",
                restrictedSOAP: false
            };
        }

        if (codeUpper.startsWith("EQUIPE") || codeUpper.startsWith("USF")) {
            return {
                valid: true,
                code: codeUpper,
                cargo: "Residente Multiprofissional",
                perfil: "Equipe Multiprofissional",
                restrictedSOAP: false
            };
        }

        return {
            valid: false,
            message: "Código privado não reconhecido! Verifique o token individual fornecido pela coordenação."
        };
    }

    // Valida o código privado, gera a categoria e exibe o formulário de cadastro
    function verifyAndApplyCode(silentIfEmpty = false) {
        const codeInput = document.getElementById("auth-reg-code");
        const categoryCard = document.getElementById("auth-detected-category-card");
        const cargoLabel = document.getElementById("auth-detected-cargo-label");
        const detailsForm = document.getElementById("auth-form-register");
        const cargoSelect = document.getElementById("auth-reg-cargo");
        const errorEl = document.getElementById("auth-error-msg");

        if (!codeInput) return false;
        const codeVal = codeInput.value.trim();

        if (!codeVal) {
            if (categoryCard) categoryCard.style.display = "none";
            if (detailsForm) detailsForm.style.display = "none";
            if (!silentIfEmpty && errorEl) {
                errorEl.textContent = "Por favor, informe seu código de acesso privado individual.";
                errorEl.style.display = "block";
            }
            return false;
        }

        const inspection = inspectPrivateToken(codeVal);

        if (inspection.valid) {
            if (errorEl) {
                errorEl.style.display = "none";
                errorEl.textContent = "";
            }

            if (categoryCard) {
                categoryCard.style.display = "block";
            }

            if (cargoLabel) {
                cargoLabel.textContent = `${inspection.cargo} (${inspection.restrictedSOAP ? 'Acesso SOAP Restrito Liberado' : 'Equipe Multiprofissional'})`;
            }

            if (cargoSelect) {
                cargoSelect.value = inspection.cargo;
            }

            if (detailsForm) {
                detailsForm.style.display = "block";
            }

            if (window.lucide && typeof window.lucide.createIcons === "function") {
                window.lucide.createIcons();
            }

            return true;
        } else {
            if (categoryCard) categoryCard.style.display = "none";
            if (detailsForm) detailsForm.style.display = "none";

            if (errorEl) {
                errorEl.textContent = inspection.message;
                errorEl.style.display = "block";
            }
            return false;
        }
    }

    // Validação matemática oficial de CPF
    function validarCPF(cpfInput) {
        if (!cpfInput) return false;
        const cpf = cpfInput.replace(/\D/g, "");

        if (cpf.length !== 11) return false;

        // Impede sequências repetidas (ex: 111.111.111-11)
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // Validação do 1º Dígito Verificador
        let soma = 0;
        let resto;
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        // Validação do 2º Dígito Verificador
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    // Formatação de CPF com Máscara (000.000.000-00)
    function formatarCPF(v) {
        if (!v) return "";
        v = v.replace(/\D/g, "");
        if (v.length > 11) v = v.substring(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return v;
    }

    // Obter banco local de usuários
    function getUsersDB() {
        try {
            const data = localStorage.getItem(STORAGE_KEY_USERS_DB);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error("Erro ao ler banco de usuários local:", e);
            return {};
        }
    }

    // Salvar banco local de usuários
    function saveUsersDB(db) {
        try {
            localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));
        } catch (e) {
            console.error("Erro ao salvar usuário localmente:", e);
        }
    }

    // Obter usuário logado na sessão atual
    function getCurrentUser() {
        try {
            const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    // Verificar se há usuário autorizados logado
    function isLoggedIn() {
        const user = getCurrentUser();
        return !!(user && (user.cpf || user.email));
    }

    // Verificar se o perfil do usuário é de Farmacêutico(a)
    function isPharmacist(userInput = null) {
        const user = userInput || getCurrentUser();
        if (!user || !user.cargo) return false;
        const cargoLower = String(user.cargo).toLowerCase().trim();
        return cargoLower.includes("farmacêut") || cargoLower.includes("farmaceut");
    }

    // Verificar se a seção exige autorização
    function isRestrictedSection(sectionId) {
        return RESTRICTED_SECTIONS.includes(sectionId);
    }

    // Abrir Modal de Autenticação
    function openAuthModal(reasonMessage = null) {
        const modal = document.getElementById("auth-modal-overlay");
        const reasonBanner = document.getElementById("auth-reason-banner");
        const reasonText = document.getElementById("auth-reason-text");

        if (modal) {
            if (reasonMessage && reasonBanner && reasonText) {
                reasonText.textContent = reasonMessage;
                reasonBanner.style.display = "flex";
            } else if (reasonBanner) {
                reasonBanner.style.display = "none";
            }

            showStep1();
            modal.classList.add("active");

            // Atualiza o indicador de status do Supabase no Modal
            updateSupabaseModalBadge();

            setTimeout(() => {
                const cpfInput = document.getElementById("auth-cpf-input");
                if (cpfInput) cpfInput.focus();
            }, 100);
        }
    }

    // Fechar Modal de Autenticação
    function closeAuthModal() {
        const modal = document.getElementById("auth-modal-overlay");
        if (modal) {
            modal.classList.remove("active");
        }
    }

    // Abrir link protegido de recurso (Mapa ou Drive)
    function openProtectedExternalLink(event, url, resourceName) {
        if (event && event.preventDefault) event.preventDefault();

        if (isLoggedIn()) {
            window.open(url, "_blank");
        } else {
            openAuthModal(`O recurso "${resourceName}" é restrito a profissionais cadastrados e autorizados. Por favor, identifique-se por CPF para acessar.`);
        }
    }

    // Exibe Passo 1: Digitar CPF ou E-mail
    function showStep1() {
        const step1 = document.getElementById("auth-step-cpf");
        const step2 = document.getElementById("auth-step-register");
        const errorEl = document.getElementById("auth-error-msg");

        if (step1) step1.style.display = "block";
        if (step2) step2.style.display = "none";
        if (errorEl) {
            errorEl.style.display = "none";
            errorEl.textContent = "";
        }
    }

    // Exibe Passo 2: Form de Cadastro de novo profissional (Código Privado primeiro)
    function showStep2(cpfFormatado) {
        const step1 = document.getElementById("auth-step-cpf");
        const step2 = document.getElementById("auth-step-register");
        const cpfDisplay = document.getElementById("auth-register-cpf-display");
        const regCpfHidden = document.getElementById("auth-reg-cpf-hidden");
        const codeInput = document.getElementById("auth-reg-code");
        const categoryCard = document.getElementById("auth-detected-category-card");
        const detailsForm = document.getElementById("auth-form-register");
        const errorEl = document.getElementById("auth-error-msg");

        if (step1) step1.style.display = "none";
        if (step2) step2.style.display = "block";
        if (cpfDisplay) cpfDisplay.value = cpfFormatado;
        if (regCpfHidden) regCpfHidden.value = cpfFormatado.replace(/\D/g, "");
        if (categoryCard) categoryCard.style.display = "none";
        if (detailsForm) detailsForm.style.display = "none";
        if (codeInput) {
            codeInput.value = "";
            setTimeout(() => codeInput.focus(), 100);
        }

        if (errorEl) {
            errorEl.style.display = "none";
            errorEl.textContent = "";
        }
    }

    // Processa Login / Identificação por CPF Exclusivamente via Supabase
    async function processCPFSubmit(e) {
        if (e) e.preventDefault();

        const cpfInput = document.getElementById("auth-cpf-input");
        const errorEl = document.getElementById("auth-error-msg");

        if (!cpfInput) return;

        const cpfFormatado = cpfInput.value.trim();
        const cpfClean = cpfFormatado.replace(/\D/g, "");

        if (!validarCPF(cpfClean)) {
            if (errorEl) {
                errorEl.textContent = "Por favor, informe um CPF válido com 11 dígitos.";
                errorEl.style.display = "block";
            }
            return;
        }

        if (!window.USFSupabase || !window.USFSupabase.isConfigured()) {
            if (errorEl) {
                errorEl.textContent = "Supabase desativado ou não configurado. Verifique as credenciais no rodapé.";
                errorEl.style.display = "block";
            }
            return;
        }

        // Tentar autenticação direta no Supabase
        const sbResult = await window.USFSupabase.signInUser({ cpf: cpfClean });
        if (sbResult.success && sbResult.data?.user) {
            const sbUser = sbResult.data.user;
            const meta = sbUser.user_metadata || {};

            const userObj = {
                cpf: cpfClean,
                cpfFormatado: formatarCPF(cpfClean),
                nome: meta.nome || `Profissional ${cpfClean.substring(0, 3)}`,
                cargo: meta.cargo || "Farmacêutico(a)",
                usf: meta.usf || "USF Saúde da Família",
                supabaseId: sbUser.id,
                email: sbUser.email,
                loggedInAt: new Date().toISOString()
            };

            localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(userObj));
            closeAuthModal();
            updateUI();

            if (window.showToast) {
                window.showToast(`Autenticado no Supabase com sucesso, ${userObj.nome}!`, "success");
            } else {
                alert(`Bem-vindo(a) de volta, ${userObj.nome}! (Supabase Autenticado)`);
            }

            if (window.pendingNavigationSection) {
                const targetSec = window.pendingNavigationSection;
                window.pendingNavigationSection = null;
                if (window.navigateToSection) window.navigateToSection(targetSec);
            }
            return;
        }

        // CPF não encontrado no Supabase -> direcionar para cadastro no Supabase
        showStep2(cpfFormatado);
    }

    // Processa o cadastro de novo profissional Exclusivamente no Supabase
    async function processRegisterSubmit(e) {
        if (e) e.preventDefault();

        const cpfHidden = document.getElementById("auth-reg-cpf-hidden");
        const codeInput = document.getElementById("auth-reg-code");
        const nomeInput = document.getElementById("auth-reg-nome");
        const cargoInput = document.getElementById("auth-reg-cargo");
        const usfInput = document.getElementById("auth-reg-usf");
        const emailInput = document.getElementById("auth-reg-email");
        const passInput = document.getElementById("auth-reg-password");
        const errorEl = document.getElementById("auth-error-msg");

        const isCodeValid = verifyAndApplyCode(false);
        if (!isCodeValid) return;

        const cpfClean = cpfHidden ? cpfHidden.value : "";
        const accessCode = codeInput ? codeInput.value.trim() : "";
        const nome = nomeInput ? nomeInput.value.trim() : "";
        const cargo = cargoInput ? cargoInput.value : "Farmacêutico(a)";
        const usf = usfInput ? usfInput.value.trim() : "USF Saúde da Família";
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passInput ? passInput.value.trim() : "";

        if (!nome || nome.length < 3) {
            if (errorEl) {
                errorEl.textContent = "Por favor, digite seu nome completo (mínimo 3 letras).";
                errorEl.style.display = "block";
            }
            return;
        }

        if (!window.USFSupabase || !window.USFSupabase.isConfigured()) {
            if (errorEl) {
                errorEl.textContent = "Supabase não está configurado. Conecte seu projeto Supabase para cadastrar usuários em nuvem.";
                errorEl.style.display = "block";
            }
            return;
        }

        const newUser = {
            cpf: cpfClean,
            cpfFormatado: formatarCPF(cpfClean),
            nome: nome,
            cargo: cargo,
            usf: usf,
            email: email || `prof.${cpfClean}@usf-saude.br`,
            registeredAt: new Date().toISOString(),
            loggedInAt: new Date().toISOString()
        };

        // Realizar o cadastro Exclusivamente no Supabase Auth + Tabela Profiles
        const sbResult = await window.USFSupabase.signUpUser({
            email: newUser.email,
            password: password || `USF#${cpfClean.substring(0, 6)}`,
            cpf: cpfClean,
            nome: nome,
            cargo: cargo,
            usf: usf
        });

        if (!sbResult.success) {
            if (errorEl) {
                errorEl.textContent = `Erro ao salvar no Supabase: ${sbResult.error || "Falha ao registrar usuário."}`;
                errorEl.style.display = "block";
            }
            return;
        }

        if (sbResult.data?.user) {
            newUser.supabaseId = sbResult.data.user.id;
        }

        // Salvar sessão ativa
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(newUser));

        closeAuthModal();
        updateUI();

        if (window.showToast) {
            window.showToast(`Cadastro salvo com sucesso no Supabase! Bem-vindo(a), ${newUser.nome}.`, "success");
        } else {
            alert(`Cadastro registrado no Supabase! Bem-vindo(a), ${newUser.nome}.`);
        }

        if (window.pendingNavigationSection) {
            const targetSec = window.pendingNavigationSection;
            window.pendingNavigationSection = null;
            if (window.navigateToSection) window.navigateToSection(targetSec);
        }
    }

    // Encerrar Sessão (Logout)
    async function logout() {
        if (window.USFSupabase) {
            await window.USFSupabase.signOutUser();
        }

        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
        updateUI();

        if (window.navigateToSection) {
            window.navigateToSection("inicio");
        }

        if (window.showToast) {
            window.showToast("Sessão encerrada com sucesso.", "info");
        }
    }

    // Atualiza Badges de conexão do Supabase
    function updateSupabaseModalBadge() {
        const badgeEl = document.getElementById("auth-supabase-status-badge");
        if (!badgeEl) return;

        const isConfigured = window.USFSupabase && window.USFSupabase.isConfigured();
        if (isConfigured) {
            badgeEl.className = "supabase-status-badge active";
            badgeEl.innerHTML = `
                <span class="status-dot green"></span>
                <span>Supabase Conectado</span>
                <button type="button" class="btn-link-sm" onclick="USFAuth.openSupabaseConfigModal()">Configurar</button>
            `;
        } else {
            badgeEl.className = "supabase-status-badge inactive";
            badgeEl.innerHTML = `
                <span class="status-dot gray"></span>
                <span>Modo Local / Demo</span>
                <button type="button" class="btn-link-sm" onclick="USFAuth.openSupabaseConfigModal()">⚡ Conectar Supabase</button>
            `;
        }
    }

    // Abrir Modal de Configuração do Supabase
    function openSupabaseConfigModal() {
        const configModal = document.getElementById("supabase-config-modal-overlay");
        if (!configModal) return;

        const urlInput = document.getElementById("supabase-cfg-url");
        const keyInput = document.getElementById("supabase-cfg-key");
        const resBox = document.getElementById("supabase-cfg-test-result");

        if (urlInput) urlInput.value = window.USFSupabase ? window.USFSupabase.getUrl() : "";
        if (keyInput) keyInput.value = window.USFSupabase ? window.USFSupabase.getKey() : "";
        if (resBox) {
            resBox.style.display = "none";
            resBox.textContent = "";
        }

        configModal.classList.add("active");
    }

    // Fechar Modal de Configuração do Supabase
    function closeSupabaseConfigModal() {
        const configModal = document.getElementById("supabase-config-modal-overlay");
        if (configModal) {
            configModal.classList.remove("active");
        }
    }

    // Salvar Credenciais do Supabase
    async function saveSupabaseConfig(e) {
        if (e) e.preventDefault();

        const urlInput = document.getElementById("supabase-cfg-url");
        const keyInput = document.getElementById("supabase-cfg-key");
        const resBox = document.getElementById("supabase-cfg-test-result");

        const url = urlInput ? urlInput.value.trim() : "";
        const key = keyInput ? keyInput.value.trim() : "";

        if (window.USFSupabase) {
            window.USFSupabase.saveConfig(url, key);

            if (resBox) {
                resBox.className = "wizard-error-msg show";
                resBox.style.background = "var(--bg-tertiary)";
                resBox.style.borderColor = "var(--color-primary)";
                resBox.style.color = "var(--color-primary)";
                resBox.style.display = "block";
                resBox.textContent = "Testando conexão com as credenciais informadas...";
            }

            const testRes = await window.USFSupabase.testConnection();

            if (resBox) {
                if (testRes.success) {
                    resBox.style.background = "var(--success-bg)";
                    resBox.style.borderColor = "var(--success-color)";
                    resBox.style.color = "var(--success-color)";
                    resBox.textContent = "🎉 Sucesso! " + testRes.message;
                } else {
                    resBox.style.background = "var(--danger-bg)";
                    resBox.style.borderColor = "var(--danger-color)";
                    resBox.style.color = "var(--danger-color)";
                    resBox.textContent = "⚠️ " + testRes.message;
                }
            }

            updateSupabaseModalBadge();
            updateUI();
        }
    }

    // Atualiza a interface gráfica do Header e botões de perfil
    function updateUI() {
        const user = getCurrentUser();
        const headerAuthBtn = document.getElementById("header-auth-btn");
        const mobileAuthBtn = document.getElementById("mobile-auth-btn");
        const soapProfessionalBadge = document.getElementById("soap-prof-badge");
        const soapProfessionalInput = document.getElementById("soap-prof-nome-input");

        const isSbActive = window.USFSupabase && window.USFSupabase.isConfigured();

        if (user && (user.cpf || user.email)) {
            // Usuário Logado
            const displayName = user.nome ? user.nome.split(" ")[0] : "Profissional";
            const displayTitle = `${(user.cargo && user.cargo.includes("Farmacêut")) ? "Farm." : "Prof."} ${displayName}`;

            if (headerAuthBtn) {
                headerAuthBtn.innerHTML = `
                    <div class="user-badge-header">
                        <i data-lucide="user-check"></i>
                        <span class="user-badge-name">${displayTitle}</span>
                        ${isSbActive ? '<span class="sb-indicator-dot" title="Sincronizado com Supabase Cloud"></span>' : ''}
                        <button class="user-logout-btn" onclick="USFAuth.logout()" title="Sair do Sistema">
                            <i data-lucide="log-out"></i>
                        </button>
                    </div>
                `;
            }

            if (mobileAuthBtn) {
                mobileAuthBtn.innerHTML = `
                    <div class="mobile-user-card">
                        <div class="mobile-user-info">
                            <strong>${user.nome} ${isSbActive ? '⚡' : ''}</strong>
                            <small>${user.cargo || 'Profissional'} • ${user.usf || 'USF'}</small>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="USFAuth.logout()">Sair</button>
                    </div>
                `;
            }

            if (soapProfessionalBadge) {
                soapProfessionalBadge.textContent = `${user.cargo || 'Profissional'}: ${user.nome} (${user.usf || 'USF'})`;
                soapProfessionalBadge.style.display = "inline-block";
            }
            if (soapProfessionalInput) {
                soapProfessionalInput.value = `${user.nome} (${user.cargo || 'Profissional'} - ${user.usf || 'USF'})`;
            }
        } else {
            // Usuário Deslogado
            if (headerAuthBtn) {
                headerAuthBtn.innerHTML = `
                    <a href="#" class="nav-link" id="nav-btn-auth" onclick="event.preventDefault(); USFAuth.openAuthModal();">
                        <i data-lucide="user"></i> Entrar
                    </a>
                `;
            }

            if (mobileAuthBtn) {
                mobileAuthBtn.innerHTML = `
                    <a href="#" class="mobile-link" id="mob-nav-auth" onclick="event.preventDefault(); USFAuth.openAuthModal();">
                        <i data-lucide="user"></i> Entrar com CPF
                    </a>
                `;
            }

            if (soapProfessionalBadge) {
                soapProfessionalBadge.style.display = "none";
            }
        }

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    // Inicialização do Módulo
    async function init() {
        document.addEventListener("input", function (e) {
            if (e.target && e.target.id === "auth-cpf-input") {
                e.target.value = formatarCPF(e.target.value);
            }
        });

        const formCpf = document.getElementById("auth-form-cpf");
        if (formCpf) {
            formCpf.addEventListener("submit", processCPFSubmit);
        }

        const formRegister = document.getElementById("auth-form-register");
        if (formRegister) {
            formRegister.addEventListener("submit", processRegisterSubmit);
        }

        const regCodeInput = document.getElementById("auth-reg-code");
        if (regCodeInput) {
            regCodeInput.addEventListener("input", function () {
                if (regCodeInput.value.trim().length >= 4) {
                    verifyAndApplyCode(true);
                }
            });
            regCodeInput.addEventListener("blur", function () {
                if (regCodeInput.value.trim().length > 0) {
                    verifyAndApplyCode(true);
                }
            });
            regCodeInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    verifyAndApplyCode(false);
                }
            });
        }

        const btnBackStep1 = document.getElementById("auth-btn-back-step1");
        if (btnBackStep1) {
            btnBackStep1.addEventListener("click", showStep1);
        }

        const modalOverlay = document.getElementById("auth-modal-overlay");
        if (modalOverlay) {
            modalOverlay.addEventListener("click", function (e) {
                if (e.target === modalOverlay) {
                    closeAuthModal();
                }
            });
        }

        // Tentar restaurar sessão Supabase se disponível
        if (window.USFSupabase && window.USFSupabase.isConfigured()) {
            const session = await window.USFSupabase.getCurrentSession();
            if (session?.user) {
                const sbUser = session.user;
                const meta = sbUser.user_metadata || {};
                const currentUser = getCurrentUser();

                if (!currentUser) {
                    const restoredUser = {
                        cpf: meta.cpf || "",
                        cpfFormatado: formatarCPF(meta.cpf || ""),
                        nome: meta.nome || sbUser.email.split("@")[0],
                        cargo: meta.cargo || "Farmacêutico(a)",
                        usf: meta.usf || "USF Saúde da Família",
                        email: sbUser.email,
                        supabaseId: sbUser.id,
                        loggedInAt: new Date().toISOString()
                    };
                    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(restoredUser));
                }
            }
        }

        updateUI();
    }

    return {
        init: init,
        validarCPF: validarCPF,
        formatarCPF: formatarCPF,
        isLoggedIn: isLoggedIn,
        getCurrentUser: getCurrentUser,
        isPharmacist: isPharmacist,
        isRestrictedSection: isRestrictedSection,
        openAuthModal: openAuthModal,
        closeAuthModal: closeAuthModal,
        openSupabaseConfigModal: openSupabaseConfigModal,
        closeSupabaseConfigModal: closeSupabaseConfigModal,
        saveSupabaseConfig: saveSupabaseConfig,
        logout: logout,
        updateUI: updateUI,
        openProtectedExternalLink: openProtectedExternalLink,
        inspectPrivateToken: inspectPrivateToken,
        verifyAndApplyCode: verifyAndApplyCode,
        getPrivateTokens: function () { return PRIVATE_TOKEN_REGISTRY; }
    };
})();

// Helper global para mensagens Toast elegantes
if (!window.showToast) {
    window.showToast = function (message, type = "info") {
        let toastContainer = document.getElementById("usf-toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "usf-toast-container";
            toastContainer.style.cssText = "position: fixed; bottom: 24px; right: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; max-width: 400px; pointer-events: none;";
            document.body.appendChild(toastContainer);
        }
        const toast = document.createElement("div");
        let bg = "var(--color-primary, #0d9488)";
        let icon = "i";
        if (type === "danger" || type === "error") {
            bg = "#e11d48";
            icon = "⚠️";
        } else if (type === "success") {
            bg = "#10b981";
            icon = "✓";
        } else if (type === "warning") {
            bg = "#f59e0b";
            icon = "⚡";
        }

        toast.style.cssText = `background: ${bg}; color: #ffffff; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 10px; pointer-events: auto; font-family: 'Inter', sans-serif; transition: all 0.3s ease; transform: translateY(10px); opacity: 0;`;
        toast.innerHTML = `<span style="font-size: 14px;">${icon}</span><span>${message}</span>`;

        toastContainer.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.transform = "translateY(0)";
            toast.style.opacity = "1";
        });

        setTimeout(() => {
            toast.style.transform = "translateY(-10px)";
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };
}

// Função global para atalho nos cartões
window.openProtectedExternalLink = function (event, url, resourceName) {
    if (window.USFAuth) {
        window.USFAuth.openProtectedExternalLink(event, url, resourceName);
    } else if (event) {
        window.open(url, "_blank");
    }
};

document.addEventListener("DOMContentLoaded", function () {
    USFAuth.init();
});

window.USFAuth = USFAuth;
