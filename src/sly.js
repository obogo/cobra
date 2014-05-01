/* global sly, _ */
function Sly() {
    this._schemas = {};
    this._schemaTypes = {};
    this._schemaFormats = {};
}

Sly.prototype.schemaType = function (name, callback) {
    if (_.isUndefined(callback)) {
        return this._schemaTypes[name];
    }
    // used in schema definitions
    this.Schema.Types[name] = {name: name};
    // user internally by schema
    this._schemaTypes[name] = callback;
};

Sly.prototype.schemaFormat = function (name, callback) {
    if (_.isUndefined(callback)) {
        return this._schemaFormats[name];
    }
    // used in schema definitions
    this.Schema.Types[name] = {name: name};
    // user internally by schema
    this._schemaFormats[name] = callback;
};

Sly.prototype.model = function (name, schema) {
    if (_.isUndefined(schema)) {
        return sly.Model.factory(name, this._schemas[name]);
    }
    this._schemas[name] = schema;
};

var sly = new Sly();
window.sly = sly;