simpleformsApp.service('LoginService', function($http, $state){
    var loggedIn = false;
    var userData ={};
    this.loggedIn = function(){
        return loggedIn;
    };

    this.getUser = function(){
        return userData;
    };

    this.sessionLogin = function(user){
        userData.username = user.username;
        userData.id = user.id;
        loggedIn = true;

    };

    this.login = function(user){
        $http({
            method: 'POST',
            url: '/login',
            data: {
                username: user.username, 
                password: user.password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .success(function(data) {
                if (data.userData){
                    loggedIn = true;
                    userData.username = data.userData.username;
                    userData.id = data.userData.user_id;
                    $state.go("dashboard");
                }
                else{
                    loggedIn = false;
                    alert("could not log in");
                }
            });
    };

    this.logout = function(){
        $http({
            method: 'POST',
            url: '/logout'
        })
        .success(function(data) {
                console.log(data);
                loggedIn = false;
                userData = {};
                $state.go("login");
            });
    };
});
