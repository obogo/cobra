/* global cobra */
cobra.validators.isPosition = function (val) {
    var regExpPos = /(\b\d+px\b)|(\b\d+em\b)|(\b\d+\%$)/;
    return regExpPos.test(val);
};