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

    function getValueFromType(type, property, value){
        var type_str = type.name ? type.name : String(type);
        var SchemaType, schemaType, returnVal;
        var types = String(type_str).split('|');
        var i = 0, len = types.length, hasError = false;

        while (i < len) {
            SchemaType = exports.schemaType(types[i]);
            schemaType = new SchemaType();
            try {
                var newVal = schemaType.exec(value, {});
                if (isDefined(newVal)) {
                    returnVal = newVal;
                    break;
                }
            } catch (e) {
                hasError = true;
            }
            i += 1;
        }

        // check for error
        if(isUndefined(returnVal) && hasError) {
            throw new exports.SchemaInvalidTypeError(type_str, property, value);
        }

        return returnVal;
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

                if (isUndefined(val)) { // if the value is undefined move on
                    continue;
                }

                if (isNull(val)) { // if the value is null move on
                    if (schemaOptions.allowNull) { // set to null if permitted
                        returnVal[name] = null;
                    }
                    continue;
                }


                if (isString(options)) { // if the definition is a string: { myName: 'Position|Bind|Number' }
                    returnVal[name] = getValueFromType(options, name, val);
                } else if (options.type) { // if the definition is an object with a type property: { myName: { type: String } }
                    returnVal[name] = getValueFromType(options.type, name, val);
                } else if (options.name) { // ex: { myName: String }
                    returnVal[name] = getValueFromType(options, name, val);
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
