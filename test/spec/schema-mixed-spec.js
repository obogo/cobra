/* global cobra, describe, beforeEach, expect, it */
describe('Mixed schema', function () {

    var model;

    beforeEach(function () {
        var Schema = cobra.Schema;

        // create schema
        var TestSchema = new Schema({
            myProp: { type: Schema.Types.Mixed }
        }, { allowNull: false });

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });

    describe('value set to anything', function () {
        it('should have property equal to that value', function (done) {

            var val = {
                message: 'Hello, world!'
            };
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual( val );
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

});
