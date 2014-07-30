/* global exports, validators */
exports.schemaHelper('min', function (val, minValue) {
    if (validators.isNumber(minValue)) {
        val = Math.min(val, minValue);
    }
    return val;
});
