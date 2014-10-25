window.jet = (function(){
    var j = {};

    var shortExp = /([^\\]|^)(\$(item|index|global|first|last)([^\s\t:;"])*)+/g,
        bracetExpr = /{{([^\}]+)}}/g;
       // longExpRegex =/\$\(([^)]+)\)/g,
        //funcExpRegex = /<\$([^\$]+)\$>/g,
        //escapeRegex = /\\(.)/g,
       // commentRegex = /(\/\*[\w'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(<![\-\-\s\w>\/]*>)/g;

    j.tokens = [
       // { regex: commentRegex, type:"Comment"},
        { regex: bracetExpr, type: "Expression", getExpression: function(matches) { return matches[1]; } },
       { regex:  shortExp, type: "Expression", getExpression: function(matches) {
           return matches[0]; }  }
       // { regex:  funcExpRegex, type: "Expression" },
       // { regex:  escapeRegex, type: "Escape symbol" }
    ];


    j.specificators = [
        { token: "\\s", translate: " ", description: "Space" },
        { token: "\\t", translate: "\t", description: "Tab" },
        { token: "\\n", translate: "\n", description: "Line end" },
        { token: "(none)", translate: "", description: "Empty string"}
    ];

    j.findSpec = function(spec) {
        var specs = jet.specificators;
        for (var i = 0; i < specs.length; i++) {
            if(specs[i].token === spec) {
                return specs[i];
            }
        }
        return null;
    };

    j.generateTemplate = (function () {

        function generate(options) {
            var opts = options;
            opts.data = opts.data || "";
            opts.template = opts.template || "";
            opts.dataColumSeprator = opts.dataColumSeprator || " ";
            opts.dataRowSeparator = opts.dataRowSeparator || "\n";
            opts.joinWith = opts.joinWith || "\n";

            console.log("template", opts.template);

            var dataAdapter = opts.isJson
                ? j.dataAdapters.json
                : j.dataAdapters.dataTable;

            var items = dataAdapter.parse(opts.data, opts);
            var template = opts.template;

            var output = [];
            var global = {
                $items:items,
                foo: function() {
                    return "this is foo";
                }
            };

            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                output.push(generateItemRecord(template));
            }

            return output.join(translateSpecs(opts.joinWith));


            function generateItemRecord(template) {

                var context = {
                        $item: item,
                        $index: i,
                        $first: i == 0,
                        $last: i == items.length - 1,
                        $global:global
                    };


                _.chain(jet.tokens).where(function(t) {
                    return t.type.toLowerCase() == "expression";
                }).each(function(expr) {
                    var processExpression = _.partial(replaceExpression.bind(context), expr);
                    template = template.replace(expr.regex, processExpression)
                });

                return  template;
                  //  .replace(commentRegex, "")
                    //.replace(bracetExpr, replaceExpression.bind(context));
                    //.replace(longExpRegex, replaceExpression.bind(context))
                   // .replace(funcExpRegex, replaceFuncExpression.bind(context))
                    //.replace(escapeRegex, "$1");
            }

        }

        function replaceExpression(expr, match) {
            var matches = Array.prototype.slice.call(arguments, 1), // Regex matched group
                value = _.isFunction(expr.getExpression) ? expr.getExpression(matches) : matches[0];

            var result = executeExpression(value, this);
            return result;
        }

        function replaceFuncExpression(match, expr) {
            var funcExpr = "(function(){" + expr + "})()";
            //console.log('execute func expr: %s', funcExpr);
            return executeExpression(funcExpr, this);
        }

        function executeExpression(expression, context) {

            var result = null;

            with(context){
                try {
                    console.log('Executing expression', expression, context);
                    result =  eval(expression);
                }
                catch (error){
                    console.error('Error while executing expression:', expression, error, context);
                    throw error;
                }
            }

            return result;
        }

        return generate;
    })();

    j.dataAdapters = {

        json: {
            parse: function (data, config) {
                try
                {
                    return JSON.parse(data);
                }
                catch (e) {
                    throw new Error("Failed to parse JSON data: " + e.message, e);
                }
            }
        },

        dataTable: {
            parse: function(data, config) {

                var items = [],
                    list = this.normalizeData(data)
                                .split(translateSpecs(
                                        config.dataRowSeparator)); //todo: handle \r\n

                for (var i = 0; i < list.length; i++) {
                    items.push(this.parseItem(list[i], config.dataColumSeprator));
                }
                return items;
            },
            parseItem: function (str, dataColumSeprator) {
                var item = {};
                item.value = str;

                var parts = str.split(j.translateSpecs(dataColumSeprator));
                for (var i = 0; i < parts.length; i++) {
                    item[i] = parts[i];
                }

                item.first = parts[0];
                item.last = parts[parts.length - 1];

                item.toString = function () {
                    return this.value;
                };

                console.log('created item', item);

                return item;
            },
            normalizeData: function (data) {
                return data.replace(/\r|\r\n|\n/g, "\n");
            }
        }
    };

    function translateSpecs(input){

        var out = input;
        for (var i = 0; i < j.specificators.length; i++) {
            var spec = j.specificators[i];
            out = out.replace(spec.token, spec.translate);
        }
        return out;
    }

    j.translateSpecs = translateSpecs;

    return j;
})();