/* global cobra, describe, beforeEach, expect, it */
describe('String schema', function () {

    var model;

    beforeEach(function () {
        var Schema = cobra.Schema;

        // create schema
        var TestSchema = new Schema({
            myProp: { type: String }
        }, { allowNull: false });

        // assign model to schema
        cobra.model('Test', TestSchema);

        // get a reference to model
        var Model = cobra.model('Test');

        // create instance of model
        model = new Model();

    });

    describe('value set to "12345"', function () {
        it('should have property equal to "12345"', function (done) {

            var val = '12345';
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual("12345");
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to 12345', function () {
        it('should have property equal to "12345"', function (done) {

            var val = 12345;
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual("12345");
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to true', function () {
        it('should have property equal to "true"', function (done) {

            var val = true;
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual("true");
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to {}', function () {
        it('should have property equal to "[object Object]"', function (done) {

            var val = {};
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual("[object Object]");
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to [1,2,3]', function () {
        it('should have property equal to "1,2,3"', function (done) {

            var val = [1,2,3];
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual("1,2,3");
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });

    describe('value set to [{ message: "hello world"}, 1, "another string"]', function () {
        it('should have property equal to "[object Object],1,another string"', function (done) {

            var val = [{ message: 'hello world'}, 1, 'another string'];
            model.myProp = val;

            function onApplySchema(result) {
                expect(result.myProp).toEqual("[object Object],1,another string");
                done();
            }

            model.applySchema().then(onApplySchema, onApplySchema);

        });
    });




//    describe('value set to "12345"', function () {
//        it('should have property equal to 12345', function (done) {
//
//            var val = '12345';
//            model.myProp = val;
//
//            function onApplySchema(result) {
//                expect(result.myProp).toEqual(12345);
//                done();
//            }
//
//            model.applySchema().then(onApplySchema, onApplySchema);
//
//        });
//    });
//
//    describe('value set to non-numeric value', function () {
//        it('to have an error', function (done) {
//
//            var val = [];
//            model.myProp = val;
//
//            function onApplySchema(result) {
//                expect(result).toBeError();
//                done();
//            }
//
//            model.applySchema().then(onApplySchema, onApplySchema);
//
//        });
//    });

});
