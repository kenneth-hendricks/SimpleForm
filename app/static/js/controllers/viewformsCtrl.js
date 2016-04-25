simpleformsApp.controller('viewformsCtrl', function($scope, $http, $stateParams, LoginService) {
    $scope.user = LoginService.getUser();
    $scope.active_form = 0;
    $http.get('/forms/' + $scope.user.id)
        .then(function successCallback(response) {
            $scope.forms = response.data.forms;
            if ($stateParams.formId !== null) {
                for (var i = 0; i < $scope.forms.length; i++) {
                    if ($scope.forms[i].id == $stateParams.formId) {
                        $scope.active_form = i;
                        break;
                    }
                }

            }
        }, function errorCallback(response) {
            console.log("error" + response);
        });

    $scope.isActiveForm = function(formIndex) {
        return formIndex === $scope.active_form;
    };
    $scope.setActiveForm = function(formIndex) {
        $scope.active_form = formIndex;
    };
    $scope.deleteForm = function(formIndex) {
        if (confirm("Are you sure you want to delete this form? All responses will also be deleted.")) {
            $http({
                method: 'POST',
                url: '/delete_form/' + $scope.forms[formIndex].id
            })
                .success(function(data) {
                    console.log(data);
                    $scope.active_form = 0;
                    $scope.forms.splice(formIndex, 1);
                });

        }

    };
});