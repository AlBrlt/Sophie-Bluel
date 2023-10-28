
async function recuperationApiIdentification() {
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("motDePasse").value
        })
    });
    return reponse;
};


function verificationDesIdentifiants() {

    const formulaire = document.querySelector(".formulaire")

    formulaire.addEventListener('submit', function(event) {
        event.preventDefault();
    });
    
    const boutonConnexion = document.querySelector(".connexion")
    
    boutonConnexion.addEventListener('click', async function(event) {
        event.preventDefault();

        try {
            /*
            Appelle la fonction recuperationApiIdentification pour faire la requête HTTP
            d'identification.
            */
           const reponse = await recuperationApiIdentification()
           console.log(reponse.status)


           if (reponse.ok) {
            const contenu = await reponse.json()
            console.log(contenu)
            console.log(contenu.token)

            let ChangementEtatToken = JSON.stringify(contenu.token)
            sessionStorage.setItem("token", ChangementEtatToken);

            let stockageToken = sessionStorage.getItem("token")

            let recuperationToken = JSON.parse(stockageToken)
            console.log(stockageToken)
            console.log(recuperationToken)

            window.location.href = "/index.html";

           } else if (reponse.status == 401 || reponse.status == 404) {

            const alerteErreur = document.querySelector(".alerteErreur");
            alerteErreur.textContent = "Identifiant ou mot de passe incorrect !";
    
            function cacheAlerteEmail() {
                alerteErreur.textContent = "";
            }
            setTimeout(cacheAlerteEmail, 2000)


           }

        } catch (error) {
            console.error(error);
        }
    });
}

verificationDesIdentifiants()