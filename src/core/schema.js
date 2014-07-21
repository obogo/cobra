/* global exports, validators, D */
(function () {

    var schemaTypes = {};
    var errType = 'Schema found type "{foundType}" where it expected type "{expectType}" :: {prop} => {val}';
    var v = validators;
    var isUndefined = v.isUndefined;
    var isFunction = v.isFunction;
    var isNull = v.isNull;
    var isString = v.isString;
    var isDefined = v.isDefined;
    var isEmpty = v.isEmpty;

    function type(name, func) {
        schemaTypes[name] = func;
    }

    function applyRequired(prop, val) {
        if (isUndefined(val)) {
            throw new exports.SchemaRequiredPropertyError(prop);
        }
        return val;
    }

    function applyDefault(val, defaultVal) {
        if (isUndefined(val)) {
            if (isFunction(defaultVal)) {
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
                fn = exports.schemaHelper(e);
                if (isFunction(fn)) {
                    val = fn(val, formatOptions[e]);
                }
            }
        }
        return val;
    }

    function timeout(doc, schema, schemaOptions) {
        var deferred = D();
        setTimeout(function () {
            try {
                var val = applySchema(doc, schema, schemaOptions);
                deferred.resolve(val);
            } catch (e) {
                deferred.reject(e);
            }
        }, 1);
        return deferred.promise;
    }

    function applySchema(data, schema, schemaOptions) {
        var returnVal = {};
        var name, val, options, type;
        var SchemaType;
        for (name in schema) {
            if (schema.hasOwnProperty(name)) {
                console.log('test');
                options = schema[name];

                // if a default value is defined, apply it if value is undefined
                val = applyDefault(data[name], options.default);

                if (options.required) {
                    val = applyRequired(name, val);
                }
                val = applyFormat(val, options);

                if (isUndefined(val)) { // if the value is undefined move on
                    continue;
                }

                if (isNull(val)) { // if the value is null move on
                    if (schemaOptions.allowNull) {
                        returnVal[name] = null;
                    }
                    continue;
                }

                if (isString(options)) { // if the definition is a string: { myName: 'Position|Bind|Number' }
                    var $options = options.split('|');
                    var i = 0, len = $options.length, found = false, hasError = false;
                    while (i < len) {
                        SchemaType = exports.schemaType($options[i]);
                        type = new SchemaType();
                        try {
                            var newVal = type.exec(val, {});
                            if (isDefined(newVal)) {
                                returnVal[name] = newVal;
                                found = true;
                                break;
                            }
                        } catch (e) {
                            hasError = true;
//                            throw new exports.SchemaInvalidTypeError(options, name, val);
//                            throw new Error(errType.supplant({foundType: typeof val, expectType: options, prop: name, val: val}));
                        }
                        i += 1;
                    }
                    // check for error
                    if(isUndefined(returnVal[name]) && hasError) {
                        throw new exports.SchemaInvalidTypeError(options, name, val);
                    }
                } else if (options.type) { // if the definition is an object with a type property: { myName: { type: String } }
                    SchemaType = exports.schemaType(options.type.name);
                    type = new SchemaType();
                    try {
                        returnVal[name] = type.exec(val, options);
                    } catch (e) {
                        throw new exports.SchemaInvalidTypeError(options, name, val);
//                        throw new Error(errType.supplant({foundType: typeof val, expectType: options.type.name, prop: name, val: val}));
                    }
                } else if (options.name) { // ex: { myName: String }
                    SchemaType = exports.schemaType(options.name);
                    type = new SchemaType();
                    try { // otherwise try to apply value
                        returnVal[name] = type.exec(val, options);
                    } catch (e) {
                        throw new exports.SchemaInvalidTypeError(options, name, val);
//                        throw new Error(errType.supplant({foundType: typeof val, expectType: options.name, prop: name, val: val}));
                    }
                } else if (isEmpty(options)) {
                    returnVal[name] = val;
                } else {
                    val = applySchema(val || {}, options);
                    if (!isEmpty(val)) {
                        returnVal[name] = val;
                    }
                }
            }
        }
        return returnVal;
    }

    function Schema(schema, options) {
        this.schema = (schema || {});
        this.options = (options || {});
    }

    Schema.type = type;
    Schema.Types = {};

    Schema.prototype.applySchema = function (data, optionsOverride) {
        return timeout(data, this.schema, optionsOverride || this.options);
    };

    exports.Schema = Schema;

}());
