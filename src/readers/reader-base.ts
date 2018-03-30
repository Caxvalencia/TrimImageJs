export abstract class ReaderBase {
    /**
     * @static
     * @param {Uint8ClampedArray} pixels
     * @returns {Function}
     */
    static getPixel(pixels: Uint8ClampedArray): Function {
        return (index: number): number => {
            return pixels[index];
        };
    }
}
