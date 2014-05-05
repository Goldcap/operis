(function() {

DS.DjangoRESTSerializer = DS.RESTSerializer.extend({

    init: function() {
        this._super.apply(this, arguments);
        
    },

    paginatePayload: function(json, type, many) {
        
        var pJSON, res;
        
        pJSON = {};
        
        if (json['results'] && json['results'].constructor.name === 'Array') {
            pJSON = json['results'];

            // this is a paginated result, compute pagination properties
            var page_match = new RegExp('page=([0-9]+)');
            var items = {
                total: json['count'],
                first: 1,
                last: json['results'].length,
                per_page: undefined,
            };
            var page = {
                total: 1,
                current: 1,
                previous: false,
                next: false,
            };

            // do we have a previous page?
            if(res = page_match.exec(json['previous'])) {
                page.previous = parseInt(res[1], 10);
                page.current = page.previous + 1;

                // the number of items per page is calculated from number of
                // items in previous pages and the number of the previous page
                items.per_page = (json['count'] - json['results'].length) / page.previous;
            }

            // do we have a next page?
            if(res = page_match.exec(json['next'])) {
                page.next = parseInt(res[1], 10);
                page.current = page.next - 1;

                // as we have a next page, we know that the current page is
                // full, so just count how many items are in the current page
                items.per_page = json['results'].length;
            }

            if(items.per_page === undefined) {
                // `items.per_page` is not set, this happen when there is only
                // one page. And with only one page, we are not able to guess
                // the server-side configured value for the number of items per
                // page.
            } else {
                page.total = Math.ceil(json['count'] / items.per_page);
                items.first = (page.current - 1) * items.per_page + 1;
                items.last = items.first + json['results'].length - 1;
            }

            // add a pagination object in metadata
            pJSON['meta'] = {
                pagination: {
                    page: page,
                    items: items,
                },
            };
        } else {
            pJSON = json;
        }

        return pJSON;
    },
    
    extractDjangoPayload: function(store, type, payload) {
        type.eachRelationship(function(key, relationship){
            // TODO should we check if relationship is marked as embedded?
            if (!Ember.isNone(payload[key]) && typeof(payload[key][0]) !== 'number') {
                if (payload[key].constructor.name === 'Array' && payload[key].length > 0) {
                    var ids = payload[key].mapBy('id'); //todo find pk (not always id)
                    this.pushArrayPayload(store, relationship.type, payload[key]);
                    payload[key] = ids;
                }
            }
        }, this);
    },

    extractSingle: function(store, type, payload) {
        payload = this.paginatePayload(payload,type);
        
        // using normalize from RESTSerializer applies transforms and allows
        // us to define keyForAttribute and keyForRelationship to handle
        // camelization correctly. 
        this.normalize(type, payload);
        this.extractDjangoPayload(store, type, payload);
        return payload;
    },

    extractArray: function(store, type, payload) {
        payload = this.paginatePayload(payload,type);
        
        var self = this;
        for (var j = 0; j < payload.length; j++) {
            // using normalize from RESTSerializer applies transforms and allows
            // us to define keyForAttribute and keyForRelationship to handle
            // camelization correctly.
            this.normalize(type, payload[j]);
            self.extractDjangoPayload(store, type, payload[j]);
        }
        return payload;
    },

    /**
      This method allows you to push a single object payload.

      It will first normalize the payload, so you can use this to push
      in data streaming in from your server structured the same way
      that fetches and saves are structured.

      @param {DS.Store} store
      @param {String} type
      @param {Object} payload
    */
    pushSinglePayload: function(store, type, payload) {
        type = store.modelFor(type);
        payload = this.extract(store, type, payload, null, "find");
        store.push(type, payload);
    },

    /**
      This method allows you to push an array of object payloads.

      It will first normalize the payload, so you can use this to push
      in data streaming in from your server structured the same way
      that fetches and saves are structured.

      @param {DS.Store} store
      @param {String} type
      @param {Object} payload
    */
    pushArrayPayload: function(store, type, payload) {
        type = store.modelFor(type);
        payload = this.extract(store, type, payload, null, "findAll");
        store.pushMany(type, payload);
    },

    /**
      Converts camelcased attributes to underscored when serializing.

      Stolen from DS.ActiveModelSerializer.

      @method keyForAttribute
      @param {String} attribute
      @returns String
    */
    keyForAttribute: function(attr) {
        return Ember.String.decamelize(attr);
    },

    /**
      Underscores relationship names when serializing relationship keys.
  
      Stolen from DS.ActiveModelSerializer.
      
      @method keyForRelationship
      @param {String} key
      @param {String} kind
      @returns String
    */
    keyForRelationship: function(key, kind) {
        return Ember.String.decamelize(key);
    }

});


})();

(function() {

var get = Ember.get;

DS.DjangoRESTAdapter = DS.RESTAdapter.extend({
    defaultSerializer: "DS/djangoREST",

    /**
      Overrides the `pathForType` method to build underscored URLs.

      Stolen from ActiveModelAdapter

      ```js
        this.pathForType("famousPerson");
        //=> "famous_people"
      ```

      @method pathForType
      @param {String} type
      @returns String
    */
    pathForType: function(type) {
        var decamelized = Ember.String.decamelize(type);
        return Ember.String.pluralize(decamelized);
    },


    createRecord: function(store, type, record) {
        var url = this.getCorrectPostUrl(record, this.buildURL(type.typeKey));
        var data = store.serializerFor(type.typeKey).serialize(record);
        return this.ajax(url, "POST", { data: data });
    },

    updateRecord: function(store, type, record) {
        var data = store.serializerFor(type.typeKey).serialize(record);
        var id = get(record, 'id'); //todo find pk (not always id)
        return this.ajax(this.buildURL(type.typeKey, id), "PUT", { data: data });
    },

    findMany: function(store, type, ids, parent) {
        var adapter, root, url, endpoint, attribute;
        adapter = this;

        if (parent) {
            attribute = this.getHasManyAttributeName(type, parent, ids);
            endpoint = store.serializerFor(type.typeKey).keyForAttribute(attribute);
            url = this.buildFindManyUrlWithParent(type, parent, endpoint);
        } else {
            Ember.assert("You need to add belongsTo for type (" + type.typeKey + "). No Parent for this record was found");
        }

        return this.ajax(url, "GET");
    },

    ajax: function(url, type, hash) {
        hash = hash || {};
        hash.cache = false;

        return this._super(url, type, hash);
    },

    buildURL: function(type, id) {
        var url = this._super(type, id);

        if (url.charAt(url.length -1) !== '/') {
            url += '/';
        }

        return url;
    },

    getBelongsTo: function(record) {
        var totalParents = [];
        record.eachRelationship(function(name, relationship) {
            if (relationship.kind === 'belongsTo') {
                totalParents.push(name);
            }
        }, this);
        return totalParents;
    },

    getNonEmptyRelationships: function(record, totalParents) {
        var totalHydrated = [];
        totalParents.forEach(function(item) {
            if (record.get(item) !== null) {
                totalHydrated.push(item);
            }
        }, this);
        return totalHydrated;
    },

    getCorrectPostUrl: function(record, url) {
        var totalParents = this.getBelongsTo(record);
        var totalHydrated = this.getNonEmptyRelationships(record, totalParents);
        if (totalParents.length > 1 && totalHydrated.length <= 1) {
            return this.buildUrlWithParentWhenAvailable(record, url, totalHydrated);
        }

        if (totalParents.length === 1 && totalHydrated.length === 1) {
            var parent_value = record.get(totalParents[0]).get('id'); //todo find pk (not always id)
            var parent_plural = Ember.String.pluralize(totalParents[0]);
            var endpoint = url.split('/').reverse()[1];
            return url.replace(endpoint, parent_plural + "/" + parent_value + "/" + endpoint);
        }

        return url;
    },

    buildUrlWithParentWhenAvailable: function(record, url, totalHydrated) {
        if (record && url && totalHydrated) {
            var parent_type = totalHydrated[0];
            var parent_pk = record.get(parent_type).get('id'); //todo find pk (not always id)
            var parent_plural = Ember.String.pluralize(parent_type);
            var endpoint = url.split('/').reverse()[1];
            url = url.replace(endpoint, parent_plural + "/" + parent_pk + "/" + endpoint);
        }
        return url;
    },

    buildFindManyUrlWithParent: function(type, parent, endpoint) {
        var root, url, parentValue;

        parentValue = parent.get('id'); //todo find pk (not always id)
        root = parent.constructor.typeKey;
        url = this.buildURL(root, parentValue);

        return url + endpoint + '/';
    },

    /**
      Extract the attribute name given the parent record, the ids of the referenced model, and the type of
      the referenced model.

      Given the model definition

      ````
      App.User = DS.Model.extend({
          username: DS.attr('string'),
          aliases: DS.hasMany('speaker', { async: true})
          favorites: DS.hasMany('speaker', { async: true})
      });
      ````

      with a model object

      ````
      user1 = {
          id: 1,
          name: 'name',
          aliases: [2,3],
          favorites: [4,5]
      }
      
      type = App.Speaker;
      parent = user1;
      ids = [4,5]
      name = getHasManyAttributeName(type, parent, ids) // name === "favorites"
      ````

      @method getHasManyAttributeName
      @param {subclass of DS.Model} type
      @param {DS.Model} parent
      @param {Array} ids
      @returns String
    */
    getHasManyAttributeName: function(type, parent, ids) {
      var attributeName;

      parent.eachRelationship(function(name, relationship){
        var relationshipIds;
        if (relationship.kind === "hasMany" && relationship.type.typeKey === type.typeKey) {
          relationshipIds = parent._data[name].mapBy('id');
          if (Ember.compare(ids, relationshipIds) === 0) {
            attributeName = name;
          }
        }
      });

      return attributeName;
    }

});


})();