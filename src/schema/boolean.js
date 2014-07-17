/* global exports, validators */
exports.schemaType('Boolean', function () {

    this.exec = function (val, options) {

        if(validators.isBoolean(val)) {
            return val;
        }

        if (typeof val === 'string') {
            switch (val) {
                case '0':
                case 'false':
                    val = false;
                    break;
                case '1':
                case 'true':
                    val = true;
                    break;
                default:
                    throw new Error('Invalid boolean');
            }
            return val;
        }

        if (typeof val === 'number') {
            return !!val;
        }

        throw new Error('Invalid boolean');
    };

});
