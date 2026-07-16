import {identifiants} from "./toutesLesRequetes"
const urlDeconnexion = identifiants().urlDeconnexion
const key = identifiants().key

function affichageProfilUser(){
const profilRecupere = JSON.parse(localStorage.getItem('profileUser'))
const dateBrute = profilRecupere.createdAt

//convertir la chaine à un véritable objet Data du javascrip
const date = new Date(dateBrute)

//formatage de la date selon les préferences
const dateFormater = date.toLocaleDateString("fr-FR", {
    day : "numeric",
    month : "long",
    year: "numeric"
})
const imgUser = document.getElementById("imgUser")
const nameUser = document.getElementById("nameUser")
const bioUser = document.getElementById("bioUser")
const emailUser = document.getElementById("emailUser")
const dateCreatonUser= document.getElementById('dateCreatonUser')
const nomComplet = document.getElementById("nomComplet")

nameUser.textContent=`${profilRecupere.fullName}`
bioUser.textContent=`${profilRecupere.bio}`
emailUser.textContent=`${profilRecupere.email}`
imgUser.src=`${profilRecupere.avatarUrl}`
imgUser.alt=`Photo profil de ${profilRecupere.fullName}`
dateCreatonUser.textContent=` : ${dateFormater}`
nomComplet.textContent=`${profilRecupere.fullName}`
}
affichageProfilUser()

const btnDeconnexion = document.getElementById("btnDeconnexion");
btnDeconnexion.addEventListener('click', async (event)=>{
    event.preventDefault()
    await deconnection (url, token, key)
});

