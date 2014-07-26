/* global exports, validators */
exports.schemaType('String', function (val, options) {
    this.exec = function (val, options) {
        if(validators.isNull(val)) {
            return null;
        }
        return String(val);
    };
});
