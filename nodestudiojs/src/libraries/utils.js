
let ref = undefined;

export const throttle = (f, throttleTime = 100) => {
    console.log('called');
    if (ref) return;
    f()

    ref = setTimeout(() => {    
        ref = undefined;
        console.log('throttle');
    }, throttleTime);
}

export const debounce = (f, debounceTime = 100) => {
    console.log('called');
    clearTimeout(ref);
    ref = setTimeout(() => {
        f();
        console.log('debounce');
    }, debounceTime);
    console.log('called:' + ref);
};