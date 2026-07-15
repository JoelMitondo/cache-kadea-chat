//les script qui gère la traduction de toutes les pages
function traductionDeLaPage(){
    let currentLanguage = localStorage.getItem('userLanguage') || 'fr';
    let translations = {}; // On crée un objet vide qui accueillera les données du JSON
    // 1. Fonction pour charger le fichier JSON
    async function loadTranslations() {
        try {
            // Le navigateur va chercher le fichier de manière asynchrone
            const response = await fetch('./SCRIPTS/traduction.json'); 
            translations = await response.json(); // On extrait les données JSON
            
            // Une fois le fichier chargé, on peut appliquer la traduction
            applyTranslations(currentLanguage);
        } catch (error) {
            console.error("Erreur lors du chargement des langues :", error);
        }
    }
    // 2. Fonction pour appliquer les textes sur le HTML (reste presque identique)
    function applyTranslations(lang) {
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');

        elementsToTranslate.forEach(element => {
            const translationKey = element.getAttribute('data-i18n');
            
            // On vérifie bien que l'objet "translations" a été rempli par le fetch
            if (translations[lang] && translations[lang][translationKey]) {
                element.textContent = translations[lang][translationKey];
            }
        });

        document.getElementById('language-select-pageIndex').value = lang;
    }

    // 3. Écouteur pour le changement de langue
    document.getElementById('language-select-pageIndex').addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('userLanguage', currentLanguage);
        applyTranslations(currentLanguage);
    });

    // INITIALISATION : Au chargement de la page, on lance le chargement du JSON
    document.addEventListener('DOMContentLoaded', loadTranslations);
}
traductionDeLaPage()