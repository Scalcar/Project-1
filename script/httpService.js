class HttpService {
    commonService = new CommonService();
    productService = new ProductService();

    register(profile){       
        //facel call-ul catre backend
        fetch("https://ilbahtraining.azurewebsites.net/register", this.getHeaderWithTokenAndBody(profile, 'POST'))
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

    addProduct(name, description, price, discountPrice, productUrl){
        let body = {"name": name, "description": description, "price": price, "discountPrice": discountPrice, "productUrl": productUrl };

        fetch("https://ilbahtraining.azurewebsites.net/api/Product", this.getHeaderWithTokenAndBody(body, 'POST'))
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

    getProducts(){       
        return fetch("https://ilbahtraining.azurewebsites.net/api/Product", this.getHeaderWithToken('GET'))
        .then(response => response.json())
    }

    getProductbyId(id){        
        return fetch(`https://ilbahtraining.azurewebsites.net/api/Product/${id}`, this.getHeaderWithToken('GET'))
        .then(response => response.json())
    }

    updateProduct(product){
        fetch("https://ilbahtraining.azurewebsites.net/api/Product", this.getHeaderWithTokenAndBody(product, 'PUT'))
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
        fetch(`https://ilbahtraining.azurewebsites.net/api/Product/${id}`, this.getHeaderWithToken('POST'))
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }

    addRating(productId, rating){       
        //`https://ilbahtraining.azurewebsites.net/api/rating?productId=17&rating=5`
        fetch(`https://ilbahtraining.azurewebsites.net/api/rating?productId=${productId}&rating=${rating}`, this.getHeaderWithToken('POST'))
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }

    getProfile(){
        return fetch(`https://ilbahtraining.azurewebsites.net/profile`, this.getHeaderWithToken('GET'))
        .then(response => response.json())
    }

    getHeaderWithTokenAndBody(body, method){
        let token = localStorage.getItem('token');

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        return {
            method: method,
            headers: myHeaders,
            body: JSON.stringify(body)
        };
    }
    getHeaderWithToken(method){
        let token = localStorage.getItem('token');

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        return {
            method: method,
            headers: myHeaders,
        };
    }

    addReview(title, description, productId){
        let body = {"title": title, "description": description};

        fetch(`https://ilbahtraining.azurewebsites.net/api/review?id=${productId}`, this.getHeaderWithTokenAndBody(body, "POST"))
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
            location.reload();
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }

}