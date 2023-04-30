const displayProductData = async () => {
  await fetch("http://localhost:3000/api/products/")
  // Récupération de la BDD avec fetch
    .then((res) => res.json()) // Transformer en JSON les données
    .then((products) => {
      const itemsSelector = document.getElementById("items");// Navigation dans le DOM pour indiquer l'emplacement où on veut creer des éléments
      for (let item of products) {//Pour chaque élément de la BDD on créer des éléments HTML
        let productLinkSelector = document.createElement("a");
        productLinkSelector.href = "product.html?id=" + item._id;
        let productArticleSelector = document.createElement("article");
        let productImgSelector = document.createElement("img");
        productImgSelector.src = item.imageUrl;
        productImgSelector.alt = item.alt;
        let productNameSelector = document.createElement("h3");
        productNameSelector.innerText = item.name;
        let productDescriptionSelector = document.createElement("p");
        productDescriptionSelector.innerText = item.description;
        productArticleSelector.appendChild(productImgSelector);
        productArticleSelector.appendChild(productNameSelector);
        productArticleSelector.appendChild(productDescriptionSelector);
        productLinkSelector.appendChild(productArticleSelector);
        itemsSelector.appendChild(productLinkSelector);
      }
    })
    .catch((error) => {//Message d'erreur si la création de ces éléments n'a pas pu avoir lieu
      alert(
        "Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter"
      );
    });
};

displayProductData();
