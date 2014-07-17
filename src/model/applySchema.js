exports.Model.extend('applySchema', function (options) {
    return this.getSchema().applySchema(this, options);
});