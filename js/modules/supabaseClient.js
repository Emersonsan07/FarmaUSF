// =================================================================
// MÓDULO SUPABASE CLIENT & INTEGRAÇÃO EM NUVEM (FARMÁCIA USF)
// =================================================================

const USFSupabase = (function () {
    const STORAGE_KEY_URL = "usf_supabase_url";
    const STORAGE_KEY_KEY = "usf_supabase_anon_key";

    // URL e Chave Anon padrão da UEMS / USF
    const DEFAULT_URL = "https://heqgiibxikdjuyyzbrny.supabase.co";
    const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlcWdpaWJ4aWtkanV5eXpicm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDQ0MjQsImV4cCI6MjEwMDQyMDQyNH0.102sV-0U2OUY5Tw4M3OeyIEPy_qBaiBZcYLyhPo5bgs";

    let cachedUrl = localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_URL;
    let cachedKey = localStorage.getItem(STORAGE_KEY_KEY) || DEFAULT_KEY;

    let supabaseInstance = null;

    // Retorna URL configurada
    function getUrl() {
        const stored = localStorage.getItem(STORAGE_KEY_URL);
        if (stored && stored.trim()) return stored.trim();
        return cachedUrl || DEFAULT_URL;
    }

    // Retorna Key configurada
    function getKey() {
        const stored = localStorage.getItem(STORAGE_KEY_KEY);
        if (stored && stored.trim()) return stored.trim();
        return cachedKey || DEFAULT_KEY;
    }

    // Verifica se há credenciais válidas e SDK carregado
    function isConfigured() {
        const url = getUrl();
        const key = getKey();
        return !!(url && key && url.startsWith("https://") && key.length > 15);
    }

    // Instancia ou recupera o cliente Supabase JS
    function getClient() {
        if (supabaseInstance) return supabaseInstance;

        const url = getUrl();
        const key = getKey();

        if (url && key && typeof supabase !== "undefined" && typeof supabase.createClient === "function") {
            try {
                supabaseInstance = supabase.createClient(url, key, {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    }
                });
                return supabaseInstance;
            } catch (err) {
                console.error("Erro ao inicializar Supabase Client:", err);
                return null;
            }
        }
        return null;
    }

    // Salva ou remove a configuração do Supabase no localStorage
    function saveConfig(url, key) {
        if (url && url.trim()) {
            localStorage.setItem(STORAGE_KEY_URL, url.trim());
            cachedUrl = url.trim();
        } else {
            localStorage.removeItem(STORAGE_KEY_URL);
            cachedUrl = "";
        }

        if (key && key.trim()) {
            localStorage.setItem(STORAGE_KEY_KEY, key.trim());
            cachedKey = key.trim();
        } else {
            localStorage.removeItem(STORAGE_KEY_KEY);
            cachedKey = "";
        }

        supabaseInstance = null;
        return getClient();
    }

    // Testar Conexão com o projeto Supabase
    async function testConnection() {
        const client = getClient();
        if (!client) {
            return {
                success: false,
                message: "Cliente Supabase não inicializado. Verifique a URL e a Chave Anon no formulário."
            };
        }

        try {
            // Tenta obter a sessão atual ou fazer ping na API de Autenticação
            const { data, error } = await client.auth.getSession();
            if (error) {
                return {
                    success: false,
                    message: `Erro ao conectar com Supabase: ${error.message}`
                };
            }
            return {
                success: true,
                message: "Conexão com o Supabase estabelecida com sucesso! API e Autenticação operacionais."
            };
        } catch (err) {
            return {
                success: false,
                message: `Falha na requisição Supabase: ${err.message || err}`
            };
        }
    }

    // Cadastro de Usuário no Supabase Auth
    async function signUpUser({ email, password, cpf, nome, cargo, usf }) {
        const client = getClient();
        if (!client) {
            return { success: false, error: "Supabase não configurado. Operando em modo local." };
        }

        try {
            const cleanCpf = cpf ? cpf.replace(/\D/g, "") : "00000000000";
            const emailFinal = (email && email.includes("@")) ? email.trim() : `prof.${cleanCpf}@usf-saude.br`;
            const passFinal = password || `USF#${cleanCpf.substring(0, 6)}`;

            const { data, error } = await client.auth.signUp({
                email: emailFinal,
                password: passFinal,
                options: {
                    data: {
                        cpf: cleanCpf,
                        nome: nome,
                        cargo: cargo,
                        usf: usf
                    }
                }
            });

            if (error) {
                // Se o usuário já existia ou estourou rate limit por múltiplos envios, tentar login
                const trySignIn = await signInUser({ email: emailFinal, password: passFinal });
                if (trySignIn.success) {
                    return { success: true, data: trySignIn.data, emailUsed: emailFinal };
                }
                throw error;
            }

            // Salvar no perfil (opcional, se a tabela profiles existir no Supabase)
            if (data.user) {
                try {
                    await client.from("profiles").upsert({
                        id: data.user.id,
                        cpf: cleanCpf,
                        nome: nome,
                        cargo: cargo,
                        usf: usf
                    });
                } catch (pErr) {
                    console.warn("Aviso ao sincronizar tabela profiles:", pErr);
                }
            }

            return { success: true, data, emailUsed: emailFinal };
        } catch (err) {
            console.error("Erro no Sign Up Supabase:", err);

            // Se for rate limit de e-mail, oferecer mensagem explicativa
            let msg = err.message || "Erro desconhecido no Supabase.";
            if (msg.includes("rate limit") || msg.includes("rate_limit")) {
                msg = "Limite de e-mails do Supabase atingido. Solução: No painel Supabase, vá em Authentication -> Providers -> Email e DESATIVE 'Confirm email'.";
            }
            return { success: false, error: msg };
        }
    }

    // Login com E-mail / CPF no Supabase Auth
    async function signInUser({ email, cpf, password }) {
        const client = getClient();
        if (!client) {
            return { success: false, error: "Supabase não configurado." };
        }

        try {
            const cleanCpf = cpf ? cpf.replace(/\D/g, "") : "";
            let emailFinal = email;
            if (!emailFinal && cleanCpf) {
                emailFinal = `prof.${cleanCpf}@usf-saude.br`;
            }
            let passFinal = password;
            if (!passFinal && cleanCpf) {
                passFinal = `USF#${cleanCpf.substring(0, 6)}`;
            }

            const { data, error } = await client.auth.signInWithPassword({
                email: emailFinal,
                password: passFinal
            });

            if (error) throw error;
            return { success: true, data };
        } catch (err) {
            console.error("Erro no Sign In Supabase:", err);
            return { success: false, error: err.message };
        }
    }

    // Sair (Logout) no Supabase
    async function signOutUser() {
        const client = getClient();
        if (client) {
            try {
                await client.auth.signOut();
            } catch (err) {
                console.error("Erro ao desconectar Supabase:", err);
            }
        }
    }

    // Obter sessão ativa no Supabase
    async function getCurrentSession() {
        const client = getClient();
        if (!client) return null;
        try {
            const { data } = await client.auth.getSession();
            return data?.session || null;
        } catch (err) {
            return null;
        }
    }

    // Salvar consulta SOAP no Supabase (Nuvem)
    async function syncConsultaSOAP(consultData) {
        const client = getClient();
        if (!client) {
            return { success: false, localOnly: true, message: "Supabase desativado. Dados mantidos apenas no navegador local." };
        }

        try {
            const session = await getCurrentSession();
            const payload = {
                paciente: consultData.paciente,
                idade: consultData.idade,
                sexo: consultData.sexo,
                pa_sistolica: consultData.paSistolica,
                pa_diastolica: consultData.paDiastolica,
                glicemia: consultData.glicemia,
                adesao_morisky: consultData.adesaoMorisky,
                prm: consultData.prm,
                conduta: consultData.conduta,
                medicamentos_count: consultData.medicamentosCount,
                clearance_renal: consultData.clearanceRenal,
                drc_estagio: consultData.drcEstagio,
                med_list_string: consultData.medListString,
                prm_list_string: consultData.prmListString,
                user_id: session?.user?.id || null
            };

            const { data, error } = await client.from("consultas_soap").insert([payload]).select();

            if (error) {
                console.warn("Supabase Sync Warning:", error.message);
                return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (err) {
            console.error("Erro ao enviar SOAP para Supabase:", err);
            return { success: false, error: err.message };
        }
    }

    // Obter consultas da nuvem
    async function fetchConsultasSOAP() {
        const client = getClient();
        if (!client) return [];

        try {
            const { data, error } = await client.from("consultas_soap").select("*").order("created_at", { ascending: false }).limit(50);
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.warn("Falha ao buscar consultas no Supabase:", err);
            return [];
        }
    }

    return {
        getUrl,
        getKey,
        isConfigured,
        getClient,
        saveConfig,
        testConnection,
        signUpUser,
        signInUser,
        signOutUser,
        getCurrentSession,
        syncConsultaSOAP,
        fetchConsultasSOAP
    };
})();

window.USFSupabase = USFSupabase;
