import { TypeReader } from './constants/type-reader';
import { ImageDataHelper } from './helpers/image-data.helper';
import { ImageHelper } from './helpers/image.helper';

/**
 * @export
 * @class TrimImage
 */
export class TrimImage {
    private image: HTMLImageElement;

    /**
     * Creates an instance of TrimImage.
     * @param {HTMLImageElement} image
     * @param {Function} callback
     */
    constructor(image: HTMLImageElement, callback: Function) {
        this.configureImage(image, callback);
    }

    static trim(image?, callback?) {
        return new TrimImage(image, callback).trim();
    }

    static trimTop(image?, callback?) {
        return new TrimImage(image, callback).trimTop();
    }

    static trimBottom(image?, callback?) {
        return new TrimImage(image, callback).trimBottom();
    }

    static trimLeft(image?, callback?) {
        return new TrimImage(image, callback).trimLeft();
    }

    static trimRight(image?, callback?) {
        return new TrimImage(image, callback).trimRight();
    }

    /**
     * @description - Configura el parametro de entrada "image" del constructor
     * @param {(string | HTMLImageElement)} image
     * @param {Function} callback
     */
    async configureImage(image: string | HTMLImageElement, callback: Function) {
        this.image =
            typeof image === 'string'
                ? await ImageHelper.create(image)
                : <HTMLImageElement>image;

        if (callback !== undefined) {
            callback.call(this, this.image);
        }
    }

    /**
     * @description - Elimina pixeles innecesarios para todos los bordes de la imagen
     */
    trim() {
        this.image = ImageDataHelper.getImage(
            this._trim(ImageDataHelper.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde superior de la imagen
     * @returns {this}
     */
    trimTop(): this {
        this.image = ImageDataHelper.getImage(
            this._trimTop(ImageDataHelper.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde inferior de la imagen
     * @returns {this}
     */
    trimBottom() {
        this.image = ImageDataHelper.getImage(
            this._trimBottom(ImageDataHelper.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde izquierdo de la imagen
     * @returns {this}
     */
    trimLeft() {
        this.image = ImageDataHelper.getImage(
            this._trimLeft(ImageDataHelper.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde derecho de la imagen
     * @returns {this}
     */
    trimRight(): this {
        this.image = ImageDataHelper.getImage(
            this._trimRight(ImageDataHelper.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles de la imagen innecesarios
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trim(imageData: ImageData): ImageData {
        ImageDataHelper.validate(imageData);

        let trimmedImage = this._trimTop(imageData);
        trimmedImage = this._trimBottom(trimmedImage);
        trimmedImage = this._trimLeft(trimmedImage);
        trimmedImage = this._trimRight(trimmedImage);

        return trimmedImage;
    }

    /**
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trimTop(imageData: ImageData): ImageData {
        let row = ImageDataHelper.readImageData(TypeReader.TOP, imageData).row; // default 0
        let lenghtCol = imageData.width * 4;
        let lenghtRow = imageData.height;

        return ImageDataHelper.cutImageData(imageData, row, 0, lenghtRow, lenghtCol);
    }

    /**
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trimBottom(imageData: ImageData): ImageData {
        let lenghtRow = imageData.height;
        let lenghtCol = imageData.width * 4;

        lenghtRow =
            ImageDataHelper.readImageData(TypeReader.BOTTOM, imageData).row ||
            lenghtRow;

        return ImageDataHelper.cutImageData(imageData, 0, 0, lenghtRow, lenghtCol);
    }

    /**
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trimLeft(imageData: ImageData): ImageData {
        let column = ImageDataHelper.readImageData(TypeReader.LEFT, imageData)
            .col; //default 0
        let lenghtCol = imageData.width * 4;
        let lenghtRow = imageData.height;

        return ImageDataHelper.cutImageData(imageData, 0, column, lenghtRow, lenghtCol);
    }

    /**
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trimRight(imageData: ImageData): ImageData {
        let lenCol = imageData.width * 4;
        let lenRow = imageData.height;

        lenCol =
            ImageDataHelper.readImageData(TypeReader.RIGHT, imageData).col ||
            lenCol;

        return ImageDataHelper.cutImageData(imageData, 0, 0, lenRow, lenCol);
    }
}
