(function() {

    "use strict";

    angular.module("myApp")
        .filter("dlcDateFilter", dlcDateFilter);

    function dlcDateFilter() {

        return function(value) {

            var date = +value,
                minutes;
            if(!date) {
                return value;
            }

            date = new Date(date);

            minutes = date.getMinutes();
            if(minutes < 10) {
                minutes = "0" + minutes;
            }
            value = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " +
                date.getHours() + ":" + minutes;

            return value;

        }

    }

}());