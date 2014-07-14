/* global cobra */
cobra.validators.isBoundProperty = function (val) {
    var regExp = /^(\s+)?\{\{[^\}]+\}\}(\s+)?$/;
    return regExp.test(val);
};