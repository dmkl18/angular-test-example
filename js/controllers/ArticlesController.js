(function() {

    "use strict";

    angular.module("myApp")
        .controller("ArticlesController", ArticlesController);

    ArticlesController.$inject = ["$scope", "$routeParams", "articlesFirebaseService", "arrayHelperService"];

    function ArticlesController($scope, $routeParams, articlesFirebaseService, arrayHelperService) {

        var countMaterialOnPage = 6,
            materialInLine = 2;

        $scope.articlesPrepare = {
            showLoading: true,
            isResult: false,
            isMistake: false,
            isEmpty: false,
            mistakeMessage: "",
            emptyMessage: "There is no articles now, but you can visit our site later",
            baseDescriptionLength: 150,
        };

        $scope.articles = {
            values: [],
            page: 0,
            pages: 0,
        };

        init();

        function init() {
            var page = +$routeParams["page"];
            if(!page || page <= 0) {
                if($routeParams["page"] === undefined) {
                    page = 1;
                }
                else {
                    $scope.articlesPrepare.showLoading = false;
                    $scope.articlesPrepare.isMistake = true;
                    $scope.articlesPrepare.mistakeMessage = "You must enter a correct number of page";
                    return;
                }
            }
            getArticles(page);
            $scope.articles.page = page;
        }

        function getArticles(page) {
            var promise = articlesFirebaseService.getArticlesByPage(page, countMaterialOnPage);
            promise.then(getArticlesSuccess, getArticlesError);
        }

        function getArticlesSuccess(result) {
            $scope.articlesPrepare.showLoading = false;
            if(result.data.length === 0) {
                $scope.articlesPrepare.isEmpty = true;
            }
            else {
                $scope.articlesPrepare.isResult = true;
                $scope.articles.values = arrayHelperService.createGroupsFromArray(result.data, materialInLine);
                $scope.articles.page = result.page;
                $scope.articles.pages = result.pages;
            }
        }

        function getArticlesError(error) {
            $scope.articlesPrepare.showLoading = false;
            $scope.articlesPrepare.isMistake = true;
            $scope.articlesPrepare.mistakeMessage = error.message;
            console.error(error.message);
        }

    }

}());