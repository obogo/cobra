/* global cobra */
describe('Cobra', function () {
    var Schema;
    var BasicSchema;
    var BasicModel;
    var emptyModel;

    beforeEach(function () {
        Schema = cobra.Schema;
    });

    describe('Model from basic schema', function () {
        beforeEach(function () {
            BasicSchema = new cobra.Schema({
                array: [],
                bool: Boolean,
                currency: Schema.Types.Currency,
                date: Date,
                email: Schema.Types.Email,
                int: Schema.Types.Int,
                obj: Schema.Types.Mixed,
                num: Number,
                str: String
            });

            cobra.model('Basic', BasicSchema);
        });

        describe('Empty model', function(){
            beforeEach(function(){
                BasicModel = cobra.model('Basic');
                emptyModel = new BasicModel();
            });

            it('should be of type "Basic"', function () {
                expect(emptyModel.getName()).toEqual('Basic');
//                expect(player.currentlyPlayingSong).toEqual(song);
//
//                //demonstrates use of custom matcher
//                expect(player).toBePlaying(song);
            });

            it('should be empty', function (done) {
                emptyModel.check().then(function (resolvedData) {
                    expect(resolvedData).toBeEmpty(true);
                    done();
                }, function (err) {
//                    console.log('error', err.message);
                });
//                expect(true).toBeTruthy();
//                expect(player.currentlyPlayingSong).toEqual(song);
//
//                //demonstrates use of custom matcher
//                expect(player).toBePlaying(song);
            });
        });
    });
});
