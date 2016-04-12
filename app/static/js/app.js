var simpleformsApp = angular.module('simpleformsApp', ['ui.router']);

simpleformsApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise("/");
    // Now set up the states
    $stateProvider
        .state('dashboard', {
            url: "/",
            templateUrl: "../static/partials/dashboard.html",
            controller: "dashboardCtrl",
            data: {
                requireLogin: true
            }
        })
        .state('create_form', {
            url: "/create_form",
            templateUrl: "../static/partials/create_form.html",
            data: {
                requireLogin: true
            }
        })
        .state('view_forms', {
            url: "/view_forms",
            templateUrl: "../static/partials/view_forms.html",
            params: {
                formId: null
            },
            data: {
                requireLogin: true
            }
        })
        .state('view_response', {
            url: "/view_response/:responseId",
            templateUrl: "../static/partials/view_response.html",
            data: {
                requireLogin: true
            }
        })
        .state('create_response', {
            url: "/create_response/:formId",
            templateUrl: "../static/partials/create_response.html",
            controller: "createresponseCtrl",
            data: {
                requireLogin: false
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "../static/partials/login.html",
            controller: "loginCtrl",
            data: {
                requireLogin: false
            }
        })
        .state('register', {
            url: "/register",
            templateUrl: "../static/partials/register.html",
            controller: "registerCtrl",
            data: {
                requireLogin: false
            }
        });

});



simpleformsApp.run(function($rootScope, $state, LoginService, $http) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        var login = LoginService.sessionLogin;
        if (requireLogin && LoginService.loggedIn() === false) {
            
            $http({
                method: 'GET',
                url: '/current_user'
            }).then(function successCallback(response) {
                if(response.data === "not logged in"){
                  event.preventDefault();
                  $state.go("login");
                }
                else{
                  var user = {username: response.data.userData.username,
                    id: response.data.userData.user_id
                  };
                  login(user);
                }


                console.log(response);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

/*
            var user = {
                username: "test",
                password: "test"
            };
            LoginService.login(user);
*/
        }
    });

});