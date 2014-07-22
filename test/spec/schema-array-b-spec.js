/* global cobra, describe, beforeEach, expect, it */
describe('Array Complex schema containing required properties', function () {


    var model;

    beforeEach(function () {

        // create schema
        var TestSchema = new cobra.Schema({
            array: [
                {
                    list: [
                        { value: { type: String, required: true } }
                    ]
                }
            ]
        }, { allowNull: false });

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });

    describe('value set to {}', function () {

        it('should have value equal to {}', function (done) {

            function onApplySchema(result) {
                expect(result).toEqual({ });
                done();
            }
            model.applySchema().then(onApplySchema, onApplySchema);
        });

    });

    describe('value set to { array: [] }', function () {
        it('should have value equal to { array: [] }', function (done) {

            model.array = [];

            function onApplySchema(result) {
                expect(result).toEqual({ array: [] });
                done();
            }
            model.applySchema().then(onApplySchema, onApplySchema);
        });
    });

    describe('value set to { array: [ {} ] }', function () {
        it('should have value equal to { array: [ {} ] }', function (done) {

            model.array = [ {} ];

            function onApplySchema(result) {
                expect(result).toEqual({ array: [ {} ] });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);
        });
    });

    describe('value set to { array: [ { list: [] } ] }', function () {
        it('should have value equal to { array: [ { list: [] } ] }', function (done) {

            model.array = [ { list: [] } ];

            function onApplySchema(result) {
                expect(result).toEqual({ array: [ { list: [] } ] });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);
        });
    });

    describe('value set to { array: [ { list: [ {} ] } ] }', function () {
        it('to have an error', function (done) {

            model.array = [ { list: [ {} ] } ];

            function onApplySchema(result) {
                expect(result).toBeError();
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to { array: [ { list: [ { value: "hello" } ] } ] }', function () {
        it('should have value equal to { array: [ { list: [ { value: "hello" } ] } ] }', function (done) {

            model.array = [ { list: [ { value: "hello" } ] } ];

            function onApplySchema(result) {
                expect(result).toEqual({ array: [ { list: [ { value: "hello" }] } ] });
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);
        });
    });

});
