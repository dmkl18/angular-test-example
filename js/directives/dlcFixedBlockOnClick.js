(function() {

    "use strict";

    angular.module("myApp")
        .directive("dlcFixedBlockOnClick", dlcFixedBlockOnClickDirective);

    //directive to show message when click on element
    //dlcFixedBlockOnClick - id of the block that will be shown
    function dlcFixedBlockOnClickDirective() {

        return {

            restrict: 'A',

            scope: {
                dlcFixedBlockOnClick: "@",
            },

            link: function($scope, $element, $attrs) {

                var fixedBlock = document.getElementById($scope.dlcFixedBlockOnClick);

                if(fixedBlock) {
                    fixedBlock.style.display = "none";
                    $element.on("click", toggleBlock);
                }

                function toggleBlock(event) {
                    if (fixedBlock.style.display === "none") {
                        fixedBlock.style.display = "block";
                    }
                    else {
                        fixedBlock.style.display = "none";
                    }
                }

            }

        }

    }

}());