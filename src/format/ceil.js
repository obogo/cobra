/* global schemaFormat */
exports.schemaFormat('ceil', function (val, isTrue) {
    if (isTrue) {
        val = Math.ceil(val);
    }
    return val;
});
