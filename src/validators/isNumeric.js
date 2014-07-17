/* global validators */
validators.isNumeric = function (value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
};