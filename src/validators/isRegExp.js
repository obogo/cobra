/* global validators */
validators.isRegExp = function (value) {
    return value && value instanceof RegExp;
};