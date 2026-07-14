/**
 * Effectue de requête fetch avec une gestion complète des erreurs.
 * Determination de type des valeurs pour chaque paramettre des function tous ce qui doit entré de 
 * @param {string} url - L'URL de l'API.
 * @param {object} options - Les options de la requête (method, headers, body, etc.).
 * @returns {object} { success: boolean, data: any, error: any }
 */

//Fonction requete securisée 
async function requeteSecurisee (url, options={}){
    try{
        const reponse = await fetch (url, options)
        //Vérification des erreurs HTTP (Le backend renvoie une erreur 400 ou 500)
        if(!reponse.ok){
            let erreurData 
            //on lit si le message du backend est en JSON
            try{
                erreurData = await reponse.json
            } //au cas contraire on lit le texte
            catch(e){
                erreurData = await reponse.json
            }
            // en cas de ces erreurs, on return un objet
            return {
                success : false,
                erreur : {
                    status : reponse.status,
                    statusText : reponse.statusText,
                    details : erreurData,
                    type: 'Erreur HTTP'
                }
            }
        }
        // en cas de succèss, on parse JSON
        const data = await reponse.json
        return {
            success : true,
            data : data
        }
    } catch (erreur){
        //Erreurs réseau (Pas d'internet, serveur éteint, ou erreur de parsing JSON)
        return {
            success : false,
            erreur : {
                message : erreur.message,
                type : "Erreur reseau ou système"
            }
        }
    }
}

























async function requeteSecurisee(url, options = {}) {
    try {
        const response = await fetch(url, options);
        // 1. Vérification des erreurs HTTP (Le backend renvoie une erreur 400 ou 500)
        if (!response.ok) {
            let errorData;
            // On essaie de lire le message d'erreur envoyé par le backend (s'il est en JSON)
            try {
                errorData = await response.json();
            } catch (e) {
                // Si le backend n'a pas renvoyé de JSON, on lit le texte brut
                errorData = await response.text();
            }

            // On construit et on retourne notre objet d'erreur
            return {
                success: false,
                error: {
                    status: response.status,
                    statusText: response.statusText,
                    details: errorData,
                    type: 'Erreur HTTP'
                }
            };
        }

        // 2. Succès : On tente de parser la réponse en JSON
        const data = await response.json();
        
        // On retourne les données reçues
        return {
            success: true,
            data: data
        };

    } catch (erreur) {
        // 3. Erreurs réseau (Pas d'internet, serveur éteint, ou erreur de parsing JSON)
        return {
            success: false,
            error: {
                message: erreur.message,
                type: 'Erreur Réseau ou Système'
            }
        };
    }
}