/* global cobra, describe, beforeEach, expect, it */
describe('Schema class', function () {

    describe('Model "Test"', function () {

        var Model, model;

        beforeEach(function () {
            // create a new Schema
            var TestSchema = new cobra.Schema();
            cobra.model('Test', TestSchema);
            Model = cobra.model('Test');
            model = new Model();
            model.id = 1;
            model.name = 'My Model';
        });


        it('should be an instance of "Test" model.', function () {
            expect(model.getName()).toEqual('Test');
        });

        it('should have no options.', function () {
            expect(model.options()).toEqual({});
        });

        it('should have no properties on apply', function (done) {
            model.applySchema().then(function (result) {
                expect(result).toEqual({});
                done();
            });
        });

    });

});
