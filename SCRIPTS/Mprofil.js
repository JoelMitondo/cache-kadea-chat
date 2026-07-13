const key="wksp_43bb0d0056273188e10830ef1db75c22"

//TRAITEMENT DE L'IMAGE ET LA PARTIE BIO

const CLOUD_NAME = 'fncbnumq'; 
const UPLOAD_PRESET = 'tous_chats'; // Le nom du preset Unsigned créé à l'étape 1

// 1. On cible les éléments
const photoContainer = document.getElementById('photo-container');
const photoInput = document.getElementById('profilePhoto');
const photoPlaceholder = document.getElementById('photo-placeholder');
const photoPreview = document.getElementById('photo-preview');
const photoCircle = document.getElementById('photo-circle');
const errorPhoto = document.getElementById('error-photo');

// Variable globale pour stocker le lien final Cloudinary
let urlImageCloudinary = "";


// 2. Quand on clique sur n'importe quel endroit du cercle, on simule un clic sur l'input caché
photoContainer.addEventListener('click', () => {
    photoInput.click(); // Ouvre l'explorateur de fichiers
});

// Quand une image est sélectionnée
photoInput.addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
        // 1. GESTION DE L'AFFICHAGE LOCAL (Instantané)
        errorPhoto.style.display = 'none';
        const localUrl = URL.createObjectURL(file);
        photoPreview.src = localUrl;
        photoPreview.classList.remove('hidden');
        photoPlaceholder.classList.add('hidden');
        photoCircle.classList.remove('border-dashed', 'border-gray-300', 'border-2');

        // 2. ENVOI VERS CLOUDINARY
        // Optionnel : tu pourrais afficher un petit spinner de chargement ici
        alert("Envoi de l'image vers Cloudinary en cours...");
        
        try {
            // On prépare les données à envoyer
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            // On fait la requête vers l'API Cloudinary
            const reponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });

            // On convertit la réponse en JSON
            const data = await reponse.json();

            // Cloudinary nous renvoie un lien sécurisé (https) de l'image ! que l'on stocke en local pour l'utiliser après.
            urlImageCloudinary = data.secure_url;
            alert("Succès ! Voici le lien de ton image :"+ urlImageCloudinary);
             
            
            

            // Tu peux maintenant utiliser ce lien quand l'utilisateur cliquera sur "Save & Continue"

        } catch (erreur) {
            console.error("Erreur lors de l'envoi à Cloudinary :", erreur);
            errorPhoto.textContent = "Erreur lors du téléchargement de l'image. Veuillez réessayer.";
            errorPhoto.style.display = 'block';
        }

    } else {
        errorPhoto.textContent = "Le fichier doit être une image (JPG ou PNG).";
        errorPhoto.style.display = 'block';
        photoInput.value = '';
    }
});

const btnProfilEtBio = document.querySelector(".btnProfilEtBio")
btnProfilEtBio.addEventListener("click", async (event)=>{
    event.preventDefault()
    const urlPhoto = urlImageCloudinary;
    const token = localStorage.getItem('token')
    const contenuBio = document.getElementById("contenuBio").value
    await mPhotoAndBio(key, token, contenuBio, urlPhoto)
    .then(data => {
        if (data.success) {
        console.log("Profil mis à jour avec succès !", data);
        window.location.replace("profil.html")
        } else {
        console.error("L'API a refusé la modification :", data.message);
        }
  })
  .catch(error => console.error("Erreur réseau :", error))

})

//function pour la modification de la photo de profil et le bio
async function mPhotoAndBio(key, token, contenuBio, urlPhoto) {
    try{
        const reponse = await fetch('https://kadea-chat-api.onrender.com/users/me', {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': key,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                avatarUrl: urlPhoto,
                bio: contenuBio 
                })
            })
        if(!reponse.ok){
            const erreurData = await reponse.json()
            console.error("Erreur du serveur : ", errorData)
            return
        }
        const reponseData = await reponse.json()
        alert("ca va awa")
        return reponseData
    }
    catch(error){
        console.error("voici l'erreur", error)
    }    
}


