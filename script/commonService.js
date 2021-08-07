class CommonService {
    constructor(){}
    
    showInfoMessage(message){
        var messageBar = document.getElementById('messageBarId')
        messageBar.innerHTML = message;
    }
}