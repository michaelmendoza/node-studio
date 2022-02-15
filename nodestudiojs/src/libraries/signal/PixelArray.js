
export const base64ToPixelArray = (base64encoded) => {
    const rawString = window.atob(base64encoded);
    const uint8Array = new Uint8Array(rawString.length);
    for(var i = 0; i < rawString.length; i++) {
        uint8Array[i] = rawString.charCodeAt(i);
    }
    const pixelArray = new Uint16Array(uint8Array.buffer);
    return pixelArray;
}
