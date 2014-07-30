/* global validators */
/**
 * This make the assumption that functions are not being used that have been placed on the global namespace.
 * Had to do this because this was failing in PhantomJS
 * @param value
 * @returns {boolean}
 */
validators.isNativeFunction = function (value) {
    return typeof value === 'function' &&
        (value.toString().indexOf('[native code]') > -1 ||
            value.toString().indexOf('[function]') > -1) || !!window[value.name];
};