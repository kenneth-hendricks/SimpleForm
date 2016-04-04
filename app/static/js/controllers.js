simpleformsApp.controller('createresponseCtrl', function($scope, $http, $stateParams) {


    $http.get('/form/' + $stateParams.formId)
        .then(function successCallback(response) {
                $scope.form = response.data;
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
            },

            function errorCallback(response) {


            });


    $scope.test = function() {

        console.log($scope.response);
    };

    $scope.checkboxChange = function(questionIndex, optionIndex) {
        if ($scope.response.answers[questionIndex].textArray[optionIndex] === "") {
            $scope.response.answers[questionIndex].textArray[optionIndex] = $scope.form.questions[questionIndex].options[optionIndex].text;
        } else {
            $scope.response.answers[questionIndex].textArray[optionIndex] = "";
        }

    };

    $scope.submitResponse = function() {

        $http({
            method: 'POST',
            url: '/submit_response',
            data: $scope.response,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .success(function(data) {
                console.log(data);
            });


    };

});

simpleformsApp.controller('viewresponseCtrl', function($scope, $http, $stateParams) {
    $http.get('/response/' + $stateParams.responseId)
        .then(function successCallback(response) {
            $scope.response = response.data;
        }, function errorCallback(response) {});

});



simpleformsApp.controller('viewformsCtrl', function($scope, $http) {
    $http.get('/forms')
        .then(function successCallback(response) {
            $scope.forms = response.data.forms;
        }, function errorCallback(response) {});

    $scope.active_form = 0;

    $scope.isActiveForm = function(formIndex) {
        return formIndex === $scope.active_form;
    };

    $scope.setActiveForm = function(formIndex) {
        $scope.active_form = formIndex;
    };

    $scope.deleteForm = function(formIndex) {
        $http({
            method: 'POST',
            url: '/delete_form/' + $scope.forms[formIndex].id
        })
            .success(function(data) {
                console.log(data);
                $scope.active_form = 0;
                $scope.forms.splice(formIndex, 1);
            });


    };



});

simpleformsApp.controller('createformCtrl', function($scope, $http) {

    $scope.form = {
        title: "Untitled Form",
        description: "",
        questions: [{
            title: "",
            type: "Text",
            options: []
        }]

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
                console.log(data);
            });


    };


});