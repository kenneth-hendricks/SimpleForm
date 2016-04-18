simpleformsApp.controller('viewresponseCtrl', function($scope, $http, $stateParams) {
    $http.get('/response/' + $stateParams.responseId)
        .then(function successCallback(response) {
            $scope.response = response.data;
        }, function errorCallback(response) {
            console.log("error" + response);
        });
});