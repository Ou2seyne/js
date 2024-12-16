document.addEventListener("DOMContentLoaded", function () {
  // Affichage des modaux (connexion et inscription)
  document.getElementById("view-connexion").addEventListener("click", function () {
    console.log("Bouton Connexion cliqué");
    const modal = document.getElementById("connexion-modal");
    modal.classList.remove("hidden");
  });

  document.getElementById("view-inscription").addEventListener("click", function () {
    console.log("Bouton Inscription cliqué");
    const modal = document.getElementById("inscription-modal");
    modal.classList.remove("hidden");
  });

  document.getElementById("close-connexion-modal").addEventListener("click", function () {
    const modal = document.getElementById("connexion-modal");
    modal.classList.add("hidden");
  });

  document.getElementById("close-inscription-modal").addEventListener("click", function () {
    const modal = document.getElementById("inscription-modal");
    modal.classList.add("hidden");
  });

  // Fonction pour empêcher l'utilisation de caractères invalides dans les champs prénom et nom
  function preventInvalidCharacters(event) {
    const regex = /[^a-zA-Z]/g;
    event.target.value = event.target.value.replace(regex, '');
  }

  const prenomInput = document.getElementById("prenom");
  const nomInput = document.getElementById("nom");

  if (prenomInput) {
    prenomInput.addEventListener("input", preventInvalidCharacters);
  }

  if (nomInput) {
    nomInput.addEventListener("input", preventInvalidCharacters);
  }

  // Soumission du formulaire de connexion
  document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://s3-4662.nuage-peda.fr/forum2/api/authentication_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Connexion réussie !");
        localStorage.setItem("token", result.token);
        document.getElementById("connexion-modal").classList.add("hidden");
        updateUIForLoggedInUser(); // Mise à jour de l'UI après connexion
        loadMessages(); // Charger les messages après la connexion
      } else {
        alert("Erreur de connexion. Veuillez vérifier vos identifiants.");
      }
    } catch (error) {
      alert("Erreur de connexion. Essayez plus tard.");
    }
  });

  // Soumission du formulaire d'inscription
  document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email-signup").value;
    const password = document.getElementById("password-signup").value;

    try {
      const response = await fetch("https://s3-4662.nuage-peda.fr/forum2/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, nom, email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Inscription réussie !");
        document.getElementById("inscription-modal").classList.add("hidden");
      } else {
        alert("Erreur lors de l'inscription.");
      }
    } catch (error) {
      alert("Erreur lors de l'inscription. Essayez plus tard.");
    }
  });

  // Fonction pour charger les messages avec pagination
  function loadMessages(page = 1) {
    const itemsPerPage = 5; // Limiter l'affichage à 5 messages par page
    fetch(`https://s3-4662.nuage-peda.fr/forum2/api/messages?page=${page}&itemsPerPage=${itemsPerPage}`)
      .then(response => response.json())
      .then(data => {
        const messagesDiv = document.getElementById("message-detail");
        messagesDiv.innerHTML = ""; // Effacer le contenu existant

        // Trier les messages par date de publication (ordre décroissant)
        data["hydra:member"].sort((a, b) => new Date(b.datePoste) - new Date(a.datePoste));

        // Rendre dynamiquement les messages
        data["hydra:member"].forEach(message => {
          messagesDiv.innerHTML += `
            <div class="message p-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300">
              <h2 class="text-2xl font-semibold text-gray-800">${message.titre}</h2>
              <p class="text-gray-700 mt-2">${message.contenu}</p>
              <p class="text-sm text-gray-500 mt-2">Publié par ${message.user.prenom} ${message.user.nom} le ${new Date(message.datePoste).toLocaleDateString()}</p>
            </div>
          `;
        });
      });
  }

  // Met à jour l'interface utilisateur en fonction de l'état de connexion
  function updateUIForLoggedInUser() {
    const token = localStorage.getItem("token");
    const nav = document.querySelector("nav");

    if (token) {
      document.getElementById("view-connexion").classList.add("hidden");
      document.getElementById("view-inscription").classList.add("hidden");

      let logoutButton = document.getElementById("logout-button");
      if (!logoutButton) {
        logoutButton = document.createElement("button");
        logoutButton.id = "logout-button";
        logoutButton.innerHTML = "Se déconnecter";
        logoutButton.classList.add("bg-red-600", "text-white", "py-2", "px-4", "rounded-md", "hover:bg-red-700", "focus:outline-none");
        logoutButton.addEventListener("click", function () {
          localStorage.removeItem("token");
          updateUIForLoggedInUser();
          loadMessages(); // Recharger les messages après la déconnexion
        });
        nav.appendChild(logoutButton);
      }
    } else {
      document.getElementById("view-connexion").classList.remove("hidden");
      document.getElementById("view-inscription").classList.remove("hidden");

      const logoutButton = document.getElementById("logout-button");
      if (logoutButton) {
        logoutButton.remove();
      }
    }
  }

  updateUIForLoggedInUser(); // Vérifier l'état de connexion au chargement de la page
  loadMessages(); // Toujours charger les messages, même sans connexion
});
