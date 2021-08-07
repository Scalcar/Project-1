class ProductService { // var productService = new ProductService();
    constructor() {
        this.productNotFoundMsg = 'Product not found';
        this.cartList = this.getCartProductsFromStorage();
        this.favoriteList = this.getFavoritesProductsFromStorage();
    }

    getFormatedProducts(products){
        var concatenatedProducts = '';
        products.forEach(product => {
            //pentru fiecare produs construieste urmatorul html
            concatenatedProducts += `
            <div>
                <p>${product.name}</p>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <button onclick="removeProduct(${product.id})">Remove</button>
                <button onclick ="openProduct(${product.id})">Show Details</button>
                <button onclick ="updateProductById(${product.id})">Update</button>
                <button onclick ="addToCart(${product.id})">Add to Cart</button>
                <button onclick="addToFavorites(${product.id})">Add to Favorites</button>
            </div>`
        });
        return concatenatedProducts;
    }   

    getFormatedProduct(product){
        if (product) {
            return `
            <div>
                <h3>Name: ${product.name}</h3>
                <p>Description: "${product.description}"</p>
                <p>Price: ${product.price} lei</p>
                ${this.getNumberOfStars(product)}
            </div>`; 
        }
    }
      
    getNumberOfStars(product) {
        let starList = "";
        let rating = product.rating.avgRating;
        let fullStar = Math.floor(rating);
        let halfStar = (fullStar < rating);
        if (rating) {
            for (let index = 1; index <= 5; index++) {
                if (index <= fullStar) {
                    starList += ` <span class="fa fa-star checked" onclick="addRating(${product.id}, ${index})"></span>`
                }else if(index == fullStar+1 && halfStar == true) {
                    starList += ` <span class="fa fa-star-half-o yellow-color" onclick="addRating(${product.id}, ${index})"></span>`
                    // <i class="fad fa-star-half"></i>
                } else {
                    starList += ` <span class="fa fa-star" onclick="addRating(${product.id}, ${index})"></span>`
                }
            }
            return starList;
        } else {
            return `
            <span class="fa fa-star" onclick="addRating(${product.id}, 1)"></span>
            <span class="fa fa-star" onclick="addRating(${product.id}, 2)"></span>
            <span class="fa fa-star" onclick="addRating(${product.id}, 3)"></span>
            <span class="fa fa-star" onclick="addRating(${product.id}, 4)"></span>
            <span class="fa fa-star" onclick="addRating(${product.id}, 5)"></span> `;
        }
    }

    getFormatedUpdateProduct(product) { //rezolvat
        if (product) {
            return `
            <tr>
                <td>Name:</td>
                <td>${product.name}</td>
            </tr>
            <tr>
                <td>Description:</td>
                <td>${product.description}</td>
            </tr>
            <tr>
                <td>Price:</td>
                <td>${product.price}</td>
            </tr>`
        }
    }

    // <tr>
    //     <td>Image Link</td>
    //     <td><a href = ${product.imgUrl} alt="${product.name}">Click here</a></td>
    // </tr>   

    getFormatedCart() {
        let list = '';
        list = `
        <tr>
            <th>Nr</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Remove</th>
        </tr>`;
        var j = 1;
        this.cartList.forEach(function (product) {
            list += `
            <tr>
                <td>${j}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td><p id="pCart"><span id="addCart" onclick="modifyQuantityOfMinus(${product.id})">-</span><input type='text' value='${product.quantity}'><span id="addCart" onclick ="modifyQuantityOfPlus(${product.id})">+</span></p></td>
                <td><p  onclick ="removeFromCart2(${product.id})"><span id="remove">x</span></p></td>
            </tr>`
            j++;
        })
        let sumPrice = parseInt(0);
        for (let i = 0, l = this.cartList.length; i < l; i++) {
            sumPrice += parseInt(this.cartList[i].price) * parseInt(this.cartList[i].quantity);
        }
        list += `
        <tr>
            <td></td>
            <td></td>
            <td>Total:</td>
            <td>${sumPrice}</td>
            <td></td>
        </tr>`;
        return list;
    }   

    getFormatedFavorites() {
        let favorites = '';
        favorites = `
            <tr>
                <th>Nr</th>
                <th>Name</th>
                <th>Links</th>
                <th>Remove</th>
            </tr>`;
        var i = 1;
        this.favoriteList.forEach(function (product) {
            favorites += `
                <tr>
                    <td>${i}</td>
                    <td>${product.name}</td>
                    <td><a href="#" onclick ="openProduct(${product.id})">View</a></td>
                    <td><p onclick = "removeFromFavorites2(${product.id})"><span id="remove">x</span></p></td>
                </tr>`;
            i++;
        })
        favorites += `
            <tr>
                <td></td>
                <td>Total:</td>
                <td>${this.favoriteList.length}</td>
                <td></td>
            </tr>`;
        return favorites;
    }

    addImageToProduct(id, imgUrl) { // incercat ceva
        let product = this.findProduct(id);
        if (product) {
            product.imgUrl = imgUrl;
            this.updateStorage();
            return `You set a new image for product ${product.name}`;
        } else {
            return this.productNotFoundMsg;
        }
    }

    showProductsByName(query, products) {
        let response = {
            list: '',
            count: 0
        }
        let filteredProducts = products.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        response.count = filteredProducts.length;
        filteredProducts.forEach(item => {
            response.list += `
                <div>
                    <p>${item.name}</p>
                    <p>${item.description}</p>
                    <p>${item.price}</p>
                    <button onclick="removeProduct(${item.id})">Remove</button>
                    <button onclick ="openProduct(${item.id})">Show Details</button>
                    <button onclick ="updateProductById(${item.id})">Update</button>
                    <button onclick ="addToCart(${item.id})">Add to Cart</button>
                    <button onclick="addToFavorites(${item.id})">Add to Favorites</button>
                </div>`
        });
        return response;
    }

    // showProductsWithPriceRange(from,to){
    //     let items = this.products;
    //     items.forEach(function(item) {
    //         if(item.price >= from && item.price <= to){
    //             console.log(item);
    //         return item;
    //         }         
    //     })
    // }

    showProductsWithPriceRange(from, to, products) { // aici 2)
        let response = {
            list: '',
            count: 0
        }
        let filteredProducts = products.filter(product => product.price >= from && product.price <= to);
        response.count = filteredProducts.length;
        filteredProducts.forEach(item => {
            response.list += `
                <div>
                    <p>${item.name}</p>
                    <p>${item.description}</p>
                    <p>${item.price}</p>
                    <button onclick="removeProduct(${item.id})">Remove</button>
                    <button onclick ="openProduct(${item.id})">Show Details</button>
                    <button onclick ="updateProductById(${item.id})">Update</button>
                    <button onclick ="addToCart(${item.id})">Add to Cart</button>
                    <button onclick="addToFavorites(${item.id})">Add to Favorites</button>
                </div>`
        });
        return response;
        // this.products.filter(product => product.price >= from && product.price <= to);
    }    

    discountCampainForAllProducts(percent) {  // 1)
        percent = Math.abs(percent);
        return this.products.filter(item => item.price = item.price * [(100 - percent) / 100]);
        // let items = this.products;
        // items.forEach(function(item) {
        //     percent = Math.abs(percent);
        //     item.price = item.price * [(100 - percent)/100];   
        //         console.log(item);
        //     return item; 
        // })
    }
    promoCodeDiscount(percent) {
        this.cartList.filter(product => {
            product.price = product.price * [(100 - percent) / 100];
            this.updateCartStorage();
        });
        return `Congrats! Now ${percent}% discount for products in the cart`;
    }

    updateCartStorage() {
        window.localStorage.setItem('cartProducts', JSON.stringify(this.cartList));
    }

    updateFavoritesStorage() {
        window.localStorage.setItem('favorites', JSON.stringify(this.favoriteList));
    }

    getCartProductsFromStorage() {
        let cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
        return cartProducts ? cartProducts : [];
    }

    getFavoritesProductsFromStorage() {
        let data = JSON.parse(localStorage.getItem('favorites'));
        return data ? data : [];
    }

    addProductToCart(product, id) {
        if (!this.cartList.some(product => product.id === id)) {
            this.cartList.push(product);
            this.updateCartStorage();
            return `Product ${product.name} was added to cart`;
        } else {
            product.quantity = parseInt(product.quantity) + parseInt(1);
            // this.updateCartStorage();
            return `Product ${product.name} is already in cart`;
        }
    }

    addProductToFavorites(product, id) {
        if (!this.favoriteList.some(product => product.id === id)) {
            this.favoriteList.push(product);
            this.updateFavoritesStorage();
            return `Product ${product.name} was added to favorites`;
        } else {
            return `Product ${product.name} is already in favorites`;
        }
    }

    removeProductFromCart() { //varianta gresita
        if (this.cartList.length >= 1) {
            let product = this.cartList.pop();
            // product.quantity = parseInt(1);
            this.updateCartStorage();
            return `Product ${product.name} was removed`;
        } else {
            return 'The cart is empty';
        }
    }

    removeProductFromCartAnotherMethod(product, id) {
        // let product = this.findProduct(id);
        for (var i = 0; i < this.cartList.length; i++) {
            if (this.cartList[i].id == id) {
                this.cartList.splice(i, 1);
                // product.quantity = parseInt(1);
                this.updateCartStorage();
                return `Product ${product.name} was removed from cart`;
            }
        }
        return `Product with id ${id} doesn't exist`;
    }

    removeProductFromFavorites() { //varianta gresita
        if (this.favoriteList.length >= 1) {
            let favorite = this.favoriteList.pop();
            this.updateFavoritesStorage();
            return `Product ${favorite.name} was removed from favorites`;
        } else {
            return 'The favorites list is empty';
        }
    }

    removeFromFavoritesAnotherMethod(product, id) {
        // let favorite = this.findProduct(id);
        for (var i = 0; i < this.favoriteList.length; i++) {
            if (this.favoriteList[i].id == id) {
                this.favoriteList.splice(i, 1);
                this.updateFavoritesStorage();
                return `Product ${product.name} was removed from favorites`;
            }
        }
        return `Product with id ${id} doesn't exist`;
    }

    removeAllProductsFromCart() {
        if (this.cartList.length >= 1) {
            this.cartList.splice(0, this.cartList.length);
            this.updateCartStorage();
            return 'You have removed all products from cart';
        } else {
            return 'The cart is empty';
        }
    }

    removeAllProductsFromFavorites() {
        if (this.favoriteList.length >= 1) {
            this.favoriteList.splice(0, this.favoriteList.length);
            this.updateFavoritesStorage();
            return 'You have removed all products from favorites';
        } else {
            return 'The favorites list is empty';
        }
    }

    getProductCount() {
        let count = {
            cartCount: this.cartList.length,
            // productsCount: this.products.length,
            favoritesCount: this.favoriteList.length
        };
        let total = 0;
        this.cartList.forEach(product => { total += product.quantity });
        count.cartCount = total;
        return count;
    }

    increasePlus(id) {
        for (var i = 0; i < this.cartList.length; i++) {
            const product = this.cartList[i];
            if (product.id == id) {
                product.quantity++;
                this.updateCartStorage();
                return `Quantity of ${product.name} increased by 1`;
            }
        }
        return `Product with id ${id} doesn't exist`;
    }
    decreaseMinus(id) {
        for (var i = 0; i < this.cartList.length; i++) {
            const product = this.cartList[i];
            if (product.id == id) {
                if (product.quantity > "1") {
                    product.quantity--;
                    this.updateCartStorage();
                    return `Quantity of ${product.name} decreased by 1`;
                } else {
                    this.removeProductFromCartAnotherMethod(product, id);
                    return `Product ${product.name} was removed from cart`;
                    // return "You have only one product! Remove it if you don't want it";
                }
            }
        }
        return `Product with id ${id} doesn't exist`;
    }

}










