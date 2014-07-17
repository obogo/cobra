/* global cobra */
cobra.schemaType('Position', function (val, options) {
    return cobra.validators.isPosition(val);
});