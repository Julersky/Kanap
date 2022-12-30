let cart = JSON.parse(localStorage.getItem("cart")) ?? [];//Si le panier contient des éléments on retourne ces derniers au format JSON sinon on créer un array cart vide

let products = [];

// Récuperer les elements de la BDD
const getDataFromApi = async () => {
  await fetch("http://localhost:3000/api/products/")
    .then((res) => {
      return res.json(); //Transformer les elements en JSON
    })
    .then((items) => {
      products = items;
      if (cart == null || cart == undefined || cart.length == 0) {//Affichage d'un <p> si le panier est vide 
        let cartItemsSelector = document.getElementById("cart__items");
        let errorText = document.createElement("p");
        errorText.innerHTML = "Votre panier est vide !";
        errorText.style.fontSize = "35px";
        errorText.style.display = "flex";
        errorText.style.justifyContent = "center";

        cartItemsSelector.appendChild(errorText);

        let cartOrderSelector = document.getElementsByClassName("cart__order");

        cartOrderSelector[0].style.display = "none";//Si le panier est vide on masque le formulaire
      } else {//Si le panier n'est pas vide on initialise le prix total et le nmb d'article(s)
        let priceSum = 0;
        let totalQuantity = 0;
        const cartProductsSelector = document.getElementById("cart__items");
        let productsToDipslay = "";

        for (let product of cart) {
          const cartDisplay = cartProductsSelector.innerHTML;

          //Recuperation des données de la BDD et les ajouter au localStorage
          for (let item of items) { //Jointure des données du localStorage et de la BDD
            if (product.productId == item._id) {
              product.productPrice = item.price;
              product.productName = item.name;
              product.productImg = item.imageUrl;
              product.productAltText = item.altTxt;
              totalQuantity += product.productQuantity;
            }
          };


            let articleSelector = document.createElement("article");
            articleSelector.setAttribute("class", "cart__item");
            articleSelector.setAttribute("data-id", product.productId);
            articleSelector.setAttribute("data-color", product.productColor);
   
            let divImg = document.createElement("div");
            divImg.setAttribute("class","cart__item__img");
            let img = document.createElement("img");
            img.setAttribute("src", product.productImg);
            img.setAttribute("alt", product.productAltText);

            let divContent = document.createElement("div");
            divContent.setAttribute("class","cart__item__content");
            let divDesc = document.createElement("div");
            divDesc.setAttribute("class","cart__item__content__description");           
            let hName = document.createElement("h2");
            hName.innerHTML = product.productName;
            let pColor = document.createElement("p");
            pColor.innerHTML = product.productColor;
            let pPrice = document.createElement("p");
            pPrice.innerHTML = product.productPrice + ",00 €";

            let divSettings = document.createElement("div");
            divSettings.setAttribute("class","cart__item__content__settings");
            let divSettingsQuantity = document.createElement("div");
            divSettingsQuantity.setAttribute("class","cart__item__content__settings__quantity");
            let pQuantity = document.createElement("p");
            pQuantity.innerHTML = "Qté : ";

            let inputQuantity = document.createElement("input");    
            inputQuantity.setAttribute("type","number");        
            inputQuantity.setAttribute("class","itemQuantity");       
            inputQuantity.setAttribute("name","itemQuantity");       
            inputQuantity.setAttribute("min","1");       
            inputQuantity.setAttribute("max","100");       
            inputQuantity.setAttribute("value",product.productQuantity);

            let divSettingsDelete = document.createElement("div");
            divSettingsDelete.setAttribute("class","cart__item__content__settings__delete");
            let pDelete = document.createElement("p");
            pDelete.setAttribute("class","deleteItem");
            pDelete.innerHTML = "Supprimer";

            

            cartProductsSelector.insertAdjacentElement("afterbegin",articleSelector);
            articleSelector.insertAdjacentElement("afterbegin",divImg);
            articleSelector.insertAdjacentElement("beforeend",divContent);
            divContent.insertAdjacentElement("afterbegin",divDesc);
            divContent.insertAdjacentElement("beforeend",divSettings);
            divSettings.insertAdjacentElement("afterbegin",divSettingsQuantity);
            divSettings.insertAdjacentElement("beforeend",divSettingsDelete);
            divSettingsDelete.insertAdjacentElement("afterbegin",pDelete);
            divSettingsQuantity.insertAdjacentElement("afterbegin",pQuantity);
            divSettingsQuantity.insertAdjacentElement("beforeend",inputQuantity);

            divImg.appendChild(img);
            divDesc.appendChild(hName);
            divDesc.appendChild(pColor);
            divDesc.appendChild(pPrice);
        }
      }

      deleteFromCart();

      modifyQuantity();

      calculateTotalProductInCart();

      calculateTotalCartPrice();
    })
    .catch((error) => {
      alert(
        "Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter"
      );
    });
};

getDataFromApi();

//Les fonctions permettant de modifier la quantité d'un produit, le supprimer et recalculer le prix total ainsi que le nombre de produits.//

function deleteFromCart() {
  let deleteFromCartButton = document.getElementsByClassName("deleteItem");

  for (let i = 0; i < deleteFromCartButton.length; i++) {//Pour chaque bouton supprimer on créer un EventListener 'click' avec un confirm
    deleteFromCartButton[i].addEventListener("click", (e) => {
      e.preventDefault();

      let confirmation = confirm("Voulez-vous supprimer ce produit ?");

      if (confirmation) {//Si la suppression est confirmée on va selectionner le parent et recuperer l'id et la couleur du produit
        let articleSelector =
          deleteFromCartButton[i].parentNode.parentNode.parentNode.parentNode;

        let productId = articleSelector.getAttribute("data-id");

        let productColor = articleSelector.getAttribute("data-color");

        for (let j = 0; j < cart.length; j++) {// Si la couleur et l'id du produit à supprimer correspondent à un element dans le localStorage on le supprime dans le cart et dans le DOM
          if (
            cart[j].productColor == productColor &&
            cart[j].productId == productId
          ) {
            cart.splice(j, 1);

            articleSelector.remove();

            localStorage.setItem("cart", JSON.stringify(cart));
          }
        }

        if (cart == null || cart == undefined || cart.length == 0) {//Affichage d'un <p> si tous les éléments sont supprimés et que le panier est vide  
          let cartItemsSelector = document.getElementById("cart__items");
          let errorText = document.createElement("p");
          errorText.innerHTML = "Votre panier est vide !";
          errorText.style.fontSize = "35px";
          errorText.style.display = "flex";
          errorText.style.justifyContent = "center";

          cartItemsSelector.appendChild(errorText);

          let cartOrderSelector =
            document.getElementsByClassName("cart__order");

          cartOrderSelector[0].style.display = "none";
        }

        calculateTotalProductInCart();

        calculateTotalCartPrice();
      }
    });
  }
}

function calculateTotalProductInCart() {
  cart = JSON.parse(localStorage.getItem("cart")) ?? [];

  let totalQuantitySelector = document.getElementById("totalQuantity");

  let totalProductInCart = 0;

  for (let product of cart) {
    totalProductInCart = totalProductInCart + parseInt(product.productQuantity);//Somme de tout les productQuantity du cart
  }

  totalQuantitySelector.innerText = totalProductInCart;

  return totalProductInCart;
}

function calculateTotalCartPrice() {
  cart = JSON.parse(localStorage.getItem("cart")) ?? [];

  let totalPriceSelector = document.getElementById("totalPrice");

  let totalartPrice = 0;

  for (let product of cart) {
    for (let item of products) {
      if (item._id === product.productId) {//Si l'id du produit dans le cart =  l'id du produit dans la BDD on créer la somme des prix  
        totalartPrice =
          totalartPrice + parseInt(product.productQuantity) * item.price;
      }
    }
  }
  totalPriceSelector.innerText = totalartPrice;

  return totalartPrice;
}

function modifyQuantity() {
  let quantitySelector = document.getElementsByClassName("itemQuantity");

  for (let i = 0; i < quantitySelector.length; i++) {
    let articleSelector =
      quantitySelector[i].parentNode.parentNode.parentNode.parentNode;

    let productId = articleSelector.getAttribute("data-id");

    let productColor = articleSelector.getAttribute("data-color");

    quantitySelector[i].addEventListener("change", () => {//Des que la quantité est modifiée et que l'id de l'élément = un id dans le cart on change la quantité dans le cart
      let newQuantity = parseInt(quantitySelector[i].value);
      for (let j = 0; j < cart.length; j++) {
        if (
          cart[j].productColor == productColor &&
          cart[j].productId == productId
        ) {
          if (newQuantity > 0 && newQuantity <= 100) {// Si la nouvelle quantité n'est pas comprise entre 1 et 100 elle n'est pas prise en compte et l'ancienne valeur est gardée
            cart[j].productQuantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(cart));
          } else {
            alert(
              "Veuillez choisir une quantité valide comprise entre 1 et 100."
            );
            quantitySelector[i].value = cart[j].productQuantity;
          }
        }
      }
      calculateTotalProductInCart(); //Recalcul du nombre d'articles total + le prix total

      calculateTotalCartPrice();
    });
  }
}

//Les fonctions pour le formulaire de confirmation (RegExp)//

let confirmationForm = document.querySelector(".cart__order__form");

//Fonctions sur chaque champs du formulaire

confirmationForm.firstName.addEventListener("change", function () {
  validFirstName(this);
});

confirmationForm.lastName.addEventListener("change", function () {
  validLastName(this);
});

confirmationForm.address.addEventListener("change", function () {
  validAdress(this);
});

confirmationForm.city.addEventListener("change", function () {
  validCity(this);
});

confirmationForm.email.addEventListener("change", function () {
  validEmail(this);
});

function validFirstName(FirstName) { //RegExp 
  let isvalidFirstName = false;
  let firstNameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç'\S,.'-]{3,15}$");
  let testFirstName = firstNameRegExp.test(FirstName.value);
  let FirstNameMessageSelector = document.getElementById("firstNameErrorMsg");
  if (!testFirstName) {
    FirstNameMessageSelector.innerHTML =
      "Prénom invalide! Veuillez spécifier un nom sans caractères numériques, sans espaces avec un longueur minimum de 3 caractères et au maximum 15 caractères.Pour les prénoms composés utilisez le \"-\".";
  } else {
    FirstNameMessageSelector.innerHTML = "";
    isvalidFirstName = true;
  }
  return isvalidFirstName;
}

function validLastName(LastName) {
  let isValidLastName = false;
  let lastNameRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç'\S,.'-]{3,15}$");
  let testLastName = lastNameRegExp.test(LastName.value);
  let LastNameMessageSelector = document.getElementById("lastNameErrorMsg");
  if (!testLastName) {
    LastNameMessageSelector.innerHTML =
      "Nom invalide! Veuillez spécifier un nom sans caractères numériques, sans espaces avec un longueur minimum de 3 caractères et au maximum 15 caractères.Pour les noms composés utilisez le \"-\". ";
  } else {
    LastNameMessageSelector.innerHTML = "";
    isValidLastName = true;
  }
  return isValidLastName;
}

function validAdress(adress) {
  let isValidAdress = false;
  let adressRegExp = new RegExp(
    "^[0-9]{1,3}[a-z]{0,3}[,. ]{1}[ ]{0,1}[-a-zA-Zàâäéèêëïîôöùûüç']+"
  );
  let testAdress = adressRegExp.test(adress.value);
  let adressMessageSelector = document.getElementById("addressErrorMsg");
  if (!testAdress) {
    adressMessageSelector.innerHTML =
      "Adresse invalide! Veuillez spécifier le numéro de la rue suivi des détails de l'adresse.";
  } else {
    adressMessageSelector.innerHTML = "";
    isValidAdress = true;
  }
  return isValidAdress;
}

function validCity(city) {
  let isValidCity = false;
  let cityRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç,.'-\S]+$");
  let testCity = cityRegExp.test(city.value);
  let cityMessageSelector = document.getElementById("cityErrorMsg");
  if (!testCity) {
    cityMessageSelector.innerHTML =
      "Ville invalide! Veuillez spécifier une ville sans caractères numériques ni caractères speciaux.";
  } else {
    cityMessageSelector.innerHTML = "";
    isValidCity = true;
  }
  return isValidCity;
}

function validEmail(email) {
  let isValidEmail = false;
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$" 
  );
  let testEmail = emailRegExp.test(email.value);
  let emailMessageSelector = document.getElementById("emailErrorMsg");
  if (!testEmail) {
    emailMessageSelector.innerHTML =
      "Adresse mail invalide! Veuillez fournir une adresse mail au format abc@example.com";
  } else {
    emailMessageSelector.innerHTML = "";
    isValidEmail = true;
  }
  return isValidEmail;
}

//Envoi du formulaire + commande au back//

const btnOrder = document.querySelector(".cart__order__form");

btnOrder.addEventListener("submit", function (e) {
  e.preventDefault();

  let confirmation = confirm("Voulez-vous valider votre panier?");

  if (confirmation) {//Apres confirmation par le client et si toute les regexp sont passées on POST les informations
    if (cart != null && cart != undefined && cart.length > 0) {
      let isvalidFirstName = validFirstName(confirmationForm.firstName);
      let isValidLastName = validLastName(confirmationForm.lastName);
      let isValidAdress = validAdress(confirmationForm.address);
      let isValidCity = validCity(confirmationForm.city);
      let isValidEmail = validEmail(confirmationForm.email);

      if (
        isvalidFirstName &&
        isValidLastName &&
        isValidAdress &&
        isValidCity &&
        isValidEmail
      ) {
        let products = [];
        for (let product of cart) {
          products.push(product.productId);
        }

        const orderData = {//Structure de la requete (trouvée dans le fichier back/controllers/product.js)
          contact: {
            firstName: confirmationForm.firstName.value,
            lastName: confirmationForm.lastName.value,
            address: confirmationForm.address.value,
            city: confirmationForm.city.value,
            email: confirmationForm.email.value,
          },
          products: products,
        };

        fetch("http://localhost:3000/api/products/order", {//Fetch API avec methode POST
          method: "POST",
          body: JSON.stringify(orderData),
          headers: {
            "Content-Type": "application/json",
            "Acces-Control-Allow-Origin": "*",
          },
        })
          .then(function (res) {//Retour des informations au format JSON
            return res.json();
          })
          .then(function (data) {//Une fois les informations récupérées on se redirige vers la page confirmation qui contient dans son URL l'orderID
            window.location.href = `confirmation.html?orderId=${data.orderId}`;
          })
          .catch(function (error) {
            alert(
              "Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter"
            );
          });
      } else {
        alert(
          "Un ou plusieurs champs du formulaire sont incorrect ou non fournis."
        );
      }
    } else {
      alert("Votre panier est vide.");
    }
  }
});
