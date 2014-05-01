/* global sly, _ */
sly.schemaType('Date', function (val, options) {
    return _.isDate(val) || _.isNumber(val);
});
