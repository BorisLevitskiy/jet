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

    .filter('highlightData', function ($sce, jet) {

        return function (input) {
            var output = input;
            var specs = jet.specificators;

            for (var i = 0; i < specs.length; i++) {
                var spec = specs[i];
                output = output.replace(spec.translate, "<span style='color:gray' title='" + spec.description + "'>" + spec.token + "</span>");
            }

            return $sce.trustAsHtml(output);
            ;
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

    });
//
//    .filter('highlightOutput', function ($sce, jet) {
//
//        return function (input) {
//            var replacements = {
//                '<span class="integer">$&</span>' : /d+/g
//            };
//
//            _.aggr
//
//            return $sce.trustAsHtml(toHtml(output));
//        });

//TODO: Move to htmlHelper factory
function toHtml(input) {
    return input.replace(/\n|\r\n|\r/g, "<br/>")
        .replace("\t","&nbsp;&nbsp;&nbsp;&nbsp;")
}