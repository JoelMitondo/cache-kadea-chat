const key="wksp_43bb0d0056273188e10830ef1db75c22"
const profilRecupere = JSON.parse(localStorage.getItem('profileUser'))
const monId=profilRecupere.id
const token = localStorage.getItem('token')

//ici, on recupère toutes les conversation et 
//on recupère tous les messages

const imgProfil=document.getElementById("imgProfil")
imgProfil.src=profilRecupere.avatarUrl
const nomUser=document.getElementById("nomUser")
nomUser.textContent=profilRecupere.fullName;

const toutesConversations = JSON.parse(localStorage.getItem("toutesLesConversations"));
const contenairConversationsMessages = document.getElementById("contenairConversationsMessages");
contenairConversationsMessages.innerHTML=""


async function afficherLesUsers() {
    // Sécurité : on vérifie que le tableau des conversations existe
    if (!toutesConversations) return;
    // === ETAPE DE TRI AUTOMATIQUE ===
    // Trie du message le plus récent au plus ancien
    toutesConversations.sort((a, b) => {
        // On récupère le timestamp du dernier message pour A (sinon 0 si pas de message)
        const timeA = a.messages && a.messages.length > 0 
            ? new Date(a.messages[0].createdAt).getTime() 
            : 0; 
            
        // On récupère le timestamp du dernier message pour B (sinon 0 si pas de message)
        const timeB = b.messages && b.messages.length > 0 
            ? new Date(b.messages[0].createdAt).getTime() 
            : 0;

        // Tri décroissant : on soustrait A de B
        return timeB - timeA;
    });
    // BOUCLE POUR AFFICHER TOUTES LES CONVERSATIONS
    for (let conversation of toutesConversations) {
        const blocMessage = document.createElement("div")
        blocMessage.id = conversation.id
        blocMessage.className = "classConversation flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border-t border-transparent"
         
        const blocContenu = document.createElement("div");
        blocContenu.className = "ml-3 flex-1 overflow-hidden"
        
        const blocNomEtJour = document.createElement("div");
        blocNomEtJour.className = "flex justify-between items-center mb-0.5"
        
        const nomAutre = document.createElement("h3");
        nomAutre.className = "text-sm font-semibold text-gray-900 dark:text-white truncate"
        
        const idConversation = conversation.id
        await informationDuneConversation(key, token, idConversation)
        
        const infoMessage = JSON.parse(localStorage.getItem(`infoConversation-${idConversation}`))
        const blocImg = document.createElement("div")
        blocImg.className = "flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm"
        const imgConversation=document.createElement("img")
        imgConversation.alt=`la photo de `
        imgConversation.className="rounded-full w-12 h-12"
        
        // Sécurité : On vérifie que les données de la conversation et des participants existent
        if (infoMessage?.data?.conversation?.participants) {
            for (let participant of infoMessage.data.conversation.participants) {
                if (participant.user.id !== monId) {
                    nomAutre.textContent = participant.user.fullName
                    imgConversation.src= participant.user.avatarUrl
                }
            }
        }
        blocImg.appendChild(imgConversation)
        const dernierjour = document.createElement("span")
        dernierjour.className = "text-[11px] text-gray-400"
        dernierjour.id = conversation.id

        const dernierMessage = document.createElement("p");
        dernierMessage.id = conversation.id
        dernierMessage.className = "text-[13px] text-gray-500 dark:text-gray-400 truncate pr-2"

        // === GESTION SÉCURISÉE DES MESSAGES VIDE / EXISTANTS ===
        const aDesMessages = conversation.messages && conversation.messages.length > 0;

        if (aDesMessages) {
            // S'il y a des messages, on formate la date du premier
            const dateBruteDuDernierMessage = conversation.messages[0].createdAt;
            const date = new Date(dateBruteDuDernierMessage);
            
            const dateFormater = date.toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
            dernierjour.textContent = dateFormater;
            
            // On affiche le contenu du dernier message
            dernierMessage.textContent = conversation.messages[0].content ?? "Message vide";
        } else {
            // Si la conversation vient d'être créée et n'a aucun message
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

afficherLesUsers()



// ÉVÉNEMENT POUR AFFICHER LES MESSAGES D'UNE CONVERSATION
contenairConversationsMessages.addEventListener("click", async (event) => {
    const idConversationCliqué = event.target.closest(".classConversation");
    if (!idConversationCliqué) return;
    const idConversation = idConversationCliqué.id;
    
    // 1. Rendu de l'en-tête du contact
    const containerInfoContact = document.querySelector(".containerInfoContact");
    containerInfoContact.innerHTML = `
        <header class="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-gray-800 flex-shrink-0">
            <button class="mr-3 md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div class="flex items-center">
                <img id="imgContact" src="rien" alt="Sarah Connor" class="w-10 h-10 rounded-full object-cover hidden sm:block mr-3">
                <div>
                    <h2 id="nameContact" class="text-[15px] font-semibold text-gray-900 dark:text-white">Sarah Connor</h2>
                    <div class="flex items-center text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>Online
                    </div>
                </div>
            </div>
            <div class="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                <button class="hover:text-gray-700 dark:hover:text-gray-200 hidden sm:block cursor-pointer"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>
                <button class="hover:text-gray-700 dark:hover:text-gray-200 hidden sm:block cursor-pointer"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></button>
                <div class="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block"></div>
                <button class="hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg></button>
            </div>
        </header>`;

    // 2. Cibler la zone des messages existante et la vider avant chargement
    const zoneDesMessages = document.getElementById("zoneDesMessages");
    zoneDesMessages.innerHTML = ""; 

        await ListeMessagesConversations(token, idConversation)
    // Chargement et affichage des messages depuis le localStorage
    const messages = JSON.parse(localStorage.getItem(`messageConversation-${idConversation}`)).messages;
    
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
    
        const date = new Date(message.updatedAt);
        const dateFormater = date.toLocaleString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });   
        heure.textContent = dateFormater;

        blocMessage.appendChild(divMessage);
        blocMessage.appendChild(heure);
        zoneDesMessages.appendChild(blocMessage);
    }

    // 3. Rendu du bloc d'envoi en bas
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

    // Scroll automatique vers le bas dès l'ouverture de la conversation
    messagesEnd.scrollIntoView({ behavior: "auto" });

    // Événement d'envoi de message instantané
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
        
        // On l'ajoute directement dans notre zone dédiée aux messages
        zoneDesMessages.appendChild(blocMessage);
        
        inputMessage.value = "";
    
        // Défilement fluide vers le bas après envoi
        messagesEnd.scrollIntoView({ behavior: "smooth" });
        await envoyerMessage(token, idConversation, contenu)
    });
});


//function pour voir la liste des messages d'une conversation
async function ListeMessagesConversations (token, idConversation) {
    try{
        const reponse = await fetch(`https://kadea-chat-api.onrender.com/conversations/${idConversation}/messages`, {
            method : "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key,
                "Authorization": `Bearer ${token}`
            }
        })
        const reponseData = await reponse.json();
        if(reponse.ok){
            const messageDeCetteConversation = reponseData.data; //renvoie un tableau de toutes les conversations du user connecté, chaque conversation contient un objet de messages(avec toutes les informations nécessaires), si y a pas de conversation ça renvoie un tableau vide
            localStorage.setItem(`messageConversation-${idConversation}`, JSON.stringify(messageDeCetteConversation)); //stockage de toutes les conversations du user connecté dans le localStorage
            alert("tous les messageDeCetteConversation sont récuperées avec succès !");
            console.log(messageDeCetteConversation);
        } else {
            throw new Error(JSON.stringify(reponseData));
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des messages d'une conversation :", error);
        throw error;
    }
}

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

