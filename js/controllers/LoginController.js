(function() {

    "use strict";

    angular.module("myApp")
        .controller("LoginController", LoginController);

    LoginController.$inject = ["$scope", "$location", "$rootScope", "userService"];

    function LoginController($scope, $location, $rootScope, userService) {

        var logInEventHandlerName = "logInSuccess";

        $scope.formPrepare = {
            clearForm: false,
        };

        $scope.userActions = {
            isLoginProccess: false,
        };

        $scope.userInfo = {
            isUserLoggedIn: false,
            user: {},
        };

        $scope.user = {};

        $scope.login = login;
        $scope.clearLoginForm = clearLoginForm;
        $scope.logout = logout;

        $scope.$on(logInEventHandlerName, logInSuccessHandler);

        init();

        function init() {
            if(userService.checkIfUserLoggedIn()) {
                logInSuccessHandler();
            }
        }

        function login(form) {
            if(form.$valid) {
                $scope.userActions.isLoginProccess = true;
                var promise = userService.login($scope.user);
                promise.then(loginSuccess, loginError);
            }
        }

        function loginSuccess(data) {
            $scope.userActions.isLoginProccess = false;
            $scope.dlcGlobalMessage.message = "You have successfully logged in";
            $scope.dlcGlobalMessage.type = "success";
            $rootScope.$broadcast(logInEventHandlerName);
            $location.path("/");
        }

        function loginError(error) {
            $scope.userActions.isLoginProccess = false;
            $scope.dlcGlobalMessage.message = "You set wrong email or password";
            $scope.dlcGlobalMessage.type = "error";
            console.error(error);
        }

        function clearLoginForm() {
            $scope.user = {};
            $scope.formPrepare.clearForm = true;
        }

        function logout() {
            userService.logout();
            $scope.userInfo.isUserLoggedIn = false;
            $scope.userInfo.user = {};
            $scope.dlcGlobalMessage.message = "You have logged out";
            $scope.dlcGlobalMessage.type = "base";
            $location.path("/");
        }

        function logInSuccessHandler() {
            $scope.userInfo.isUserLoggedIn = true;
            $scope.userInfo.user = userService.getCurrentUserInfo();
        }

    }

}());