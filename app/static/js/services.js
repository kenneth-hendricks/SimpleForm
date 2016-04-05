simpleformsApp.service('LoginService', function($http){
    var loggedIn = false;
    this.loggedIn = function(){
        return loggedIn;
    };

    this.logIn = function(){
        loggedIn = true; 
    };

    this.logOut = function(){
        loggedIn = false; 
    };

});
