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