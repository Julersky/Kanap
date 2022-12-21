
const getId = function (){
    let urlParam = new URLSearchParams(window.location.search);
    return urlParam.get("orderId");
};

const displayOrderId = function(){
    let orderIdSelector = document.getElementById('orderId');
    orderIdSelector.innerHTML = getId();
    localStorage.clear();    
};

getId();
displayOrderId();
