/* global validators */
validators.isDate = function (value) {
    return value instanceof Date && !isNaN(value.valueOf());
};