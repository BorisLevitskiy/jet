angular.module('dataStore',[])
    .factory("dataStore", function() {
        return {
            setObject: function (key, value) {
                if(value == null){
                    this.setItem(key, null);
                    return;
                }

                this.setItem(key, JSON.stringify(value));
            },
            getObject: function (key) {

                var json = localStorage.getItem(key),
                    obj;

                if(json == null || json == '') {
                    return null;
                }

                try
                {
                    obj = JSON.parse(json);
                }
                catch (err) {
                    // console.error("Failed to load value with key " + key, err);
                    return null;
                }



                // console.log('dataStore: loaded object', obj);

                return obj;
            },

            setItem: function (key, value) {

                if(value == null) {
                    localStorage.removeItem(key);
                    return;
                }

                localStorage.setItem(key, value);
                // console.log('dataStore: loaded saved', value);

            },

            removeItem: function (key) {
                if(key != null) {
                    localStorage.removeItem(key);
                }
            }
        }
    })
    .factory("stash", function(dataStore){
        var templatesKey = "templateList";
        return {
            getTemplates:function() {
                var list = dataStore.getObject(templatesKey);
                return list == null ? [] : list;
            },

            stashTemplate: function (template) {
                var list = this.getTemplates();

                if(_.indexOf(list, template) >= 0) {
                    return; // Already stashed
                }

                list.push(template);
                dataStore.setObject(templatesKey, list);
                return list;
            },

            removeTemplate : function (p) {
                var list = this.getTemplates();
                var index = _.isNumber(p) ? p : _.indexOf(list, p);

                if(index >= 0) {
                    list.splice(index,1);
                    dataStore.setObject(templatesKey, list);
                } else {
                    console.warn('Failed to find template in stash by the given parameter: ', p);
                }

                return list;
            }
        }
    });
