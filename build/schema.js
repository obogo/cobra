/*
* Schema v.0.0.1
* Rob Taylor. MIT 2014
*/
(function(){
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

var _;

if (window._) {
    _ = window._;
} else {
    Array.prototype.isArray = true;
    _ = {};
    function extend(target, source) {
        target = target || {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                if (typeof source[prop] === "object") {
                    target[prop] = extend(target[prop], source[prop]);
                } else {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }
    _.extend = extend;
    _.isString = function(val) {
        return typeof val === "string";
    };
    _.isBoolean = function(val) {
        return typeof val === "boolean";
    };
    _.isNumber = function(val) {
        return typeof val === "number";
    };
    _.isDate = function(val) {
        return val instanceof Date && !isNaN(val.valueOf());
    };
    _.isArray = function(val) {
        return !!val.isArray;
    };
    _.isEmpty = function(val) {
        if (_.isString(val)) {
            return val === "";
        }
        if (_.isArray(val)) {
            return val.length === 0;
        }
        if (_.isObject(val)) {
            for (var e in val) {
                return false;
            }
            return true;
        }
        return false;
    };
    _.isUndefined = function(val) {
        return typeof val === "undefined";
    };
    _.isFunction = function(val) {
        return typeof val === "function";
    };
    _.isObject = function(val) {
        return typeof val === "object";
    };
}

function Sly() {
    this._schemas = {};
    this._schemaTypes = {};
    this._schemaFormats = {};
}

Sly.prototype.schemaType = function(name, callback) {
    if (_.isUndefined(callback)) {
        return this._schemaTypes[name];
    }
    this.Schema.Types[name] = {
        name: name
    };
    this._schemaTypes[name] = callback;
};

Sly.prototype.schemaFormat = function(name, callback) {
    if (_.isUndefined(callback)) {
        return this._schemaFormats[name];
    }
    this.Schema.Types[name] = {
        name: name
    };
    this._schemaFormats[name] = callback;
};

Sly.prototype.model = function(name, schema) {
    if (_.isUndefined(schema)) {
        return sly.Model.factory(name, this._schemas[name]);
    }
    this._schemas[name] = schema;
};

var sly = new Sly();

window.sly = sly;

var schemaTypes = {};

var errType = 'Schema found type "{foundType}" where it expected type "{expectType}" => {val}';

function type(name, func) {
    schemaTypes[name] = func;
}

function applyRequired(prop, val) {
    if (_.isUndefined(val)) {
        throw new Error('property "{prop}" is required'.supplant({
            prop: prop
        }));
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
            fn = sly.schemaFormat(e);
            if (_.isFunction(fn)) {
                val = fn(val, formatOptions[e]);
            }
        }
    }
    return val;
}

function timeout(doc, schema) {
    var deferred = D();
    setTimeout(function() {
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
                type = sly.schemaType(options.type.name);
                if (type(val, options)) {
                    returnVal[name] = val;
                } else {
                    throw new Error(errType.supplant({
                        foundType: typeof val,
                        expectType: options.type.name,
                        val: val
                    }));
                }
            } else if (options.name) {
                type = sly.schemaType(options.name);
                if (type(val, options)) {
                    returnVal[name] = val;
                } else {
                    throw new Error(errType.supplant({
                        foundType: typeof val,
                        expectType: options.name,
                        val: val
                    }));
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

Schema.prototype.applySchema = function(doc) {
    return timeout(doc, this.schema);
};

sly.Schema = Schema;

function ModelFactory() {}

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
        _.extend(this, doc);
    }
    Model.statics = {};
    Model.prototype = ModelFactory.prototype;
    Model.prototype.getName = function() {
        return name;
    };
    Model.prototype.getSchema = function() {
        return schema;
    };
    return Model;
};

sly.Model = ModelFactory;

sly.schemaFormat("trim", function(val, isTrim) {
    if (isTrim) {
        val = String(val).trim();
    }
    return val;
});

sly.Model.extend("check", function() {
    return this.getSchema().applySchema(this, arguments);
});

String.prototype.supplant = function(o) {
    "use strict";
    return this.replace(/{([^{}]*)}/g, function(a, b) {
        var r = o[b];
        return typeof r === "string" || typeof r === "number" ? r : a;
    });
};

sly.schemaType("Boolean", function(val, options) {
    return _.isBoolean(val);
});

sly.schemaType("Date", function(val, options) {
    return _.isDate(val) || _.isNumber(val);
});

var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

sly.schemaType("Email", function(val, options) {
    return filter.test(val);
});

sly.schemaType("Mixed", function(val, options) {
    return true;
});

sly.schemaType("Number", function(val, options) {
    return _.isNumber(val);
});

var regExIsInt = /^\s*(\-)?\d+\s*$/;

sly.schemaType("Int", function(val, options) {
    return String(val).search(regExIsInt) !== -1;
});

var regExCurrency = /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/;

sly.schemaType("Currency", function(val, options) {
    var result = String(val).search(regExCurrency) !== -1;
    if (!result) {
        throw new Error("Currency can have either 0 or 2 decimal places. => " + val);
    }
    return result;
});

sly.schemaType("String", function(val, options) {
    return _.isString(val);
});
}());
