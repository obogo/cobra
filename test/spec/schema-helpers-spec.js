/* global cobra, describe, beforeEach, expect, it */
describe('Schema helpers', function () {

    var Model, model;

    beforeEach(function () {
        var TestSchema = cobra.Schema;

        // create a new Schema
        var schema = new TestSchema({
            ceilProp: { type: String, ceil: true},
            floorProp: { type: String, floor: true },
            roundProp: { type: String, round: true },
            trimProp: { type: String, trim: true }
        }, { allowNull: false });

        cobra.model('Test', schema);
        Model = cobra.model('Test');
    });

    beforeEach(function () {
        model = new Model();
    });

    describe('helper set to ceil "3.45"', function () {
        it('should have property equal to "4"', function (done) {

            model.ceilProp = '3.45';

            function onApplySchema(result) {
                expect(result.ceilProp).toEqual('4');
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('helper set to floor "3.45"', function () {
        it('should have property equal to "3"', function (done) {

            model.floorProp = '3.45';

            function onApplySchema(result) {
                expect(result.floorProp).toEqual('3');
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('helper set to round "3.45"', function () {
        it('should have property equal to "4"', function (done) {

            model.roundProp = '3.45';

            function onApplySchema(result) {
                expect(result.roundProp).toEqual('3');
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });


    describe('helper set to trim "     John Smith     "', function () {
        it('should have property equal to "John Smith"', function (done) {

            model.trimProp = '     John Smith     ';

            function onApplySchema(result) {
                expect(result.trimProp).toEqual('John Smith');
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

});
