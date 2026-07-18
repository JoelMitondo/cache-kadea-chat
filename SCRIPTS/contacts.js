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

//Affichage des comptes crées récemment
const comptesParDate = structuredClone(users)
comptesParDate.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))

const compteRecents = []
for(let i = 0; i < 3; i++ ){
    if(comptesParDate[i]){ // sécurité en cas de moins de trois
        compteRecents.push(comptesParDate[i])
    }
}

const divCompteRecent = document.getElementById("divCompteRecent")
divCompteRecent.innerHTML=""

for(let compteRecent of compteRecents){
    const divGeneral = document.createElement("div")
    divGeneral.className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm flex flex-col items-center text-center"
    
    const divImg = document.createElement("div")
    divImg.classList.add("relative")
    const img = document.createElement("img")
        
    if(compteRecent.avatarUrl === null){
        const imgDiv = document.createElement("div")
        imgDiv.className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm"
        const initialNameUser = `${compteRecent.fullName}`
        const initiale = initialNameUser.trim().split(" ") //transformer en tableau
            .splice(0,2).map(mot=>mot.charAt(0).toUpperCase()).join("");
        imgDiv.textContent= initiale
        divImg.appendChild(imgDiv) 
    } else{
        img.src=`${compteRecent.avatarUrl}`
        img.alt=`photo de ${compteRecent.fullName}`
        img.className="w-14 h-14 rounded-full object-cover"
        divImg.appendChild(img)
    }

    const puceVerte = document.createElement("div")
    puceVerte.className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"
    divImg.appendChild(puceVerte)

    const name = document.createElement("h4")
    name.textContent=`${compteRecent.fullName}`
    name.className="font-semibold text-gray-900 dark:text-white mt-3 text-sm"

    const email = document.createElement("p")
    email.textContent=`${compteRecent.email}`
    email.className="text-[11px] text-gray-400 dark:text-gray-500"

    const button = document.createElement("button")
    button.className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
    button.textContent="Discuter"

    divGeneral.appendChild(divImg)
    divGeneral.appendChild(name)
    divGeneral.appendChild(email)
    divGeneral.appendChild(button)

    divCompteRecent.appendChild(divGeneral)
}

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

    if(user.avatarUrl === null){
        const imgDiv = document.createElement("div")
        imgDiv.className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm"
        const initialNameUser = `${user.fullName}`
        const initiale = initialNameUser.trim().split(" ") //transformer en tableau
        .splice(0,2).map(mot=>mot.charAt(0).toUpperCase()).join("");
        imgDiv.textContent= initiale
        blocImg.appendChild(imgDiv) 
    } else{
        imgProfile.src=`${user.avatarUrl}`
        imgProfile.classList="w-full h-full object-cover"
        imgProfile.alt=`Photo de ${user.fullName}`
        blocImg.appendChild(imgProfile)
    }
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
    const conver = conversations.conversations
    handleContactClick(utilisateurId, conver, token, monId)

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




async function handleContactClick(clickedContactId, conversations, token, userId1) {
    const objetVide = {}
    // 1. Vérification : On cherche si une conversation privée existe déjà avec ce contact
    const existingConversation = conversations.find(conv => {
        if (conv.type !== "private") return false;
        
        // On vérifie si le contact cliqué fait partie des participants de cette conversation
        return conv.participants.some(participant => participant.userId === clickedContactId);
    });

    if (existingConversation) {
        // La conversation existe déjà ---
        localStorage.setItem("ouvrirConversation", true)
        localStorage.setItem("converId", existingConversation.id)
        location.href ="message.html"
    } else {
        // --- CAS 2 : Aucune conversation n'existe, on la crée ---;
        const idCrée = await creationConversation (token, userId1, clickedContactId)
        location.href="message.html"
    }
}

//Système de recherche dynamique membres et contacts recents)
const inputRechercheMembre = document.querySelector(".inputRechercheMembre")

if (inputRechercheMembre) {
    inputRechercheMembre.addEventListener("input", (event) => {
        const recherche = event.target.value.toLowerCase().trim();

        // 1. Filtrage dans "Tous les membres" (Recherche par nom ou par email)
        const tousLesBlocsMembres = document.querySelectorAll(".utilisateur");
        let membresVisibles = 0;

        tousLesBlocsMembres.forEach((bulle) => {
            const nomContact = bulle.querySelector("h3")?.textContent.toLowerCase() || "";
            const emailContact = bulle.querySelector("p")?.textContent.toLowerCase() || "";

            if (nomContact.includes(recherche) || emailContact.includes(recherche)) {
                bulle.classList.remove("hidden");
                membresVisibles++;
            } else {
                bulle.classList.add("hidden");
            }
        });

        // Mise à jour dynamique du compteur
        if (recherche) {
            nbreUsers.textContent = `${membresVisibles} sur ${users.length}`;
        } else {
            nbreUsers.textContent = users.length;
        }

        // 2. Filtrage dans "Contacts Récents"
        const cartesRecentes = divCompteRecent.children;
        Array.from(cartesRecentes).forEach((carte) => {
            const nomRecent = carte.querySelector("h4")?.textContent.toLowerCase() || "";
            const emailRecent = carte.querySelector("p")?.textContent.toLowerCase() || "";

            if (nomRecent.includes(recherche) || emailRecent.includes(recherche)) {
                carte.classList.remove("hidden");
            } else {
                carte.classList.add("hidden");
            }
        });
    });
}