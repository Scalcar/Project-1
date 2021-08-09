class UserService{
    constructor(){
        this.users = this.getUsersFromStorage();
    }
    
    addUser(user){
        this.users.push(user);
        this.updateUserStorage();
    }

    removeUser(userName){
        for (let index = 0; index < this.users.length; index++) {
            const user = this.users[index];
            if(user.userName == userName){
                this.users.splice(index, 1);
                this.updateUserStorage();
                    // console.log(`${userName} has been removed`);
                return `${userName} has been removed`;
            }
        }
    }

    getUserByUserName(userName){
        let response = {
            message: "",
            user: null,
        };

        for (let index = 0; index < this.users.length; index++) {
            const userToFind = this.users[index];
            if(userToFind.userName == userName){
                response.user = userToFind;
                return response;
            }
        }
        response.message = 'User not found';
        return response;
    }
   
    getFormatedProfileDetail(profile){ // fixed
        if(profile){
            //returneaza stringul
           return `
            <tr>
                <td>Name:</td>
                <td>${profile.name}</td>
            </tr>
            <tr>
                <td>Email:</td>
                <td>${profile.email}</td>
            </tr>
            <tr>
                <td>Age:</td>
                <td>${profile.age}</td>
            </tr>
            <tr>
                <td>Gender:</td>
                <td>${profile.gender}</td>
            </tr>`;
        }    
    }

    changePassword(userName, newPassword){
        var userResponse = this.getUserByUserName(userName);
        if(userResponse.user){
            if(newPassword){
                userResponse.user.password = newPassword;
                userResponse.message = 'Password changed successfully!';
                this.updateUserStorage();
                return userResponse.message;
            }else {
                userResponse.message = 'Please use a valid password';
                return userResponse.message;
            }
           
        }else{
            return userResponse.message;
        }
    }

    updateUserStorage(){
        window.localStorage.setItem('users', JSON.stringify(this.users));
    }
    getUsersFromStorage(){
        let user = JSON.parse(localStorage.getItem('users'));
        // window.localStorage.getItem('user',JSON.parse(this.users));
        // Object.setPrototypeOf(user, User.prototype)
        return user? user : [];
    }

}
