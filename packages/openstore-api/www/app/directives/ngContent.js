var ngContent = function() { //From http://stackoverflow.com/a/19802130
    return {
        link: function($scope, $element, $attrs) {
            $scope.$watch($attrs.ngContent, function(value) {
                $element.attr('content', value);
            });
        }
    };
};

module.exports = ngContent;
