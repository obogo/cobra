/* global exports, validators */
exports.schemaType('Email', function () {

    this.exec = function (val, options) {
        var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regExp.test(val)) {
            throw new Error('Invalid email');
        }

        return val;
    };

});