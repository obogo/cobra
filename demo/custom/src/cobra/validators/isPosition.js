/* global cobra */
cobra.validators.isPosition = function (val) {
    var regExpPos = /^\d+(px|em|vw|vh|vmin|vmax|%)?$/;
    return regExpPos.test(val);
};