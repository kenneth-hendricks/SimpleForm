simpleformsApp.controller('createresponseCtrl', function($scope, $http, $stateParams, $state, ResponseService, FormService) {

    FormService.getForm($stateParams.formId)
        .success(function(response) {
            $scope.form = response.form;
            $scope.response = {};
            $scope.response.formId = $scope.form.id;
            $scope.response.answers = [];
            var questions = $scope.form.questions;
            for (var i = 0; i < questions.length; i++) {
                $scope.response.answers[i] = {};
                $scope.response.answers[i].questionId = questions[i].id;
                if (questions[i].type === "Check Box") {
                    $scope.response.answers[i].textArray = [];
                    for (var j = 0; j < questions[i].options.length; j++) {
                        $scope.response.answers[i].textArray.push("");
                    }
                } else {
                    $scope.response.answers[i].textArray = [""];
                }
            }
        })
        .error(function(response) {
            console.log("error");
        });

    $scope.checkboxChange = function(questionIndex, optionIndex) {
        if ($scope.response.answers[questionIndex].textArray[optionIndex] === "") {
            $scope.response.answers[questionIndex].textArray[optionIndex] = $scope.form.questions[questionIndex].options[optionIndex].text;
        } else {
            $scope.response.answers[questionIndex].textArray[optionIndex] = "";
        }
    };

    $scope.submitResponse = function() {
        ResponseService.submitResponse($scope.response)
            .success(function(response) {
                $state.go("dashboard");
            })
            .error(function(response) {
                console.log(response);
            });
    };
});