simpleformsApp.controller('loginCtrl', function($scope, $http, $stateParams, LoginService, $state) {
    user ={
        username: "",
        password: ""
    };
    $scope.login = LoginService.login;
});

simpleformsApp.controller('registerCtrl', function($scope, $http, $stateParams, LoginService, $state) {
    $scope.user = {
        username: "",
        password: "",
        passwordConfirm: ""
    };

    $scope.login = LoginService.login;

    $scope.passwordMismatch = false;
    $scope.usernameTaken= false;

    $scope.register = function(){
        if ($scope.user.password === $scope.user.passwordConfirm){
            $scope.passwordMismatch = false;
            $scope.usernameTaken = false;

            $http({
            method: 'POST',
            url: '/register_user',
            data: {
                username: $scope.user.username, 
                password: $scope.user.password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .success(function(data) {
                if (data === "success"){
                    $scope.login({username: $scope.user.username,
                        password: $scope.user.password});
                } else if (data === "username taken"){
                    $scope.usernameTaken= true;
                } else{
                    console.log("error" + data);
                }
            });
        }

        else{
            $scope.passwordMismatch = true;
        }
        
    };
});



simpleformsApp.controller('dashboardCtrl', function($scope, $http, $stateParams, LoginService) {
    $scope.user = LoginService.getUser();
    
    $http.get('/recent_forms/' + $scope.user.id)
        .then(function successCallback(response) {
            $scope.recentForms = response.data.forms;
        }, function errorCallback(response) {
            console.log("error" + response);
        });
    $http.get('/recent_responses/' + $scope.user.id)
        .then(function successCallback(response) {
            $scope.recentResponses = response.data.responses;
        }, function errorCallback(response) {
            console.log("error" + response);
        });
});

simpleformsApp.controller('createresponseCtrl', function($scope, $http, $stateParams, $state) {
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
                console.log("error" + response);
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
                $state.go("dashboard");
            });
    };
});
simpleformsApp.controller('viewresponseCtrl', function($scope, $http, $stateParams) {
    $http.get('/response/' + $stateParams.responseId)
        .then(function successCallback(response) {
            $scope.response = response.data;
        }, function errorCallback(response) {
            console.log("error" + response);
        });
});
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