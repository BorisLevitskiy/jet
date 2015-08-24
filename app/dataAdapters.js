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

                    var i = 0,
                        resultList = [],
                        rowSeparator,
                        colSeparator,
                        dataRows; //TODO: handle \r\n

                    opts.dataColumnSeparator = opts.dataColumnSeparator || " ";
                    opts.dataRowSeparator = opts.dataRowSeparator || "\n";
                    opts.dataColumnSeparatorRegex = !!opts.dataColumnSeparatorRegex;
                    opts.dataRowSeparatorRegex = !!opts.dataRowSeparatorRegex;
                    opts.globalPrototype = "";

                    rowSeparator = opts.dataRowSeparatorRegex ? new RegExp(opts.dataRowSeparator, "ig") : opts.dataRowSeparator;
                    colSeparator = opts.dataColumnSeparatorRegex ? new RegExp(opts.dataColumnSeparator, "ig") : opts.dataColumnSeparator;

                    dataRows = this.normalizeData(data).split(rowSeparator);

                    for (; i < dataRows.length; i++) {
                        resultList.push(this.parseItem(dataRows[i], colSeparator));
                    }

                    return resultList;
                },

                parseItem: function (str, colSeparator) {

                    var item = {};
                    item.value = str;

                    var parts = str.split(colSeparator);
                    for (var i = 0; i < parts.length; i++) {
                        item[i] = parts[i];
                    }

                    item.first = parts[0];
                    item.last = parts[parts.length - 1];
                    item.length = parts.length;

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

