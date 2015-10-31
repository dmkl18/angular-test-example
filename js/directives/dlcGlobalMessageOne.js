(function() {

    "use strict";

    angular.module("myApp")
        .directive("dlcGlobalMessageOne", dlcGlobalMessageOneDirective);

    //directive to show global message, that will be shown during showTime milliseconds
    //type can be success, error, base
    function dlcGlobalMessageOneDirective() {

        "use strict";

        var baseViewClasses = {
                base: "bg-primary",
                success: "bg-success",
                error: "bg-danger",
            },
            baseClasses = {
                main: "dlc-gl-msg-one",
                showMessage: "show-message",
                btnClasses: "btn btn-xs btn-danger"
            },
            baseShowTime = 5000;

        return {

            restrict: "EA",

            template: '<div><p ng-bind="message"></p></div><div><button type="button" class="' + baseClasses.btnClasses + '">x</button></div>',

            scope: {
                message: "=",
                type: "=",
                showTime: "@"
            },

            link: function($scope, $element, $attrs) {

                $element.addClass(baseClasses.main);

                var closeElements = $element.find("button"),
                    removingClasses = baseViewClasses.base + " " + baseViewClasses.success + " " +
                        baseViewClasses.error + " " + baseClasses.showMessage,
                    tm;

                closeElements.on("click", close);

                $scope.$watch("message", function(newValue, oldValue) {
                    if(newValue !== "") {
                        if(tm) {
                            clearTimeout(tm);
                            $element.removeClass(removingClasses);
                        }
                        showMessage();
                    }
                });

                function showMessage() {
                    $element.addClass(baseClasses.showMessage)
                        .addClass(baseViewClasses[$scope.type] ? baseViewClasses[$scope.type] : baseViewClasses.base);
                    tm = setTimeout(function() {
                            hideMessage();
                            $scope.$apply();
                        },
                        $scope.showTime ? +$scope.showTime : baseShowTime);
                }

                function hideMessage() {
                    $scope.message = "";
                    if($scope.type) {
                        $scope.type = "base";
                    }
                    $element.removeClass(removingClasses);
                }

                function close() {
                    if(tm) {
                        clearTimeout(tm);
                    }
                    hideMessage();
                    $scope.$apply();
                }

            },

        };

    }

}());