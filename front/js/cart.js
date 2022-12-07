

// Récuperer les elements de la BDD
const getDataFromApi = async () =>{
    await fetch('http://localhost:3000/api/products/')
    .then(res => {
        return res.json();//Transformer les elements en JSON
    })
    .then(item => {
        const getProducts = () =>{
            let dataFromLocalStorage = JSON.parse(localStorage.getItem('cart'))?? alert('Votre panier est vide!');
            //Verifier qu'il y a quelque chose dans cart(localStorage)
              
            let priceSum = 0;
            let totalQuantity = 0;
            const cartProductsSelector = document.getElementById('cart__items'); 
            let productsToDipslay = "";

            for (let product of dataFromLocalStorage){ 
              const cartDisplay = cartProductsSelector.innerHTML;             

                //Recuperation des données de la BDD et les ajouter au localStorage  
                for(let items of  item){
                    if(product.productId == items._id){    
                        product.productPrice = items.price;
                        product.productName = items.name;
                        product.productImg = items.imageUrl;
                        product.productAltText = items.altTxt;
                        product.productPriceSum = items.price * product.productQuantity;  
                        priceSum += product.productPriceSum;
                        totalQuantity += product.productQuantity;                           
                    }
                }
                console.log(product);

                
                let toto = `<article class="cart__item" data-id="${product.productId}" data-color="${product.productColor}">
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
                      <p>Qté : ${product.productQuantity}</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.productQuantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
              productsToDipslay += toto;
              console.log(productsToDipslay);
                //creer les elements html ici

              let totalPriceSelector = document.getElementById('totalPrice');
              totalPriceSelector.innerHTML = priceSum;
  
              let totalQuantitySelector = document.getElementById('totalQuantity');

              totalQuantitySelector.innerHTML = totalQuantity;

            }

            cartProductsSelector.innerHTML = productsToDipslay;




        };

        getProducts();

    })
    .catch (error => {
        alert('Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter')
    });
};
getDataFromApi();



