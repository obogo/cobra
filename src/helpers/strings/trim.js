/* global exports, validators */
exports.schemaHelper('trim', function (val, isTrue) {
    if (isTrue && validators.isString(val)) {
        val = val.trim();
    }
    return val;
});
