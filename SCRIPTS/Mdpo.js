const key="wksp_43bb0d0056273188e10830ef1db75c22"
//function pour la récuperation du mot de passe oublié
async function recuperationMdpO (key, email) {
    try{
        const reponse = await fetch("https://kadea-chat-api.onrender.com/auth/forgot-password", {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key
            },
            body: JSON.stringify({
                email : email 
                })
        })
        if(!reponse.ok){
            const erreurRecu =  await reponse.jsaon()  
            alert("erreur 1") 
            return erreurRecu
        } else {
            const reponseRecu = await reponse.json()
            alert("c'est okey")
            return reponseRecu
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du code pour la recuperation du compte :", error);
        throw error;
    }
}

//function pour modifier le mot de passe en fonction du code recu
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
            const erreurRecu =  await reponse.jsaon()   
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




const emailDuMdpO = document.getElementById("emailDuMdpO")
const btnMdpO = document.getElementById("btnMdpO")
const divSaisirCode = document.getElementById("div-saisir-code")
btnMdpO.addEventListener("click", async (event)=>{
    event.preventDefault()
    const email = emailDuMdpO.value
    await recuperationMdpO(key, email)
    .then(response => response.json())
    .then((code) => {
        console.log("voici la reponse:", code);
        const divEmail = document.getElementById("div-email") 
        const divSaisirCode = document.getElementById("div-saisir-code")
        divEmail.classList.add("hidden");
        divSaisirCode.classList.remove("hidden")
        divSaisirCode.classList.add("block")
        const userEmail = document.getElementById("user-email")
        userEmail.textContent=emailDuMdpO.value
    })
    .catch((error) => {console.error("Erreur lors de la création du code :", error);})
})

const btnSoumissionCode = document.getElementById("btnSoumissionCode")
btnSoumissionCode.addEventListener("click", (event)=>{
    event.preventDefault()
    const divNewPassword = document.getElementById("div-password") 
    divSaisirCode.classList.add("hidden")
    divNewPassword.classList.remove("hidden")
    divNewPassword.classList.add("block")
})

const modificatioMdp = document.getElementById("modificatioMdp")
modificatioMdp.addEventListener("click", async (event)=>{
    event.preventDefault()
    const email = emailDuMdpO.value
    const code = document.getElementById("verification-code").value
    const newPassword = document.getElementById("confirm-password").value
    await modifictaionMdp (key, code, newPassword)
    .then(response => response.json())
    .then((reponse) => {
        console.log("voici la reponse:", reponse);
    })
    .catch((error) => {console.error("Erreur lors de la changement du mot de passe :", error);})
})