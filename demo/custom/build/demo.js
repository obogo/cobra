/*
* Demo v.0.1.0
* Rob Taylor. MIT 2014
*/
cobra.Model.extend("cleanup", function() {
    function purge(returnVal) {
        for (var e in returnVal) {
            if (returnVal[e] === "") {
                delete returnVal[e];
            } else if (cobra.validators.isObject(returnVal[e])) {
                purge(returnVal[e]);
            }
        }
    }
    var promise = this.getSchema().applySchema(this, arguments);
    promise.then(function(resolvedData) {
        purge(resolvedData);
    });
    return promise;
});

cobra.schemaType("Bind", function() {
    this.exec = function(val) {
        if (cobra.validators.isBoundProperty(val)) {
            return val;
        }
    };
});

cobra.schemaType("Position", function() {
    this.exec = function(val) {
        if (cobra.validators.isPosition(val)) {
            return val;
        }
        throw new Error("Invalid type");
    };
});

cobra.validators.isBoundProperty = function(val) {
    var regExp = /^(\s+)?\{\{[^\}]+\}\}(\s+)?$/;
    return regExp.test(val);
};

cobra.validators.isPosition = function(val) {
    var regExpPos = /(\b\d+px\b)|(\b\d+em\b)|(\b\d+\%$)/;
    return regExpPos.test(val);
};