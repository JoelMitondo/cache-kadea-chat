import {afficherNotification} from "./scripts.js"

//Fonction requete securisée 
export async function requeteSecurisee (url, options={}){
    try{
        const reponse = await fetch (url, options)
        //Vérification des erreurs HTTP (Le backend renvoie une erreur 400 ou 500)
        if(!reponse.ok){
            let erreurData 
            //on lit si le message du backend est en JSON
            try{
                erreurData = await reponse.json()
            } //au cas contraire on lit le texte
            catch(e){
                erreurData = await reponse.json()
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
        const data = await reponse.json()
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
        localStorage.setItem('token', resultat.data.data.token)

        const token = localStorage.getItem('token');
        await informationUser(token, key);
        await users(token, key);
        await recevoirTousConversationUser(token, key);
        window.location.replace("profil.html")
    } else {
        const loader = document.getElementById("page-loader")
        console.error(" La requête a échoué :", resultat.erreur);
        if (loader) loader.classList.add("hidden")
        // 1. Récupération sécurisée du statut et du message brut
        const statutErreur = resultat?.erreur?.status;
        const messageBrutAPI = resultat?.erreur?.message;

        // 2. Définition du message par défaut au cas où la panne est inconnue
        let messageNotification = "Une erreur imprévue est survenue. Veuillez réessayer.";

        // 3. Traitement chirurgical selon le type d'erreur retourné par l'API
        switch (statutErreur) {
            case 400:
                messageNotification = "Données invalides ou formulaire incomplet. Veuillez vérifier les champs.";
                break;
                
            case 401:
                messageNotification = "Identifiants incorrects (email ou mot de passe invalide).";
                break;
                
            case 403:
                messageNotification = "Accès interdit. Votre session a expiré ou vous n'avez pas les droits requis.";
                break;
                
            case 404:
                messageNotification = "La ressource ou l'utilisateur demandé reste introuvable.";
                break;
                
            case 429:
                messageNotification = "Trop de requêtes envoyées ! Veuillez patienter un instant avant de réessayer.";
                break;
                
            case 500:
            case 502:
            case 503:
                messageNotification = "Le serveur Kadea Chat rencontre un problème technique. Réessayez dans quelques minutes.";
                break;
                
            default:
                // Si l'API ne renvoie pas de code HTTP, on teste la connexion internet locale
                if (!navigator.onLine) {
                    messageNotification = "Connexion impossible. Veuillez vérifier votre accès Internet.";
                } else if (messageBrutAPI) {
                    // Secours si l'API envoie son propre texte descriptif
                    messageNotification = messageBrutAPI;
                }
                break;
        }

        // 4. Affichage de la notification personnalisée à l'utilisateur
        afficherNotification(messageNotification, false);
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
        localStorage.clear()
        window.location.replace("./connexion.html")
    } else{
        const messageDeconnexionFalse = "Echec de la déconnexion " 
        afficherNotification(messageDeconnexionFalse, false)
    }
}



//LES FONCTIONS CI-DESSOUS DOIVENT ETRE AMELIORER MALGRE QU'ELLES FONCTIONNENT DEJQ

async function informationUser(token, key){
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
            const profileUser = reponseData.data.user;
            localStorage.setItem('profileUser', JSON.stringify(profileUser));
        }
    } catch(error){
        console.error("Erreur lors de la récupération des informations de l'utilisateur :");
    }
}

//FUNCTION QUI RECUPERE LES INFORMATIONS USERS
async function users(token, key){
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
            const listeUtilisateurs = reponseData.data.users;
            localStorage.setItem('tousLesUsers', JSON.stringify(listeUtilisateurs));
        } else{
            throw new Error(JSON.stringify(reponseData))
        }

    }catch(error){
        console.error("Erreur lors de la récupération des utilisateurs :");
        throw error;
    }
}

//FUNCTION POUR RECUPERER TOUTES LES CONVERSATIONS DU USER
async function recevoirTousConversationUser(token, key) {
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
