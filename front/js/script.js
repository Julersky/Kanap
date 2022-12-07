
const displayProductData =  async () => {   
    await fetch("http://localhost:3000/api/products/")
    .then((res) => res.json())
    .catch (error => {
        alert('Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter')
    })
    .then((products) => {
        const itemsSelector = document.getElementById('items')
        for (let item of products){ 
            let productLinkSelector = document.createElement('a');
            productLinkSelector.href='product.html?id='+item._id;
            let productArticleSelector = document.createElement('article');
            let productImgSelector = document.createElement('img');
            productImgSelector.src = item.imageUrl;
            productImgSelector.alt = item.alt;
            let productNameSelector = document.createElement('h3');
            productNameSelector.innerText = item.name;
            let productDescriptionSelector = document.createElement('p');
            productDescriptionSelector.innerText = item.description;
            productArticleSelector.appendChild(productImgSelector);
            productArticleSelector.appendChild(productNameSelector);
            productArticleSelector.appendChild(productDescriptionSelector);
            productLinkSelector.appendChild(productArticleSelector);
            itemsSelector.appendChild(productLinkSelector);
        }        
    })
    .catch (error => {
        alert('Nous rencontrons un problème avec notre serveur. Veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter')
    });
};

displayProductData();
