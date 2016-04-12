simpleformsApp.controller('dashboardCtrl', function($scope, LoginService, FormService, ResponseService) {

    $scope.user = LoginService.getUser();

    FormService.recentForms()
        .success(function(response) {
            $scope.recentForms = response.forms;
        }).error(function(response){
            console.log("error" + response);
        });

    ResponseService.recentResponses()
        .success(function(response) {
            $scope.recentResponses = response.responses;
        }).error(function(response){
            console.log("error" + response);
        });
    
});