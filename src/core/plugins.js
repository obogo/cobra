/* global exports, validators */
(function () {

    var _schemas = {};
    var _schemaTypes = {};
    var _schemaHelpers = {};
    var isUndefined = validators.isUndefined;

    exports.schemaType = function schemaType(name, callback) {
        if (isUndefined(callback)) {
            return _schemaTypes[name];
        }
        // used in schema definitions
        exports.Schema.Types[name] = {name: name};
        // user internally by schema
        _schemaTypes[name] = callback;
    };

    exports.schemaHelper = function schemaHelper(name, callback) {
        if (isUndefined(callback)) {
            return _schemaHelpers[name];
        }
        // used in schema definitions
        exports.Schema.Types[name] = {name: name};
        // user internally by schema
        _schemaHelpers[name] = callback;
    };

    exports.model = function model(name, schema) {
        if (isUndefined(schema)) {
            return exports.Model.factory(name, _schemas[name]);
        }
        _schemas[name] = schema;
    };

}());