/* global exports, validators */

(function () {

    function ModelFactory() {
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

        Model.prototype = ModelFactory.prototype;
        // add properties to prototype so hasOwnProperty() does not pick them up
        Model.prototype.__name = name;
        Model.prototype.__schema = schema;

        Model.prototype.getName = function () {
            return this.__name;
        };

        Model.prototype.getSchema = function () {
            return this.__schema;
        };

        Model.prototype.options = function (name, value) {
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

