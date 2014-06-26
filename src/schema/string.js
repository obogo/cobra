/* global cobra, _ */
cobra.schemaType('String', function (val, options) {
    return _.isString(val);
});
