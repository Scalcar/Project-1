class CommonService {
    constructor(){}
    
    showInfoMessage(message){
        var messageBar = document.getElementById('messageBarId')
        messageBar.innerHTML = message;
    }

    setToStorage(key, value){
        localStorage.setItem(key, value);
    }

    getFromStorage(key){
        return localStorage.getItem(key);
    }

    redirect(path){
        document.location.href = path;
    }
}