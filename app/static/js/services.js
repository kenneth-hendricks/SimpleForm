simpleformsApp.service('viewformsService', function($http){

    this.getForms = function(){
        return $http.get('/forms');
    };

});