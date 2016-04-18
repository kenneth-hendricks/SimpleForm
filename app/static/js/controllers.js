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
simpleformsApp.controller('createformCtrl', function($scope, $http, $state, LoginService) {
    $scope.user = LoginService.getUser();
    $scope.form = {
        title: "Untitled Form",
        description: "",
        questions: [{
            title: "",
            type: "Text",
            options: []
        }],
        user_id: $scope.user.id
    };
    var questions = $scope.form.questions;
    $scope.questionTypes = ["Text", "Paragraph", "Multiple Choice", "Check Box", "Dropdown"];
    $scope.changeQuestionType = function(questionIndex, questionTypeIndex) {
        questions[questionIndex].type = $scope.questionTypes[questionTypeIndex];
        if ($scope.questionTypes[questionTypeIndex] === "Text" || $scope.questionTypes[questionTypeIndex] === "Paragraph") {
            questions[questionIndex].options = [];
        } else {
            questions[questionIndex].options = [""];
        }
    };
    $scope.addQuestion = function() {
        questions.push({
            title: "",
            type: "Text",
            options: []
        });
    };
    $scope.addQuestionAfter = function(questionIndex) {
        questions.splice(questionIndex + 1, 0, {
            title: "",
            type: "Text",
            options: []
        });
    };
    $scope.removeQuestion = function(questionIndex) {
        questions.splice(questionIndex, 1);
    };
    $scope.duplicateQuestion = function(questionIndex) {
        var oldQuestion = questions[questionIndex];
        var newQuestion = {};
        newQuestion.title = oldQuestion.title;
        newQuestion.type = oldQuestion.type;
        newQuestion.options = oldQuestion.options;
        questions.splice(questionIndex + 1, 0, newQuestion);
    };
    $scope.addOption = function(questionIndex) {
        questions[questionIndex].options.push("");
    };
    $scope.minimumOptions = function(questionIndex) {
        if (questions[questionIndex].options.length == 1) {
            return true;
        }
        return false;
    };
    $scope.removeOption = function(questionIndex, optionIndex) {
        questions[questionIndex].options.splice(optionIndex, 1);
    };
    $scope.submitForm = function() {
        $http({
            method: 'POST',
            url: '/submit_form',
            data: $scope.form,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .success(function(data) {
                $state.go("view_forms");
            });
    };
});