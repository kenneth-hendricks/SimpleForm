simpleformsApp.controller('navCtrl', function($scope, LoginService) {
    $scope.loggedIn = LoginService.loggedIn;
    $scope.logout = LoginService.logout;
});