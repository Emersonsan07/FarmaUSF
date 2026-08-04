// =================================================================
// MÓDULO DE GERENCIAMENTO DE TEMA (CLARO/ESCURO) E NAVEGAÇÃO MOBILE
// =================================================================

function initTheme() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (!themeBtn) return;
    
    const darkIcon = themeBtn.querySelector(".theme-icon-dark");
    const lightIcon = themeBtn.querySelector(".theme-icon-light");

    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add("dark-theme");
        if (darkIcon) darkIcon.style.display = "none";
        if (lightIcon) lightIcon.style.display = "block";
    } else {
        document.body.classList.remove("dark-theme");
        if (darkIcon) darkIcon.style.display = "block";
        if (lightIcon) lightIcon.style.display = "none";
    }

    themeBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        if (isDark) {
            if (darkIcon) darkIcon.style.display = "none";
            if (lightIcon) lightIcon.style.display = "block";
        } else {
            if (darkIcon) darkIcon.style.display = "block";
            if (lightIcon) lightIcon.style.display = "none";
        }
    });
}
