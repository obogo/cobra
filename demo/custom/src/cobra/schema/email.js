/* global cobra */
cobra.schemaType('Email', function (val, options) {
    return cobra.validators.isEmail(val);
});