/*
* Cobra 0.1.7
* Obogo. MIT 2014
*/
(function(exports, global) {
    global["cobra"] = exports;
    var validators = {};
    validators.isArray = function(value) {
        return value && !!value.isArray;
    };
    validators.isBoolean = function(value) {
        return typeof value === "boolean";
    };
    validators.isDate = function(value) {
        return value instanceof Date && !isNaN(value.valueOf());
    };
    validators.isDefined = function(value) {
        return typeof value !== "undefined";
    };
    validators.isEmpty = function(value) {
        if (validators.isString(value)) {
            return value === "";
        }
        if (validators.isArray(value)) {
            return value.length === 0;
        }
        if (validators.isObject(value)) {
            for (var e in value) {
                if (value.hasOwnProperty(e)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    validators.isFunction = function(value) {
        return typeof value === "function";
    };
    validators.isNativeFunction = function(value) {
        return typeof value === "function" && (value.toString().indexOf("[native code]") > -1 || value.toString().indexOf("[function]") > -1) || !!window[value.name];
    };
    validators.isNull = function(value) {
        return value === null;
    };
    validators.isNumber = function(value) {
        return typeof value === "number";
    };
    validators.isNumeric = function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };
    validators.isObject = function(value) {
        return value !== null && typeof value === "object";
    };
    validators.isRegExp = function(value) {
        return value && value instanceof RegExp;
    };
    validators.isSchema = function(value) {
        return value instanceof exports.Schema;
    };
    validators.isString = function(value) {
        return typeof value === "string";
    };
    validators.isUndefined = function(value) {
        return typeof value === "undefined";
    };
    (function() {
        function SchemaInvalidTypeError(type, property, value, message) {
            this.name = "SchemaInvalidTypeError";
            this.type = type;
            this.actualType = capitalize(typeof value);
            this.property = property.substr(5);
            this.value = value;
            this.message = message || 'Schema found type "{actualType}" where it expected type "{type}" :: {prop} => {val}'.supplant({
                actualType: this.actualType,
                type: capitalize(this.type),
                prop: this.property,
                val: this.value
            });
        }
        SchemaInvalidTypeError.prototype = Error.prototype;
        function SchemaRequiredPropertyError(property, message) {
            this.name = "SchemaRequiredPropertyError";
            this.property = property.substr(5);
            this.message = message || 'property "{prop}" is required'.supplant({
                prop: property
            });
        }
        SchemaRequiredPropertyError.prototype = Error.prototype;
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        exports.SchemaInvalidTypeError = SchemaInvalidTypeError;
        exports.SchemaRequiredPropertyError = SchemaRequiredPropertyError;
    })();
    (function() {
        function ModelFactory() {}
        function resolve(object, path, value) {
            path = path || "";
            var stack = path.match(/(\w|\$)+/g), property;
            var isGetter = typeof value === "undefined";
            while (stack.length > 1) {
                property = stack.shift();
                switch (typeof object[property]) {
                  case "object":
                    object = object[property];
                    break;

                  case "undefined":
                    if (isGetter) {
                        return;
                    }
                    object = object[property] = {};
                    break;

                  default:
                    throw new Error("property is not of type object", property);
                }
            }
            if (typeof value === "undefined") {
                return object[stack.shift()];
            }
            object[stack.shift()] = value;
            return value;
        }
        ModelFactory.extend = function(name, func) {
            var passed = /^([\w\$]+)$/.test(name);
            if (!passed) {
                throw new Error('Invalid name: "{name}"'.supplant({
                    name: name
                }));
            }
            this.prototype[name] = func;
        };
        ModelFactory.factory = function(name, schema) {
            function Model(doc) {
                exports.extend(this, doc);
            }
            Model.statics = {};
            var ModelPrototype = Model.prototype = ModelFactory.prototype;
            ModelPrototype.__name = name;
            ModelPrototype.__schema = schema;
            ModelPrototype.getName = function() {
                return this.__name;
            };
            ModelPrototype.getSchema = function() {
                return this.__schema;
            };
            ModelPrototype.get = function(path) {
                return resolve(this, path);
            };
            ModelPrototype.set = function(path, value) {
                return resolve(this, path, value);
            };
            ModelPrototype.options = function(name, value) {
                if (!arguments.length) {
                    return schema.options;
                }
                if (value === undefined) {
                    return schema.options[name];
                }
                schema.options[name] = value;
            };
            ModelPrototype.applySchema = function(options) {
                return this.getSchema().applySchema(this, options);
            };
            return Model;
        };
        exports.Model = ModelFactory;
    })();
    (function() {
        var _schemas = {};
        var _schemaTypes = {};
        var _schemaHelpers = {};
        var isUndefined = validators.isUndefined;
        var isNull = validators.isNull;
        var counter = 1;
        exports.applySchemaType = function(schemaName, value) {
            var SchemaType = exports.schemaType(schemaName);
            var schemaType = new SchemaType();
            return schemaType.exec(value);
        };
        exports.applySchemaHelper = function(helperName, value) {
            var fnHelper = exports.schemaHelper(helperName);
            return fnHelper(value);
        };
        exports.schemaType = function schemaType(name, callback) {
            if (isUndefined(callback)) {
                return _schemaTypes[name];
            }
            exports.Schema.Types[name] = {
                name: name
            };
            _schemaTypes[name] = callback;
            return this;
        };
        exports.schemaHelper = function schemaHelper(name, callback) {
            if (isUndefined(callback)) {
                return _schemaHelpers[name];
            }
            exports.Schema.Types[name] = {
                name: name
            };
            _schemaHelpers[name] = callback;
            return this;
        };
        exports.model = function model(name, schema) {
            if (isUndefined(schema)) {
                return exports.Model.factory(name, _schemas[name]);
            }
            if (isNull(schema)) {
                return delete _schemas[name];
            }
            _schemas[name] = schema;
            return this;
        };
        exports.validate = function(value, schema, options) {
            D.alwaysAsync = false;
            var c = counter++;
            var $schema = new exports.Schema({
                value: schema
            });
            exports.model("$model" + c, $schema);
            var Model = exports.model("$model" + c);
            var model = new Model({
                value: value
            });
            var returnVal = {};
            var promise = model.applySchema(options);
            promise.then(function(resolvedData) {
                exports.model("$model" + c, null);
                returnVal.isValid = true;
                returnVal.value = resolvedData.value;
            }, function(err) {
                exports.model("$model" + c, null);
                returnVal.isValid = false;
                returnVal.error = err;
            });
            D.alwaysAsync = true;
            return returnVal;
        };
    })();
    (function() {
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
        function exec(data, schema, schemaOptions, errorLog) {
            var scope = this;
            var deferred = D();
            try {
                var val = applySchema("data", data, schema, schemaOptions, errorLog);
                if (scope.errors && scope.errors.length) {
                    deferred.reject(scope.errors);
                } else {
                    deferred.resolve(val);
                }
            } catch (e) {
                deferred.reject(e);
            }
            return deferred.promise;
        }
        function getValueFromType(type, property, value, errorLog) {
            var type_str = type.name ? type.name : String(type);
            var SchemaType, schemaType, returnVal;
            var types = String(type_str).split("|");
            var i = 0, len = types.length, hasError = false, newVal;
            while (i < len) {
                try {
                    if (validators.isRegExp(type)) {
                        if (type.test(String(value))) {
                            returnVal = value;
                        }
                        throw new Error("Invalid type");
                    } else if (validators.isFunction(type) && !validators.isNativeFunction(type)) {
                        newVal = type(value, {});
                        if (isDefined(newVal)) {
                            returnVal = newVal;
                            break;
                        }
                    } else {
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
            if (isUndefined(returnVal) && hasError) {
                var schemaError = new exports.SchemaInvalidTypeError(type_str, property.split("._val").join(""), value);
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
                    val = applyDefault(data[name], options.default);
                    if (options.required) {
                        val = applyRequired(name, val);
                    }
                    val = applyFormat(val, options);
                    if (isUndefined(val)) {
                        continue;
                    }
                    if (isArray(schemaOptions.ignore) && schemaOptions.ignore.indexOf(val) !== -1) {
                        continue;
                    }
                    if (isNull(val)) {
                        returnVal[name] = null;
                        continue;
                    }
                    if (isString(options)) {
                        returnVal[name] = getValueFromType(options, path_str + "." + name, val, errorLog);
                    } else if (options.type) {
                        returnVal[name] = getValueFromType(options.type, path_str + "." + name, val, errorLog);
                    } else if (options.name) {
                        returnVal[name] = getValueFromType(options, path_str + "." + name, val, errorLog);
                    } else if (isEmpty(options)) {
                        returnVal[name] = val;
                    } else if (isDefined(val)) {
                        if (val.isArray) {
                            if (isDefined(options[0])) {
                                var optionType = options[0], newVal, len = val.length;
                                for (var i = 0; i < len; i++) {
                                    newVal = applySchema(path_str + "." + name + "[" + i + "]", {
                                        _val: val[i]
                                    }, {
                                        _val: optionType
                                    }, schemaOptions, errorLog);
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
            this.definitions = schema || {};
            this.options = options || {};
            this.errors = [];
        }
        Schema.type = type;
        Schema.Types = {};
        Schema.prototype.applySchema = function(data, optionsOverride) {
            var opts = optionsOverride || this.options;
            this.errors = opts.breakOnError === false ? [] : null;
            return exec.apply(this, [ data, this.definitions, opts, this.errors ]);
        };
        exports.Schema = Schema;
    })();
    exports.schemaHelper("ceil", function(val, isTrue) {
        if (isTrue) {
            val = Math.ceil(val);
        }
        return val;
    });
    exports.schemaHelper("floor", function(val, isTrue) {
        if (isTrue) {
            val = Math.floor(val);
        }
        return val;
    });
    exports.schemaHelper("max", function(val, maxValue) {
        if (validators.isNumber(maxValue)) {
            val = Math.max(val, maxValue);
        }
        return val;
    });
    exports.schemaHelper("min", function(val, minValue) {
        if (validators.isNumber(minValue)) {
            val = Math.min(val, minValue);
        }
        return val;
    });
    exports.schemaHelper("round", function(val, isTrue) {
        if (isTrue) {
            val = Math.round(val);
        }
        return val;
    });
    exports.schemaHelper("lowercase", function(val, isTrue) {
        if (isTrue && validators.isString(val)) {
            val = val.toLowerCase();
        }
        return val;
    });
    exports.schemaHelper("trim", function(val, isTrue) {
        if (isTrue && validators.isString(val)) {
            val = val.trim();
        }
        return val;
    });
    exports.schemaHelper("uppercase", function(val, isTrue) {
        if (isTrue && validators.isString(val)) {
            val = val.toUpperCase();
        }
        return val;
    });
    function extend(target, source) {
        var args = Array.prototype.slice.call(arguments, 0), i = 1, len = args.length, item, j;
        var options = this || {};
        while (i < len) {
            item = args[i];
            for (j in item) {
                if (item.hasOwnProperty(j)) {
                    if (target[j] && typeof target[j] === "object") {
                        target[j] = extend.apply(options, [ target[j], item[j] ]);
                    } else if (item[j] instanceof Array) {
                        target[j] = target[j] || (options && options.arrayAsObject ? {
                            length: item[j].length
                        } : []);
                        if (item[j].length) {
                            target[j] = extend.apply(options, [ target[j], item[j] ]);
                        }
                    } else if (item[j] && typeof item[j] === "object") {
                        if (options.objectsAsArray && typeof item[j].length === "number") {
                            if (!(target[j] instanceof Array)) {
                                target[j] = [];
                            }
                        }
                        target[j] = extend.apply(options, [ target[j] || {}, item[j] ]);
                    } else {
                        target[j] = item[j];
                    }
                }
            }
            i += 1;
        }
        return target;
    }
    Array.prototype.isArray = true;
    Object.defineProperty(Array.prototype, "isArray", {
        enumerable: false,
        writable: true
    });
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            var k;
            if (this === null) {
                throw new TypeError('"this" is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = +fromIndex || 0;
            if (Math.abs(n) === Infinity) {
                n = 0;
            }
            if (n >= len) {
                return -1;
            }
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                var kValue;
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }
    (function() {
        if (!Date.prototype.toISOString) {
            (function() {
                function pad(number) {
                    if (number < 10) {
                        return "0" + number;
                    }
                    return number;
                }
                Date.prototype.toISOString = function() {
                    return this.getUTCFullYear() + "-" + pad(this.getUTCMonth() + 1) + "-" + pad(this.getUTCDate()) + "T" + pad(this.getUTCHours()) + ":" + pad(this.getUTCMinutes()) + ":" + pad(this.getUTCSeconds()) + "." + (this.getUTCMilliseconds() / 1e3).toFixed(3).slice(2, 5) + "Z";
                };
            })();
        }
    })();
    String.prototype.supplant = function(o) {
        return this.replace(/{([^{}]*)}/g, function(a, b) {
            var r = o[b];
            return typeof r === "string" || typeof r === "number" ? r : a;
        });
    };
    exports.schemaType("Array", function() {
        this.exec = function(val, options) {
            if (validators.isArray(val)) {
                return val;
            }
            throw new Error("Invalid integer");
        };
    });
    exports.schemaType("Boolean", function() {
        this.exec = function(val, options) {
            if (validators.isBoolean(val)) {
                return val;
            }
            if (typeof val === "string") {
                switch (val) {
                  case "0":
                  case "false":
                    val = false;
                    break;

                  case "1":
                  case "true":
                    val = true;
                    break;

                  default:
                    throw new Error("Invalid boolean");
                }
                return val;
            }
            if (typeof val === "number") {
                return !!val;
            }
            throw new Error("Invalid boolean");
        };
    });
    exports.schemaType("Currency", function() {
        var regExCurrency = /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/;
        this.exec = function(val, options) {
            var result = String(val).search(regExCurrency) !== -1;
            if (result) {
                return String(val);
            }
            if (validators.isNull(val)) {
                return String(Number(val));
            }
            throw new Error("Currency can have either 0 or 2 decimal places. => " + val);
        };
    });
    exports.schemaType("Date", function() {
        function isValidDate(d) {
            return Object.prototype.toString.call(d) === "[object Date]" && String(d).toLowerCase() !== "invalid date";
        }
        this.exec = function(val, options) {
            var date = new Date();
            if (!validators.isNull(val)) {
                date = new Date(val);
            }
            if (!isValidDate(date)) {
                throw new Error("Invalid date format");
            }
            return date;
        };
    });
    exports.schemaType("Email", function() {
        this.exec = function(val, options) {
            var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!regExp.test(val)) {
                throw new Error("Invalid email");
            }
            return val;
        };
    });
    exports.schemaType("Int", function() {
        var regExIsInt = /^\s*(\-)?\d+\s*$/;
        this.exec = function(val, options) {
            if (isNaN(Number(val))) {
                throw new Error("Invalid integer");
            }
            if (String(Number(val)).search(regExIsInt) === -1) {
                throw new Error("Invalid integer");
            }
            return val || Number(val);
        };
    });
    exports.schemaType("Mixed", function() {
        this.exec = function(val) {
            return val;
        };
    });
    exports.schemaType("Number", function() {
        this.exec = function(val, options) {
            if (validators.isNumeric(val)) {
                return Number(val);
            }
            throw new Error("Invalid number");
        };
    });
    exports.schemaType("String", function(val, options) {
        this.exec = function(val, options) {
            if (validators.isNull(val)) {
                return null;
            }
            return String(val);
        };
    });
    (function(undef) {
        "use strict";
        var nextTick, isFunc = function(f) {
            return typeof f === "function";
        }, isArray = function(a) {
            return Array.isArray ? Array.isArray(a) : a instanceof Array;
        }, isObjOrFunc = function(o) {
            return !!(o && (typeof o).match(/function|object/));
        }, isNotVal = function(v) {
            return v === false || v === undef || v === null;
        }, slice = function(a, offset) {
            return [].slice.call(a, offset);
        }, undefStr = "undefined", tErr = typeof TypeError === undefStr ? Error : TypeError;
        if (typeof process !== undefStr && process.nextTick) {
            nextTick = process.nextTick;
        } else if (typeof MessageChannel !== undefStr) {
            var ntickChannel = new MessageChannel(), queue = [];
            ntickChannel.port1.onmessage = function() {
                queue.length && queue.shift()();
            };
            nextTick = function(cb) {
                queue.push(cb);
                ntickChannel.port2.postMessage(0);
            };
        } else {
            nextTick = function(cb) {
                setTimeout(cb, 0);
            };
        }
        function rethrow(e) {
            nextTick(function() {
                throw e;
            });
        }
        function promise_success(fulfilled) {
            return this.then(fulfilled, undef);
        }
        function promise_error(failed) {
            return this.then(undef, failed);
        }
        function promise_apply(fulfilled, failed) {
            return this.then(function(a) {
                return isFunc(fulfilled) ? fulfilled.apply(null, isArray(a) ? a : [ a ]) : defer.onlyFuncs ? a : fulfilled;
            }, failed || undef);
        }
        function promise_ensure(cb) {
            function _cb() {
                cb();
            }
            this.then(_cb, _cb);
            return this;
        }
        function promise_nodify(cb) {
            return this.then(function(a) {
                return isFunc(cb) ? cb.apply(null, isArray(a) ? a.splice(0, 0, undefined) && a : [ undefined, a ]) : defer.onlyFuncs ? a : cb;
            }, function(e) {
                return cb(e);
            });
        }
        function promise_rethrow(failed) {
            return this.then(undef, failed ? function(e) {
                failed(e);
                throw e;
            } : rethrow);
        }
        var defer = function(alwaysAsync) {
            var alwaysAsyncFn = (undef !== alwaysAsync ? alwaysAsync : defer.alwaysAsync) ? nextTick : function(fn) {
                fn();
            }, status = 0, pendings = [], value, _promise = {
                then: function(fulfilled, failed) {
                    var d = defer();
                    pendings.push([ function(value) {
                        try {
                            if (isNotVal(fulfilled)) {
                                d.resolve(value);
                            } else {
                                d.resolve(isFunc(fulfilled) ? fulfilled(value) : defer.onlyFuncs ? value : fulfilled);
                            }
                        } catch (e) {
                            d.reject(e);
                        }
                    }, function(err) {
                        if (isNotVal(failed) || !isFunc(failed) && defer.onlyFuncs) {
                            d.reject(err);
                        }
                        if (failed) {
                            try {
                                d.resolve(isFunc(failed) ? failed(err) : failed);
                            } catch (e) {
                                d.reject(e);
                            }
                        }
                    } ]);
                    status !== 0 && alwaysAsyncFn(execCallbacks);
                    return d.promise;
                },
                success: promise_success,
                error: promise_error,
                otherwise: promise_error,
                apply: promise_apply,
                spread: promise_apply,
                ensure: promise_ensure,
                nodify: promise_nodify,
                rethrow: promise_rethrow,
                isPending: function() {
                    return !!(status === 0);
                },
                getStatus: function() {
                    return status;
                }
            };
            _promise.toSource = _promise.toString = _promise.valueOf = function() {
                return value === undef ? this : value;
            };
            function execCallbacks() {
                if (status === 0) {
                    return;
                }
                var cbs = pendings, i = 0, l = cbs.length, cbIndex = ~status ? 0 : 1, cb;
                pendings = [];
                for (;i < l; i++) {
                    (cb = cbs[i][cbIndex]) && cb(value);
                }
            }
            function _resolve(val) {
                var done = false;
                function once(f) {
                    return function(x) {
                        if (done) {
                            return undefined;
                        } else {
                            done = true;
                            return f(x);
                        }
                    };
                }
                if (status) {
                    return this;
                }
                try {
                    var then = isObjOrFunc(val) && val.then;
                    if (isFunc(then)) {
                        if (val === _promise) {
                            throw new tErr("Promise can't resolve itself");
                        }
                        then.call(val, once(_resolve), once(_reject));
                        return this;
                    }
                } catch (e) {
                    once(_reject)(e);
                    return this;
                }
                alwaysAsyncFn(function() {
                    value = val;
                    status = 1;
                    execCallbacks();
                });
                return this;
            }
            function _reject(Err) {
                status || alwaysAsyncFn(function() {
                    try {
                        throw Err;
                    } catch (e) {
                        value = e;
                    }
                    status = -1;
                    execCallbacks();
                });
                return this;
            }
            return {
                promise: _promise,
                resolve: _resolve,
                fulfill: _resolve,
                reject: _reject
            };
        };
        defer.deferred = defer.defer = defer;
        defer.nextTick = nextTick;
        defer.alwaysAsync = true;
        defer.onlyFuncs = true;
        defer.resolved = defer.fulfilled = function(value) {
            return defer(true).resolve(value).promise;
        };
        defer.rejected = function(reason) {
            return defer(true).reject(reason).promise;
        };
        defer.wait = function(time) {
            var d = defer();
            setTimeout(d.resolve, time || 0);
            return d.promise;
        };
        defer.delay = function(fn, delay) {
            var d = defer();
            setTimeout(function() {
                try {
                    d.resolve(fn.apply(null));
                } catch (e) {
                    d.reject(e);
                }
            }, delay || 0);
            return d.promise;
        };
        defer.promisify = function(promise) {
            if (promise && isFunc(promise.then)) {
                return promise;
            }
            return defer.resolved(promise);
        };
        function multiPromiseResolver(callerArguments, returnPromises) {
            var promises = slice(callerArguments);
            if (promises.length === 1 && isArray(promises[0])) {
                if (!promises[0].length) {
                    return defer.fulfilled([]);
                }
                promises = promises[0];
            }
            var args = [], d = defer(), c = promises.length;
            if (!c) {
                d.resolve(args);
            } else {
                var resolver = function(i) {
                    promises[i] = defer.promisify(promises[i]);
                    promises[i].then(function(v) {
                        if (!(i in args)) {
                            args[i] = returnPromises ? promises[i] : v;
                            --c || d.resolve(args);
                        }
                    }, function(e) {
                        if (!(i in args)) {
                            if (!returnPromises) {
                                d.reject(e);
                            } else {
                                args[i] = promises[i];
                                --c || d.resolve(args);
                            }
                        }
                    });
                };
                for (var i = 0, l = c; i < l; i++) {
                    resolver(i);
                }
            }
            return d.promise;
        }
        defer.all = function() {
            return multiPromiseResolver(arguments, false);
        };
        defer.resolveAll = function() {
            return multiPromiseResolver(arguments, true);
        };
        defer.nodeCapsule = function(subject, fn) {
            if (!fn) {
                fn = subject;
                subject = void 0;
            }
            return function() {
                var d = defer(), args = slice(arguments);
                args.push(function(err, res) {
                    err ? d.reject(err) : d.resolve(arguments.length > 2 ? slice(arguments, 1) : res);
                });
                try {
                    fn.apply(subject, args);
                } catch (e) {
                    d.reject(e);
                }
                return d.promise;
            };
        };
        typeof window !== undefStr && (window.D = defer);
        typeof module !== undefStr && module.exports && (module.exports = defer);
    })();
    exports["validators"] = validators;
    exports["extend"] = extend;
})({}, function() {
    return this;
}());