/* global exports, validators */
exports.schemaType('Currency', function () {

    var regExCurrency = /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/;

    this.exec = function (val, options) {
        var result = String(val).search(regExCurrency) !== -1;

        if (result) {
            return String(val);
        }

        if (validators.isNull(val)) {
            return String(Number(val));
        }

        throw new Error('Currency can have either 0 or 2 decimal places. => ' + val);
    };

});
