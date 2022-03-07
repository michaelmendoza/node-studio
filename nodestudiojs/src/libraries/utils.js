
let ref = undefined;

export const throttle = (f, throttleTime = 100) => {
    if (ref) return;
    f()

    ref = setTimeout(() => {    
        ref = undefined;
    }, throttleTime);
}

export const debounce = (f, debounceTime = 100) => {
    clearTimeout(ref);
    ref = setTimeout(() => {
        f();
    }, debounceTime);
};

export const isString = (x) => {
    return Object.prototype.toString.call(x) === "[object String]"
} 