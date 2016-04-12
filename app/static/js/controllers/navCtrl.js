simpleformsApp.controller('NavCtrl', function($scope, $http, $stateParams, LoginService) {
    $scope.loggedIn = LoginService.loggedIn;
    $scope.logout = LoginService.logout;
});