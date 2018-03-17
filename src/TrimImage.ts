declare let $;

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
    configureImage(image, funcLoadBack) {
        if ($.isString(image)) {
            if (funcLoadBack === undefined) {
                this.image = $.createImage(image);
                return;
            }

            $.createImage(image, function() {
                this.image = this;
                funcLoadBack.call(this, this);
            });

            return;
        }

        this.image = image;

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
    getImageData(image) {
        var imgW = image.width,
            imgH = image.height;

        var context = $.createCanvasBack(imgW, imgH).context;
        context.drawImage(image, 0, 0, imgW, imgH);

        return context.getImageData(0, 0, imgW, imgH);
    }

    /**
     * @description - Convierte un imageData object a un image object
     *
     * @param {imageData} imageData - Objeto con matriz de datos de la imagen
     * @return {image object}
     */
    getImage(imageData, funcBack?) {
        this.validateImageData(imageData);

        var imgW = imageData.width,
            imgH = imageData.height;

        var cnvBack = $.createCanvasBack(imgW, imgH);

        var context = cnvBack.context,
            canvas = cnvBack.canvas;

        context.putImageData(imageData, 0, 0);
        var image = new Image();
        image.width = imgW;
        image.height = imgH;

        if (funcBack) image.onload = funcBack;

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

        var trimmedImage = this._trimTop(imageData);
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
        var row = 0,
            len_col = imageData.width * 4,
            len_row = imageData.height;

        this.readImageData('top', imageData, function(r, c) {
            if (this.alpha() != 0) {
                row = r;
                return 'break';
            }
        });

        return this.cutImageData(imageData, row, 0, len_row, len_col);
    }

    /**
     * @description - Devuelve un array de datos de la imagen
     *
     * @param {imageData} imageData - Matriz de datos de la imagen
     * @return {imageData object}
     */
    private _trimBottom(imageData) {
        var len_row = imageData.height,
            len_col = imageData.width * 4;

        this.readImageData('bottom', imageData, function(r, c) {
            if (this.alpha() != 0) {
                len_row = r;

                return 'break';
            }
        });

        return this.cutImageData(imageData, 0, 0, len_row, len_col);
    }

    /**
     * @description - Devuelve un array de datos de la imagen
     *
     * @param {imageData} imageData - Matriz de datos de la imagen
     * @return {imageData object}
     */
    private _trimLeft(imageData) {
        var col = 0,
            len_col = imageData.width * 4,
            len_row = imageData.height;

        this.readImageData('left', imageData, function(r, c) {
            if (this.alpha() != 0) {
                col = c;

                return 'break';
            }
        });

        return this.cutImageData(imageData, 0, col, len_row, len_col);
    }

    /**
     * @description - Devuelve un array de datos de la imagen
     *
     * @param {imageData} imageData - Matriz de datos de la imagen
     * @return {imageData object}
     */
    private _trimRight(imageData) {
        var len_col = imageData.width * 4,
            len_row = imageData.height;

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

        var pixels = imageData.data,
            len_col = imageData.width * 4,
            row,
            col,
            rowCurrent;

        rowFin = rowFin == 0 ? 1 : rowFin;
        colFin = colFin == 0 ? 1 : colFin;

        var copyHeight = rowFin == rowIni ? 1 : rowFin - rowIni,
            copyWidth = colFin / 4 - colIni / 4;

        var copyImageData: any = [];
        $.createCanvasBack(copyWidth, copyHeight, function(ctx) {
            copyImageData = ctx.createImageData(copyWidth, copyHeight);
        });

        var diffCol = len_col - colFin;

        var countCopy = 0;
        for (row = rowIni; row < rowFin; row++) {
            rowCurrent = row * colFin + row * diffCol;

            for (col = colIni; col < colFin; col += 4, countCopy += 4) {
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

        var pixels = imageData.data,
            row,
            col,
            rowCurrent = -1;

        var len_col = imageData.width * 4,
            len_row = imageData.height;

        var isBreak: any = false;

        if (typeReader === 'TOP') {
            var rowIni = 0,
                rowFin = len_row,
                colIni = 0,
                colFin = len_col,
                interator = {
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
            let rowIni = len_row,
                rowFin = 0,
                colIni = len_col,
                colFin = 0;

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
            var rowIni = 0,
                rowFin = len_row,
                colIni = 0,
                colFin = len_col;

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
            let rowIni = len_row - 1,
                rowFin = 1,
                colIni = len_col,
                colFin = 0;

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
                if (!val) return pixels[pos];

                pixels[pos] = val;
            };
        }

        return imageData;
    }

    private validateImageData(imageData) {
        if ($.is(imageData) !== 'imagedata')
            throw 'ImageData Exception: No es compatible el tipo de dato';
    }
}
