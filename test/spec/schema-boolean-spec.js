/* global cobra, describe, beforeEach, expect, it */
describe('Boolean schema', function () {

    var model;

    beforeEach(function () {

        // create schema
        var TestSchema = new cobra.Schema({
            myProp: { type: Boolean }
        }, { allowNull: false });

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });


    describe('value set to true', function () {
        it('should have property equal to true', function (done) {

            model.myProp = true;

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: true });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to 0', function () {
        it('should have property equal to false', function (done) {

            model.myProp = 0;

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: false });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to 1', function () {
        it('should have property equal to true', function (done) {

            model.myProp = 1;

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: true });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to 100000', function () {
        it('should have property equal to true', function (done) {

            model.myProp = 100000;

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: true });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to "true"', function () {
        it('should have property equal to true', function (done) {

            model.myProp = 'true';

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: true });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to "bogus"', function () {
        it('to have an error', function (done) {

            model.myProp = 'bogus';

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to {}', function () {
        it('to have an error', function (done) {

            model.myProp = {};

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to []', function () {
        it('to have an error', function (done) {

            model.myProp = [];

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

});
