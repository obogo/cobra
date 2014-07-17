/* global cobra, describe, beforeEach, expect, it */
describe('Currency schema', function () {

    var model;

    beforeEach(function () {

        // create schema
        var TestSchema = new cobra.Schema({
            myProp: { type: cobra.Schema.Types.Currency }
        }, { allowNull: false });

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });


    describe('value set to 1', function () {
        it('should have property equal to "1"', function (done) {

            model.myProp = 1;

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: '1' });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to 1.00', function () {
        it('should have property equal to "1"', function (done) {

            model.myProp = 1.00;

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: '1' });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to 1.23', function () {
        it('should have property equal to "1.23"', function (done) {

            model.myProp = 1.23;

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: '1.23' });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to "1"', function () {
        it('should have property equal to "1"', function (done) {

            model.myProp = '1';

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: '1' });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to "1.23"', function () {
        it('should have property equal to "1.23"', function (done) {

            model.myProp = '1.23';

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: '1.23' });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to 1.234', function () {
        it('to have an error', function (done) {

            model.myProp = 1.234;

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });


});
