/* global exports */
exports.schemaHelper('floor', function (val, isTrue) {
    if (isTrue) {
        val = Math.floor(val);
    }
    return val;
});
