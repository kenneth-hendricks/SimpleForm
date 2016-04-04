var simpleformsApp = angular.module('simpleformsApp', ['ui.router']);

simpleformsApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  // Now set up the states
  $stateProvider
    .state('home', {
        url: "/",
        templateUrl: "../static/partials/home.html"
      })
    .state('create_form', {
      url: "/create_form",
      templateUrl: "../static/partials/create_form.html"
    })
    .state('view_forms', {
      url: "/view_forms",
      templateUrl: "../static/partials/view_forms.html"
    })
    .state('view_response', {
      url: "/view_response/:responseId",
      templateUrl: "../static/partials/view_response.html"
    })
    .state('analyse_responses', {
      url: "/analyse_responses",
      templateUrl: "../static/partials/analyse_responses.html"
    })
    .state('create_response', {
        url: "/create_response/:formId",
        templateUrl: "../static/partials/create_response.html"
    });

});


