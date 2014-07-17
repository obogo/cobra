/* global cobra */
cobra.validators.isPosition = function () {
    var regExpPos = /(\b\d+px\b)|(\b\d+em\b)|(\b\d+\%$)/;
    this.exec = function (val) {
        return regExpPos.test(val);
    };
};