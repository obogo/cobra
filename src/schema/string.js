/* global _ */
exports.schemaType('String', function (val, options) {
    this.exec = function (val, options) {
//        if(validators.isString(val)) {
        return String(val);
//        }
    };
});
