/* global cobra, describe, beforeEach, expect, it */
describe('Date schema', function () {

    var model;

    beforeEach(function () {

        // create schema
        var TestSchema = new cobra.Schema({
            myProp: { type: Date }
        }, { allowNull: false });

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });

    describe('value set to new Date()', function () {
        it('should have property equal to new Date()', function (done) {

            var date = new Date();
            model.myProp = date;

            function onApplySchema(result) {
                expect(result.myProp.toString()).toEqual( date.toString() );
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to Date.now()', function () {
        it('should have property equal to new Date.now()', function (done) {

            var date = Date.now();
            model.myProp = date;

            function onApplySchema(result) {
                expect(result.myProp.toString()).toEqual( new Date(date).toString() );
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to non date or non numeric value', function () {
        it('to have an error', function (done) {

            var date = 'bogus';
            model.myProp = date;

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

});
