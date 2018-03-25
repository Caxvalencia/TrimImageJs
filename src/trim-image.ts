import { TypeReader } from './constants/type-reader';
import { ColorRGBA } from './contracts/color-rgba';

/**
 * @export
 * @class TrimImage
 */
export class TrimImage {
    private image: HTMLImageElement;

    /**
     * Creates an instance of TrimImage.
     *
     * @param {HTMLImageElement} image Imagen a procesar
     * @param {any} funcLoadBack Función back para el load de la imagen
     */
    constructor(image: HTMLImageElement, funcLoadBack) {
        this.configureImage(image, funcLoadBack);
    }

    /**
     * @description - Configura el parametro de entrada "image" del constructor
     *
     * @param {[image object, String]} image - Imagen a tratar
     * @param {Function} callback - Funcion callback
     *
     * @return {imageData object}
     */
    async configureImage(image: string | HTMLImageElement, callback) {
        this.image =
            typeof image === 'string'
                ? await createImage(image)
                : <HTMLImageElement>image;

        if (callback !== undefined) {
            callback.call(this, this.image);
        }
    }

    /**
     * @description - Devuelve un objeto imageData a partir de una imagen dada
     * @param {HTMLImageElement} image
     * @returns
     */
    getImageData(image: HTMLImageElement) {
        let imgWidth = image.width;
        let imgHeight = image.height;

        let context = createCanvasBack(imgWidth, imgHeight).context;
        context.drawImage(image, 0, 0, imgWidth, imgHeight);

        return context.getImageData(0, 0, imgWidth, imgHeight);
    }

    /**
     * @description - Convierte un imageData object a un image object
     *
     * @param {imageData} imageData - Objeto con matriz de datos de la imagen
     * @return {HTMLImageElement}
     */
    getImage(imageData, funcBack?) {
        this.validateImageData(imageData);

        let imgWidth = imageData.width;
        let imgHeight = imageData.height;

        let canvasBack = createCanvasBack(imgWidth, imgHeight);

        let context = canvasBack.context;
        let canvas = canvasBack.canvas;

        context.putImageData(imageData, 0, 0);

        let image = new Image();
        image.width = imgWidth;
        image.height = imgHeight;

        if (funcBack) {
            image.onload = funcBack;
        }

        image.src = canvas.toDataURL('image/png');

        return image;
    }

    /**
     * @static
     * @param {any} [image]
     * @param {function} [callback]
     * @returns
     */
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
     * @description - Elimina pixeles innecesarios para todos los bordes de la imagen
     */
    trim() {
        this.image = this.getImage(this._trim(this.getImageData(this.image)));

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde superior de la imagen
     * @param [image object] image - Parametro opcional tipo Image
     * @return [image object, this] - Retorna this si el parametro es indefinido
     */
    trimTop() {
        this.image = this.getImage(
            this._trimTop(this.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde inferior de la imagen
     * @param [image object] image - Parametro opcional tipo Image
     * @return [image object, this] - Retorna this si el parametro es indefinido
     */
    trimBottom() {
        this.image = this.getImage(
            this._trimBottom(this.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde izquierdo de la imagen
     * @param [image object] image - Parametro opcional tipo Image
     * @return [image object, this] - Retorna this si el parametro es indefinido
     */
    trimLeft() {
        this.image = this.getImage(
            this._trimLeft(this.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde derecho de la imagen
     * @returns {this}
     */
    trimRight(): this {
        this.image = this.getImage(
            this._trimRight(this.getImageData(this.image))
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
        this.validateImageData(imageData);

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
        let row = 0;
        let lenghtCol = imageData.width * 4;
        let lenghtRow = imageData.height;

        this.readImageData(
            TypeReader.TOP,
            imageData,
            (_row, _col, rgba: ColorRGBA) => {
                if (rgba.alpha() != 0) {
                    row = _row;

                    return 'break';
                }
            }
        );

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

        this.readImageData(
            TypeReader.BOTTOM,
            imageData,
            (_row, _col, rgba: ColorRGBA) => {
                if (rgba.alpha() != 0) {
                    lenghtRow = _row;

                    return 'break';
                }
            }
        );

        return this.cutImageData(imageData, 0, 0, lenghtRow, lenghtCol);
    }

    /**
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trimLeft(imageData: ImageData): ImageData {
        let column = 0;
        let lenghtCol = imageData.width * 4;
        let lenghtRow = imageData.height;

        this.readImageData(
            TypeReader.LEFT,
            imageData,
            (_row, _col, rgba: ColorRGBA) => {
                if (rgba.alpha() != 0) {
                    column = _col;

                    return 'break';
                }
            }
        );

        return this.cutImageData(imageData, 0, column, lenghtRow, lenghtCol);
    }

    /**
     * @private
     * @param {ImageData} imageData
     * @returns {ImageData}
     */
    private _trimRight(imageData: ImageData): ImageData {
        let len_col = imageData.width * 4;
        let len_row = imageData.height;

        this.readImageData(
            TypeReader.RIGHT,
            imageData,
            (_row, _col, rgba: ColorRGBA) => {
                if (rgba.alpha() != 0) {
                    len_col = _col;

                    return 'break';
                }
            }
        );

        return this.cutImageData(imageData, 0, 0, len_row, len_col);
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
        this.validateImageData(imageData);

        let pixels = imageData.data;
        let len_col = imageData.width * 4;

        rowFin = rowFin == 0 ? 1 : rowFin;
        colFin = colFin == 0 ? 1 : colFin;

        let copyHeight = rowFin == rowIni ? 1 : rowFin - rowIni,
            copyWidth = colFin / 4 - colIni / 4;

        let copyImageData: ImageData;

        createCanvasBack(
            copyWidth,
            copyHeight,
            (ctx: CanvasRenderingContext2D) => {
                copyImageData = ctx.createImageData(copyWidth, copyHeight);
            }
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
     * @param {function} funcBack
     * @returns {ImageData}
     */
    private readImageData(
        typeReader: TypeReader,
        imageData: ImageData,
        funcBack
    ): ImageData {
        this.validateImageData(imageData);

        let pixels = imageData.data;
        let row;
        let col;
        let rowCurrent = -1;

        let len_col = imageData.width * 4;
        let len_row = imageData.height;

        let isBreak: any = false;

        if (typeReader === TypeReader.TOP) {
            let rowIni = 0;
            let rowFin = len_row;
            let colIni = 0;
            let colFin = len_col;

            let interator = {
                row: 1,
                col: 4
            };

            for (row = rowIni; row < rowFin; row += interator.row) {
                rowCurrent = row * len_col;

                for (col = colIni; col < colFin; col += interator.col) {
                    isBreak = funcBack.apply(this, [
                        row,
                        col,
                        <ColorRGBA>{
                            red: getAndSetForPixel(rowCurrent + col),
                            green: getAndSetForPixel(rowCurrent + col + 1),
                            blue: getAndSetForPixel(rowCurrent + col + 2),
                            alpha: getAndSetForPixel(rowCurrent + col + 3)
                        }
                    ]);

                    if (isBreak == 'break') {
                        break;
                    }
                }

                if (isBreak == 'break') {
                    break;
                }
            }
        } else if (typeReader === TypeReader.BOTTOM) {
            let rowIni = len_row;
            let rowFin = 0;
            let colIni = len_col;
            let colFin = 0;

            for (row = rowIni; row >= rowFin; row--) {
                rowCurrent = row * colIni;

                for (col = colIni; col > colFin; col -= 4) {
                    isBreak = funcBack.apply(this, [
                        row,
                        col,
                        <ColorRGBA>{
                            red: getAndSetForPixel(rowCurrent - col),
                            green: getAndSetForPixel(rowCurrent - col - 3),
                            blue: getAndSetForPixel(rowCurrent - col - 2),
                            alpha: getAndSetForPixel(rowCurrent - col - 1)
                        }
                    ]);

                    if (isBreak == 'break') {
                        break;
                    }
                }

                if (isBreak == 'break') {
                    break;
                }
            }
        } else if (typeReader === TypeReader.LEFT) {
            let rowIni = 0;
            let rowFin = len_row;
            let colIni = 0;
            let colFin = len_col;

            for (col = colIni; col < colFin; col += 4) {
                for (row = rowIni; row < rowFin; row++) {
                    rowCurrent = row * colFin;

                    isBreak = funcBack.apply(this, [
                        row,
                        col,
                        <ColorRGBA>{
                            red: getAndSetForPixel(rowCurrent + col),
                            green: getAndSetForPixel(rowCurrent + col + 1),
                            blue: getAndSetForPixel(rowCurrent + col + 2),
                            alpha: getAndSetForPixel(rowCurrent + col + 3)
                        }
                    ]);

                    if (isBreak == 'break') {
                        break;
                    }
                }

                if (isBreak == 'break') {
                    break;
                }
            }
        } else if (typeReader === TypeReader.RIGHT) {
            let rowIni = len_row - 1;
            let rowFin = 1;
            let colIni = len_col;
            let colFin = 0;

            for (col = colIni; col > colFin; col -= 4) {
                for (row = rowIni; row > rowFin; row--) {
                    rowCurrent = row * colIni - 4 + col;

                    isBreak = funcBack.apply(this, [
                        row,
                        col,
                        <ColorRGBA>{
                            red: getAndSetForPixel(rowCurrent - 3),
                            green: getAndSetForPixel(rowCurrent - 2),
                            blue: getAndSetForPixel(rowCurrent - 1),
                            alpha: getAndSetForPixel(rowCurrent)
                        }
                    ]);

                    if (isBreak == 'break') {
                        break;
                    }
                }

                if (isBreak == 'break') {
                    break;
                }
            }
        }

        function getAndSetForPixel(pos) {
            return function(val) {
                if (!val) {
                    return pixels[pos];
                }

                pixels[pos] = val;
            };
        }

        return imageData;
    }

    /**
     * @param imageData
     */
    private validateImageData(imageData) {
        if (is(imageData) !== 'imagedata')
            throw 'ImageData Exception: No es compatible el tipo de dato';
    }
}

function is(element) {
    return {}.toString
        .call(element)
        .match(/\s([a-z|A-Z]+)/)[1]
        .toLowerCase();
}

/**
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function createImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * @param width
 * @param height
 * @param funcBack
 */
function createCanvasBack(width: number, height: number, funcBack?) {
    let canvasDummy = document.createElement('canvas');

    canvasDummy.width = width;
    canvasDummy.height = height;

    let context = canvasDummy.getContext('2d');

    let scoper = {
        canvas: canvasDummy,
        context: context
    };

    if (funcBack) {
        funcBack.apply(scoper, [context, canvasDummy]);
    }

    return scoper;
}
