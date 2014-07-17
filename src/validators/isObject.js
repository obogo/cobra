/* global validators */
validators.isObject = function (value) {
    return value !== null && typeof value === 'object';
};