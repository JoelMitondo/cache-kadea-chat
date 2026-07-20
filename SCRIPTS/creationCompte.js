//ma clef 
const key ="wksp_43bb0d0056273188e10830ef1db75c22"
//function qui gère la creation du compte
async function creationCompte(nom, prenom, email, password) {
    try{
        const reponse = await fetch("https://kadea-chat-api.onrender.com/auth/register", {
            method : "POST",
            headers : {
                "content-type" : "application/json",
                "x-api-key" : key
            },
            body: JSON.stringify({
                fullName: `${prenom} ${nom}`,
                email: email,
                password: password,
            })
        });

        // 1. GESTION DES ERREURS HTTP (ex: 400, 401, 500)
        if (!reponse.ok) {
            // Le serveur a répondu, mais avec une erreur.
            // On convertit la réponse en JSON pour lire le message d'erreur du backend
            const errorData = await reponse.json();
            
            // On affiche toute l'erreur dans la console pour toi, le développeur
            console.error("Détails de l'erreur backend :", errorData);
            
            // On extrait le message pour l'utilisateur (la clé 'message' dépend de comment l'API est codée)
            const messageBackend = errorData.message || errorData.error || "Informations invalides.";
            
            // On arrête la fonction ici pour ne pas exécuter la suite
            return; 
        }

        // 2. SUCCÈS : Si reponse.ok est true (statut 200 ou 201)
        const data = await reponse.json();
        
        window.location.replace('connexion.html');

    } catch(error) {
        // 3. GESTION DES ERREURS RÉSEAU UNIQUEMENT
        console.error('Erreur réseau ou critique', error);
    }
}

//creation des variables qui seront utilisé pour stocker les information qui irons via API d'enregistrement.

const nomUtilisateur = document.getElementById('Name');
const prenomUtilisateur = document.getElementById('prenom');
const emailEnregistrement = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const btnCreationCompte = document.getElementById('btnCreationCompte');
const erreurNbreCaractere = document.getElementById('error-pwd-length');
const erreurPwdLettre = document.getElementById('error-pwd-letter');
const erreurNombre = document.getElementById('error-pwd-number');
const erreurCaractereSpeciaux = document.getElementById('error-pwd-special');
const erreurUn = document.querySelector(".erreurUn");
const erreurDeux = document.querySelector(".erreurDeux")
const erreurTrois = document.querySelector(".erreurTrois")
const erreurQuatre = document.querySelector(".erreurQuatre")
const erreurPwdConfirme = document.getElementById('error-confirmPwd');

const confirmationFormulaire = {
    confirmNom:false,
    confirmPrenom:false,
    confirmEmail:false,
    confirPassword:false,
    confirConfirPassword:false
}

function verificationNumbreEtCaractereSpeciaux(saisi, messageErreur){
    const testNombre = /[0-9]/.test(saisi);
    const testCaractere = /[^a-zA-Z0-9]/.test(saisi)
    let toutEstOk = false
        if(testNombre && !testCaractere){
            messageErreur.classList.remove('hidden');
            messageErreur.classList.add('block');
            messageErreur.textContent="Pas des chiffres dans ce champs"
        }else if(testCaractere && !testNombre){
            messageErreur.classList.remove('hidden');
            messageErreur.classList.add('block');
            messageErreur.textContent="Pas des caractères speciaux dans ce champs"
        }else if(testNombre && testCaractere){
            messageErreur.classList.remove('hidden');
            messageErreur.classList.add('block');
            messageErreur.textContent="Pas de chiffre ni caractères speciaux dans ce champs"
        }else{
            messageErreur.classList.remove('block');
            messageErreur.classList.add('hidden');
            return true
        }
}
//verification du nom
nomUtilisateur.addEventListener('input', (event)=>{
    let texteSaisi=event.target.value;
    let erreurNom = document.getElementById('erreur-nom');
    verificationNumbreEtCaractereSpeciaux(texteSaisi, erreurNom)
    if(verificationNumbreEtCaractereSpeciaux(texteSaisi, erreurNom) === true){
        confirmationFormulaire.confirmNom=true 
    } else {
        confirmationFormulaire.confirmNom=false
    }

})

//verification du prenom
prenomUtilisateur.addEventListener('input', (event)=>{
    let texteSaisi=event.target.value;
    let erreurPrenom = document.getElementById('erreur-prenom');
    verificationNumbreEtCaractereSpeciaux(texteSaisi, erreurPrenom)
    if(verificationNumbreEtCaractereSpeciaux(texteSaisi, erreurPrenom) === true){
        confirmationFormulaire.confirmPrenom=true 
    } else {
        confirmationFormulaire.confirmPrenom=false
    }

})

//verification de email
emailEnregistrement.addEventListener('blur', (event)=>{
    const texteSaisi = event.target.value
    const erreurMail = document.getElementById('erreur-email');
    const testEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(texteSaisi)

    if(!testEmail){
        erreurMail.classList.remove("hidden")
        erreurMail.classList.add("block")
        erreurMail.textContent="Veillez mettre une bonne adresse email.. ex : mitondojoel@gmail.com"
        confirmationFormulaire.confirmEmail=false
    }else{
        erreurMail.classList.remove("block")
        erreurMail.classList.add("hidden")
        confirmationFormulaire.confirmEmail=true
    }
})

//verification du mot de passe
password.addEventListener('input', (event)=>{
    const texteSaisi =event.target.value;
    const testNombre = /[0-9]/.test(texteSaisi);
    const testLettre = /[a-zA-Z]/.test(texteSaisi);
    const testCaractere = /[^a-zA-Z0-9]/.test(texteSaisi);
    
    //Verification nombre des lettres
    if(texteSaisi.length >= 8){
        erreurNbreCaractere.classList.remove("text-red-500")
        erreurNbreCaractere.classList.add("text-green-800")
        erreurUn.src= "./../IMAGES/ICONES/checkGreen.svg"
        confirmationFormulaire.confirPassword=true
    } else{
        erreurNbreCaractere.classList.remove("text-green-800")
        erreurNbreCaractere.classList.add("text-red-500")
        erreurUn.src= "./../IMAGES/ICONES/closeRed.svg"
        confirmationFormulaire.confirPassword=false
    }

    //Verification Nombre
    if(testNombre){
        erreurNombre.classList.remove("text-red-500")
        erreurNombre.classList.add("text-green-800")
        erreurTrois.src= "./../IMAGES/ICONES/checkGreen.svg"
        confirmationFormulaire.confirPassword=true
    } else{
        erreurNombre.classList.remove("text-green-800")
        erreurNombre.classList.add("text-red-500")
        erreurTrois.src= "./../IMAGES/ICONES/closeRed.svg"
        confirmationFormulaire.confirPassword=false
    }

    //Verification Existence Lettre
    if(testLettre){
        erreurPwdLettre.classList.remove("text-red-500")
        erreurPwdLettre.classList.add("text-green-800")
        erreurDeux.src= "./../IMAGES/ICONES/checkGreen.svg"
        confirmationFormulaire.confirPassword=true
    }else{
        erreurPwdLettre.classList.remove("text-green-800")
        erreurPwdLettre.classList.add("text-red-500")
        erreurDeux.src= "./../IMAGES/ICONES/closeRed.svg"
        confirmationFormulaire.confirPassword=false
    }

    //Verification caractere special
    if(testCaractere){
        erreurCaractereSpeciaux.classList.remove("text-red-500")
        erreurCaractereSpeciaux.classList.add("text-green-800")
        erreurQuatre.src= "./../IMAGES/ICONES/checkGreen.svg"
        confirmationFormulaire.confirPassword=true
    }else{
        erreurCaractereSpeciaux.classList.remove("text-green-800")
        erreurCaractereSpeciaux.classList.add("text-red-500")
        erreurQuatre.src= "./../IMAGES/ICONES/closeRed.svg"
        confirmationFormulaire.confirPassword=false
    }
})

//verification de la conformité de mot de passe
confirmPassword.addEventListener('input', (event)=>{
    let passewordEcrit = event.target.value
    let passewordDonne=document.getElementById('password').value

    if (passewordDonne === passewordEcrit){
        erreurPwdConfirme.classList.remove("block")
        erreurPwdConfirme.classList.add("hidden")
        confirmationFormulaire.confirConfirPassword=true
    } else{
        erreurPwdConfirme.classList.remove("hidden")
        erreurPwdConfirme.classList.add("block")
        confirmationFormulaire.confirConfirPassword=false   
    }

})

//soumissions du formulaire après verification
btnCreationCompte.addEventListener('click', (event)=>{
    event.preventDefault()
    if(!confirmationFormulaire.confirmNom ||
    !confirmationFormulaire.confirmPrenom ||
    !confirmationFormulaire.confirmEmail ||
    !confirmationFormulaire.confirPassword ||
    !confirmationFormulaire.confirConfirPassword){
        alert("remplie ")
    }else{
    const blocInformationCompte=document.getElementById("blocInformationCompte")
    blocInformationCompte.classList.add("hidden")
    const blocRecaputilatif=document.getElementById("blocRecaputilatif")
    blocRecaputilatif.classList.remove("hidden")
    blocRecaputilatif.classList.add("block")
    const nom = document.getElementById('Name').value; 
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const fullName = `${prenom} ${nom}`
    const recapPrenom = document.getElementById('recap-prenom');
    recapPrenom.textContent = prenom;
    const recapNom = document.getElementById('recap-nom');
    recapNom.textContent = nom;
    const recapEmail = document.getElementById('recap-email');
    recapEmail.textContent = email;
    }

})


const btn_create_account=document.getElementById("btn-create-account");
btn_create_account.addEventListener("click", async (event)=>{
    event.preventDefault()
    const nom = document.getElementById('Name').value; 
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await creationCompte(nom, prenom, email, password);
})
