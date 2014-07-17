/* global exports, validators, D */
(function () {

    var schemaTypes = {};
    var errType = 'Schema found type "{foundType}" where it expected type "{expectType}" :: {prop} => {val}';

    function type(name, func) {
        schemaTypes[name] = func;
    }

    function applyRequired(prop, val) {
        if (validators.isUndefined(val)) {
            throw new Error(('property "{prop}" is required').supplant({prop: prop}));
        }
        return val;
    }

    function applyDefault(val, defaultVal) {
        if (validators.isUndefined(val)) {
            if (validators.isFunction(defaultVal)) {
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
                if (validators.isFunction(fn)) {
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
                options = schema[name];

                // if a default value is defined, apply it if value is undefined
                val = applyDefault(data[name], options.default);

                if (options.required) {
                    val = applyRequired(name, val);
                }
                val = applyFormat(val, options);

                if (validators.isUndefined(val)) { // if the value is undefined move on
                    continue;
                }

                if (validators.isNull(val)) { // if the value is null move on
                    if (schemaOptions.allowNull) {
                        returnVal[name] = null;
                    }
                    continue;
                }

                if (validators.isString(options)) { // if the definition is a string: { myName: 'Position|Bind|Number' }
                    var $options = options.split('|');
                    var i = 0, len = $options.length, found = false;
                    while (i < len) {
                        type = exports.schemaType($options[i]);
                        try {
                            var newVal = type(val, {});
                            if (validators.isDefined(newVal)) {
                                returnVal[name] = newVal;
                                found = true;
                                break;
                            }
                        } catch (e) {
                            throw new Error(errType.supplant({foundType: typeof val, expectType: options, prop: name, val: val}));
                        }
                        i += 1;
                    }
                } else if (options.type) { // if the definition is an object with a type property: { myName: { type: String } }
                    SchemaType = exports.schemaType(options.type.name);
                    type = new SchemaType();
                    try {
                        returnVal[name] = type.exec(val, options);
                    } catch (e) {
                        throw new Error(errType.supplant({foundType: typeof val, expectType: options.type.name, prop: name, val: val}));
                    }
                } else if (options.name) { // ex: { myName: String }
                    SchemaType = exports.schemaType(options.name);
                    type = new SchemaType();
                    try { // otherwise try to apply value
                        returnVal[name] = type.exec(val, options);
                    } catch (e) {
                        throw new Error(errType.supplant({foundType: typeof val, expectType: options.name, prop: name, val: val}));
                    }
                } else if (validators.isEmpty(options)) {
                    returnVal[name] = val;
                } else {
                    val = applySchema(val || {}, options);
                    if (!validators.isEmpty(val)) {
                        returnVal[name] = val;
                    }
                }
            }
        }
        return returnVal;
    }

//    var forEach = function (obj, iterator, context) {
//        var key;
//        if (obj) {
//            if (validators.isFunction(obj)) {
//                for (key in obj) {
//                    // Need to check if hasOwnProperty exists,
//                    // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
//                    if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
//                        iterator.call(context, obj[key], key);
//                    }
//                }
//            } else if (obj.forEach && obj.forEach !== forEach) {
//                obj.forEach(iterator, context);
//            } else if (validators.isArrayLike(obj)) {
//                for (key = 0; key < obj.length; key++)
//                    iterator.call(context, obj[key], key);
//            } else {
//                for (key in obj) {
//                    if (obj.hasOwnProperty(key)) {
//                        iterator.call(context, obj[key], key);
//                    }
//                }
//            }
//        }
//        return obj;
//    };
//
//    function copy(source, destination, stackSource, stackDest) {
//        if (validators.isWindow(source)) {
//            throw Error("Can't copy! Making copies of Window instances is not supported.");
//        }
//
//        if (!destination) {
//            destination = source;
//            if (source) {
//                if (validators.isArray(source)) {
//                    destination = copy(source, [], stackSource, stackDest);
//                } else if (validators.isDate(source)) {
//                    destination = new Date(source.getTime());
//                } else if (validators.isRegExp(source)) {
//                    destination = new RegExp(source.source);
//                } else if (validators.isObject(source)) {
//                    destination = copy(source, {}, stackSource, stackDest);
//                }
//            }
//        } else {
//            if (source === destination) {
//                throw Error("Can't copy! Source and destination are identical.");
//            }
//
//            stackSource = stackSource || [];
//            stackDest = stackDest || [];
//
//            if (validators.isObject(source)) {
//                var index = stackSource.indexOf(source);
//                if (index !== -1) {
//                    return stackDest[index];
//                }
//
//                stackSource.push(source);
//                stackDest.push(destination);
//            }
//
//            var result;
//            if (validators.isArray(source)) {
//                destination.length = 0;
//                for (var i = 0; i < source.length; i++) {
//                    result = copy(source[i], null, stackSource, stackDest);
//                    if (validators.isObject(source[i])) {
//                        stackSource.push(source[i]);
//                        stackDest.push(result);
//                    }
//                    destination.push(result);
//                }
//            } else {
//                forEach(destination, function (value, key) {
//                    delete destination[key];
//                });
//                for (var key in source) {
//                    result = copy(source[key], null, stackSource, stackDest);
//                    if (validators.isObject(source[key])) {
//                        stackSource.push(source[key]);
//                        stackDest.push(result);
//                    }
//                    destination[key] = result;
//                }
//            }
//
//        }
//        return destination;
//    }

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
