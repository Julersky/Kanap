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

function deleteFromCart() {
  let deleteFromCartButton = document.getElementsByClassName('deleteItem');

  for (let i = 0; i < deleteFromCartButton.length; i++) {

    deleteFromCartButton[i].addEventListener('click', (e) => {

      e.preventDefault();

      let confirmation = confirm("Etes vous sur de vouloir supprimer ce produit ?");

      if (confirmation) {

        let articleSelector = deleteFromCartButton[i].parentNode.parentNode.parentNode.parentNode;

        let productId = articleSelector.getAttribute("data-id");

        let productColor = articleSelector.getAttribute("data-color");

        for (let j = 0; j < cart.length; j++) {

          if (cart[j].productColor == productColor && cart[j].productId == productId) {

            cart.splice(j, 1);

            //deleteFromCartButton[i].remove();

            localStorage.setItem("cart", JSON.stringify(cart));

          }

        }
        getDataFromApi();

        calculateTotalProductInCart();

        calculateTotalCartPrice();

      }

    })

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
        if(cart[j].productColor == productColor && cart[j].productId == productId){
          cart[j].productQuantity = newQuantity;
          localStorage.setItem("cart", JSON.stringify(cart));          
        }
      } 
      calculateTotalProductInCart();

      calculateTotalCartPrice();
   

    })

  }  
}

