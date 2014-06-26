/* global cobra, _ */
var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
cobra.schemaType('Email', function (val, options) {
    return regExp.test(val);
});
