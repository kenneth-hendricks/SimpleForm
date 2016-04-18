simpleformsApp.controller('createresponseCtrl', function($scope, $stateParams, $state, ResponseService, FormService) {

    
    var setupResponse = function(form) {
        $scope.response = {};
        $scope.response.formId = form.id;
        var questions = form.questions;
        $scope.response.question_answers = []
        for (var i = 0; i < questions.length; i++) {
            $scope.response.question_answers[i] = {};
            $scope.response.question_answers[i].questionId = questions[i].id;
            if (questions[i].type === "Check Box") {
                $scope.response.question_answers[i].answers = [];
                for (var j = 0; j < questions[i].options.length; j++) {
                    $scope.response.question_answers[i].answers.push("");
                }
            } else {
                $scope.response.question_answers[i].answers = [""];
            }
        }
    };
    


    FormService.getForm($stateParams.formId)
        .success(function(response) {
            $scope.form = response.form;
            setupResponse($scope.form);
        })
        .error(function(response) {
            console.log("error");
        });

    $scope.checkboxChange = function(questionIndex, optionIndex) {
        if ($scope.response.question_answers[questionIndex].answers[optionIndex] === "") {
            $scope.response.question_answers[questionIndex].answers[optionIndex] = $scope.form.questions[questionIndex].options[optionIndex].text;
        } else {
            $scope.response.question_answers[questionIndex].answers[optionIndex] = "";
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