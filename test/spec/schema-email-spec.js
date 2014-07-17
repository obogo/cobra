/* global cobra, describe, beforeEach, expect, it */
describe('Email schema', function () {

    var model;

    beforeEach(function () {
        var Schema = cobra.Schema;

        // create schema
        var TestSchema = new Schema({
            myProp: { type: Schema.Types.Email }
        }, { allowNull: false });

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });

    describe('value set to "john.smith@acme.com"', function () {
        it('should have property equal to "john.smith@acme.com"', function (done) {

            var email = 'john.smith@acme.com';
            model.myProp = email;

            function onApplySchema(result) {
                expect(result.myProp).toEqual( email );
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to "john.smith@acme.c"', function () {
        it('to have an error', function (done) {

            var email = 'john.smith@acme.c';
            model.myProp = email;

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

});
