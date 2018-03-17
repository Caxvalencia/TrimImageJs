/**
 * @description - Crea un objeto para manipular la imagen pasada por el parametro
 *
 * @param {image object} image - Imagen a procesar
 * @param {function} funcLoadBack - Función back para el load de la imagen
 */
export class TrimImage {
    private image: HTMLImageElement;

    /**
     * @constructor
     * @param image
     * @param funcLoadBack
     */
    constructor(image, funcLoadBack) {
        this.configureImage(image, funcLoadBack);

        return this;
    }

    /**
     * @description - Configura el parametro de entrada "image" del constructor
     *
     * @param {[image object, String]} image - Imagen a tratar
     * @param {Function} funcLoadBack - Funcion callback
     *
     * @return {imageData object}
     */
    configureImage(image: string | HTMLImageElement, funcLoadBack) {
        if (typeof image === 'string') {
            if (funcLoadBack === undefined) {
                this.image = createImage(image);

                return;
            }

            let self = this;

            createImage(image, function() {
                self.image = this;
                funcLoadBack.call(this, self);
            });

            return;
        }

        this.image = <HTMLImageElement>image;

        //La imagen en este punto ya esta cargada
        //Llamamos el callBack
        funcLoadBack.call(image, this);
    }

    /**
     * @description - Devuelve un objeto imageData a partir de una imagen dada
     *
     * @param {image object} image - Objeto imagen
     * @return {imageData object}
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
     * @description - Elimina pixeles innecesarios para todos los bordes de la imagen
     * @param [image object] image - Parametro opcional tipo Image
     * @return [image object, this] - Retorna this si el parametro es indefinido
     */
    trim(image?) {
        if (image !== undefined) {
            return this.getImage(this._trim(this.getImageData(image)));
        }

        this.image = this.getImage(this._trim(this.getImageData(this.image)));

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde superior de la imagen
     * @param [image object] image - Parametro opcional tipo Image
     * @return [image object, this] - Retorna this si el parametro es indefinido
     */
    trimTop(image) {
        if (image !== undefined) {
            return this.getImage(this._trimTop(this.getImageData(image)));
        }

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
    trimBottom(image) {
        if (image !== undefined) {
            return this.getImage(this._trimBottom(this.getImageData(image)));
        }

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
    trimLeft(image) {
        if (image !== undefined) {
            return this.getImage(this._trimLeft(this.getImageData(image)));
        }

        this.image = this.getImage(
            this._trimLeft(this.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles innecesarios para el borde derecho de la imagen
     * @param [image object] image - Parametro opcional tipo Image
     * @return [image object, this] - Retorna this si el parametro es indefinido
     */
    trimRight(image) {
        if (image !== undefined) {
            return this.getImage(this._trimRight(this.getImageData(image)));
        }

        this.image = this.getImage(
            this._trimRight(this.getImageData(this.image))
        );

        return this;
    }

    /**
     * @description - Elimina pixeles de la imagen innecesarios
     *
     * @param {imageData} imageData - Datos de la imagen en forma de matriz
     * @return {imageData object}
     */
    private _trim(imageData) {
        this.validateImageData(imageData);

        let trimmedImage = this._trimTop(imageData);
        trimmedImage = this._trimBottom(trimmedImage);
        trimmedImage = this._trimLeft(trimmedImage);
        trimmedImage = this._trimRight(trimmedImage);

        return trimmedImage;
    }

    /**
     * @description - Devuelve un array de datos de la imagen
     *
     * @param {imageData} imageData - Matriz de datos de la imagen
     * @return {imageData object}
     */
    private _trimTop(imageData) {
        let row = 0;
        let lenghtCol = imageData.width * 4;
        let lenghtRow = imageData.height;

        this.readImageData('top', imageData, function(r, c) {
            if (this.alpha() != 0) {
                row = r;

                return 'break';
            }
        });

        return this.cutImageData(imageData, row, 0, lenghtRow, lenghtCol);
    }

    /**
     * @description - Devuelve un array de datos de la imagen
     *
     * @param {imageData} imageData - Matriz de datos de la imagen
     * @return {imageData object}
     */
    private _trimBottom(imageData) {
        let lenghtRow = imageData.height;
        let lenghtCol = imageData.width * 4;

        this.readImageData('bottom', imageData, function(r, c) {
            if (this.alpha() != 0) {
                lenghtRow = r;

                return 'break';
            }
        });

        return this.cutImageData(imageData, 0, 0, lenghtRow, lenghtCol);
    }

    /**
     * @description - Devuelve un array de datos de la imagen
     *
     * @param {imageData} imageData - Matriz de datos de la imagen
     * @return {imageData object}
     */
    private _trimLeft(imageData) {
        let col = 0;
        let lenghtCol = imageData.width * 4;
        let lenghtRow = imageData.height;

        this.readImageData('left', imageData, function(r, c) {
            if (this.alpha() != 0) {
                col = c;

                return 'break';
            }
        });

        return this.cutImageData(imageData, 0, col, lenghtRow, lenghtCol);
    }

    /**
     * @description - Devuelve un array de datos de la imagen
     *
     * @param {imageData} imageData - Matriz de datos de la imagen
     * @return {imageData object}
     */
    private _trimRight(imageData) {
        let len_col = imageData.width * 4;
        let len_row = imageData.height;

        this.readImageData('right', imageData, function(r, c) {
            if (this.alpha() != 0) {
                len_col = c;

                return 'break';
            }
        });

        return this.cutImageData(imageData, 0, 0, len_row, len_col);
    }

    cutImageData(imageData, rowIni, colIni, rowFin, colFin) {
        this.validateImageData(imageData);

        let pixels = imageData.data;
        let len_col = imageData.width * 4;

        rowFin = rowFin == 0 ? 1 : rowFin;
        colFin = colFin == 0 ? 1 : colFin;

        let copyHeight = rowFin == rowIni ? 1 : rowFin - rowIni,
            copyWidth = colFin / 4 - colIni / 4;

        let copyImageData: any = [];

        createCanvasBack(copyWidth, copyHeight, function(ctx) {
            copyImageData = ctx.createImageData(copyWidth, copyHeight);
        });

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

    private readImageData(typeReader, imageData, funcBack) {
        this.validateImageData(imageData);

        typeReader = typeReader.toUpperCase();

        let pixels = imageData.data;
        let row;
        let col;
        let rowCurrent = -1;

        let len_col = imageData.width * 4;
        let len_row = imageData.height;

        let isBreak: any = false;

        if (typeReader === 'TOP') {
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
                    isBreak = funcBack.apply(
                        {
                            red: getAndSetForPixel(rowCurrent + col),
                            green: getAndSetForPixel(rowCurrent + col + 1),
                            blue: getAndSetForPixel(rowCurrent + col + 2),
                            alpha: getAndSetForPixel(rowCurrent + col + 3)
                        },
                        [row, col]
                    );

                    if (isBreak == 'break') {
                        break;
                    }
                }

                if (isBreak == 'break') {
                    break;
                }
            }
        } else if (typeReader === 'BOTTOM') {
            let rowIni = len_row;
            let rowFin = 0;
            let colIni = len_col;
            let colFin = 0;

            for (row = rowIni; row >= rowFin; row--) {
                rowCurrent = row * colIni;

                for (col = colIni; col > colFin; col -= 4) {
                    isBreak = funcBack.apply(
                        {
                            red: getAndSetForPixel(rowCurrent - col),
                            green: getAndSetForPixel(rowCurrent - col - 3),
                            blue: getAndSetForPixel(rowCurrent - col - 2),
                            alpha: getAndSetForPixel(rowCurrent - col - 1)
                        },
                        [row, col]
                    );

                    if (isBreak == 'break') {
                        break;
                    }
                }

                if (isBreak == 'break') {
                    break;
                }
            }
        } else if (typeReader === 'LEFT') {
            let rowIni = 0;
            let rowFin = len_row;
            let colIni = 0;
            let colFin = len_col;

            for (col = colIni; col < colFin; col += 4) {
                for (row = rowIni; row < rowFin; row++) {
                    rowCurrent = row * colFin;

                    isBreak = funcBack.apply(
                        {
                            red: getAndSetForPixel(rowCurrent + col),
                            green: getAndSetForPixel(rowCurrent + col + 1),
                            blue: getAndSetForPixel(rowCurrent + col + 2),
                            alpha: getAndSetForPixel(rowCurrent + col + 3)
                        },
                        [row, col]
                    );

                    if (isBreak == 'break') {
                        break;
                    }
                }

                if (isBreak == 'break') {
                    break;
                }
            }
        } else if (typeReader === 'RIGHT') {
            let rowIni = len_row - 1;
            let rowFin = 1;
            let colIni = len_col;
            let colFin = 0;

            for (col = colIni; col > colFin; col -= 4) {
                for (row = rowIni; row > rowFin; row--) {
                    rowCurrent = row * colIni - 4 + col;

                    isBreak = funcBack.apply(
                        {
                            red: getAndSetForPixel(rowCurrent - 3),
                            green: getAndSetForPixel(rowCurrent - 2),
                            blue: getAndSetForPixel(rowCurrent - 1),
                            alpha: getAndSetForPixel(rowCurrent)
                        },
                        [row, col]
                    );

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
 * @param url string
 * @param funcBack Function
 */
function createImage(url: string, funcBack?) {
    let img = new Image();

    if (funcBack) {
        img.onload = funcBack;
    }

    img.src = url;

    return img;
}

/**
 * @param width
 * @param height
 * @param funcBack
 */
function createCanvasBack(width: number, height: number, funcBack?) {
    let canvasDum = document.createElement('canvas');

    canvasDum.width = width;
    canvasDum.height = height;

    let contextDum = canvasDum.getContext('2d');

    let scoper = {
        canvas: canvasDum,
        context: contextDum
    };

    if (funcBack) {
        funcBack.apply(scoper, [contextDum, canvasDum]);
    }

    return scoper;
}