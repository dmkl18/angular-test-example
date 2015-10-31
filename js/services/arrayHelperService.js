(function() {

    "use strict";

    angular.module("myApp")
        .service("arrayHelperService", arrayHelperService);

    function arrayHelperService() {

        this.createGroupsFromArray = function(items, groupedBy) {
            if (items) {
                var newItems = [],
                    nit = [],
                    ct = 0;
                for(var i=0; i<items.length; i++) {
                    if(i%groupedBy === 0 && i !== 0) {
                        newItems[ct] = angular.copy(nit);
                        ct++;
                        nit = [];
                    }
                    nit.push(items[i]);
                }
                newItems[ct] = angular.copy(nit);
                return newItems;
            }
        };

    }

}());