(function() {

    "use strict";

    angular.module("myApp")
        .filter("beginStringFilter", beginStringFilter);

    function beginStringFilter() {

        var baseStringLength = 100,
            anchors = [" ", ",", ".", "?", "!", ":", ";"];

        return function(value, length) {

            var lh = length ? length : baseStringLength,
                fullString = false,
                n;

            if(!angular.isString(value)) {
                return value;
            }

            if(value.length > lh) {
                n = lh;
                while(anchors.indexOf(value[n]) === -1) {
                    if(n >= value.length) {
                        fullString = true;
                        break;
                    }
                    n++;
                }
                if(!fullString) {
                    value = value.substr(0, n) + "...";
                }
            }

            return value;

        }

    }

}());