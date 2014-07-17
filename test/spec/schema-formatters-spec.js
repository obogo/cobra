/* global cobra, describe, beforeEach, expect, it */
describe('Schema formatters', function () {

    var Model, model;

    beforeEach(function () {
        var TestSchema = cobra.Schema;

        // create a new Schema
        var schema = new TestSchema({
            "ceil": { type: String, ceil: true},
//            "floor": { type: 'String', floor: true },
//            "round": { type: 'String', round: true },
//            "trim": { type: 'String', trim: true }
        }, { allowNull: false });

        cobra.model('Test', schema);
        Model = cobra.model('Test');
    });

    beforeEach(function () {
        model = new Model();
    });

    describe('value set to "3.45 on ceil"', function () {
        it('should have property equal to 4', function (done) {

            model.ceil = '3.45';

            function onApplySchema(result) {
                expect(result.ceil).toEqual('4');
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });


});
