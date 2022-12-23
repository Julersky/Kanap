// Recuperer l'ID du lien//

let urlParam = new URLSearchParams(window.location.search);

let urlId = urlParam.get("id");

// Récuperer les elements de la BDD par l'ID du lien et les afficher//

const displayDataById = async () => {
  await fetch(`http://localhost:3000/api/products/${urlId}`)
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      alert(
        "Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter"
      );
    })
    .then((item) => {
      //Creation du titre//
      let productName = document.getElementById("title");
      productName.textContent = item.name;

      //Creation du nom d'onglet
      let tabTitle = document.getElementsByTagName("title")[0];
      tabTitle.innerText = item.name;

      //Creation du prix//
      let productPrice = document.getElementById("price");
      productPrice.textContent = item.price;

      //Creation de la description//
      let productDescription = document.getElementById("description");
      productDescription.textContent = item.description;

      //Creation de l'image//
      const imgSelector = document.getElementsByClassName("item__img")[0];
      const productImg = document.createElement("img");
      productImg.src = item.imageUrl;
      productImg.alt = item.altTxt;
      imgSelector.appendChild(productImg);

      // Creation de la liste deroulante des couleurs//
      const colorsSelector = document.getElementById("colors");
      for (color of item.colors) {
        const productColor = document.createElement("option");
        productColor.value = color;
        productColor.textContent = color;
        colorsSelector.appendChild(productColor);
      }
      addToCart(item);
    })
    .catch((error) => {
      alert(
        "Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter"
      );
    });
};
displayDataById();

//Récuperer les informations fournies par le client et les envoyer a un objet//

function addToCart(item) {
  let addToCartButton = document.getElementById("addToCart");//Navigation dans le DOM

  addToCartButton.addEventListener("click", () => {
    // Focus sur les données lors du clic
    let productColor = document.getElementById("colors").value;
    let productId = item._id;
    let productQuantity = parseInt(document.getElementById("quantity").value);

    //Message d'alerte pour la couleur
    if (productColor == undefined || productColor == "") {
      alert("Veuillez choisir une couleur valide.");
      return;
    }

    //Message d'alerte pour la quantité
    if (
      productQuantity == undefined ||
      productQuantity <= 0 ||
      productQuantity > 100
    ) {
      alert("Veuillez choisir une quantité valide comprise entre 1 et 100.");
      return;
    }

    //Création de l'objet new product avec les valeurs
    let newProduct = {
      productId: productId,
      productColor: productColor,
      productQuantity: productQuantity,
    };

    // Si rien dans le localStorage (si cart = null ou undefined )? Voir avec mentor
    let cart = JSON.parse(localStorage.getItem("cart")) ?? [];

    // Création d'une variable boolean pour savoir si un produit est présent dans le cart ou non
    let findProductInCart = false;

    //Incrementation si ajout du même produit avec la même couleur dans le cart
    for (let i = 0; i < cart.length; i++) {
      if (
        cart[i].productId == productId &&
        cart[i].productColor == productColor
      ) {
        findProductInCart = true; //Indiquer la présence d'un produit identique dans le cart
        cart[i].productQuantity = cart[i].productQuantity + productQuantity;
      }
    }

    //Si au clic le produit n'est pas présent dans le cart, on push le produit dans le cart (si findProductInCart est false)
    if (!findProductInCart) {
      cart.push(newProduct);
    }

    //Ajout du cart dans le localStorage + Alerte
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Votre produit a bien été ajouté au panier.");
  });
}
