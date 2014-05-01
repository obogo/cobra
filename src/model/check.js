/* global sly, Q */
sly.Model.extend('check', function () {
    return this.getSchema().applySchema(this, arguments);
});
