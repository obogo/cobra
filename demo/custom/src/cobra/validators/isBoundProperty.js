/* global cobra */
cobra.validators.isBoundProperty = function () {
    var regExp = /^(\s+)?\{\{[^\}]+\}\}(\s+)?$/;
    this.exec = function (val) {
        return regExp.test(val);
    };
};