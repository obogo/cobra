/* global exports, validators, D */
(function () {

    var schemaTypes = {};
    var v = validators;
    var isUndefined = v.isUndefined;
    var isFunction = v.isFunction;
    var isNull = v.isNull;
    var isString = v.isString;
    var isDefined = v.isDefined;
    var isEmpty = v.isEmpty;
    var isArray = v.isArray;

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

    function timeout(data, schema, schemaOptions, errorLog) {
        var scope = this;
        var deferred = D();
        setTimeout(function () {
            try {
                var val = applySchema('data', data, schema, schemaOptions, errorLog);
                if (scope.errors && scope.errors.length) {
                    deferred.reject(scope.errors);
                } else {
                    deferred.resolve(val);
                }
            } catch (e) {
                deferred.reject(e);
            }
        }, 1);
        return deferred.promise;
    }

    function getValueFromType(type, property, value, errorLog) {
        var type_str = type.name ? type.name : String(type);
        var SchemaType, schemaType, returnVal;
        var types = String(type_str).split('|');
        var i = 0, len = types.length, hasError = false, newVal;
        while (i < len) {
            try {
                if (validators.isRegExp(type)) {
                    if(type.test(String(value))) {
                        returnVal = value;
                    }
                    throw new Error('Invalid type');
                } else if (validators.isFunction(type) && !validators.isNativeFunction(type)) { // if the type is a function (non-registered)
                    newVal = type(value, {});
                    if (isDefined(newVal)) {
                        returnVal = newVal;
                        break;
                    }
                } else { // otherwise it is a registered
                    SchemaType = exports.schemaType(types[i]);
                    schemaType = new SchemaType();
                    newVal = schemaType.exec(value, {});
                    if (isDefined(newVal)) {
                        returnVal = newVal;
                        break;
                    }
                }
            } catch (e) {
                hasError = true;
            }
            i += 1;
        }

        // check for error
        if (isUndefined(returnVal) && hasError) {
            var schemaError = new exports.SchemaInvalidTypeError(type_str, property.split('._val').join(''), value);
            if (errorLog) {
                errorLog.push(schemaError);
            } else {
                throw schemaError;
            }
        }

        return returnVal;
    }

    function applySchema(path_str, data, schema, schemaOptions, errorLog) {
        var returnVal = {};
        var name, val, options;
        for (name in schema) {
            if (schema.hasOwnProperty(name)) {
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

                if (isArray(schemaOptions.ignore) && schemaOptions.ignore.indexOf(val) !== -1) { // if here is an ignore list
                    continue;
                }

                if (isNull(val)) { // if the value is null, set to null and move on
                    returnVal[name] = null;
                    continue;
                }

                if (isString(options)) { // if the definition is a string: { myName: 'Position|Bind|Number' }
                    returnVal[name] = getValueFromType(options, path_str + '.' + name, val, errorLog);
                } else if (options.type) { // if the definition is an object with a type property: { myName: { type: String } }
                    returnVal[name] = getValueFromType(options.type, path_str + '.' + name, val, errorLog);
                } else if (options.name) { // ex: { myName: String }
                    returnVal[name] = getValueFromType(options, path_str + '.' + name, val, errorLog);
                } else if (isEmpty(options)) {
                    returnVal[name] = val;
                } else if (isDefined(val)) {
                    if (val.isArray) {
                        if (isDefined(options[0])) {
                            var optionType = options[0], newVal,
                                len = val.length;
                            for (var i = 0; i < len; i++) {
                                newVal = applySchema(path_str + '.' + name + '[' + i + ']', {_val: val[i]}, {_val: optionType}, schemaOptions, errorLog);
                                val[i] = newVal._val;
                            }
                        }
                        returnVal[name] = val;
                    } else {
                        val = applySchema(path_str, val || {}, options, schemaOptions, errorLog);
                        returnVal[name] = val;
                    }
                }
            }
        }
        return returnVal;
    }

    function Schema(schema, options) {
        this.definitions = (schema || {});
        this.options = (options || {});
        this.errors = [];
    }

    Schema.type = type;
    Schema.Types = {};

    Schema.prototype.applySchema = function (data, optionsOverride) {
        var opts = optionsOverride || this.options;
        this.errors = opts.breakOnError === false ? [] : null;
        return timeout.apply(this, [data, this.definitions, opts, this.errors]);
    };

    exports.Schema = Schema;

}());
