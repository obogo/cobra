/* global schemaFormat */
exports.schemaFormat('floor', function (val, isTrue) {
    if (isTrue) {
        val = Math.floor(val);
    }
    return val;
});
