/* global sly, _ */
sly.schemaType('String', function (val, options) {
    return _.isString(val);
});
