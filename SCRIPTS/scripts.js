const eyeOpenSVG = `
    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
`;

const eyeClosedSVG = `
    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
`;
export function modeClairSombre(){
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const htmlElement = document.documentElement;

        // Synchronise visuellement les icônes du bouton
        function syncIcons() {
            if (htmlElement.classList.contains('dark')) {
                themeToggleLightIcon.classList.remove('hidden');
                themeToggleDarkIcon.classList.add('hidden');
            } else {
                themeToggleLightIcon.classList.add('hidden');
                themeToggleDarkIcon.classList.remove('hidden');
            }
        }

        // Lancement initial de la synchronisation des icônes
        syncIcons();

        // Écouteur de clic pour changer de thème
        themeToggleBtn.addEventListener('click', function() {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            syncIcons();
        });
}


export function affichageMotDePasseCreation(){
    //Gestion affichage mot de passe ou pas


    // 1. Pour le champ de mot de passe principal
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("togglePasswordBtn");

    if (passwordInput && togglePasswordBtn) {
        togglePasswordBtn.addEventListener("click", () => {
            const estMasque = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", estMasque ? "text" : "password");
            togglePasswordBtn.innerHTML = estMasque ? eyeClosedSVG : eyeOpenSVG;
        });
    }

    // 2. Pour le champ de confirmation du mot de passe
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPasswordBtn");

    if (confirmPasswordInput && toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener("click", () => {
            const estMasque = confirmPasswordInput.getAttribute("type") === "password";
            confirmPasswordInput.setAttribute("type", estMasque ? "text" : "password");
            toggleConfirmPasswordBtn.innerHTML = estMasque ? eyeClosedSVG : eyeOpenSVG;
        });
    }
}


export function affichageMotDePasseConnexion(){
    const passwordInput = document.getElementById("passwordLogin");
    const togglePasswordBtn = document.getElementById("togglePasswordLoginBtn");

    if (passwordInput && togglePasswordBtn) {
        togglePasswordBtn.addEventListener("click", () => {
            const estMasque = passwordInput.getAttribute("type") === "password";
            
            // Alterne le type de l'input
            passwordInput.setAttribute("type", estMasque ? "text" : "password");
            
            // Modifie dynamiquement le SVG injecté dans l'œil
            togglePasswordBtn.innerHTML = estMasque ? eyeClosedSVG : eyeOpenSVG;
        });
    }
}

export function afficherNotification(message, isSuccess) {
    const popop = document.getElementById('pop-notification');
    const popopMessage = document.getElementById('pop-message');
    const popopIconContainer = document.getElementById('pop-icon-container');

    // 1. On met à jour le texte
    popopMessage.textContent = message;

    // 2. On configure l'apparence selon le succès ou l'erreur
    if (isSuccess) {
        // STYLE SUCCÈS (Fond Vert)
        popop.className = "fixed top-5 right-5 z-[10000] transform transition-all duration-500 flex items-center w-full max-w-sm p-4 space-x-3 rounded-lg shadow-xl text-white bg-green-600 dark:bg-green-700 translate-x-full opacity-0";
        
        // Icône Check (Coche)
        popopIconContainer.innerHTML = `
            <svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
            </svg>
        `;
    } else {
        // STYLE ERREUR (Fond Rouge)
        popop.className = "fixed top-5 right-5 z-[10000] transform transition-all duration-500 flex items-center w-full max-w-sm p-4 space-x-3 rounded-lg shadow-xl text-white bg-red-600 dark:bg-red-700 translate-x-full opacity-0";
        
        // Icône Croix (Erreur)
        popopIconContainer.innerHTML = `
            <svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        `;
    }

    // 3. Animation d'entrée (On retire le décalage pour la faire glisser dans l'écran)
    // On utilise un petit setTimeout pour laisser le temps au navigateur d'appliquer les couleurs avant d'animer
    setTimeout(() => {
        popop.classList.remove('translate-x-full', 'opacity-0');
        popop.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    // 4. Animation de sortie (On la recache après 4 secondes)
    setTimeout(() => {
        popop.classList.remove('translate-x-0', 'opacity-100');
        popop.classList.add('translate-x-full', 'opacity-0');
    }, 4000);
}
