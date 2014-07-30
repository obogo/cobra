/* global validators */
validators.isNativeFunction = function (value) {
    return typeof value === 'function' &&
        (value.toString().indexOf('[native code]') > -1 ||
            value.toString().indexOf('[function]') > -1);
};