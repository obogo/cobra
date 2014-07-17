/* global exports, validators */
exports.schemaType('Number', function () {
    this.exec = function (val, options) {
        if (validators.isNumeric(val)) {
            return Number(val);
        }
        throw new Error('Invalid number');
    };
});



