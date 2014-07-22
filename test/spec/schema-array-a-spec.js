/* global cobra, describe, beforeEach, expect, it */
describe('Array schema', function () {


    var model;

    beforeEach(function () {

        // create schema
        var TestSchema = new cobra.Schema({
            array: { type: Array }
        }, { allowNull: false });

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

    describe('value set to null', function () {
        it('should not have property defined', function (done) {

            model.array = null;

            function onApplySchema(result) {
                expect(result).toEqual({  });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('setting "allowNull" option to true', function () {

        describe('value set to null', function () {
            it('should have value equal to null', function (done) {

                model.array = null;

                function onApplySchema(result) {
                    expect(result).toEqual({ array: null });
                    done();
                }

                model.applySchema({ allowNull: true }).then(onApplySchema, onApplySchema);

            });
        });
    });
});
