(function() {

    "use strict";

    angular.module("myApp")
        .controller("ArticleController", ArticleController);

    ArticleController.$inject = ["$scope", "$routeParams", "articlesFirebaseService"];

    function ArticleController($scope, $routeParams, articlesFirebaseService) {

        $scope.articlePrepare = {
            showLoading: true,
            isResult: false,
            isMistake: false,
            mistakeMessage: "There is no such article",
        };

        $scope.article = {};

        $scope.imageArticleView = {
            isShown: false,
            show: showArticleImage,
            close: closeArticleImage,
        };

        init();

        function init() {
            var article = $routeParams["article"];
            getArticle(article);
        }

        function getArticle(data) {
            var promise = articlesFirebaseService.getArticle(data);
            promise.then(getArticleSuccess, getArticleError);
        }

        function getArticleSuccess(data) {
            $scope.articlePrepare.showLoading = false;
            $scope.articlePrepare.isResult = true;
            $scope.article = data;
        }

        function getArticleError(error) {
            $scope.articlePrepare.showLoading = false;
            $scope.articlePrepare.isMistake = true;
            console.error(error.message);
        }

        function showArticleImage() {
            $scope.imageArticleView.isShown = true;
        }

        function closeArticleImage() {
            $scope.imageArticleView.isShown = false;
        }

    }

}());