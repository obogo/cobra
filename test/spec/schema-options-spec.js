/* global cobra, describe, beforeEach, expect, it */
describe('Schema options', function () {

    var Model, model;

    beforeEach(function () {
        var TestSchema = cobra.Schema;

        // create a new Schema
        var schema = new TestSchema({
            myProp: Number
        });

        cobra.model('Test', schema);
        Model = cobra.model('Test');
    });

    beforeEach(function () {
        model = new Model();
    });

    describe('value set to { myProp: null }', function () {
        it('to have value equal to { myProp: null }', function (done) {

            model.myProp = null;

            function onApplySchema(result) {
                expect(result).toEqual({ myProp: null } );
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('setting applySchema({ ignore:[ null ] })', function () {

        describe('value set to { myProp: null }', function () {
            it('should have value equal to { }', function (done) {

                model.myProp = null;

                function onApplySchema(result) {
                    expect(result).toEqual({ });
                    done();
                }

                model.applySchema({ ignore: [null] }).then(onApplySchema, onApplySchema);

            });
        });
    });


    describe('value set to { myProp: "" }', function () {
        it('to have an error', function (done) {

            model.myProp = '';

            function onApplySchema(result) {
                expect(result).toBeError( result );
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('setting option { breakOnError: false }', function () {

        describe('value set to { myProp: "" }', function () {
            it('should have error as Array', function (done) {

                model.myProp = '';

                function onApplySchema(result) {
                    expect(result).toBeTruthy( result.isArray && result.length === 1 );
                    done();
                }

                model.applySchema({breakOnError: false}).then(onApplySchema, onApplySchema);

            });
        });
    });

});
