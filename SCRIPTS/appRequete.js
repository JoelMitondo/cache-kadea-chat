async function connexion(email, password){
    try {
        const reponse = await fetch("https://kadea-chat-api.onrender.com/auth/login", {
            method : "POST",
            body : JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json",
                "x-api-key": key
            }
        })
        const resultData = await reponse.json()
        if(reponse.ok){
            alert("Connexion réussie !");
            // Stocker le token dans le localStorage pour une utilisation ultérieure
            localStorage.setItem('token', resultData.data.token);
        }else{
            console.log("Erreur de connexion :" + resultData);
        }
    } catch(error){
        alert("Erreur lors de la connexion :" + error);
    }
}