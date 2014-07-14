/* global cobra */
cobra.schemaType('Bind', function (val, options) {
    return cobra.validators.isBoundProperty(val);
});