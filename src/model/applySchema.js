exports.Model.extend('applySchema', function () {
    return this.getSchema().applySchema(this, arguments);
});