(function() {

    "use strict";

    angular.module("myApp")
        .directive("dlcLogInfo", dlcLogInfoDirective);

    //directive, that will have nagigation for users (it changes when user logged in)
    function dlcLogInfoDirective() {

        return {

            restrict: "EA",
            replace: true,
            templateUrl: "templates/log-info.html",
            scope: {
                isLoggedIn: "=",
                userName: "=",
                classInfo: "@",
                logout: "&"
            },

            link: function($scope, $element, $attrs) {

                if(!$scope.classInfo) {
                    $scope.classInfo = "";
                }

            }

        };

    }

}());