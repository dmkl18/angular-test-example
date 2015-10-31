(function() {

    "use strict";

    angular.module("myApp", ["ngRoute", "firebase", "ngAnimate"])
        .constant("FIREBASE_PATH", "https://intense-fire-2076.firebaseIO.com")
        .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {

            $routeProvider.when("/articles", {
                templateUrl: "views/articles.html",
                controller: "ArticlesController",
            }).when("/articles/page/:page", {
                templateUrl: "views/articles.html",
                controller: "ArticlesController",
            }).when("/articles/:article", {
                templateUrl: "views/article.html",
                controller: "ArticleController",
            }).when("/admin/articles/add", {
                templateUrl: "views/add-article.html",
                controller: "ArticlesActionController",
                needAuth: true,
            }).when("/login", {
                templateUrl: "views/login.html",
                controller: "LoginController",
                withoutAuth: true,
            }).when("/admin", {
                templateUrl: "views/admin-main.html",
                controller: "AdminMainController",
                needAuth: true,
            }).otherwise({
                redirectTo: "/articles",
            });

            $locationProvider.html5Mode(true).hashPrefix("!");

        }])
        .run(["$rootScope", "$location", "userService", function($rootScope, $location, userService) {

            $rootScope.dlcGlobalMessage = {
                message: "",
                type: "base",
                showTime: 4000,
            };

            $rootScope.$on('$routeChangeStart', function(event, next, current) {
                if(next && next.$$route ) {
                    var isLoggedIn = userService.checkIfUserLoggedIn();
                    if(next.$$route.needAuth === true && !isLoggedIn) {
                        event.preventDefault();
                        $location.path("/login");
                        $rootScope.dlcGlobalMessage.message = "You need to login";
                        $rootScope.dlcGlobalMessage.type = "error";
                    }
                    else if(next.$$route.withoutAuth === true && isLoggedIn) {
                        event.preventDefault();
                        $rootScope.dlcGlobalMessage.message = "You have already logged in";
                        $rootScope.dlcGlobalMessage.type = "base";
                        $location.path("/");
                    }
                }
            });

        }]);

}());