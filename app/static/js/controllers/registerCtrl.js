simpleformsApp.controller('registerCtrl', function($scope, LoginService, RegisterService) {

    $scope.login = LoginService.login;
    $scope.passwordMismatch = false;
    $scope.usernameTaken = false;

    $scope.register = function() {
        if ($scope.password === $scope.passwordConfirm) {
            $scope.passwordMismatch = false;
            RegisterService.checkUsername($scope.username)
                .success(function(response) {
                    if (response === "unused") {
                        $scope.usernameTaken = false;
                        RegisterService.registerUser($scope.username, $scope.password)
                            .success(function(response) {
                                if (response === "success") {
                                    $scope.login(user = {
                                        username: $scope.username,
                                        password: $scope.password
                                    })
                                } else {
                                    console.log(response);
                                }
                            })
                            .error(function(response) {
                                console.log(response);
                            });
                    } else if (response === "used") {
                        $scope.usernameTaken = true;
                    } else {
                        console.log(response);
                    }
                })
                .error(function(response) {
                    console.log(response);

                });
        } else {
            $scope.passwordMismatch = true;
        }
    };
});