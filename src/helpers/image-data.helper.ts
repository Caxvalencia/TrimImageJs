import { CanvasHelper } from './canvas.helper';
import { TypeReader } from '../constants/type-reader';
import { IReaderPosition } from '../contracts/reader-position';
import { ReaderTop } from '../readers/reader-top';
import { ReaderBottom } from '../readers/reader-bottom';
import { ReaderLeft } from '../readers/reader-left';
import { ReaderRight } from '../readers/reader-right';

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

    /**
     * @param {ImageData} imageData
     * @param {number} rowInit
     * @param {number} colInit
     * @param {number} rowEnd
     * @param {number} colEnd
     * @returns {ImageData}
     */
    static cutImageData(
        imageData: ImageData,
        rowInit: number,
        colInit: number,
        rowEnd: number,
        colEnd: number
    ): ImageData {
        ImageDataHelper.validate(imageData);

        let pixels = imageData.data;
        let lenCol = imageData.width * 4;

        rowEnd = rowEnd == 0 ? 1 : rowEnd;
        colEnd = colEnd == 0 ? 1 : colEnd;

        let copyHeight = rowEnd == rowInit ? 1 : rowEnd - rowInit;
        let copyWidth = colEnd / 4 - colInit / 4;

        let copyImageData: ImageData = ImageDataHelper.create(
            copyWidth,
            copyHeight
        );

        let diffCol = lenCol - colEnd;
        let countCopy = 0;

        for (let row = rowInit; row < rowEnd; row++) {
            let rowCurrent = row * colEnd + row * diffCol;

            for (let col = colInit; col < colEnd; col += 4, countCopy += 4) {
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
    static readImageData(
        typeReader: TypeReader,
        imageData: ImageData
    ): IReaderPosition {
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

function is(element) {
    return {}.toString
        .call(element)
        .match(/\s([a-z|A-Z]+)/)[1]
        .toLowerCase();
}
