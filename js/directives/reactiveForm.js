(function() {

    "use strict";

    angular.module('myApp')
        .directive('reactiveForm', reactiveForm);

    /*
     *   This directive clear the styles of form when user click cancel
     */
    function reactiveForm() {

        var baseClasses = {
            successForm: "has-success",
            errorForm: "has-error",
            success: "alert alert-success",
            error: "alert alert-danger",
        };

        return {

            restrict: 'A',
            require: 'form',
            scope: {
                clearForm: "=",
            },
            link: function(scope, element, attrs, ctrl) {

                var errorBlocksClass = attrs["errBlockClass"];

                scope.$watch("clearForm", clearForm);

                function clearForm(value, oldValue) {
                    if(value) {
                        clearClubForm();
                        scope.clearForm = false;
                    }
                }

                function clearClubForm() {
                    var fieldsSuccess = element.find("." + baseClasses.successForm),
                        fieldsError = element.find("." + baseClasses.errorForm),
                        errorBlocks = element.find("." + errorBlocksClass);
                    if(fieldsSuccess.length) {
                        fieldsSuccess.removeClass(baseClasses.successForm);
                    }
                    if(fieldsError.length) {
                        fieldsError.removeClass(baseClasses.errorForm);
                    }
                    if(errorBlocks.length) {
                        errorBlocks.css("display", "none");
                    }
                    ctrl.$setPristine();
                    ctrl.$setUntouched();
                }

            },

        };

    }

}());