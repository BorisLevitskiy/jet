angular.module("app")
    .controller("GeneratorCtrl", function($scope, jet, dataStore, stash, dataAdapters, symbols){
        var defaultTemplate =
            "$$item = $item\n" +
            "$$item[0] = $item[0]\n" +
            "$$item[1] = $item[1]\n" +
            "$$last = $last\n" +
            "$$first = $first\n" +
            "$$global.items = $global.items\n" +
            "Is first: {{ $first ? 'yes' : 'no' }}\n" +
            "Function: $global.foo()";

        var defaultData =
            "Alpha 1\n" +
            "Beta 2\n" +
            "Gamma 3\n";

        //console.log("Loaded isJson: %s",localStorage.getItem("isJson"));
        var configKey = 'config',
            storedConfig = dataStore.getObject(configKey),
            cfg = $scope.config = storedConfig || {
                                                    template: localStorage.getItem("template") || defaultTemplate,
                                                    data: localStorage.getItem("data") || defaultData,
                                                    isJson:localStorage.getItem("isJson") !== null || false,
                                                    joinWith: localStorage.getItem("joinWith") || "\\n",
                                                    dataRowSeparator:"\\n",
                                                    dataColumnSeparator:"\\s"
                                                  };

        $scope.stashTemplates = stash.getTemplates() || [];

        $scope.stashTemplate = function(t) {
            $scope.stashTemplates = stash.stashTemplate(cfg.template);
            cfg.template = "";
        };

        $scope.removeTemplateFromStash = function(index) {
            $scope.stashTemplates = stash.removeTemplate(index);
        };

        $scope.setTemplateFromStash = function(template, unstash) {
            cfg.template = template;
            if(unstash === true) {
                $scope.removeTemplateFromStash(template);
            }
        };

        $scope.$watch('config', function(newVal) {
            dataStore.setObject(configKey, newVal); // TODO: Incupsulate
        }, true);

        $scope.success = true;

        $scope.generate = function() {
            var out = document.getElementById("output");
            var output;

            try {
                console.log($scope.config);

                var cfg = $scope.config,
                    dataAdapter = cfg.isJson ? dataAdapters.json : dataAdapters.dataTable,
                    items = dataAdapter.parse(cfg.data, {
                        dataColumnSeparator: symbols.translate(cfg.dataColumnSeparator),
                        dataRowSeparator: symbols.translate(cfg.dataRowSeparator),
                        dataColumnSeparatorRegex: cfg.dataColumnSeparatorRegex
                    });
                output = jet.generateTemplate(items, { template: cfg.template, joinWith: symbols.translate(cfg.joinWith) });



                $scope.success = true;

            } catch (ex) {
                output = ex.stack;
                $scope.success = false;
            }

            //TODO: Replace by result parameter
            out.value = output;
            out.style.color = $scope.success ? "black" : "red";

            $scope.output = output;
        };

        $scope.spec = function(symbolOrSynonym) {
            var spec = symbols.find(symbolOrSynonym);
            return spec == null ? '' : spec.description;
        };

        $scope.isKnownSpec = function(symbolOrSynonym) {
           return symbols.isKnown(symbolOrSynonym);
        };

        $scope.helpHtml = function() {
            var html = ["<ul>"];

            _.each($scope.macroses, function(m) {
               html.push("<li><code>" + m.name + "</code> - " + m.description + "</li>");
            });

            html.push("</ul>");
            return html.join("\n");
        }

        $scope.macroses = [
            { name: "$item", description: "current item (row)" },
            { name: "$item[0]", description: "current item first column" },
            { name: "$item[1]", description: "current item second column" },
            { name: "$index", description: "index of an item" },
            { name: "$first", description: "true if item is first in list" },
            { name: "$last", description: "true if item is last in list" },
            { name: "$odd", description: "true if $index is odd" },
            { name: "$even", description: "true if $index is even" },
            { name: "$global", description: "global object" },
            { name: "$global.items", description: "all items" }
        ];


        if($scope.isFirstRun) {
            stash.stashTemplate(defaultTemplate);
        }
    });
