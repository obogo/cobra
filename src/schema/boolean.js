/* global cobra, _ */
cobra.schemaType('Boolean', function (val, options) {
    return _.isBoolean(val);
});
