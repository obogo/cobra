var _;
if (window._) {
    _ = window._;
} else {
    Array.prototype.isArray = true;

    _ = {};

    function extend(target, source) {
        target = target || {};
        for (var prop in source) {
            if(source.hasOwnProperty(prop)) {
                if (typeof source[prop] === 'object') {
                    target[prop] = extend(target[prop], source[prop]);
                } else {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    _.extend = extend;

    _.isString = function (val) {
        return typeof val === 'string';
    };

    _.isBoolean = function (val) {
        return typeof val === 'boolean';
    };

    _.isNumber = function (val) {
        return typeof val === 'number';
    };

    _.isArray = function (val) {
        return !!val.isArray;
    };

    _.isEmpty = function (val) {
        if (_.isString(val)) {
            return val === '';
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

    _.isUndefined = function (val) {
        return typeof val === 'undefined';
    };

    _.isFunction = function (val) {
        return typeof val === 'function';
    };

    _.isObject = function (val) {
        return typeof val === 'object';
    };
}