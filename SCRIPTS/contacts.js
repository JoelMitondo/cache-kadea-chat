const key="wksp_43bb0d0056273188e10830ef1db75c22"
let lien = "https://kadea-chat-api.onrender.com"
const profilRecupere = JSON.parse(localStorage.getItem('profileUser'))
const monId = `${profilRecupere.id}`
const token = localStorage.getItem('token')
//récuperation de tous les users stockés en local
const tousUsers = localStorage.getItem("tousLesUsers")
const users = JSON.parse(tousUsers) //tableau des tous les users

//toutes les conversation de ce user
const toutesConversations = localStorage.getItem("toutesLesConversations")
const conversations = JSON.parse(toutesConversations)



//affichage du nombre des users
const nbreUsers = document.querySelector(".nbreUsers")
nbreUsers.textContent=users.length

//affichage des tous les utilisateurs
const containerUsers=document.getElementById("containerUsers")//container de tous les users
containerUsers.innerHTML=""
for(user of users){
    
    const blocsUser = document.createElement("div");
    blocsUser.id=user.id
    blocsUser.className="utilisateur p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
    const blocInfoUser =document.createElement("div")
    blocInfoUser.className="flex items-center space-x-3"

    const blocImgUser=document.createElement("div")
    blocImgUser.className="relative flex-shrink-0"
    const blocImg=document.createElement("div")
    blocImg.className="overflow-hidden w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm"
    const imgProfile=document.createElement("img")
    imgProfile.src=`${user.avatarUrl}`
    imgProfile.classList="w-full h-full object-cover"
    imgProfile.alt=`Photo de ${user.fullName}`
    blocImg.appendChild(imgProfile)
    const puceEnLigne =document.createElement("div")
    puceEnLigne.className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"

    blocImgUser.appendChild(blocImg);
    blocImgUser.appendChild(puceEnLigne);

    const identiteUser=document.createElement("div");
    const fullNameUser=document.createElement("h3")
    fullNameUser.className="text-sm font-semibold text-gray-900 dark:text-white"
    fullNameUser.textContent=`${user.fullName}`
    const emailUser=document.createElement("p")
    emailUser.textContent=`${user.email}`
    emailUser.className="text-xs text-gray-400 dark:text-gray-500"

    identiteUser.appendChild(fullNameUser);
    identiteUser.appendChild(emailUser);

    const blocStatus=document.createElement("div");
    blocStatus.className="flex items-center space-x-4"
    const dateEnLigne=document.createElement("span")
    dateEnLigne.className="hidden md:block text-xs text-gray-500 dark:text-gray-400"
    const dateBrute = user.updatedAt
    //convertir la chaine à un véritable objet Data du javascrip
    const date = new Date(dateBrute)
    //formatage de la date selon les préferences
    const dateFormater = date.toLocaleDateString("fr-FR", {
        day : "numeric",
        month : "long",
        year: "numeric"
    })
    dateEnLigne.textContent=`En ligne le ${dateFormater}`;
    const btnDiscuter=document.createElement("button")
    btnDiscuter.textContent="Discuter"
    btnDiscuter.className="bg-gray-100 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-200 hover:text-white dark:hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all" 
    blocStatus.appendChild(dateEnLigne);
    blocStatus.appendChild(btnDiscuter);

    blocInfoUser.appendChild(blocImgUser)
    blocInfoUser.appendChild(identiteUser)
    
    blocsUser.appendChild(blocInfoUser)
    blocsUser.appendChild(blocStatus)

    containerUsers.appendChild(blocsUser)
    

}

containerUsers.addEventListener("click", async (event)=>{
    const utilisateur = event.target.closest(".utilisateur");
    if(!utilisateur){
        return
    }
    const utilisateurId = utilisateur.id

    await creationConversation (token, monId, utilisateurId)
    // a chaque clique, j'ai recupère l'id du contact cliqué
    /* j'ai déja enregisté l'id de user connecté sur monId
    a chaque clique, ssi aucune conversation avec les deux id existe, j'en crée une
    et je dirige l'utilisateur jusqu'à l'interface de leur message*/

})

//function pour crée une conversation entre deux utilisateurs
async function creationConversation (token, userId1, userId2) {
    try{
        const reponse = await fetch("https://kadea-chat-api.onrender.com/conversations", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`},
            body: JSON.stringify({
                "type": "private",
                "name": `Conversation entre ${userId1} et ${userId2}`,
                "participantIds": [userId1, userId2]
            })
        })
        const reponseData = await reponse.json()
        if(reponse.ok){
            alert("crée")
            return reponseData.data.conversation.id;
        } else {
            throw new Error(JSON.stringify(reponseData));                    
        }
    } catch (error) {
        console.error("Erreur lors de la création de la conversation :", error);
        throw error;
    }
}