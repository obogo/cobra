/* global cobra */
cobra.schemaType('Position', function () {
    this.exec = function (val) {
        if (cobra.validators.isPosition(val)) {
            return val;
        }
    };
});