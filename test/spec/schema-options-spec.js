/* global cobra, describe, beforeEach, expect, it */
describe('Schema options', function () {

    var Model, model;

    beforeEach(function () {
        var TestSchema = cobra.Schema;

        // create a new Schema
        var schema = new TestSchema({
            myProp: String
        }, { allowNull: false, breakOnError: false });

        cobra.model('Test', schema);
        Model = cobra.model('Test');
    });

    beforeEach(function () {
        model = new Model();
    });

    describe('value set to null', function () {
        it('should not have property defined', function (done) {

            model.myProp = null;

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

                model.myProp = null;

                function onApplySchema(result) {
                    expect(result).toEqual({ myProp: null });
                    done();
                }

                model.applySchema({ allowNull: true }).then(onApplySchema, onApplySchema);

            });
        });
    });

});
