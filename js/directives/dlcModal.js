(function() {

    "use strict";

    angular.module("myApp")
        .directive('dlcModal', dlcModalDirective);

    //directive for modal window
    function dlcModalDirective() {

        return {

            restrict: 'AE',
            replace: true,
            transclude: true,
            templateUrl: "templates/modal.html",
            scope: {
                isShown: "=show",
                header: "@modalTitle",
                close: "&",
                notNeedToCloseByEvent: "@"
            },

            link: function($scope, $element, $attrs) {

                if($scope.notNeedToCloseByEvent === "true") {
                    return;
                }

                $scope.$watch("isShown", createKeyNav);

                function createKeyNav(newValue, oldValue) {
                    newValue ? document.addEventListener("keyup", closeWindow, false) : document.removeEventListener("keyup", closeWindow, false);
                }

                function closeWindow(event) {
                    if(+event.which === 27) {
                        $scope.close();
                        $scope.$apply();
                    }
                }

            }

        };

    }

}());