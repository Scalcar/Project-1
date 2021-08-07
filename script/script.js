var userService = new UserService();
var productService = new ProductService();
var commonService = new CommonService();
var httpService = new HttpService();

function login() {
   let email = document.getElementById('emailId').value;
   let password = document.getElementById('passwordId').value;

   httpService.login(email, password);
}

//aceasta functie se executa pe evenimentul onload pe pagina de produse
function authorize() {
   let isAuthenticated = window.localStorage.getItem('token');
   if (!isAuthenticated) {
      document.location.href = "login.html";
   }
}

function logOut() {
   window.localStorage.removeItem('token');
   window.localStorage.removeItem('connected');
   document.location.href = "login.html";
}

function register() {
   //colectam datele din inputuri
   let name = document.getElementById('nameId').value;
   let email = document.getElementById('emailId').value;
   let password = document.getElementById('passwordId').value;

   let user = new User(name, email, password);
   userService.addUser(user);

   httpService.register(email, password);

}

function showProducts() {
   let promise = httpService.getProducts();
   promise
   .then(products => {
      let formatedProducts = productService.getFormatedProducts(products);
      document.getElementById('productsListId').innerHTML = formatedProducts;
      document.getElementById('listCountId').innerHTML = products.length;
   })
   .catch(error => {
      commonService.showInfoMessage(error);
   }); 
}

function showProfile() { // fixed
   let userName = window.localStorage.getItem('connected');
   let response = userService.getFormatedProfileDetail(userName);
   if (response.message) {
      //daca avem mesaj de eroare ca nu exista utilizatorul
      commonService.showInfoMessage(response.message);
   } else {
      document.getElementById('persons').innerHTML = response;
   }
}

function removeProduct(id){
   httpService.deleteProductById(id);

  showProducts();
  updateProductsCount();
}

//functia este apelata cand se da click pe un produs
function openProduct(id) {
   window.localStorage.setItem("productId", id);
   document.location.href = "productDetails.html";
}

//funtia este apelata la onload pe pagina productDetails
function showProduct() {
   let productId = window.localStorage.getItem("productId");
   let promise = httpService.getProductbyId(productId);
   promise
      .then(product => {
         let formatedProduct = productService.getFormatedProduct(product);
         document.getElementById('productDetailId').innerHTML = formatedProduct;
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
}

function updateProductById(id) {
   window.localStorage.setItem("updateProductId", id);
   document.location.href = "productUpdate.html";
}

function showUpdateDetailProduct() { // ??? - product update
   let productId = window.localStorage.getItem("updateProductId");
   let promise = httpService.getProductbyId(productId);
   promise
      .then(product => {
         let productUpdate = productService.getFormatedUpdateProduct(product);
         document.getElementById('itemUpdate').innerHTML = productUpdate;
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });       
}

function setProductDetails(){
   let productId = window.localStorage.getItem('updateProductId');

   let promise = httpService.getProductbyId(productId)
      promise
        .then(product => {
         document.getElementById('nameId').value = product.name; 
         document.getElementById('descriptionId').value = product.description; 
         document.getElementById('priceId').value = product.price; 
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
}

function updateProduct() {
   let name = document.getElementById('nameId').value;
   let description = document.getElementById('descriptionId').value;
   let price = document.getElementById('priceId').value;
   let discountPrice = $("#discountPriceId").val();
   let productUrl = $("#productUrlId").val();
   let productId = window.localStorage.getItem('updateProductId');

   let product = {"id": Number(productId), "name": name, "description": description, "price": price, "discountPrice": discountPrice, "productUrl": productUrl};

   httpService.updateProduct(product);
}

function addToFavorites(id) {
   let promise = httpService.getProductbyId(id);
   promise
      .then(product => {
         let response = productService.addProductToFavorites(product, id);
         commonService.showInfoMessage(response);
         refreshProducts();
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
}

function addToCart(id) {
   let promise = httpService.getProductbyId(id);
   promise
      .then(product => {
         let test = product;
         test.quantity = 1;
         let response = productService.addProductToCart(test,id);
         commonService.showInfoMessage(response);
         productService.updateCartStorage();
         refreshProducts();
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
     
   // document.getElementById('cartTable').innerHTML = product.list;
   // refreshProducts();
}

function updateProductsCount() {
   let count = productService.getProductCount();
   // document.getElementById('listCountId').innerHTML = count.productsCount;
   document.getElementById('counter').innerHTML = count.cartCount;
   document.getElementById('favCountID').innerHTML = count.favoritesCount;
}

function refreshProducts() {
   showCart();
   showFavorites();
   updateProductsCount();
}

function showCart() {
   let cart = productService.getFormatedCart();
   document.getElementById('cartTable').innerHTML = cart;
   // showCountInfo();
}

function showFavorites() {
   let favorites = productService.getFormatedFavorites();
   document.getElementById('favTable').innerHTML = favorites;
   // showCountInfo();
}

function removeFromCart() { //variata gresita
   let response = productService.removeProductFromCart();
   // document.getElementById('cartTable').innerHTML = product.list;
   commonService.showInfoMessage(response);
   refreshProducts();
}

function removeFromCart2(id) {
   let promise = httpService.getProductbyId(id);
   promise
      .then(product => {
         let response = productService.removeProductFromCartAnotherMethod(product,id);
         commonService.showInfoMessage(response);
         refreshProducts();
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
}

function removeFromFavorites() { //varianta gresita
   let response = productService.removeProductFromFavorites();
   commonService.showInfoMessage(response);
   refreshProducts();
}

function removeFromFavorites2(id) {
   let promise = httpService.getProductbyId(id);
   promise
      .then(product => {
         let response = productService.removeFromFavoritesAnotherMethod(product,id);
         commonService.showInfoMessage(response);
         refreshProducts();
      })
      .catch(error => {
         commonService.showInfoMessage(error);
     });
}

function addRating(id, rating){
   httpService.addRating(id, rating);
   showProduct();
}

function addProduct(){
   let name = document.getElementById('nameId').value;
   let description = document.getElementById('descriptionId').value;
   let price = document.getElementById('priceId').value;

   httpService.addProduct(name, description, price);
}

function searchForProducts(){
   let query = document.getElementById('searchId').value;
   let promise = httpService.getProducts();
   promise
   .then(products => {
      let response = productService.showProductsByName(query, products);
      let text = `You have found ${response.count} products`;
      document.getElementById('productsListId').innerHTML = response.list;
      document.getElementById('textModificat').innerHTML = text;
   })
   .catch(error => {
      commonService.showInfoMessage(error);
   });
}

function searchForProductsPrice(){
   let from = document.getElementById('searchId2').value;
   let to = document.getElementById('searchId3').value;
   let promise = httpService.getProducts();
   promise
   .then(products => {
      let response = productService.showProductsWithPriceRange(from, to, products);
      let text = `You have found ${response.count} products`;
      document.getElementById('productsListId').innerHTML = response.list;
      document.getElementById('textModificat').innerHTML = text;
   })
   .catch(error => {
      commonService.showInfoMessage(error);
   });
}













function changeUrl(){
   let id = localStorage.getItem("productUpdateId");
   let imgUrl = document.getElementById('imgUrl').value;
   let response = productService.addImageToProduct(id, imgUrl);
   showUpdateDetailProduct();
   commonService.showInfoMessage(response);
}

function applyPromoCode(){
   let code = document.getElementById('promoCode').value;
   let voucher = '#1213';
   if (code == voucher) {
      let cart = localStorage.getItem("cartProducts");
      if(cart.length >= 3){
         applyOnce();
         refreshProducts();
      }else{
         commonService.showInfoMessage('The cart is empty. Buy something first!');
      } 
   }else {
      commonService.showInfoMessage('Promo Code entered not valid. Try again!');
   }
} 

function usePromoCode() {
      let percent = parseInt(10);
      let response = productService.promoCodeDiscount(percent);
      commonService.showInfoMessage(response);
}

var applyOnce = (function () {
   var promoCode = false;
   return function () {
      if (!promoCode) {
         promoCode = true;
         usePromoCode();
      }
   };
})();

function modifyQuantityOfPlus(id) {
   let count = productService.increasePlus(id);
   commonService.showInfoMessage(count);
   refreshProducts();
}

function modifyQuantityOfMinus(id) {
   let count = productService.decreaseMinus(id);
   commonService.showInfoMessage(count);
   refreshProducts();
}

function resetCart() {
   let basket = productService.removeAllProductsFromCart();
   commonService.showInfoMessage(basket);
   refreshProducts();
}

function resetFavorites() {
   let response = productService.removeAllProductsFromFavorites();
   commonService.showInfoMessage(response);
   refreshProducts();
}

function removeUser() { // -- here  ??
   let userName = document.getElementById('email').value;
   let response = userService.removeUser(userName);
   commonService.showInfoMessage(response);
   setTimeout(logOut, 5000);
}

function changePassword() { // -- here
   let userName = document.getElementById('userName').value;
   let newPassword = document.getElementById('passwordIdNew').value;

   let response = userService.changePassword(userName, newPassword);
   commonService.showInfoMessage(response);

   showProfile();
}

// function toggle(){
//    var element = document.getElementById('toggle');
//    if(element.style.display != 'none'){
//       element.style.display = 'none';
//    }else {
//       element.style.display = 'block';
//    }
// }










