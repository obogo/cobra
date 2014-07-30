/* global exports, validators */
exports.schemaHelper('max', function (val, maxValue) {
    if (validators.isNumber(maxValue)) {
        val = Math.max(val, maxValue);
    }
    return val;
});
