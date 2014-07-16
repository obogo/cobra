/* global cobra, describe, beforeEach, expect, it */
describe('Cobra', function () {

    var Schema;

    beforeEach(function () {
        Schema = cobra.Schema;
    });

    describe('schema with no types.', function () {

        var EmptySchema,
            EmptyModel,
            model;

        beforeEach(function () {
            EmptySchema = new cobra.Schema({});
            cobra.model('Empty', EmptySchema);
            EmptyModel = cobra.model('Empty');
        });

        describe('create an instance of EmptyModel', function () {

            beforeEach(function () {
                model = new EmptyModel();
                model.id = 1;
                model.name = 'My Model';
            });

            it('should be an instance of "Empty" model.', function () {
                expect(model.getName()).toEqual('Empty');
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

//            it('should be able to modify schema', function (done) {
//                EmptySchema.schema.id = String;
//                model = new EmptyModel();
//                model.id = '1ed23';
//                console.log('model', model);
//                model.applySchema().then(function (result) {
//                    expect(result).toEqual({id: '1ed23'});
//                    done();
//                }, function(err){
//                    expect(err).toEqual({id: '1ed23'});
//                    done();
//                });
//
//            });

        });
    });

});
