class HttpService {
    commonService = new CommonService();
    productService = new ProductService();

    register(email, password){
        //adaugam header
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        //adaugam body
        let bodyJson = JSON.stringify({"email": email, "password": password});

        //adaugam requestOptions
        let requestOption = {
            method: 'POST',
            headers: myHeaders,
            body: bodyJson
        };

        //facel call-ul catre backend
        fetch("https://ilbahtraining.azurewebsites.net/register", requestOption)
        .then(response => response.text())
        .then(token => {
            window.localStorage.setItem('token', token);
            commonService.showInfoMessage("You are registered");
            window.setTimeout( function() {
                window.location.href = 'login.html'
            }, 1500);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        })
    }

    login(email, password){
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let bodyJson = JSON.stringify({"email": email, "password": password});

        let requestOption = {
            method: 'POST',
            headers: myHeaders,
            body: bodyJson
        }

        fetch("https://ilbahtraining.azurewebsites.net/login", requestOption)
        .then(response => response.text())
        .then(token => {
            if(token == 'Unauthorized'){
                commonService.showInfoMessage('Unauthorized');
            }else {
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('connected', email);
                commonService.showInfoMessage("You are logged in"); 
                window.setTimeout( function() {
                    window.location.href = 'products.html'
                }, 1500);
            }
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        })

    }

    addProduct(name, description, price){
        let token = window.localStorage.getItem('token');
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        let bodyJson = JSON.stringify({"name": name, "description": description, "price": price});

        let requestOption = {
            method: 'POST',
            headers: myHeaders,
            body: bodyJson
        };

        fetch("https://ilbahtraining.azurewebsites.net/api/Product", requestOption)
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        })
    }

    getProducts(){
        let token = window.localStorage.getItem('token');
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        let requestOption = {
            method: 'GET',
            headers: myHeaders
        }

        return fetch("https://ilbahtraining.azurewebsites.net/api/Product", requestOption)
        .then(response => response.json())
        // .then(products => {
        //     let formatedProducts = productService.getFormatedProducts(products);
        //     document.getElementById('productsListId').innerHTML = formatedProducts;
        // })
        // .catch(error => {
        //     commonService.showInfoMessage(error);
        // })
    }

    getProductbyId(id){
        let token = window.localStorage.getItem('token');
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        let requestOption = {
            method: 'GET',
            headers: myHeaders
        }

        return fetch(`https://ilbahtraining.azurewebsites.net/api/Product/${id}`, requestOption)
        .then(response => response.json())
    }

    updateProduct(product){
        let token = window.localStorage.getItem('token');
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        let requestOption = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(product)
        }

        fetch("https://ilbahtraining.azurewebsites.net/api/Product", requestOption)
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
            window.setTimeout( function() {
                window.location.href = 'products.html'
            }, 1500);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        })
    }

    deleteProductById(id){
        let token = localStorage.getItem('token');

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        let requestOption = {
            method: 'POST',
            headers: myHeaders
        };

        fetch(`https://ilbahtraining.azurewebsites.net/api/Product/${id}`, requestOption)
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }

    addRating(productId, rating){
        let token = localStorage.getItem('token');

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        let requestOption = {
            method: 'POST',
            headers: myHeaders
        };
        //`https://ilbahtraining.azurewebsites.net/api/rating?productId=17&rating=5`
        fetch(`https://ilbahtraining.azurewebsites.net/api/rating?productId=${productId}&rating=${rating}`, requestOption)
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }

}