/* global schemaFormat */
exports.schemaFormat('trim', function (val, isTrue) {
    if (isTrue) {
        val = String(val).trim();
    }
    return val;
});
