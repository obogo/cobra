/* global exports, validators */
exports.schemaType('String', function (val, options) {
    this.exec = function (val, options) {
        return String(val);
    };
});
