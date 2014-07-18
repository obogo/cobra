/* global cobra */
cobra.schemaType('Bind', function () {
    this.exec = function (val) {
        if(cobra.validators.isBoundProperty(val)){
            return val;
        }
    };
});