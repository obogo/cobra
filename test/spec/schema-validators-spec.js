/* global cobra, describe, beforeEach, expect, it */
describe('Schema validators', function () {

    describe('isArray', function () {

        var truthys = [
            { label: '[]', value: [] },
            { label: 'new Array()', value: new Array() }
        ];

        var falseys = [
            { label: '1', value: 1 },
            { label: 'true', value: true },
            { label: '"[]"', value: '[]' }
        ];


        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isArray(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isArray(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isBoolean', function () {

        var truthys = [
            { label: 'true', value: true },
            { label: 'false', value: false }
        ];

        var falseys = [
            { label: '1', value: 1 },
            { label: '0', value: 0 },
            { label: '"true"', value: 'true' },
            { label: '"false"', value: 'false' }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isBoolean(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isBoolean(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isDate', function () {

        var truthys = [
            { label: 'new Date()', value: new Date() }
        ];

        var falseys = [
            { label: 'Date.now()', value: Date.now() },
            { label: 'Monday, Feb 04, 2014', value: 'Monday, Feb 04, 2014' },
            { label: '1405621543758', value: 1405621543758 }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isDate(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isDate(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isDefined', function () {

        var truthys = [
            { label: '0', value: 0 },
            { label: 'null', value: null },
            { label: '""', value: '' },
            { label: '"undefined"', value: 'undefined' }
        ];

        var falseys = [
            { label: 'undefined', value: undefined }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isDefined(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isDefined(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isEmpty', function () {

        var i;

        var truthys = [
            { label: '""', value: '' },
            { label: '[]', value: [] },
            { label: '{}', value: {} }
        ];

        var falseys = [
            { label: '0', value: 0 },
            { label: '" "', value: ' ' },
            { label: '[0]', value: [0] },
            { label: '{ length:0 }', value: { length:0 } }
        ];

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isEmpty(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isEmpty(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isFunction', function () {

        function MyClass(){}

        var truthys = [
            { label: 'function(){}', value: function(){} },
        ];

        var falseys = [
//            { label: 'Function', value: Function },
            { label: '(function(){})()', value: (function(){})() },
            { label: 'new MyClass()', value: new MyClass() }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isFunction(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isFunction(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isNull', function () {

        var truthys = [
            { label: 'null', value: null },
        ];

        var falseys = [
            { label: 'undefined', value: undefined },
            { label: '""', value: '' },
            { label: '0', value: 0 }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isNull(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isNull(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isNumber', function () {

        var truthys = [
            { label: '0', value: 0 },
            { label: '1.1', value: 1.1 }
        ];

        var falseys = [
            { label: '"1"', value: '1' },
            { label: 'true', value: true }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isNumber(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isNumber(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isNumeric', function () {

        var truthys = [
            { label: '0', value: 0 },
            { label: '1.1', value: 1.1 }
        ];

        var falseys = [
            { label: '"1"', value: '1' },
            { label: 'true', value: true }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isNumber(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isNumber(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isObject', function () {

        var truthys = [
            { label: '{}', value: {} },
            { label: 'new Object()', value: new Object() },
            { label: '[]', value: [] }
        ];

        var falseys = [
            { label: 'null', value: null }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isObject(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isObject(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });

    describe('isString', function () {

        var truthys = [
            { label: '""', value: '' },
            { label: '(1).toString()', value: (1).toString() },
            { label: 'String(1)', value: String(1) }
        ];

        var falseys = [
            { label: 'new String()', value: new String() },
            { label: '1', value: 1 },
            { label: 'null', value: null },
            { label: 'Number("")', value: Number('') },
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isString(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isString(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }
    });

    describe('isUndefined', function () {

        var truthys = [
            { label: 'undefined', value: undefined }
        ];

        var falseys = [
            { label: '0', value: 0 },
            { label: 'null', value: null },
            { label: '""', value: '' },
            { label: '"undefined"', value: 'undefined' }
        ];

        var i;

        for (i = 0; i < truthys.length; i++) {
            describe('value ' + truthys[i].label, function () {
                var result = cobra.validators.isUndefined(truthys[i].value);
                it('should be true', function () {
                    expect(result).toBeTruthy();
                });
            });
        }

        for (i = 0; i < falseys.length; i++) {
            describe('value ' + falseys[i].label, function () {
                var result = cobra.validators.isUndefined(falseys[i].value);
                it('should be false', function () {
                    expect(result).toBeFalsy();
                });
            });
        }

    });
});
