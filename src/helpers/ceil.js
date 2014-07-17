/* global schemaHelper */
exports.schemaHelper('ceil', function (val, isTrue) {
    if (isTrue) {
        val = Math.ceil(val);
    }
    return val;
});
