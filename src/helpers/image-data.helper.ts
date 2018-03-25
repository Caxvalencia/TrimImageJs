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
}
