/* global exports, validators */
exports.schemaType('Boolean', function () {

    this.exec = function (val, options) {
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
            }
            return val;
        }

        if (typeof val === 'number') {
            return !!val;
        }

        return Boolean(val);
    };

});
