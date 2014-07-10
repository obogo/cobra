/* global validators */
validators.isEmpty = function (val) {
    if (validators.isString(val)) {
        return val === '';
    }

    if (validators.isArray(val)) {
        return val.length === 0;
    }

    if (validators.isObject(val)) {
        for (var e in val) {
            return false;
        }
        return true;
    }

    return false;
};