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

async function connexion(url, email, password, key){
    const resultat = await requeteSecurisee (url, {
        method : "POST",
        body : JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            "Content-Type": "application/json",
            "x-api-key": key
        }
    })
    //Gestion du resultat
    if(resultat.success){
        localStorage.setItem('token', resultat.data.data.token)
        localStorage.setItem('tokenBrute', )
        console.log("Donnée reçue avec succès", resultat.data)
    } else {
        console.error(" La requête a échoué :", resultat.erreur);
        
        // Affichage message à l'utilisateur selon le type d'erreur
        if (resultat.erreur.status === 401) {
            alert("Votre session a expiré, veuillez vous reconnecter.");
        } else {
            alert("Une erreur est survenue lors du chargement des données.");
        }
    }
}



connexion()