/* global cobra, _ */
cobra.schemaType('Number', function (val, options) {
    return _.isNumber(val);
});

var regExIsInt = /^\s*(\-)?\d+\s*$/;
cobra.schemaType('Int', function (val, options) {
    return String(val).search(regExIsInt) !== -1;
});

var regExCurrency = /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/;
cobra.schemaType('Currency', function (val, options) {
    var result = String(val).search(regExCurrency) !== -1;
    if (!result) {
        throw new Error('Currency can have either 0 or 2 decimal places. => ' + val);
    }
    return result;
});
