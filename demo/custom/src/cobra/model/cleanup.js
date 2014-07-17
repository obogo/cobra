/* global cobra */
cobra.Model.extend('cleanup', function () {
    function purge(returnVal) {
        for(var e in returnVal) {
            if(returnVal[e] === '') {
                delete returnVal[e];
            } else if (cobra.validators.isObject(returnVal[e])) {
                purge(returnVal[e]);
            }
        }
    }
    var promise = this.getSchema().applySchema(this, arguments);
    promise.then(function(resolvedData){
        purge(resolvedData);
    });
    return promise;
});
