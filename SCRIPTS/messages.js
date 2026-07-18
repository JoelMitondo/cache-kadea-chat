const key="wksp_43bb0d0056273188e10830ef1db75c22"
const profilRecupere = JSON.parse(localStorage.getItem('profileUser'))
const monId = profilRecupere.id
const token = localStorage.getItem('token')

const imgProfil = document.getElementById("imgProfil")
imgProfil.src = profilRecupere.avatarUrl
const nomUser = document.getElementById("nomUser")
nomUser.textContent = profilRecupere.fullName;

// On récupère la version locale actuelle pour l'affichage instantané au démarrage
let toutesConversations = JSON.parse(localStorage.getItem("toutesLesConversations"));
const tousUsers = localStorage.getItem("tousLesUsers")
const users = JSON.parse(tousUsers)

const contenairConversationsMessages = document.getElementById("contenairConversationsMessages");

// === MODIFICATION 1 : La fonction accepte maintenant un paramètre pour être réutilisable ===
// === FONCTION MODIFIÉE ET SÉCURISÉE ===
function afficherLesUsers(conversationsA_Afficher = toutesConversations) {
    // Sécurité : On vérifie que les données existent
    if (!conversationsA_Afficher) return;
    
    // --- NOUVEAU : Extraction automatique du tableau ---
    let liste = conversationsA_Afficher;
    
    // Si ce n'est pas un tableau mais un objet, on fouille dedans
    if (!Array.isArray(liste) && typeof liste === "object") {
        // On essaie de prendre .data, ou .conversations, ou le premier tableau trouvé dans l'objet
        liste = liste.data || liste.conversations || Object.values(liste).find(Array.isArray);
    }

    // Si après fouille on n'a toujours pas de tableau, on arrête pour éviter le crash
    if (!liste || !Array.isArray(liste)) {
        console.error("Impossible d'afficher les conversations : le format reçu n'est pas un tableau.", conversationsA_Afficher);
        return;
    }
    // ----------------------------------------------------

    // On vide le conteneur avant de re-remplir (essentiel lors de la mise à jour en arrière-plan)
    contenairConversationsMessages.innerHTML = ""

    // Tri de la liste nettoyée (du message le plus récent au plus ancien)
    liste.sort((a, b) => {
        const timeA = a.messages && a.messages.length > 0 ? new Date(a.messages[0].createdAt).getTime() : 0; 
        const timeB = b.messages && b.messages.length > 0 ? new Date(b.messages[0].createdAt).getTime() : 0;
        return timeB - timeA;
    });

    // BOUCLE POUR AFFICHER TOUTES LES CONVERSATIONS (on utilise 'liste' maintenant)
    for (let conversation of liste) {
        const blocMessage = document.createElement("div")
        blocMessage.id = conversation.id
        blocMessage.className = "classConversation flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border-t border-transparent"
         
        const blocContenu = document.createElement("div");
        blocContenu.className = "ml-3 flex-1 overflow-hidden"
        
        const blocNomEtJour = document.createElement("div");
        blocNomEtJour.className = "flex justify-between items-center mb-0.5"
        
        const nomAutre = document.createElement("h3");
        nomAutre.className = "text-sm font-semibold text-gray-900 dark:text-white truncate"
        nomAutre.textContent = "Discussion..." 
        
        const idConversation = conversation.id
        
        const blocImg = document.createElement("div")
        blocImg.className = "flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm"
        const imgConversation = document.createElement("img")
        imgConversation.alt = `la photo de `
        imgConversation.className = "rounded-full w-12 h-12"
        imgConversation.src = "rien" 
        
        const infoMessage = JSON.parse(localStorage.getItem(`infoConversation-${idConversation}`))
        
        if (infoMessage?.data?.conversation?.participants) {
            for (let participant of infoMessage.data.conversation.participants) {
                if (participant.user.id !== monId) {
                    nomAutre.textContent = participant.user.fullName
                    imgConversation.src = participant.user.avatarUrl
                }
            }
        } else {
            informationDuneConversation(key, token, idConversation).then(() => {
                const infoMessageNeuf = JSON.parse(localStorage.getItem(`infoConversation-${idConversation}`))
                if (infoMessageNeuf?.data?.conversation?.participants) {
                    for (let participant of infoMessageNeuf.data.conversation.participants) {
                        if (participant.user.id !== monId) {
                            nomAutre.textContent = participant.user.fullName
                            imgConversation.src = participant.user.avatarUrl
                        }
                    }
                }
            }).catch(err => console.error("Erreur tâche de fond détails conversation:", err));
        }

        blocImg.appendChild(imgConversation)
        const dernierjour = document.createElement("span")
        dernierjour.className = "text-[11px] text-gray-400"
        dernierjour.id = conversation.id

        const dernierMessage = document.createElement("p");
        dernierMessage.id = conversation.id
        dernierMessage.className = "text-[13px] text-gray-500 dark:text-gray-400 truncate pr-2"

        const aDesMessages = conversation.messages && conversation.messages.length > 0;

        if (aDesMessages) {
            const dateBruteDuDernierMessage = conversation.messages[0].createdAt;
            const date = new Date(dateBruteDuDernierMessage);
            
            const dateFormater = date.toLocaleString("fr-FR", {
                weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            });
            dernierjour.textContent = dateFormater;
            dernierMessage.textContent = conversation.messages[0].content ?? "Message vide";
        } else {
            dernierjour.textContent = "Nouveau";
            dernierMessage.textContent = "Aucun message pour le moment";
        }

        blocNomEtJour.appendChild(nomAutre)
        blocNomEtJour.appendChild(dernierjour)
        blocContenu.appendChild(blocNomEtJour)
        blocContenu.appendChild(dernierMessage)
        blocMessage.appendChild(blocImg);
        blocMessage.appendChild(blocContenu)
        contenairConversationsMessages.appendChild(blocMessage)
    }
}

// === NETTOYAGE DE LA FONCTION DE RAFRAÎCHISSEMENT ===
async function rafraichirConversationsArrierePlan() {
    try {
        const reponse = await fetch(`https://kadea-chat-api.onrender.com/conversations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        });
        const reponseData = await reponse.json();
        if (reponse.ok) {
            // On sauvegarde la réponse brute ou nettoyée dans le localStorage
            localStorage.setItem("toutesLesConversations", JSON.stringify(reponseData));
            
            // On envoie à l'affichage, notre nouvelle sécurité s'occupe du reste !
            afficherLesUsers(reponseData);
        }
    } catch (error) {
        console.error("Erreur lors du rafraîchissement des conversations en tâche de fond :", error);
    }
}
// === MODIFICATION 3 : Nouvelle fonction pour récupérer la liste globale des conversations en arrière-plan ===
async function rafraichirConversationsArrierePlan() {
    try {
        // Remplace cette URL par ton endpoint réel si nécessaire (ex: /conversations)
        const reponse = await fetch(`https://kadea-chat-api.onrender.com/conversations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        });
        const reponseData = await reponse.json();
        if (reponse.ok) {
            const nouvellesConversations = reponseData.data || reponseData;
            // Étape 1 : On enregistre la nouvelle liste en local
            localStorage.setItem("toutesLesConversations", JSON.stringify(nouvellesConversations));
            // Étape 2 : On met à jour l'affichage de manière transparente pour l'utilisateur
            afficherLesUsers(nouvellesConversations);
        }
    } catch (error) {
        console.error("Erreur lors du rafraîchissement des conversations en tâche de fond :", error);
    }
}

// --- CYCLE DE CHARGEMENT DE LA PAGE ---
// 1. On affiche instantanément ce qu'il y a dans le localStorage au démarrage
afficherLesUsers(toutesConversations);
// 2. On lance la requête réseau en arrière-plan pour mettre à jour s'il y a du nouveau
rafraichirConversationsArrierePlan();


// === MODIFICATION 4 : Isolation de la logique de rendu des messages pour la réutiliser ===
function afficherLesMessagesDuCache(idConversation) {
    const zoneDesMessages = document.getElementById("zoneDesMessages");
    zoneDesMessages.innerHTML = ""; 

    const cacheData = localStorage.getItem(`messageConversation-${idConversation}`);
    if (!cacheData) return;

    const cacheParsed = JSON.parse(cacheData);
    const messages = cacheParsed.messages || cacheParsed;

    if (!messages || !Array.isArray(messages)) return;

    for (let message of messages) {
        const blocMessage = document.createElement("div");
        const divMessage = document.createElement("div");
        
        if (message.senderId !== monId) {
            blocMessage.className = "flex flex-col mb-4 items-start";
            divMessage.className = "max-w-[85%] sm:max-w-[70%] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-[14px] shadow-sm";
        } else {
            blocMessage.className = "flex flex-col mb-4 items-end";
            divMessage.className = "max-w-[85%] sm:max-w-[70%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] shadow-sm";
        }
        
        divMessage.textContent = message.content;
        
        const heure = document.createElement("span");
        heure.className = "text-[10px] text-gray-400 mt-1.5 ml-1";
    
        const date = new Date(message.updatedAt || message.createdAt);
        const dateFormater = date.toLocaleString("fr-FR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
        });   
        heure.textContent = dateFormater;

        blocMessage.appendChild(divMessage);
        blocMessage.appendChild(heure);
        zoneDesMessages.appendChild(blocMessage);
    }

    const messagesEnd = document.getElementById("messages-end");
    if (messagesEnd) messagesEnd.scrollIntoView({ behavior: "auto" });
}


// ÉVÉNEMENT POUR AFFICHER LES MESSAGES D'UNE CONVERSATION
contenairConversationsMessages.addEventListener("click", async (event) => {
    const idConversationCliqué = event.target.closest(".classConversation");
    if (!idConversationCliqué) return;
    const idConversation = idConversationCliqué.id;
    
    await afficherMessageConversation (idConversation)
});

//Function pour afficher une conversation a partir d'un clique dans la page contact
async function afficherApartirContact(){
    document.addEventListener("DOMContentLoaded", async ()=>{
        const ouvrirConversation = localStorage.getItem("ouvrirConversation")
        const converId = localStorage.getItem("converId")
        if(ouvrirConversation === true){
            await afficherMessageConversation(converId)

            localStorage.removeItem("ouvrirConversation")
        }
    })
}
afficherApartirContact()
// FUNCTION POUR VOIR LA LISTE DES MESSAGES (Stocke en local)
async function ListeMessagesConversations (token, idConversation) {
    try {
        const reponse = await fetch(`https://kadea-chat-api.onrender.com/conversations/${idConversation}/messages`, {
            method : "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        })
        const reponseData = await reponse.json();
        if (reponse.ok) {
            const messageDeCetteConversation = reponseData.data; 
            localStorage.setItem(`messageConversation-${idConversation}`, JSON.stringify(messageDeCetteConversation)); 
            console.log("Messages synchronisés avec le serveur.");
        } else {
            throw new Error(JSON.stringify(reponseData));
        }
    } catch (error) {
        console.error("Erreur réseau ListeMessagesConversations :", error);
        throw error;
    }
}

// Les fonctions informationDuneConversation et envoyerMessage restent à leur place sans modifications structurelles...

// FUNCTION POUR RECUPERER LES INFORMATION D'UNE CONVERSATION
async function informationDuneConversation (key, token, conversationId) {
    try {
        const reponse = await fetch(`https://kadea-chat-api.onrender.com/conversations/${conversationId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        });
        if (!reponse.ok) {
            const reponseData = await reponse.json();
            throw new Error(JSON.stringify(reponseData));
            return reponseData
        } else {
            const reponseData = await reponse.json();
            const info = reponseData; 
            localStorage.setItem(`infoConversation-${conversationId}`, JSON.stringify(info));
        }
    } catch (error) {
        console.error("Erreur lors de la recuperations des information d'une conversation :", error);
        throw error;
    }
}

// FUNCTION POUR ENVOYER UN MESSAGE DANS UNE CONVERSATION
async function envoyerMessage(token, conversationId, contenu) {
    try {
        const reponse = await fetch(`https://kadea-chat-api.onrender.com/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "content": contenu })
        });
        const reponseData = await reponse.json();
        if (reponse.ok) {
            alert("message envoyer")
          await  afficherUneNouvelleBulleMessage(contenu)
        } else {
            throw new Error(JSON.stringify(reponseData));
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        throw error;
    }
}

async function afficherMessageConversation (idConversation){
    const containerInfoContact = document.querySelector(".containerInfoContact");
    const infoMessage = JSON.parse(localStorage.getItem(`infoConversation-${idConversation}`));
    let nomContactDynamique = "Discussion";
    let imgContactDynamique = "rien";

    if (infoMessage?.data?.conversation?.participants) {
        for (let participant of infoMessage.data.conversation.participants) {
            if (participant.user.id !== monId) {
                nomContactDynamique = participant.user.fullName;
                imgContactDynamique = participant.user.avatarUrl;
            }
        }
    }

    containerInfoContact.innerHTML = `
        <header class="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-gray-800 flex-shrink-0">
            <button class="mr-3 md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div class="flex items-center">
                <img id="imgContact" src="${imgContactDynamique}" alt="${nomContactDynamique}" class="w-10 h-10 rounded-full object-cover hidden sm:block mr-3">
                <div>
                    <h2 id="nameContact" class="text-[15px] font-semibold text-gray-900 dark:text-white">${nomContactDynamique}</h2>
                    <div class="flex items-center text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>Online
                    </div>
                </div>
            </div>
            <!-- ... Reste des boutons de l'en-tête inchangés ... -->
        </header>`;

    // === MODIFICATION 5 : Application du Cache-First pour les messages ===
    // Étape A : On affiche INSTANTANÉMENT les anciens messages stockés localement
    afficherLesMessagesDuCache(idConversation);

    // Étape B : On lance la requête réseau en arrière-plan (sans bloquer l'interface utilisateur)
    try {
        await ListeMessagesConversations(token, idConversation);
        // Étape C : Une fois que ListeMessagesConversations a mis à jour le localStorage, on réaffiche pour inclure les nouveaux messages reçus
        afficherLesMessagesDuCache(idConversation);
    } catch (error) {
        console.error("Erreur de mise à jour des messages via le réseau :", error);
    }

    // Le bloc d'envoi et la gestion du bouton d'envoi restent inchangés
    const divBtnEnvoie = document.getElementById("divBtnEnvoie");
    divBtnEnvoie.innerHTML = `
            <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 sm:p-2 cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
            <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 sm:p-2 hidden sm:block cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
            <div class="flex-1 relative">
                <input id="inputMessage" type="text" placeholder="Type a message..." class="w-full bg-blue-50/50 dark:bg-gray-700/50 border border-blue-100 dark:border-gray-600 rounded-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400">
            </div>
            <button class="btnSendMessage w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0 ml-2 cursor-pointer">
                <svg class="w-5 h-5 translate-x-[-1px] translate-y-[1px]" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>
        </div>`;

    const btnSendMessage = document.querySelector(".btnSendMessage");
    const messagesEnd = document.getElementById("messages-end");
    const inputMessage = document.getElementById("inputMessage");

    if (messagesEnd) messagesEnd.scrollIntoView({ behavior: "auto" });

    btnSendMessage.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!inputMessage.value.trim()) return;

        const blocMessage = document.createElement("div");
        blocMessage.className = "flex flex-col mb-4 items-end";
        
        const divMessage = document.createElement("div");
        divMessage.className = "max-w-[85%] sm:max-w-[70%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] shadow-sm";
        divMessage.textContent = inputMessage.value;

        const contenu = inputMessage.value
        blocMessage.appendChild(divMessage);
        document.getElementById("zoneDesMessages").appendChild(blocMessage);
        
        inputMessage.value = "";
        if (messagesEnd) messagesEnd.scrollIntoView({ behavior: "smooth" });
        await envoyerMessage(token, idConversation, contenu)
    });
}
