"use strict";

/*
    TODO: Ideas:
    1. [x] Quick switch between templates (like shelves)
    2. [x] List of all macroses being available
    3. [ ] Page layout select
    4. [ ] Auto-complete
    5. [ ] Custom $global functions
 */
angular.module("app", ['dataStore', 'directives'])
    .factory('jet', function (){
        return window.jet;
    })
    .run(function($rootScope, dataStore) {
            $rootScope.isFirstRun = dataStore.getObject('config') != null; // TODO: Encapsulate getting config
            // TODO: Move to directive
            $("#copiedNotify").hide();
            var clip = new ZeroClipboard(document.getElementById("btnCopyToClipBoard"));
            clip.on('aftercopy', function() {
                $("#copiedNotify").show().delay(3000).fadeOut();
            });
    })
    .filter('highlightData', function ($sce, jet) {

        return function (input) {
            var output = input;
            var specs = jet.specificators;

            for (var i = 0; i < specs.length; i++) {
                var spec = specs[i];
                output = output.replace(spec.translate, "<span style='color:gray' title='" + spec.description + "'>" + spec.token + "</span>");
            }

            return $sce.trustAsHtml(output);

        }
    })
    .filter('highlightTemplate', function ($sce, jet) {

        return function (input) {
            var output = input;

            jet.tokens.forEach(function (t) {
                output = output.replace(t.regex, function(m){
                    var boundary = '<span class="match boundary">$&</span>';

                    var content = m.replace(/{{|}}/g, boundary);
                    return "<span class='match " + t.type.toLowerCase() + "' title='" + t.type + "'>" + toHtml(content) + "</span>";
                });
            });

            return $sce.trustAsHtml(toHtml(output));
        }

    })
    .filter('highlightOutput', function ($sce, jet) {

        return function (input) {
            return input;
            var replacements = {
                '<span class="doublequotes" style="font-weight:bold">$&</span>' : /"[^"]*"/g,
                '<span class="singlequotes" style="font-weight:bold">$&</span>' : /'[^']*'/g
            };

            _.each(replacements, function(regex, rep) {
               input = input.replace(regex, rep);
            });

            return $sce.trustAsHtml(toHtml(input));
        };
})

//TODO: Move to htmlHelper factory
function toHtml(input) {
    return input.replace(/\n|\r\n|\r/g, "<br/>")
        .replace("\t","&nbsp;&nbsp;&nbsp;&nbsp;")
}