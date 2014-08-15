/* global exports, validators, D */
(function () {

    var _schemas = {};
    var _schemaTypes = {};
    var _schemaHelpers = {};
    var isUndefined = validators.isUndefined;
    var isNull = validators.isNull;
    var counter = 1;

    exports.applySchemaType = function (schemaName, value) {
        var SchemaType = exports.schemaType(schemaName);
        var schemaType = new SchemaType();

        return schemaType.exec(value);
    };

    exports.applySchemaHelper = function (helperName, value) {
        var fnHelper = exports.schemaHelper(helperName);

        return fnHelper(value);
    };

    exports.schemaType = function schemaType(name, callback) {
        if (isUndefined(callback)) {
            return _schemaTypes[name];
        }
        // used in schema definitions
        exports.Schema.Types[name] = {name: name};
        // user internally by schema
        _schemaTypes[name] = callback;

        return this;
    };

    exports.schemaHelper = function schemaHelper(name, callback) {
        if (isUndefined(callback)) {
            return _schemaHelpers[name];
        }
        // used in schema definitions
        exports.Schema.Types[name] = {name: name};
        // used internally by schema
        _schemaHelpers[name] = callback;

        return this;
    };

    exports.model = function model(name, schema) {

        if (isUndefined(schema)) {
            return exports.Model.factory(name, _schemas[name]);
        }

        if (isNull(schema)) {
            return delete _schemas[name];
        }

        _schemas[name] = schema;

        return this;
    };

    exports.validate = function (value, schema, options) {

        D.alwaysAsync = false;

        var c = counter++;

        var $schema = new exports.Schema({
            value: schema
        });

        exports.model('$model' + c, $schema);

        var Model = exports.model('$model' + c);
        var model = new Model({
            value: value
        });

        var returnVal = {};

        var promise = model.applySchema(options);
        promise.then(function (resolvedData) {
            exports.model('$model' + c, null);
            returnVal.isValid = true;
            returnVal.value = resolvedData.value;
        }, function (err) {
            exports.model('$model' + c, null);
            returnVal.isValid = false;
            returnVal.error = err;
        });

        D.alwaysAsync = true;

        return returnVal;
//        return promise;
    };

}());