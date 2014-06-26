/* global cobra, _ */
function Cobra() {
    this._schemas = {};
    this._schemaTypes = {};
    this._schemaFormats = {};
}

Cobra.prototype.schemaType = function (name, callback) {
    if (_.isUndefined(callback)) {
        return this._schemaTypes[name];
    }
    // used in schema definitions
    this.Schema.Types[name] = {name: name};
    // user internally by schema
    this._schemaTypes[name] = callback;
};

Cobra.prototype.schemaFormat = function (name, callback) {
    if (_.isUndefined(callback)) {
        return this._schemaFormats[name];
    }
    // used in schema definitions
    this.Schema.Types[name] = {name: name};
    // user internally by schema
    this._schemaFormats[name] = callback;
};

Cobra.prototype.model = function (name, schema) {
    if (_.isUndefined(schema)) {
        return cobra.Model.factory(name, this._schemas[name]);
    }
    this._schemas[name] = schema;
};

var cobra = new Cobra();
window.cobra = cobra;