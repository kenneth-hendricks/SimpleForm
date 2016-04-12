simpleformsApp.directive('sfTest', function() {
  return {
      //restrict: 'AE',
      //replace: 'true',
      template: '<h3>Hello World!!{{letter}}</h3>'
  };
});

simpleformsApp.directive('sfQuestion', function() {
  return {
      templateUrl: '../static/partials/create_form_question.html'
  };
});

simpleformsApp.directive('sfNav', function() {
  return {
      restrict : "A",
      templateUrl: '../static/partials/nav.html'
  };
});