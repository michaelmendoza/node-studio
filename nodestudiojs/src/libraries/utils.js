
let refs = {};

export const throttle = (f, throttleTime = 100, id = '0') => {
    if (refs[id]) return;
    f()

    refs[id] = setTimeout(() => {    
        refs[id] = undefined;
    }, throttleTime);
}

export const debounce = (f, debounceTime = 100, id = '0') => {
    clearTimeout(refs[id]);
    refs[id] = setTimeout(() => {
        f();
    }, debounceTime);
};

export const isString = (x) => {
    return Object.prototype.toString.call(x) === "[object String]"
} 