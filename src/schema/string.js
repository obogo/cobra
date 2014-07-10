/* global _ */
exports.schemaType('String', function (val, options) {
    return validators.isString(val);
});
