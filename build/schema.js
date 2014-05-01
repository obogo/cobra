/*
* Schema v.0.0.1
* Rob Taylor. MIT 2014
*/
(function(){
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
    var deferred = Q.defer();
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
