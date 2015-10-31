(function() {

    "use strict";

    angular.module("myApp")
        .directive("dlcArticle", dlcArticleDirective);

    //directive to show article preview
    function dlcArticleDirective() {

        return {

            restrict: 'AE',
            replace: true,
            templateUrl: "templates/article.html",

            scope: {
                dlcArticle: "=",
                articleLength: "@"
            },

            link: function($scope, $element, $attrs) {
                var baseLength = 100;
                if(!+$scope.articleLength) {
                    $scope.articleLength = baseLength;
                }
            }

        }

    }

}());