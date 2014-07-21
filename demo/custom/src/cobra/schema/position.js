/* global cobra */
cobra.schemaType('Position', function () {
    this.exec = function (val) {
        if (cobra.validators.isPosition(val)) {
            return val;
        }
        throw new Error('Invalid type');
    };
});