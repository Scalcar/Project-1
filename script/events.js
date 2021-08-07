const removeAccount = document.getElementById('removeAccountId');
const changePass = document.getElementById('changePasswordId');

function toggle1(){
    var element = document.getElementById('toggle1');
    if(element.style.display != 'none'){
        element.style.display = 'none';
    }else {
        element.style.display = 'block';
    }
}
removeAccount.addEventListener("click", toggle1);

function toggle2(){
    var element = document.getElementById('toggle2');
    if(element.style.display != 'none'){
        element.style.display = 'none';
    }else {
        element.style.display = 'block';
    }
}

changePass.addEventListener("click", toggle2);

