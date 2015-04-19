(function (jet) {
    var dataItemPrototype = {
        json: function (obj) {
            return JSON.stringify(obj, null, 2); // spacing level = 2
        }
    }

    jet.prototype = {
        setPrototype: function (dataItem) {
            var dataItemWithProto = Object.create(dataItemPrototype);
            _.extend(dataItemWithProto, dataItem);
            return dataItemWithProto;
        },
        globalPrototype: {
            foo: function () {
                return "this is foo";
            },
            translate: function (string, dictionary) {
                if (dictionary.hasOwnProperty(string)) {
                    return dictionary[string];
                }
                return string;
            }}

    }


})(window.jet);
