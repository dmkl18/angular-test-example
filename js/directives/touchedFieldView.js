(function() {

    "use strict";

    angular.module('myApp')
        .directive('touchedFieldView', touchedFieldView);

    //directive to add/remove styles to elements of the form when validate them
    function touchedFieldView() {

        var baseClasses = {
            success: "has-success",
            error: "has-error",
        };

        return {

            restrict: 'A',
            require: '^form',
            scope: {
                param: '@touchedFieldView',
            },
            link: function(scope, element, attrs, ctrl) {

                var chElem = angular.element(document.querySelector("form[name=" + ctrl.$name + "] [name=" + scope.param + "]")),
                    needCheckAjax = attrs['checkAjaxView'],
                    helpBlockClass = attrs['errBlockClass'];

                if(chElem.length) {
                    chElem.on('blur', createView);
                    if(needCheckAjax === "true") {
                        chElem.on('checkTouchedFieldView', createView);
                    }
                }

                function createView(event) {
                    var messageBlock;
                    if(ctrl[scope.param].$invalid && ctrl[scope.param].$touched) {
                        element.addClass(baseClasses.error);
                        messageBlock = angular.element(document.querySelector("form[name=" + ctrl.$name + "] [touched-field-view=" + scope.param + "] ." + helpBlockClass));
                        if(messageBlock.length) {
                            messageBlock.css('display', 'block');
                        }
                    }
                    else if(element.hasClass(baseClasses.error)) {
                        element.removeClass(baseClasses.error);
                        messageBlock = angular.element(document.querySelector("form[name=" + ctrl.$name + "] [touched-field-view=" + scope.param + "] ." + helpBlockClass));
                        if(messageBlock.length) {
                            messageBlock.css('display', 'none');
                        }
                    }

                    if(ctrl[scope.param].$valid && ctrl[scope.param].$touched) {
                        element.addClass(baseClasses.success);
                    }

                }

            },

        };

    }

}());