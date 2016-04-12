simpleformsApp.service('LoginService', function($http, $state) {
    var loggedIn = false;
    var userData = {};
    this.loggedIn = function() {
        return loggedIn;
    };

    this.getUser = function() {
        return userData;
    };

    this.sessionLogin = function(user) {
        userData.username = user.username;
        userData.id = user.id;
        loggedIn = true;

    };

    this.login = function(user) {
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
                if (data.userData) {
                    loggedIn = true;
                    userData.username = data.userData.username;
                    userData.id = data.userData.user_id;
                    $state.go("dashboard");
                } else {
                    loggedIn = false;
                    alert("could not log in");
                }
            });
    };

    this.logout = function() {
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

simpleformsApp.factory('RegisterService', function($http) {
    var factory = {};

    factory.checkUsername = function(username) {
        return $http({
            method: 'POST',
            url: '/check_username',
            data: {
                username: username
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    factory.registerUser = function(username, password) {
        return $http({
            method: 'POST',
            url: '/register_user',
            data: {
                username: username,
                password: password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    return factory;
});

simpleformsApp.factory('FormService', function($http) {
    var factory = {};

    factory.recentForms = function() {
        return $http.get('/recent_forms');
    };

    factory.getForm = function(formId) {
        return $http.get('/get_form/' + formId);
    };
    return factory;
});

simpleformsApp.factory('ResponseService', function($http) {
    var factory = {};

    factory.recentResponses = function() {
        return $http.get('/recent_responses');
    };

    factory.submitResponse = function(response) {
        return $http.post('/submit_response', response);
    };

    return factory;
});