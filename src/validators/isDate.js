/* global validators */
validators.isDate = function (val) {
    return val instanceof Date && !isNaN(val.valueOf());
};