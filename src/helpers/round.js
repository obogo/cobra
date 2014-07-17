/* global schemaHelper */
exports.schemaHelper('round', function (val, isTrue) {
    if (isTrue) {
        val = Math.round(val);
    }
    return val;
});
