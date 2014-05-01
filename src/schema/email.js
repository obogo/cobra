/* global sly, _ */
var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
sly.schemaType('Email', function (val, options) {
    return filter.test(val);
});
