let cart = JSON.parse(localStorage.getItem('cart')) ?? [];

let products = [];

// Récuperer les elements de la BDD
const getDataFromApi = async () => {
  await fetch('http://localhost:3000/api/products/')
    .then(res => {
      return res.json();//Transformer les elements en JSON
    })
    .then(items => {
      products = items;
      if (cart == null || cart == undefined || cart.length == 0) {
        //alert('Votre panier est vide!');
        let cartItemsSelector = document.getElementById("cart__items");
        let errorText = document.createElement("p");
        //errorText.style.color = "red";
        errorText.innerHTML = "Votre panier est vide !";
        errorText.style.fontSize = '35px';
        errorText.style.display = 'flex';
        errorText.style.justifyContent = 'center';

        cartItemsSelector.appendChild(errorText);

        let cartOrderSelector = document.getElementsByClassName("cart__order");

        cartOrderSelector[0].style.display = "none";

      } else {

        let priceSum = 0;
        let totalQuantity = 0;
        const cartProductsSelector = document.getElementById('cart__items');
        let productsToDipslay = "";

        for (let product of cart) {
          const cartDisplay = cartProductsSelector.innerHTML;

          //Recuperation des données de la BDD et les ajouter au localStorage  
          for (let item of items) {
            if (product.productId == item._id) {
              product.productPrice = item.price;
              product.productName = item.name;
              product.productImg = item.imageUrl;
              product.productAltText = item.altTxt;
              //product.productPriceSum = item.price * product.productQuantity;
              //priceSum += product.productPriceSum;
              totalQuantity += product.productQuantity;
            }
          }

          //Creation des elements du cart(display)//

          let productInCart = `<article class="cart__item" data-id="${product.productId}" data-color="${product.productColor}">
              <div class="cart__item__img">
                <img src="${product.productImg}" alt="${product.productAltText}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${product.productName}</h2>
                  <p>${product.productColor}</p>
                  <p>${product.productPrice},00 €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.productQuantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>`
          productsToDipslay += productInCart;

        }

        cartProductsSelector.innerHTML = productsToDipslay;

      }



      deleteFromCart();

      modifyQuantity();

      calculateTotalProductInCart();

      calculateTotalCartPrice();


    }).catch(error => {
      alert('Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter')
      console.log(error);
    });
};


getDataFromApi();

//Les fonctions permettant de modifier la quantité d'un produit, le supprimer et recalculer le prix total ainsi que le nombre de produits.//

function deleteFromCart() {
  let deleteFromCartButton = document.getElementsByClassName('deleteItem');

  for (let i = 0; i < deleteFromCartButton.length; i++) {

    deleteFromCartButton[i].addEventListener('click', (e) => {

      e.preventDefault();

      let confirmation = confirm("Voulez-vous supprimer ce produit ?");

      if (confirmation) {

        let articleSelector = deleteFromCartButton[i].parentNode.parentNode.parentNode.parentNode;

        let productId = articleSelector.getAttribute("data-id");

        let productColor = articleSelector.getAttribute("data-color");

        for (let j = 0; j < cart.length; j++) {

          if (cart[j].productColor == productColor && cart[j].productId == productId) {

            cart.splice(j, 1);

            articleSelector.remove();

            localStorage.setItem("cart", JSON.stringify(cart));

          }

        }

        if (cart == null || cart == undefined || cart.length == 0) {

          //alert('Votre panier est vide!');
          let cartItemsSelector = document.getElementById("cart__items");
          let errorText = document.createElement("p");
          //errorText.style.color = "red";
          errorText.innerHTML = "Votre panier est vide !";
          errorText.style.fontSize = '35px';
          errorText.style.display = 'flex';
          errorText.style.justifyContent = 'center';

          cartItemsSelector.appendChild(errorText);

          let cartOrderSelector = document.getElementsByClassName("cart__order");

          cartOrderSelector[0].style.display = "none";

        }

        calculateTotalProductInCart();

        calculateTotalCartPrice();

      }

    });

  }

}

function calculateTotalProductInCart() {

  cart = JSON.parse(localStorage.getItem('cart')) ?? [];

  let totalQuantitySelector = document.getElementById('totalQuantity');

  let totalProductInCart = 0;

  for (let product of cart) {

    totalProductInCart = totalProductInCart + parseInt(product.productQuantity);

  }

  totalQuantitySelector.innerText = totalProductInCart;

  return totalProductInCart;

}

function calculateTotalCartPrice() {

  cart = JSON.parse(localStorage.getItem('cart')) ?? [];

  let totalPriceSelector = document.getElementById('totalPrice');

  let totalartPrice = 0;

  for (let product of cart) {

    for (let item of products) {

      if (item._id === product.productId) {

        totalartPrice = totalartPrice + (parseInt(product.productQuantity) * item.price);

      }


    }

  }

  totalPriceSelector.innerText = totalartPrice;

  return totalartPrice;

}

function modifyQuantity() {

  let quantitySelector = document.getElementsByClassName('itemQuantity');


  for (let i = 0; i < quantitySelector.length; i++) {

    let articleSelector = quantitySelector[i].parentNode.parentNode.parentNode.parentNode;

    let productId = articleSelector.getAttribute("data-id");

    let productColor = articleSelector.getAttribute("data-color");

    quantitySelector[i].addEventListener('change', () => {
      let newQuantity = quantitySelector[i].value;
      console.log(newQuantity, productId);
      for (let j = 0; j < cart.length; j++) {
        if (cart[j].productColor == productColor && cart[j].productId == productId) {
          if (newQuantity > 0 && newQuantity <= 100) {
            cart[j].productQuantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(cart));
          } else {
            alert("Veuillez choisir une quantité valide comprise entre 1 et 100.")
            quantitySelector[i].value = cart[j].productQuantity;
          }
        }
      }
      calculateTotalProductInCart();

      calculateTotalCartPrice();


    })

  }
}

//Les fonctions pour le formulaire de confirmation (RegExp)//


let confirmationForm = document.querySelector('.cart__order__form');

confirmationForm.firstName.addEventListener('change', function () {
  validFirstName(this);
});

confirmationForm.lastName.addEventListener('change', function () {
  validLastName(this);
});

confirmationForm.address.addEventListener('change', function () {
  validAdress(this);
});

confirmationForm.city.addEventListener('change', function () {
  validCity(this);
});

confirmationForm.email.addEventListener('change', function () {
  validEmail(this);
});



function validFirstName(FirstName) {
  let isvalidFirstName = false;
  let firstNameRegExp = new RegExp(
    "^[a-zA-Zàâäéèêëïîôöùûüç' ,.'-]{3,15}$"
  );
  let testFirstName = firstNameRegExp.test(FirstName.value);
  let FirstNameMessageSelector = document.getElementById('firstNameErrorMsg');
  if (!testFirstName) {
    FirstNameMessageSelector.innerHTML = "Prénom invalide! Veuillez spécifier un nom sans caractères numériques avec un longueur minimum de 3 caractères et au maximum 15 caractères.";
  } else {
    FirstNameMessageSelector.innerHTML = "";
    isvalidFirstName = true;
  }
  return isvalidFirstName;
}

function validLastName(LastName) {
  let isValidLastName = false;
  let lastNameRegExp = new RegExp(
    "^[a-zA-Zàâäéèêëïîôöùûüç' ,.'-]{3,15}$"
  );
  let testLastName = lastNameRegExp.test(LastName.value);
  let LastNameMessageSelector = document.getElementById('lastNameErrorMsg');
  if (!testLastName) {
    LastNameMessageSelector.innerHTML = "Nom invalide! Veuillez spécifier un nom sans caractères numériques avec un longueur minimum de 3 caractères et au maximum 15 caractères.";
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
  let adressMessageSelector = document.getElementById('addressErrorMsg');
  if (!testAdress) {
    adressMessageSelector.innerHTML = "Adresse invalide! Veuillez spécifier le numéro de la rue suivi des détails de l'adresse.";
  } else {
    adressMessageSelector.innerHTML = "";
    isValidAdress = true;
  }
  return isValidAdress;

}

function validCity(city) {
  let isValidCity = false;
  let cityRegExp = new RegExp(
    "^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$"
  );
  let testCity = cityRegExp.test(city.value);
  let cityMessageSelector = document.getElementById('cityErrorMsg');
  if (!testCity) {
    cityMessageSelector.innerHTML = "Ville invalide! Veuillez spécifier une ville sans caractères numériques ni caractères speciaux.";
  } else {
    cityMessageSelector.innerHTML = "";
    isValidCity = true;
  }
  return isValidCity;

}

function validEmail(email) {
  let isValidEmail = false;
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  let testEmail = emailRegExp.test(email.value);
  let emailMessageSelector = document.getElementById('emailErrorMsg');
  if (!testEmail) {
    emailMessageSelector.innerHTML = "Adresse mail invalide! Veuillez fournir une adresse mail au format abc@example.com";
  } else {
    emailMessageSelector.innerHTML = "";
    isValidEmail = true;
  }
  return isValidEmail;

}

//Envoi du formulaire + commande au back//

const btnOrder = document.querySelector('.cart__order__form');


btnOrder.addEventListener('submit', function (e) {

  e.preventDefault();

  let confirmation = confirm("Voulez-vous valider votre panier?");

  if(confirmation){
    if (cart != null && cart != undefined && cart.length > 0) {

      let isvalidFirstName = validFirstName(confirmationForm.firstName);
      let isValidLastName = validLastName(confirmationForm.lastName);
      let isValidAdress = validAdress(confirmationForm.address);
      let isValidCity = validCity(confirmationForm.city);
      let isValidEmail = validEmail(confirmationForm.email);
  
  
      if (isvalidFirstName && isValidLastName && isValidAdress && isValidCity && isValidEmail) {
  
        let products = [];
        for (let product of cart) {
          products.push(product.productId);
        }
  
        const orderData = {        
          contact: {
            firstName: confirmationForm.firstName.value,
            lastName: confirmationForm.lastName.value,
            address: confirmationForm.address.value,
            city: confirmationForm.city.value,
            email: confirmationForm.email.value
          },
          products: products
        };
  
        
       
  
        fetch("http://localhost:3000/api/products/order", {
          method: 'POST',
          body: JSON.stringify(orderData),
          headers: {
            "Content-Type":"application/json",
            "Acces-Control-Allow-Origin":"*"
          }
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
          window.location.href =`confirmation.html?orderId=${data.orderId}`;
          
  
        }).catch(function (error) {
          console.log('erreur');
        });   
        
  
      } else {
        alert("Un ou plusieurs champs du formulaire sont incorrect ou non fournis.")
      }
  
    } else {
      alert("Votre panier est vide.")
    }
  
  }

  

  


});