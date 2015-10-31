(function () {

    "use strict";

    angular.module("myApp")
        .directive("dlcPagination", dlcPaginationDirective);

    dlcPaginationDirective.$inject = ["$location"];

    //directive for pagination
    function dlcPaginationDirective($location) {

        return {

            restrict: "EA",

            replace: true,

            templateUrl: "templates/pagination.html",

            scope: {
                pages: "=dlcPagination",
                page: "=",
                btnBlockClass: "@",
                btnClass: "@",
                firstLastPagsStartOn: "@",
                baseHref: "@",
                firstGood: "@",
            },

            link: function($scope, $element, $attrs) {

                var manyPags = 8,
                    pagsCreated = false;

                if(!$scope.btnBlockClass) {
                    $scope.btnBlockClass = "btn-group";
                }
                if(!$scope.btnClass) {
                    $scope.btnClass = "btn btn-default";
                }
                if(!$scope.firstLastPagsStartOn) {
                    $scope.firstLastPagsStartOn = 6;
                }

                if(!$scope.baseHref) {
                    $scope.baseHref = $location.path();
                }
                if($scope.baseHref.indexOf("page") === -1) {
                    $scope.baseHref = $scope.baseHref[$scope.baseHref.length - 1] === "/" ? $scope.baseHref + "page/" : $scope.baseHref + "/page/";
                }
                else {
                    $scope.baseHref = $scope.baseHref.substring(0, $scope.baseHref.indexOf("page")) + "page/";
                }

                $scope.$watch('pages', function(newValue, oldValue) {
                    if($scope.firstGood === "true") {
                        setTimeout(setPages, 0);
                        $scope.firstGood = false;
                    }
                    else if(newValue > 1 && oldValue !== newValue) {
                        setTimeout(setPages, 0);
                    }
                });

                function setPages() {
                    var childBefore = $element.children()
                            .eq($scope.pages < $scope.firstLastPagsStartOn ? 0 : 1),
                        htmlText = "", i, lh, start;
                    if(pagsCreated) {
                        var pagsElements = $element.children();
                        pagsElements.each(function() {
                            var thatHtml = this.innerHTML;
                            if(thatHtml === "..." || !isNaN(+thatHtml)) {
                                angular.element(this).remove();
                            }
                        });
                    }
                    if($scope.pages <= manyPags || $attrs["alwaysFull"] === "true") {
                        for (i = 0, lh = $scope.pages; i < lh; i++) {
                            htmlText += setPage(i);
                        }
                    }
                    else {
                        for (i = 0, lh = 2; i < lh; i++) {
                            htmlText += setPage(i);
                        }
                        if($scope.page === 2) {
                            htmlText += setPage(2);
                        }
                        if($scope.page < 3 || $scope.page > 4) {
                            htmlText += '<span class="fromto">...</span>';
                        }
                        if($scope.page > 2 && $scope.page <= $scope.pages - 2) {
                            start = $scope.page === 3 ? 2 : $scope.page - 2;
                            for (i = start, lh = $scope.page + 1; i < lh; i++) {
                                htmlText += setPage(i);
                            }
                            if($scope.pages - 2 - $scope.page > 1) {
                                htmlText += '<span class="fromto">...</span>';
                            }
                        }
                        if($scope.page === $scope.pages - 2) {
                            start = $scope.pages - 1;
                        }
                        else if($scope.page === $scope.pages - 1) {
                            start = $scope.pages - 3;
                        }
                        else {
                            start = $scope.pages - 2;
                        }
                        for(i = start; i < $scope.pages; i++) {
                            htmlText += setPage(i);
                        }
                    }
                    childBefore.after(htmlText);
                    pagsCreated = true;
                }

                function setPage(i) {
                    var htmlText;
                    if (i !== $scope.page - 1) {
                        htmlText = '<a href="' + $scope.baseHref + (i + 1) + '" class="' + $scope.btnClass + '">' + (i + 1) + '</a>';
                    }
                    else {
                        htmlText = '<button class="' + $scope.btnClass + ' active' + '" disabled>' + (i + 1) + '</button>';
                    }
                    return htmlText;
                }

            }

        };

    }

}());