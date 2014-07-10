exports.schemaType('Int', function (val, options) {
    var regExIsInt = /^\s*(\-)?\d+\s*$/;
    return String(val).search(regExIsInt) !== -1;
});