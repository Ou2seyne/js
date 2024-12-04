document.addEventListener("DOMContentLoaded", function () {
  // Affichage du modal de connexion
  document.getElementById("view-connexion").addEventListener("click", function () {
    document.getElementById("connexion-modal").classList.remove("hidden");
  });

  // Affichage du modal d'inscription
  document.getElementById("view-inscription").addEventListener("click", function () {
    document.getElementById("inscription-modal").classList.remove("hidden");
  });

  // Fermeture du modal de connexion
  document.getElementById("close-connexion-modal").addEventListener("click", function () {
    document.getElementById("connexion-modal").classList.add("hidden");
  });

  // Fermeture du modal d'inscription
  document.getElementById("close-inscription-modal").addEventListener("click", function () {
    document.getElementById("inscription-modal").classList.add("hidden");
  });

  // Gestion du formulaire de connexion
  document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://s3-4662.nuage-peda.fr/forum/api/authentication_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Connexion réussie !");
        localStorage.setItem("token", result.token);
        document.getElementById("connexion-modal").classList.add("hidden");
        loadArticleDetail();
      } else {
        alert("Échec de la connexion.");
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      alert("Une erreur est survenue.");
    }
  });

  // Gestion du formulaire d'inscription
  document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email-signup").value;
    const password = document.getElementById("password-signup").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://s3-4662.nuage-peda.fr/forum/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/ld+json" },
        body: JSON.stringify({ email, password, firstName: prenom, lastName: nom }),
      });

      if (response.ok) {
        alert("Inscription réussie !");
        document.getElementById("inscription-modal").classList.add("hidden");
      } else {
        alert("Échec de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur d'inscription", error);
      alert("Une erreur est survenue.");
    }
  });

  // Chargement d'un article
  function loadArticleDetail() {
    const messagesId = 1; // Exemple d'ID d'article
    fetch(`http://s3-4131.nuage-peda.fr/forum/api/messages/${messagesId}`)
      .then(response => response.json())
      .then(data => {
        const articleDiv = document.getElementById("article-detail");
        articleDiv.innerHTML = `
          <h2 class="text-2xl font-bold mb-4">${data.title}</h2>
          <p class="text-gray-700">${data.content}</p>
          <p class="text-sm text-gray-500 mt-2">Publié le ${new Date(data.createdAt).toLocaleDateString()}</p>
        `;
        articleDiv.classList.remove("hidden");
      })
      .catch(error => {
        console.error("Erreur de chargement d'article", error);
        alert("Impossible de charger l'article.");
      });
  }
});
