exports.schemaType('Date', function (val, options) {
    return validators.isDate(val) || validators.isNumber(val);
});
