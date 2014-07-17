/* global exports, validators */
exports.schemaType('Number', function () {
    this.exec = function (val, options) {
        if (validators.isNumber(val)) {
            return Number(val);
        }
        throw new Error('Invalid number');
    };
});



