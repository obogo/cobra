/* global schemaHelper */
exports.schemaHelper('trim', function (val, isTrue) {
    if (isTrue) {
        val = String(val).trim();
    }
    return val;
});
