/* global exports, validators */
exports.schemaType('Int', function () {

    var regExIsInt = /^\s*(\-)?\d+\s*$/;

    this.exec = function (val, options) {
        if(isNaN(Number(val))) {
            throw new Error('Invalid integer');
        }
        if (String(Number(val)).search(regExIsInt) === -1) {
            throw new Error('Invalid integer');
        }
        return val || Number(val);
    };

});