/* global cobra */
cobra.validators.isBoundProperty = function (val) {
    var regExp = /^{{.*?}}$/;
    return regExp.test(val);
};