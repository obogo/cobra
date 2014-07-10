exports.schemaType('Currency', function (val, options) {
    var regExCurrency = /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/;
    var result = String(val).search(regExCurrency) !== -1;
    if (!result) {
        throw new Error('Currency can have either 0 or 2 decimal places. => ' + val);
    }
    return result;
});
