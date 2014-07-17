/* global exports, validators */
exports.schemaType('Array', function () {

    this.exec = function (val, options) {
        if(validators.isArray(val)) {
            return val;
        }
        throw new Error('Invalid integer');
    };

});
