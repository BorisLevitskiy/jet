angular.module('app')
    .factory('dataAdapters', function() {
        return  {
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
                parse: function(data, opts) {
                    console.log('dataTable.parse()', opts);
                    opts.dataColumnSeparator = opts.dataColumnSeparator || " ";
                    opts.dataRowSeparator = opts.dataRowSeparator || "\n";

                    var items = [],
                        list = this.normalizeData(data)
                            .split(opts.dataRowSeparator); //TODO: handle \r\n

                    for (var i = 0; i < list.length; i++) {
                        items.push(this.parseItem(list[i], opts.dataColumnSeparator));
                    }

                    console.log('dataTable.parse()', opts);
                    console.table(items);

                    return items;
                },
                parseItem: function (str, dataColumnSeprator) {
                    var item = {};
                    item.value = str;

                    var parts = str.split(dataColumnSeprator);
                    for (var i = 0; i < parts.length; i++) {
                        item[i] = parts[i];
                    }

                    item.first = parts[0];
                    item.last = parts[parts.length - 1];

                    item.toString = function () {
                        return this.value;
                    };

                    return item;
                },
                normalizeData: function (data) {
                    return data.replace(/\r|\r\n|\n/g, "\n");
                }
            }
        };
    })
    .factory("symbols", function() {

        var list = [ { synonym: ["\\s"], symbol: " ", description: "Space" },
            { synonym: "\\t", symbol: "\t", description: "Tab" },
            { synonym: "\\n", symbol: "\n", description: "Line end" },
            { synonym: "", symbol: "", description: "Empty string"}];

        return {
            find: function(symbolOrSynonym) {
                var i= 0, l = list.length, cur;
                for(;i<l;i++) {
                    cur = list[i];
                    if(cur.symbol === symbolOrSynonym || cur.synonym == symbolOrSynonym) {
                        return cur;
                    }
                }
                return null;
            },
            isKnown: function(symbolOrSynonym) {
                return this.find(symbolOrSynonym) != null;
            },
            translate: function (symbolOrSynonym) {
                var existing = this.find(symbolOrSynonym);
                return existing != null ? existing.symbol : symbolOrSynonym;
            }
        }

    });

