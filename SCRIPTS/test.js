    



/*
async function recuperationMdpO (key, emailentrer) {
    try{
        const reponse = await fetch("https://kadea-chat-api.onrender.com/auth/forgot-password", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key
            },
            body: JSON.stringify({
                email : emailentrer 
                })
        })
        if(!reponse.ok){
            const erreurRecu =  await reponse.json()  
            throw new Error(JSON.stringify(erreurRecu))
            return erreurRecu
        } else {
            const reponseRecu = await reponse.json()
            
            return reponseRecu
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du code pour la recuperation du compte :", error);
        throw error;
    }
}
const key="wksp_43bb0d0056273188e10830ef1db75c22"
const email = "mitondomohindo@gmail.com"   
recuperationMdpO(key, email)
    .then((code) => {
        console.log("voici la reponse:", code);
    })
    .catch((error) => {console.error("Erreur lors de la création du code :", error);})



async function modifictaionMdp (key, code, newPassword) {
    try{
        const reponse = await fetch("https://kadea-chat-api.onrender.com/auth/reset-password", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key
            },
            body: JSON.stringify({
                code : code,
                newPassword : newPassword 
                })
        })
        if(!reponse.ok){
            const erreurRecu =  await reponse.json()   
            return erreurRecu
        } else {
            const reponseRecu = await reponse.json()
            return reponseRecu
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du nouveau mot de passe :", error);
        throw error;
    }
} 
const code = "917214"
const newPassword = "Mit2712@dja"
 modifictaionMdp (key, code, newPassword)   
    .then((code) => {
        console.log("voici la reponse:", code);
    })
    .catch((error) => {console.error("Erreur lors de la création du code :", error);})
*/

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
            return info//localStorage.setItem(`infoConversaton : ${conversationId}`, JSON.stringify(info));
        }
    } catch (error) {
        console.error("Erreur lors de la recuperations des information d'une conversation :", error);
        throw error;
    }
}

const key="wksp_43bb0d0056273188e10830ef1db75c22"
const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjNmU2NDU3Yi0yNzVjLTQ3MTEtYTllZS04ZGMwOThkYTEyYWIiLCJlbWFpbCI6ImliYW5nYUBnbWFpbC5jb20iLCJ3b3Jrc3BhY2VLZXkiOiJ3a3NwXzQzYmIwZDAwNTYyNzMxODhlMTA4MzBlZjFkYjc1YzIyIiwiaWF0IjoxNzgzODAzNTUzLCJleHAiOjE3ODQ0MDgzNTN9.qT1jlF_-XGz7UC4OIzIVLYJMfKzpBgan7ze0iJ5Xa8Y"
const conversationId = "9cf66e4a-6125-4f95-80a3-cf8f9376c683"
await informationDuneConversation (key, token, conversationId)
.then(data =>{
        console.log("voici la reponse de backend", data)
})
.catch(error => console.log("ereur", error))