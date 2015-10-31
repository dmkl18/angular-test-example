(function() {

    "use strict";

    angular.module("myApp")
        .directive("dlcImagePreview", dlcImagePreviewDirective);

    //image preview before saving
    //image can be added using button or by drag and drop
    //parameters of scope
    //  - imageValue - object that will have property image in base64
    //  - number - random number that will be added to id of input with type = file
    //  - propertyName - name of property that will have image in base64 in object imageValue
    function dlcImagePreviewDirective() {

        var baseMsgClasses = {
                base: "base",
                success: "success",
                error: "error"
            },
            defaultMaxFileSize = 2*1024*1024,
            defaultPropertyName = "image";

        return {

            restrict: "EA",
            replace: true,
            templateUrl: "templates/image-preview.html",

            scope: {
                imageValue: "=",
                message: "=",
                number: "@",
                maxFileSize: "@",
                propertyName: "@",
                clearImage: "=",
            },

            link: function($scope, $element, $attrs) {

                if(!$scope.number) {
                    $scope.number = "0";
                }

                if(!$scope.propertyName) {
                    $scope.propertyName = defaultPropertyName;
                }

                $scope.$watch("clearImage", clearImage);

                var children = $element.children(),
                    fileElem = children.eq(0).find("input"),
                    maxFileSize = $scope.maxFileSize ? +$scope.maxFileSize : defaultMaxFileSize,
                    progressDivElem = children.eq(2).find("div").eq(1),
                    progressSpanElem = children.eq(2).find("span").eq(0),
                    picture;

                init();

                function init() {
                    children.eq(1).css("display", "none");
                    children.eq(2).css("display", "none");
                    //events
                    setChangeFileEvent(fileElem);
                    children.eq(0).on("drop", function(event) {
                        prepareImage(event, true);
                        $scope.$apply();
                    });
                    children.eq(0).on('dragover', function(event){ handleDragOE(event); });
                    children.eq(0).on('dragenter', function(event){ handleDragOE(event); });
                    children.eq(1).find("button").on("click", function(event) {
                        removeCurrentImage();
                        $scope.$apply();
                    });
                }

                function setChangeFileEvent(fileElem) {
                    fileElem.on("change", function(event) {
                        prepareImage(event);
                        $scope.$apply();
                    });
                }

                function clearImage(value, oldValue) {
                    if(value) {
                        removeCurrentImage();
                        $scope.clearImage = false;
                    }
                }

                //create new input with type file, if adding of picture was canceled
                function changeFileElem() {
                    var fileId = fileElem.attr("id"),
                        fileName = fileElem.attr("name");
                    fileElem.off("change");
                    fileElem.remove();
                    children.eq(0).append('<input type="file" id="' + fileId + '" name="' + fileName + '" />');
                    fileElem = children.eq(0).find("input");
                    setChangeFileEvent(fileElem);
                }

                function handleDragOE(event) {
                    event.stopPropagation();
                    event.preventDefault();
                }

                //It can be added only one image
                function prepareImage(event, drop) {
                    if(drop) {
                        handleDragOE(event);
                    }
                    var files = drop ? (event.originalEvent ? event.originalEvent.dataTransfer.files
                        : event.dataTransfer.files)
                        : event.target.files;
                    if(files.length > 1) {
                        $scope.message.message = "It can be added only one image";
                        $scope.message.type = baseMsgClasses.base;
                    }
                    picture = files[0];
                    if(!picture) {
                        createBeforeSendErrorMessage("You must add image");
                        return;
                    }
                    if(picture.size > maxFileSize) {
                        createBeforeSendErrorMessage("The size of file is too large");
                        return;
                    }
                    if(picture.type != "image/png" && picture.type != "image/jpg" && picture.type != "image/jpeg" && picture.type != "image/gif") {
                        createBeforeSendErrorMessage("Image must have type JPG, PNG or GIF");
                        return;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL(picture);
                    reader.onload = readFile;
                    reader.onloadstart = prepareReadFile;
                    reader.onprogress = progressReadFile;
                }

                function createBeforeSendErrorMessage(message) {
                    $scope.message.message = message;
                    $scope.message.type = baseMsgClasses.error;
                    changeFileElem();
                }

                function prepareReadFile() {
                    children.eq(0).css("display", "none");
                    children.eq(2).css("display", "block");
                }

                function progressReadFile(event) {
                    var value = (event.loaded / event.total) * 100;
                    progressSpanElem.text(Math.round(value) + " %");
                    progressDivElem.css("width", value + "%");
                }

                function readFile(event) {
                    var imageDivElem = children.eq(1),
                        imageElem = new Image();
                    imageElem.src = event.target.result;
                    imageElem.setAttribute("alt", picture.name);
                    imageElem.onload = function() {
                        children.eq(0).css("display", "none");
                        children.eq(2).css("display", "none");
                        imageDivElem.css("display", "block");
                        imageDivElem.append(imageElem);
                        $scope.imageValue[$scope.propertyName] = imageElem.src;
                        $scope.$apply();
                    };
                    $scope.$apply();
                }

                function removeCurrentImage() {
                    children.eq(0).css("display", "block");
                    children.eq(1).css("display", "none");
                    children.eq(1).find("img").remove();
                    changeFileElem();
                    delete $scope.imageValue[$scope.propertyName];
                }

            }

        }

    }

}());