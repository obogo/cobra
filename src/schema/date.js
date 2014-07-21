/* global exports, validators */
exports.schemaType('Date', function () {

    function isValidDate(d) {
        return Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d.getTime());
    }

    this.exec = function (val, options) {
        var date = new Date();
        if(!validators.isNull(val)) {
            date = new Date(val);
        }
        if (!isValidDate(date)) {
            throw new Error('Invalid date format');
        }
        return date;
    };

});
