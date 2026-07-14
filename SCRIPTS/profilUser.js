const tokenBrute = JSON.parse(localStorage.getItem('tokenBrute'))
console.log(tokenBrute)

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
    const token = localStorage.getItem('token');
    const url = "https://kadea-chat-api.onrender.com"
    const key = "wksp_43bb0d0056273188e10830ef1db75c22"
    console.log(token)
    await deconnection (url, token, key)
    
});


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
