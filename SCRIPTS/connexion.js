const key="wksp_43bb0d0056273188e10830ef1db75c22"
const urlGeneral = "https://kadea-chat-api.onrender.com"
const urlConnexion = `${urlGeneral}/auth/login`

/* 
après la connexion réussi de l'utilisateur, voila les informations stocké en locastorage
son token avec comme nom variable "token" et son profil avec comme nom variable "profileUser"
tous les utilisateurs avec comme nom variable "tousLesUsers" parse pour l'utilisation
toutes les conversations du user connecté avec comme nom variable "toutesLesConversations" parse pour l'utilisation
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
        localStorage.setItem('token',resultat.data.data.token)
        const token = localStorage.getItem('token');
        await informationUser(token);
        await users(token);
        await recevoirTousConversationUser(token);
        window.location.replace("profil.html")
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

const confirmationConnexion = {
    confirmEmail:false,
    password:false
}

//verification de l'adresse email au moment de la connexion
const email = document.getElementById("emailLogin");
email.addEventListener("input", ()=>{
    const erreurLoginMail = document.getElementById('error-login-email');
    const testEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
    
    if(!testEmail){
        erreurLoginMail.classList.remove("hidden")
        erreurLoginMail.classList.add("block")
        erreurLoginMail.textContent="L'adresse email mal écrite"
    }else{
        erreurLoginMail.classList.remove("block")
        erreurLoginMail.classList.add("hidden")
        confirmationConnexion.confirmEmail=true
    }
})

//verification du mot de passe au moment de la connexion
const passwordLogin=document.getElementById("passwordLogin");
passwordLogin.addEventListener("input", ()=>{
    const errorLoginPassword=document.getElementById("error-login-password")
    const testPassword = passwordLogin.value.length >= 8;
    if(!testPassword){
        errorLoginPassword.classList.remove("hidden")
        errorLoginPassword.classList.add("block")
        errorLoginPassword.textContent="Le mot de passe doit contenir au moins 8 caractères"
    }else{
        errorLoginPassword.classList.remove("block")
        errorLoginPassword.classList.add("hidden")
        confirmationConnexion.password=true
    }
})

const btnLogin = document.getElementById("btnLogin")
btnLogin.addEventListener('click', async (event)=>{
    event.preventDefault()

    if(!confirmationConnexion.confirmEmail ||
    !confirmationConnexion.password){
        alert("Veuillez remplir correctement tous les champs du formulaire de connexion.")
    }else{
        const emailValue = email.value;
        const passwordValue = passwordLogin.value;
        await connexion(urlConnexion, emailValue, passwordValue, key)    
    }
})
