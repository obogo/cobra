/* global sly, _ */
sly.schemaType('Boolean', function (val, options) {
    return _.isBoolean(val);
});
