/* global validators */
validators.isNumber = function (val) {
    if (isNaN(val)) {
        throw new Error('Invalid number');
    }
    return val;
};