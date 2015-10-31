(function() {

    "use strict";

    angular.module("myApp")
        .controller("ArticlesActionController", ArticlesActionController);

    ArticlesActionController.$inject = ["$scope", "$location", "articlesFirebaseService"];

    function ArticlesActionController($scope, $location, articlesFirebaseService) {

        $scope.formPrepare = {
            withImage: true,
            clearForm: false,
        };

        $scope.articleToAdd = {};

        $scope.actionInfo = {
            isAddingProcess: false,
            successAddingMessage: "You successfully added article",
            errorAddingMessage: "An error occurred",
        };

        $scope.addArticleProccess = {
            isShown: false,
            show: showAddArticleMessage,
            close: closeAddArticleMessage,
        };

        $scope.addArticle = addArticle;
        $scope.clearArticleForm = clearArticleForm;

        init();

        function init() {
            if(typeof(FileReader) === "undefined") {
                $scope.formPrepare.withImage = false;
                console.log($scope.formPrepare.withImage);
            }
        }

        function addArticle(form) {
            if(form.$valid) {
                $scope.actionInfo.isAddingProcess = true;
                $scope.articleToAdd.datetime = Date.now();
                var promise = articlesFirebaseService.addArticle($scope.articleToAdd);
                promise.then(addArticleSuccess, addArticleError);
            }
        }

        function addArticleSuccess(data) {
            $scope.actionInfo.isAddingProcess = false;
            $scope.dlcGlobalMessage.message = $scope.actionInfo.successAddingMessage;
            $scope.dlcGlobalMessage.type = "success";
            clearArticleForm();
            $location.path("articles/" + data.key());
        }

        function addArticleError(error) {
            $scope.actionInfo.isAddingProcess = false;
            $scope.dlcGlobalMessage.message = $scope.actionInfo.errorAddingMessage;
            $scope.dlcGlobalMessage.type = "error";
            console.error(error);
        }

        function clearArticleForm() {
            $scope.articleToAdd = {};
            $scope.formPrepare.clearForm = true;
        }

        function closeAddArticleMessage() {
            $scope.addArticleProccess.isShown = false;
        }

        function showAddArticleMessage() {
            $scope.addArticleProccess.isShown = true;
        }

    }

}());