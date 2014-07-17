/* global schemaFormat */
exports.schemaFormat('round', function (val, isTrue) {
    if (isTrue) {
        val = Math.round(val);
    }
    return val;
});
