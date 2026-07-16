import {afficherNotification} from "./scripts.js"

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
// FONCTION DE LA CONNEXION
export async function connexion(url, email, password, key){
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
        localStorage.setItem('token',resultat.data.data.token)
        const token = localStorage.getItem('token');
        await informationUser(token);
        await users(token);
        await recevoirTousConversationUser(token);
        const messageConnexionReussi = "Connexion réussie ! Bienvenue sur Kadea Chat"
        afficherNotification(messageConnexionReussi, true)
        window.location.replace("profil.html")
    } else {
        console.error(" La requête a échoué :", resultat.erreur);
        // Affichage message à l'utilisateur selon le type d'erreur
        if (resultat.erreur.status === 401) {
            const messageConnexionEchoue = "connexion echoué, veillez réssayé"
            afficherNotification(messageConnexionEchoue, false);
        } else {
            const messageConnexionEchoue = "connexion echoué, veillez réssayé"
            afficherNotification(messageConnexionEchoue, false);
        }
    }
}

//FUNCTION POUR LA DECONNECTION
export async function deconnection (url, token, key){
    const resultat = await requeteSecurisee (url, {
            "method" : "POST",
            "headers": {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        });
    if(resultat.success){
        const messageDeconnexionTrue = "Vous êtes deconnecté avec succès !!" 
        afficherNotification(messageDeconnexionTrue, true)
        window.location.replace("./connexion.html")
    } else{
        const messageDeconnexionFalse = "Echec de la déconnexion " 
        afficherNotification(messageDeconnexionFalse, false)
    }
}



//LES FONCTIONS CI-DESSOUS DOIVENT ETRE AMELIORER MALGRE QU'ELLES FONCTIONNENT DEJQ

async function informationUser(token){
    try {
        const reponse = await fetch("https://kadea-chat-api.onrender.com/auth/me", {
        method : "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": key,
            "Authorization": `Bearer ${token}`}
        })
        const reponseData = await reponse.json()
        if(reponse.ok){
            alert("Voici votre profil récuperé :");
            const profileUser = reponseData.data.user;
            localStorage.setItem('profileUser', JSON.stringify(profileUser));
        }
    } catch(error){
        alert("Erreur lors de la récupération des informations de l'utilisateur :");
    }
}

//FUNCTION QUI RECUPERE LES INFORMATIONS USERS
async function users(token){
    try {
        const reponse = await fetch("https://kadea-chat-api.onrender.com/users", {
            method : "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        })
        const reponseData = await reponse.json()
        if(reponse.ok){
            alert("Voici la liste des utilisateurs :");
            const listeUtilisateurs = reponseData.data.users;
            localStorage.setItem('tousLesUsers', JSON.stringify(listeUtilisateurs));
        } else{
            throw new Error(JSON.stringify(reponseData))
        }

    }catch(error){
        alert("Erreur lors de la récupération des utilisateurs :");
        throw error;
    }
}

//FUNCTION POUR RECUPERER TOUTES LES CONVERSATIONS DU USER
async function recevoirTousConversationUser(token) {
    try {
        const reponse = await fetch("https://kadea-chat-api.onrender.com/conversations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        });
        const reponseData = await reponse.json();
        if (reponse.ok) {
            const toutesLesConversations = reponseData.data.conversations; //renvoie un tableau de toutes les conversations du user connecté, chaque conversation contient un objet de messages(avec toutes les informations nécessaires), si y a pas de conversation ça renvoie un tableau vide
            localStorage.setItem("toutesLesConversations", JSON.stringify(toutesLesConversations)); //stockage de toutes les conversations du user connecté dans le localStorage
            alert("tous les conversations sont récuperées avec succès !");
            console.log(toutesLesConversations); //j'ai regroupe un tableau qui contien toutes les conversations du user connecté, chaque conversation contient un objet de messages(avec toutes les informations nécessaires), si y a pas de conversation ça renvoie un tableau vide
        } else {
            throw new Error(JSON.stringify(reponseData));
            return
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        throw error;
    }
}
