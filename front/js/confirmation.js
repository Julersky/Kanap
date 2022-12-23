const getId = function () {//Fonction qui récupère l'orderId dans le lien URL
  let urlParam = new URLSearchParams(window.location.search);
  return urlParam.get("orderId");
};

const displayOrderId = function () {//Fonction qui affiche l'orderID
  let orderIdSelector = document.getElementById("orderId");
  orderIdSelector.innerHTML = getId();
  localStorage.clear();//Suppression des éléments du localStorage 
};

getId();
displayOrderId();
