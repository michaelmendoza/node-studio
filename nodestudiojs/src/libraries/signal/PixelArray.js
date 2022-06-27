
export const base64ToPixelArray = (base64encoded, dtype) => {
    const rawString = window.atob(base64encoded);

    const uint8Array = new Uint8Array(rawString.length);
    for(var i = 0; i < rawString.length; i++) {
        uint8Array[i] = rawString.charCodeAt(i);
    }
    
    const pixelArray = dtype === 'uint16' ? new Uint16Array(uint8Array.buffer) : uint8Array;
    return pixelArray;
}
