/*
* Demo v.0.1.0
* Rob Taylor. MIT 2014
*/
cobra.Model.extend("purge", function() {
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

cobra.schemaType("Bind", function(val, options) {
    return cobra.validators.isBoundProperty(val);
});

cobra.schemaType("Email", function(val, options) {
    return cobra.validators.isEmail(val);
});

cobra.schemaType("Position", function(val, options) {
    return cobra.validators.isPosition(val);
});

cobra.validators.isBoundProperty = function(val) {
    var regExp = /^(\s+)?\{\{[^\}]+\}\}(\s+)?$/;
    return regExp.test(val);
};

cobra.validators.isEmail = function(val) {
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regExp.test(val);
};

cobra.validators.isPosition = function(val) {
    var regExpPos = /(\b\d+px\b)|(\b\d+em\b)|(\b\d+\%$)/;
    return regExpPos.test(val);
};