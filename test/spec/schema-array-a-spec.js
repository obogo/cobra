/* global cobra, describe, beforeEach, expect, it */
describe('Array schema', function () {


    var model;

    beforeEach(function () {

        // create schema
        var TestSchema = new cobra.Schema({
            array: { type: Array }
        }); // { allow: [ null ] } is the default

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });

    describe('value set to []', function () {

        it('should have value equal to []', function (done) {
            model.array = [];

            function onApplySchema(result) {
                expect(result).toEqual({ array: [] });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });

    });

    describe('value set to [1, 2, 3]', function () {
        it('should have value equal to  [1, 2, 3]', function (done) {

            model.array = [1, 2, 3];

            function onApplySchema(result) {
                expect(result).toEqual({ array: [1, 2, 3] });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);
        });
    });
});
