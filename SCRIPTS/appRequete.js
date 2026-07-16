import {identifiants, connexion, deconnection} from "./toutesLesRequetes.js"
const urlConnexion = identifiants().urlConnexion
const urlDeconnexion = identifiants().urlDeconnexion
const key = identifiants().key

//Connexion

//Deconnexion
const btnDeconnexion = document.getElementById("btnDeconnexion");
btnDeconnexion.addEventListener('click', async (event)=>{
    event.preventDefault()
    const token = localStorage.getItem('token')
    await deconnection (urlDeconnexion, token, key)
});

