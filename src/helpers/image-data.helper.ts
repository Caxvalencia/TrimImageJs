import { CanvasHelper } from './canvas.helper';

export abstract class ImageDataHelper {
    /**
     * @static
     * @param {HTMLImageElement} image
     * @returns {ImageData}
     */
    static getImageData(image: HTMLImageElement): ImageData {
        let imgWidth = image.width;
        let imgHeight = image.height;

        let context = CanvasHelper.context(imgWidth, imgHeight);
        context.drawImage(image, 0, 0, imgWidth, imgHeight);

        return context.getImageData(0, 0, imgWidth, imgHeight);
    }

    /**
     * @static
     * @param {number} width 
     * @param {number} height 
     * @returns {ImageData} 
     */
    static create(width: number, height: number): ImageData {
        return CanvasHelper.context(width, height).createImageData(
            width,
            height
        );
    }
}
