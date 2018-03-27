export class ReaderBase {
    /**
     * @static
     * @param {any} pixels 
     * @returns  
     */
    static getPixel(pixels) {
        return (index) => {
            return pixels[index];
        };
    }
}
