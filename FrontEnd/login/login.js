
/*async function recuperationApiIdentification() {
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: document.getElementById("email").value,//Bonne valeurs//
            password: document.getElementById("motDePasse").value //Bonne Valeurs----
        })
    });
    return reponse;//Le Token//
};*/

async function gestionConnexion() {
    const password = document.getElementById("motDePasse")
    const email = document.getElementById("email")
    
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

const data = await response.json();
        
console.log(data.token)
sessionStorage.setItem("token", data.token);
        if (data.token="undefined") {
            throw new Error('Problème avec la requête d\'authentification: ' + response.statusText);
        }

        
    } catch (error) {
        console.error('Erreur lors de la récupération du token:', error);
        throw error;
    }
}

const boutonConnexion = document.querySelector(".connexion");
if (boutonConnexion) {
    boutonConnexion.addEventListener('click', async function (event) {
        event.preventDefault();

        try {
            await gestionConnexion();
        } catch (error) {
            console.error(error);
        }
    });
}


// Récupération du token depuis la session et gestion de l'affichage des boutons admin
const token = sessionStorage.getItem("token");
const AlredyLogged = document.querySelector(".js-already-logged");

adminPanel();

function adminPanel() {
    document.querySelectorAll(".admin__modifier").forEach(a => {
        if (token !== null) {
            a.removeAttribute("aria-hidden");
            a.removeAttribute("style");
            AlredyLogged.innerHTML = "déconnexion"; // Correction de la faute de frappe
        }
    });
}

console.log(token);

//////




/////