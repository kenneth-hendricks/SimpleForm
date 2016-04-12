simpleformsApp.controller('loginCtrl', function($scope, LoginService) {
    $scope.login = LoginService.login;
});
