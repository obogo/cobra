/* global validators, exports */
validators.isSchema = function (value) {
    return value instanceof exports.Schema;
};
