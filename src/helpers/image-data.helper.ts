import { CanvasHelper } from './canvas.helper';

export abstract class ImageDataHelper {
    /**
     * @description - Convierte un imageData object a un image object
     * @param {ImageData} imageData - Objeto con matriz de datos de la imagen
     * @return {HTMLImageElement}
     */
    static getImage(imageData: ImageData) {
        ImageDataHelper.validate(imageData);

        let imgWidth = imageData.width;
        let imgHeight = imageData.height;

        let canvas = CanvasHelper.create(imgWidth, imgHeight);
        canvas.getContext('2d').putImageData(imageData, 0, 0);

        let image = new Image();
        image.width = imgWidth;
        image.height = imgHeight;
        image.src = canvas.toDataURL('image/png');

        return image;
    }

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

    /**
     * @static
     * @param {ImageData} imageData
     */
    static validate(imageData: ImageData) {
        if (is(imageData) !== 'imagedata') {
            throw 'ImageData Exception: No es compatible el tipo de dato';
        }
    }
}

function is(element) {
    return {}.toString
        .call(element)
        .match(/\s([a-z|A-Z]+)/)[1]
        .toLowerCase();
}
