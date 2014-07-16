/* global cobra, describe, beforeEach, expect, it */
describe('Cobra', function () {
    var Schema;

    beforeEach(function () {
        Schema = cobra.Schema;
    });

    describe('will test models created from a schema with primitive schema types', function () {

        var SimpleSchema;
        var DefaultModel;
        var BasicModel;

        beforeEach(function () {
            SimpleSchema = new cobra.Schema({
                array: [],
                bool: Boolean,
                currency: Schema.Types.Currency,
                date: Date,
                email: Schema.Types.Email,
                int: Schema.Types.Int,
                obj: Schema.Types.Mixed,
                num: Number,
                str: String
            }, { allowNull: false });

            cobra.model('Default', SimpleSchema);
            cobra.model('Basic', SimpleSchema);

            DefaultModel = cobra.model('Default');
            BasicModel = cobra.model('Basic');
        });

        describe('DefaultModel', function () {

            var defaultModel;

            beforeEach(function () {
                defaultModel = new DefaultModel();
            });

            it('should have name "Default"', function () {
                expect(defaultModel.name).toEqual('Default');
            });

            it('should not allow null objects', function () {
                expect(defaultModel.options('allowNull')).toBeFalsy();
            });
        });

        describe('BasicModel', function () {

            var basicModel;

            beforeEach(function () {
                basicModel = new BasicModel();
                basicModel.options('allowNull', true);
            });

            it('should have name "Basic"', function () {
                expect(basicModel.name).toEqual('Basic');
            });

            it('should allow null objects', function () {
                expect(basicModel.options('allowNull')).toBeTruthy();
            });

        });

        describe('Empty model', function () {

            var emptyModel;

            beforeEach(function () {
                emptyModel = new BasicModel();
                basicModel.options('allowNull', true);
            });

            it('should be an empty object {}', function (done) {
                emptyModel.check().then(function (result) {
                    expect(result).toBeEmpty(true);
                    done();
                }, function (result) {
                    expect(result).toBeEmpty(true);
                    done();
                });
            });
        });

        describe('Model', function () {

            var myModel;

            beforeEach(function () {
                myModel = new BasicModel();
            });

            it('should not allow null objects', function () {
                myModel.options('allowNull', false);
                expect(myModel.options('allowNull')).toBeFalsy();
            });

            it('should allow null objects', function () {
                expect(myModel.options('allowNull')).toBeTruthy();
            });

            it('should have an not have the property "bogus"', function (done) {

                myModel.bogus = "This will not exist";

                myModel.check().then(function (result) {
                    expect(result).toEqual( { } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { } );
                    done();
                });

            });

            it('should have an "array" prop equal to []', function (done) {
                console.log('qw ');
                myModel.array = [];

                myModel.check().then(function (result) {
                    expect(result).toEqual( { array: [] } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { array: [] } );
                    done();
                });

            });

            it('should have an "array" prop equal to [1, 2, 3]', function (done) {

                myModel.array = [1, 2, 3];

                myModel.check().then(function (result) {
                    expect(result).toEqual( { array: [1, 2, 3] } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { array: [1, 2, 3] } );
                    done();
                });

            });

            it('should have an "array" prop equal to null', function (done) {

                myModel.array = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { array: null } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { array: null } );
                    done();
                });

            });

            it('should not have a property called "array"', function (done) {

                myModel.options('allowNull', false);
                myModel.array = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( {  } );
                    done();
                }, function (result) {
                    expect(result).toEqual( {  } );
                    done();
                });

            });

            it('should have an "bool" prop equal to true', function (done) {

                myModel.bool = true;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { bool: true } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { bool: true } );
                    done();
                });

            });

            it('should have an "bool" prop equal to true', function (done) {

                myModel.bool = 1;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { bool: true } );
                    done();
                }, function (result) {
                    expect(result.message).toEqual( 'Schema found type "object" where it expected type "Boolean" :: bool => {val}' );
                    done();
                });

            });

            it('should have an "bool" prop equal to false', function (done) {

                myModel.bool = false;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { bool: false } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { bool: false } );
                    done();
                });

            });

            it('should have an "bool" prop equal to null', function (done) {

                myModel.bool = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { bool: null } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { bool: null } );
                    done();
                });

            });

            it('should not have a property called "bool"', function (done) {

                myModel.options('allowNull', false);
                myModel.bool = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( {  } );
                    done();
                }, function (result) {
                    expect(result).toEqual( {  } );
                    done();
                });

            });

            it('should not have an "bool" prop', function (done) {

                myModel.check().then(function (result) {
                    expect(result).toEqual( { } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { bool: true } );
                    done();
                });

            });

            it('should have an "currency" prop equal to 1', function (done) {

                myModel.currency = 1;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { currency: 1 } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { bool: true } );
                    done();
                });

            });

            it('should have an "currency" prop equal to 1.00', function (done) {

                myModel.currency = 1.00;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { currency: 1.00 } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { bool: true } );
                    done();
                });

            });

            it('should have an "currency" prop equal to 1.23', function (done) {

                myModel.currency = 1.23;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { currency: 1.23 } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { bool: true } );
                    done();
                });

            });

            it('should have an "currency" prop value 1.234 to be invalid', function (done) {

                myModel.currency = 1.234;

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });

            it('should have an "currency" prop equal to "1"', function (done) {

                myModel.currency = "1";

                myModel.check().then(function (result) {
                    expect(result).toEqual( { currency: "1" } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { bool: true } );
                    done();
                });

            });

            it('should have an "currency" prop equal to "1.23"', function (done) {

                myModel.currency = "1.23";

                myModel.check().then(function (result) {
                    expect(result).toEqual( { currency: "1.23" } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { currency: "1.23" } );
                    done();
                });

            });

            it('should have an "currency" prop equal to null', function (done) {

                myModel.currency = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { currency: null } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { currency: null } );
                    done();
                });

            });

            it('should not have a property called "currency"', function (done) {

                myModel.options('allowNull', false);
                myModel.currency = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( {  } );
                    done();
                }, function (result) {
                    expect(result).toEqual( {  } );
                    done();
                });

            });

            it('should have an "currency" prop value "1.0.0" to be invalid', function (done) {

                myModel.currency = "1.0.0";

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });

            it('should have an "currency" prop value "1.0" to be invalid', function (done) {

                myModel.currency = "1.0";

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });

            it('should have an "currency" prop value "1.000" to be invalid', function (done) {

                myModel.currency = "1.000";

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });

            it('should have an "date" prop Date to be valid', function (done) {

                var date = new Date();
                myModel.date = date;

                myModel.check().then(function (result) {
                    expect(result.date.toString()).toEqual( date.toString() );
                    done();
                }, function (result) {
                    expect(result.date.toString()).toEqual( date.toString() );
                    done();
                });

            });

            it('should have an "date" prop Number to be valid', function (done) {

                var date = Date.now();
                myModel.date = date;

                myModel.check().then(function (result) {
                    expect(result.date.toString() ).toEqual( new Date(date).toString() );
                    done();
                }, function (result) {
                    expect(result.date.toString() ).toEqual( new Date(date).toString() );
                    done();
                });

            });

            it('should have an "date" prop ISO String to be valid', function (done) {

                var date = '2014-07-15T22:26:58.161Z';
                myModel.date = date;

                myModel.check().then(function (result) {
                    expect(result.date.toString()).toEqual( new Date(date).toString() );
                    done();
                }, function (result) {
                    expect(result.date.toString()).toEqual( new Date(date).toString() );
                    done();
                });

            });

            it('should have an "date" prop null to be valid', function (done) {

                var date = null;
                myModel.date = date;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { date: date } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { date: date } );
                    done();
                });

            });

            it('should not have a property called "date"', function (done) {

                myModel.options('allowNull', false);
                myModel.date = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( {  } );
                    done();
                }, function (result) {
                    expect(result).toEqual( {  } );
                    done();
                });

            });

            it('should have an "date" with value of "bogus" to be invalid', function (done) {

                var date = 'bogus';
                myModel.date = date;

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });


            it('should have an "email" value "john.smith@acme.com" to be valid', function (done) {

                var email = 'john.smith@acme.com';
                myModel.email = email;

                myModel.check().then(function (result) {
                    expect(result.email).toEqual( email );
                    done();
                }, function (result) {
                    expect(result.email).toEqual( email );
                    done();
                });

            });

            it('should have an "email" value null to be valid', function (done) {

                var email = null;
                myModel.email = email;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { email: null } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { email: null } );
                    done();
                });

            });

            it('should not have a property called "email"', function (done) {

                myModel.options('allowNull', false);
                myModel.email = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( {  } );
                    done();
                }, function (result) {
                    expect(result).toEqual( {  } );
                    done();
                });

            });

            it('should have an "email" value "john.smith@a.c" to be invalid', function (done) {

                var email = 'john.smith@acme.c';
                myModel.email = email;

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });

            it('should have an "email" value "john.smith@acme.com" to be valid', function (done) {

                var email = 'john.smith@acme.com';
                myModel.email = email;

                myModel.check().then(function (result) {
                    expect(result.email).toEqual( email );
                    done();
                }, function (result) {
                    expect(result.email).toEqual( email );
                    done();
                });

            });

            it('should have an "email" value "john.smith@a.c" to be invalid', function (done) {

                var email = 'john.smith@acme.c';
                myModel.email = email;

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });

            it('should have an "int" value 12345 to be valid', function (done) {

                var int = 12345;
                myModel.int = int;

                myModel.check().then(function (result) {
                    expect(result.int).toEqual( int );
                    done();
                }, function (result) {
                    expect(result.int).toEqual( int );
                    done();
                });

            });

            it('should have an "int" value "12345" to be valid', function (done) {

                var int = '12345';
                myModel.int = int;

                myModel.check().then(function (result) {
                    expect(result.int).toEqual( int );
                    done();
                }, function (result) {
                    expect(result.int).toEqual( int );
                    done();
                });

            });

            it('should have an "int" value null to be valid', function (done) {

                var int = null;
                myModel.int = int;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { int : int} );
                    done();
                }, function (result) {
                    expect(result).toEqual( { int : int } );
                    done();
                });

            });

            it('should have an "int" value 123.45 to be invalid', function (done) {

                var int = 123.45;
                myModel.int = int;

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });

            it('should have an "int" value "123.45" to be invalid', function (done) {

                var int = '123.45';
                myModel.int = int;

                myModel.check().then(function (result) {
                    expect(result).toBeError();
                    done();
                }, function (result) {
                    expect(result).toBeError();
                    done();
                });

            });

            it('should have an "int" value "" to be valid', function (done) {

                var int = '';
                myModel.int = int;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { int: 0 } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { int: 0 } );
                    done();
                });

            });

            it('should not have a property called "int"', function (done) {

                myModel.options('allowNull', false);
                myModel.int = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( {  } );
                    done();
                }, function (result) {
                    expect(result).toEqual( {  } );
                    done();
                });

            });

            it('should have an "obj" value be valid', function (done) {

                var obj = {};
                myModel.obj = obj;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { obj: {} } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { obj: {} } );
                    done();
                });

            });

            it('should have an "obj" prop equal to null', function (done) {

                myModel.obj = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( { obj: null } );
                    done();
                }, function (result) {
                    expect(result).toEqual( { obj: null } );
                    done();
                });

            });


            it('should not have a property called "obj"', function (done) {

                myModel.options('allowNull', false);
                myModel.obj = null;

                myModel.check().then(function (result) {
                    expect(result).toEqual( {  } );
                    done();
                }, function (result) {
                    expect(result).toEqual( {  } );
                    done();
                });

            });


//            it('should have an "int" value 12345 to be valid', function (done) {
//
//                var int = 12345;
//                myModel.int = int;
//
//                myModel.check().then(function (result) {
//                    expect(result.int).toEqual( int );
//                    done();
//                }, function (result) {
//                    expect(result.int).toEqual( int );
//                    done();
//                });
//
//            });
//
//            it('should have an "int" value "12345" to be valid', function (done) {
//
//                var int = '12345';
//                myModel.int = int;
//
//                myModel.check().then(function (result) {
//                    expect(result.int).toEqual( int );
//                    done();
//                }, function (result) {
//                    expect(result.int).toEqual( int );
//                    done();
//                });
//
//            });
//
//            it('should have an "int" value null to be valid', function (done) {
//
//                var int = null;
//                myModel.int = int;
//
//                myModel.check().then(function (result) {
//                    expect(result.int).toEqual( int );
//                    done();
//                }, function (result) {
//                    expect(result.int).toEqual( int );
//                    done();
//                });
//
//            });
//
//            it('should have an "int" value 123.45 to be invalid', function (done) {
//
//                var int = 123.45;
//                myModel.int = int;
//
//                myModel.check().then(function (result) {
//                    expect(result).toBeError();
//                    done();
//                }, function (result) {
//                    expect(result).toBeError();
//                    done();
//                });
//
//            });
//
//            it('should have an "int" value "123.45" to be invalid', function (done) {
//
//                var int = '123.45';
//                myModel.int = int;
//
//                myModel.check().then(function (result) {
//                    expect(result).toBeError();
//                    done();
//                }, function (result) {
//                    expect(result).toBeError();
//                    done();
//                });
//
//            });
//
//            it('should have an "int" value "" to be invalid', function (done) {
//
//                var int = '';
//                myModel.int = int;
//
//                myModel.check().then(function (result) {
//                    expect(result).toBeError();
//                    done();
//                }, function (result) {
//                    expect(result).toBeError();
//                    done();
//                });
//
//            });
        });
    });
});
