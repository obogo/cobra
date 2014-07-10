var extend = function extend(target, source) {
    target = target || {};
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            if (typeof source[prop] === 'object') {
                target[prop] = extend(target[prop], source[prop]);
            } else {
                target[prop] = source[prop];
            }
        }
    }
    return target;
}