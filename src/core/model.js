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

        Model.prototype.getName = function () {
            return name;
        };

        Model.prototype.getSchema = function () {
            return schema;
        };

        return Model;
    };

    exports.Model = ModelFactory;

}());

