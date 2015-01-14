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

                    opts.dataColumSeprator = opts.dataColumSeprator || " ";
                    opts.dataRowSeparator = opts.dataRowSeparator || "\n";

                    var items = [],
                        list = this.normalizeData(data)
                            .split(window.jet.translateSpecs(
                                opts.dataRowSeparator)); //todo: handle \r\n

                    for (var i = 0; i < list.length; i++) {
                        items.push(this.parseItem(list[i], opts.dataColumSeprator));
                    }
                    return items;
                },
                parseItem: function (str, dataColumSeprator) {
                    var item = {};
                    item.value = str;

                    var parts = str.split(window.jet.translateSpecs(dataColumSeprator));
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
    });
