(function() {

    "use strict";

    angular.module("myApp")
        .service("userService", userService);

    userService.$inject = ["$q", "$firebaseAuth", "FIREBASE_PATH"];

    function userService($q, $firebaseAuth, FIREBASE_PATH) {

        var userDataName = "user";

        this.checkIfUserLoggedIn = function() {
            var user = this.getCurrentUserInfo();
            if(user && user.expires * 1000 < Date.now()) {
                user = null;
                localStorage.removeItem(userDataName);
            }
            return user ? true : false;
        };

        this.login = function(data) {
            var deferred = $q.defer(),
                authObject = $firebaseAuth(new Firebase(FIREBASE_PATH));
            authObject.$authWithPassword({
                email: data.email,
                password: data.password
            }).then(function(data) {
                data.email = data.password.email;
                localStorage.setItem(userDataName, JSON.stringify(data));
                deferred.resolve(data);
            }, function(error) {
                deferred.reject({
                    message: error
                });
            });
            return deferred.promise;
        };

        this.getCurrentUserInfo = function() {
            return JSON.parse(localStorage.getItem(userDataName));
        };

        this.logout = function() {
            localStorage.removeItem(userDataName);
            var authObject = $firebaseAuth(new Firebase(FIREBASE_PATH));
            authObject.$unauth();
        };

    }

}());