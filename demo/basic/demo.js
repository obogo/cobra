/* global cobra, console */
(function () {
    'use strict';

    var Schema = cobra.Schema;

    var TestSchema = new Schema({
        str: { type: String, default: 'hello', required: true, trim: true },
        bool: { type: Boolean, required: true},
        num: { type: Number },
        int: { type: Schema.Types.Int },
        currency: { type: Schema.Types.Currency },
        date: { type: Date, default: Date.now },
        email: { type: Schema.Types.Email },
        obj: { type: Schema.Types.Mixed },
        name: String
    });

    cobra.model('Test', TestSchema);

    var Test = cobra.model('Test');
    var test = new Test({
        bogus: true,
        email: 'roboncode@gmail.com',
        str: '   goodbye   ',
        bool: true,
        num: 123,
        int: '123',
        currency: 123.12,
        date: Date.now(),
        obj: {
            anything: true
        }
    });
    test.name = 'Rob Taylor';

    test.applySchema().then(function (resolvedData) {
        console.log('success', resolvedData);
    }, function (err) {
        console.log('error', err.message);
    });

}());