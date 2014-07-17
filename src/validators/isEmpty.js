/* global validators */
validators.isEmpty = function (value) {
    if (validators.isString(value)) {
        return value === '';
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