/* global validators */
validators.isFunction = function (value) {
    return typeof value === 'function' && String(value) !== 'function Function() { [native code] }';
};