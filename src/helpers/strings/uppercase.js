/* global exports, validators */
exports.schemaHelper('uppercase', function (val, isTrue) {
    if (isTrue && validators.isString(val)) {
        val = val.toUpperCase();
    }
    return val;
});
