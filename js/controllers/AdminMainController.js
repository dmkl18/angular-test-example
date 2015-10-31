(function() {

    "use strict";

    angular.module("myApp")
        .controller("AdminMainController", AdminMainController);

    AdminMainController.$inject = ["$scope", "userService"];

    function AdminMainController($scope, userService) {

        $scope.user = {};

        init();

        function init() {
            $scope.user = userService.getCurrentUserInfo();
        }

    }

}());