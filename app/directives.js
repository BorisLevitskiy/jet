angular.module('directives', ['dataStore'])
    .directive('jetPopover', function() {
        return {

            link: function(scope, element, attrs) {
               element.popover({content: scope.$eval(attrs.jetPopover)});
            }
        }
    })
    .directive('tabNavigate', function(){
        return {
            link: function(scope, element, attrs) {
                var selector = '[href=' + attrs.tabNavigate + ']';
                element.click(function(){
                    $(selector).click();
                });
            }
        }
    })
    .directive("jetAutosave", function (dataStore) {
        return {
            link: function (scope, element, attrs) {
                element.change(function (e) {

                    var el = e.target, id = el.id;
                    if (el.getAttribute("type") === "checkbox") {
                        if (el.checked) {
                            dataStore.setItem(id, true);
                        } else {
                            dataStore.removeItem(id);
                        }
                        return;
                    }
                    localStorage.setItem(id, el.value);
                });
            }
        }
    })
    .directive("jetAllowTabChar", function () {
        return {
            scope:{
                tabsToSpaces:"=jetAllowTabChar"
            },
            link: function (scope, element, attrs) {
                // console.log("allow tab char scope", scope);
                var cfg = {
                    tabsToSpaces: scope.tabsToSpaces === true
                };

                scope.$watch('tabsToSpaces', function (v) {
                    cfg.tabsToSpaces = v === true;
                    console.log('cfg.tabsToSpaces', cfg.tabsToSpaces);
                });

                element.allowTabChar(cfg);
            }
        }
    })
;