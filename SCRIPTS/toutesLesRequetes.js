export function identifiants(){
    const key="wksp_43bb0d0056273188e10830ef1db75c22"
    const urlGeneral = "https://kadea-chat-api.onrender.com"
    const urlConnexion = `${urlGeneral}/auth/login`
    const urlDeconnexion = `${urlGeneral}/auth/logout`
    return {
        key : key,
        urlConnexion : urlConnexion,
        urlDeconnexion : urlDeconnexion
    }
}

//Fonction requete securisée 
export async function requeteSecurisee (url, options={}){
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



//FUNCTION POUR LA DECONNECTION
async function deconnection (url, token, key){
    try{
        const reponse = await fetch(`${url}/auth/logout`, {
            "method" : "POST",
            "headers": {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        });
        const reponseData = await reponse.json();
        if(reponse.ok){
            // Supprimer tout ce qui est sauvegarder en local
            localStorage.clear()
        alert("Vous avez été déconnecté avec succès.");
        window.location.replace("./connexion.html");
        } else {
            throw new Error(JSON.stringify(reponseData));
        }
    } catch (error) {
        alert("Erreur lors de la déconnexion. Veuillez réessayer.");
        console.error("Erreur lors de la déconnexion :", error);
        throw error;
    }
}
