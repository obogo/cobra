/* global exports, validators */

(function () {

    function ModelFactory() {
    }

    function resolve(object, path, value) {

        var stack = path.split('.'), property;
        var isGetter = typeof value === 'undefined';

        while (stack.length > 1) {
            property = stack.shift();

            switch (typeof object[property]) {
                case 'object':
                    object = object[property];
                    break;
                case 'undefined':
                    if (isGetter) {
                        return;
                    }
                    object = object[property] = {};
                    break;
                default:
                    throw new Error('property is not of type object', property);
            }
        }

        if (typeof value === 'undefined') {
            return object[stack.shift()];
        }

        object[stack.shift()] = value;

        return value;
    }

    ModelFactory.extend = function (name, func) {
        var passed = /^([\w\$]+)$/.test(name);
        if (!passed) {
            throw new Error(('Invalid name: "{name}"').supplant({name: name}));
        }
        this.prototype[name] = func;
    };

    ModelFactory.factory = function (name, schema) {

        function Model(doc) {
            exports.extend(this, doc);
        }

        Model.statics = {};

        var ModelPrototype = Model.prototype = ModelFactory.prototype;
        // add properties to prototype so hasOwnProperty() does not pick them up
        ModelPrototype.__name = name;
        ModelPrototype.__schema = schema;

        ModelPrototype.getName = function () {
            return this.__name;
        };

        ModelPrototype.getSchema = function () {
            return this.__schema;
        };

        ModelPrototype.get = function(path) {
            return resolve(this, path);
        };

        ModelPrototype.set = function(path, value) {
            return resolve(this, path, value);
        };

        ModelPrototype.options = function (name, value) {
            if (!arguments.length) {
                return schema.options;
            }

            if (value === undefined) {
                return schema.options[name];
            }

            schema.options[name] = value;
        };

        return Model;
    };

    exports.Model = ModelFactory;

}());

