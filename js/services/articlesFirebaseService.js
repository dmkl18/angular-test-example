(function () {

    "use strict";

    angular.module("myApp")
        .factory("articlesFirebaseService", articlesFirebaseService);

    articlesFirebaseService.$inject = ["$q", "$firebaseObject", "$firebaseArray", "$timeout", "FIREBASE_PATH"];

    function articlesFirebaseService($q, $firebaseObject, $firebaseArray, $timeout, FIREBASE_PATH) {

        var connectionString = FIREBASE_PATH + "/articles",
            base = null,
            currentArticles = {},
            isFirstData = false;

        init();

        function init() {
            base = new Firebase(connectionString).orderByChild("datetime");
        }

        function getAllArticles() {
            var articlesList = $firebaseArray(base);
            return articlesList.$loaded();
        }

        function getArticlesOnPage(page, countOnPage) {
            var lastPageArticleNumber = page * countOnPage,
                result = {
                    page: page,
                    pages: Math.ceil(currentArticles.length / countOnPage),
                    isCorrectData: false,
                    data: [],
                };
            if(currentArticles.length === 0 && page === 1) {
                result.isCorrectData = true;
                return result;
            }
            if(page < 1 || (lastPageArticleNumber - countOnPage) >= currentArticles.length) {
                return result;
            }
            var startArticle = currentArticles.length - lastPageArticleNumber,
                endArticle = startArticle + countOnPage;
            if(startArticle < 0) {
                startArticle = 0;
            }
            result.isCorrectData = true;
            result.data = [].slice.call(currentArticles, startArticle, endArticle).reverse();
            return result;
        }

        function getArticlesByPage(page, countOnPage) {
            var deferred = $q.defer();
            if(isFirstData) {
                $timeout(function() {
                    var pageArticles = getArticlesOnPage(page, countOnPage);
                    pageArticles.isCorrectData ? deferred.resolve(pageArticles) : deferred.reject({
                        message: "There is no such page",
                    });
                }, 0);
            }
            else {
                getAllArticles().then(function(data) {
                    currentArticles = data;
                    var pageArticles = getArticlesOnPage(page, countOnPage);
                    pageArticles.isCorrectData ? deferred.resolve(pageArticles) : deferred.reject({
                        message: "There is no such page",
                    });
                    isFirstData = true;
                }, function(error) {
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        }

        function getArticle(data) {
            var deferred = $q.defer();
            if(isFirstData) {
                $timeout(function () {
                    var article = currentArticles.$getRecord(data);
                    article != null ? deferred.resolve(article)
                        : deferred.reject({
                        message: "There is no such article",
                    });
                }, 0);
            }
            else {
                $firebaseObject(new Firebase(connectionString + "/" + data)).$loaded()
                    .then(function(data) {
                        data.$value === null ? deferred.reject({
                            message: "There is no such article",
                        }) : deferred.resolve(data);
                    }, function(error) {
                        deferred.reject(error);
                    });
            }
            return deferred.promise;
        }

        function addArticle(data) {
            if(isFirstData) {
                return currentArticles.$add(data);
            }
            return $firebaseArray(base).$add(data);
        }

        return {
            getArticle: getArticle,
            getArticlesByPage: getArticlesByPage,
            addArticle: addArticle,
        };

    }

}());