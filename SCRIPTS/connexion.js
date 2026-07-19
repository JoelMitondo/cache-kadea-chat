import {identifiants, connexion} from "./toutesLesRequetes.js";
const urlConnexion = identifiants().urlConnexion
const key = identifiants().key

/* 
après la connexion réussi de l'utilisateur, voila les informations stocké en locastorage
son token avec comme nom variable "token" et son profil avec comme nom variable "profileUser"
tous les utilisateurs avec comme nom variable "tousLesUsers" parse pour l'utilisation
toutes les conversations du user connecté avec comme nom variable "toutesLesConversations" parse pour l'utilisation
*/


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
        const loader = document.getElementById("page-loader")
        if (loader) loader.classList.remove("hidden")
        await connexion(urlConnexion, emailValue, passwordValue, key)    
    }
})
