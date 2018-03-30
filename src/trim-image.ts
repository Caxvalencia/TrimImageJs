import { TypeReader } from './constants/type-reader';
import { ImageDataHelper } from './helpers/image-data.helper';
import { ImageHelper } from './helpers/image.helper';
import { ReaderBottom } from './readers/reader-bottom';
import { ReaderLeft } from './readers/reader-left';
import { ReaderRight } from './readers/reader-right';
import { ReaderTop } from './readers/reader-top';

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
        let row = this.readImageData(TypeReader.TOP, imageData).row; // default 0
        let lenghtCol = imageData.width * 4;
        let lenghtRow = imageData.height;

        return this.cutImageData(imageData, row, 0, lenghtRow, lenghtCol);
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
            this.readImageData(TypeReader.BOTTOM, imageData).row || lenghtRow;

        return this.cutImageData(imageData, 0, 0, lenghtRow, lenghtCol);
    }

    /**
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trimLeft(imageData: ImageData): ImageData {
        let column = this.readImageData(TypeReader.LEFT, imageData).col; //default 0
        let lenghtCol = imageData.width * 4;
        let lenghtRow = imageData.height;

        return this.cutImageData(imageData, 0, column, lenghtRow, lenghtCol);
    }

    /**
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trimRight(imageData: ImageData): ImageData {
        let lenCol = imageData.width * 4;
        let lenRow = imageData.height;

        lenCol = this.readImageData(TypeReader.RIGHT, imageData).col || lenCol;

        return this.cutImageData(imageData, 0, 0, lenRow, lenCol);
    }

    /**
     * @param {ImageData} imageData
     * @param {number} rowIni
     * @param {number} colIni
     * @param {number} rowFin
     * @param {number} colFin
     * @returns {ImageData}
     */
    cutImageData(
        imageData: ImageData,
        rowIni: number,
        colIni: number,
        rowFin: number,
        colFin: number
    ): ImageData {
        ImageDataHelper.validate(imageData);

        let pixels = imageData.data;
        let len_col = imageData.width * 4;

        rowFin = rowFin == 0 ? 1 : rowFin;
        colFin = colFin == 0 ? 1 : colFin;

        let copyHeight = rowFin == rowIni ? 1 : rowFin - rowIni;
        let copyWidth = colFin / 4 - colIni / 4;

        let copyImageData: ImageData = ImageDataHelper.create(
            copyWidth,
            copyHeight
        );

        let diffCol = len_col - colFin;
        let countCopy = 0;

        for (let row = rowIni; row < rowFin; row++) {
            let rowCurrent = row * colFin + row * diffCol;

            for (let col = colIni; col < colFin; col += 4, countCopy += 4) {
                copyImageData.data[countCopy] = pixels[rowCurrent + col];
                copyImageData.data[countCopy + 1] =
                    pixels[rowCurrent + col + 1];
                copyImageData.data[countCopy + 2] =
                    pixels[rowCurrent + col + 2];
                copyImageData.data[countCopy + 3] =
                    pixels[rowCurrent + col + 3];
            }
        }

        return copyImageData;
    }

    /**
     * @private
     * @param {TypeReader} typeReader
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private readImageData(typeReader: TypeReader, imageData: ImageData): any {
        ImageDataHelper.validate(imageData);

        let pixels = imageData.data;
        let lenRow = imageData.height;
        let lenCol = imageData.width * 4;

        let reader = {
            [TypeReader.TOP]: ReaderTop,
            [TypeReader.BOTTOM]: ReaderBottom,
            [TypeReader.LEFT]: ReaderLeft,
            [TypeReader.RIGHT]: ReaderRight
        };

        return reader[typeReader].apply(pixels, lenRow, lenCol);
    }
}
