/* global cobra, describe, beforeEach, expect, it */
describe('Integer schema', function () {

    var model;

    beforeEach(function () {
        var Schema = cobra.Schema;

        // create schema
        var TestSchema = new Schema({
            myProp: { type: Schema.Types.Int }
        }, { allowNull: false });

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });

    describe('value set to 12345', function () {
        it('should have property equal to 12345', function (done) {

            var val = 12345;
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual( val );
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to "12345"', function () {
        it('should have property equal to 12345', function (done) {

            var val = '12345';
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual( val );
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to 12.345', function () {
        it('to have an error', function (done) {

            var val = 12.345;
            model.myProp = val;

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to non integer', function () {
        it('to have an error', function (done) {

            var val = 'bogus';
            model.myProp = val;

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

});
