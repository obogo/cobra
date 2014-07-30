/* global exports, validators */
exports.schemaHelper('lowercase', function (val, isTrue) {
    if (isTrue && validators.isString(val)) {
        val = val.toLowerCase();
    }
    return val;
});
