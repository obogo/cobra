/* global exports */
(function () {
    /**
     *
     * @param message
     * @constructor
     */
    function SchemaInvalidTypeError(type, property, value, message) {
        this.name = 'SchemaInvalidTypeError';
        this.type = type;
        this.actualType = capitalize(typeof value);
        this.property = property.substr(5);
        this.value = value;
        this.message = message || ('Schema found type "{actualType}" where it expected type "{type}" :: {prop} => {val}').supplant(
            {
                actualType: this.actualType,
                type: capitalize(this.type),
                prop: this.property,
                val: this.value
            }
        );
    }
    SchemaInvalidTypeError.prototype = Error.prototype;

    /**
     * Invoked when property is required an missing.
     * @param property
     * @param message
     * @constructor
     */
    function SchemaRequiredPropertyError(property, message) {
        this.name = 'SchemaRequiredPropertyError';
        this.property = property.substr(5);
        this.message = message || ('property "{prop}" is required').supplant({prop: property});
    }
    SchemaRequiredPropertyError.prototype = Error.prototype;

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    exports.SchemaInvalidTypeError = SchemaInvalidTypeError;
    exports.SchemaRequiredPropertyError = SchemaRequiredPropertyError;

})();