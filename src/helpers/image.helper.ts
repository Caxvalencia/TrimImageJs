export abstract class ImageHelper {
    /**
     * @param {string} src
     * @returns {Promise<HTMLImageElement>}
     */
    static create(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}
