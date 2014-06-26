/* global cobra, _, D */
var schemaTypes = {};
var errType = 'Schema found type "{foundType}" where it expected type "{expectType}" => {val}';

function type(name, func) {
    schemaTypes[name] = func;
}

function applyRequired(prop, val) {
    if (_.isUndefined(val)) {
        throw new Error(('property "{prop}" is required').supplant({prop: prop}));
    }
    return val;
}

function applyDefault(val, defaultVal) {
    if (_.isUndefined(val)) {
        if (_.isFunction(defaultVal)) {
            return defaultVal();
        }
        return defaultVal;
    }
    return val;
}

function applyFormat(val, formatOptions) {
    var fn;
    for (var e in formatOptions) {
        if (formatOptions.hasOwnProperty(e)) {
            fn = cobra.schemaFormat(e);
            if (_.isFunction(fn)) {
                val = fn(val, formatOptions[e]);
            }
        }
    }
    return val;
}

function timeout(doc, schema) {
    var deferred = D();
    setTimeout(function () {
        try {
            var val = applySchema(doc, schema);
            deferred.resolve(val);
        } catch (e) {
            deferred.reject(e);
        }
    }, 1);
    return deferred.promise;
}

function applySchema(doc, schema) {
    var returnVal = {};
    var name, val, options, type;
    for (name in schema) {
        if (schema.hasOwnProperty(name)) {
            options = schema[name];
            val = applyDefault(doc[name], options.default);

            if (options.required) {
                val = applyRequired(name, val);
            }

            val = applyFormat(val, options);

            if (options.type) {
                type = cobra.schemaType(options.type.name);
                if (type(val, options)) {
                    returnVal[name] = val;
                } else {
                    throw new Error(errType.supplant({foundType: typeof val, expectType: options.type.name, val: val}));
                }
            } else if (options.name) {
                type = cobra.schemaType(options.name);
                if (type(val, options)) {
                    returnVal[name] = val;
                } else {
                    throw new Error(errType.supplant({foundType: typeof val, expectType: options.name, val: val}));
                }
            } else if (_.isEmpty(options)) {
                returnVal[name] = val;
            } else {
                val = applySchema(val || {}, options);
                if (!_.isEmpty(val)) {
                    returnVal[name] = val;
                }
            }
        }
    }
    return returnVal;
}

function Schema(schema) {
    this.schema = schema;
}

Schema.type = type;
Schema.Types = {};

Schema.prototype.applySchema = function (doc) {
    return timeout(doc, this.schema);
};


cobra.Schema = Schema;
