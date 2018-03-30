import { ColorRGBA } from '../contracts/color-rgba';
import { ReaderBase } from './reader-base';
import { IReaderPosition } from '../contracts/reader-position';

export class ReaderRight extends ReaderBase {
    /**
     * @static
     * @param {Uint8ClampedArray} pixels
     * @param {number} lenRow
     * @param {number} lenCol
     * @returns {IReaderPosition}
     */
    static apply(
        pixels: Uint8ClampedArray,
        lenRow: number,
        lenCol: number
    ): IReaderPosition {
        let rowCurrent = -1;
        let getPixel = super.getPixel(pixels);

        let rowIni = lenRow - 1;
        let rowFin = 1;
        let colIni = lenCol;
        let colFin = 0;

        for (let col = colIni; col > colFin; col -= 4) {
            for (let row = rowIni; row > rowFin; row--) {
                rowCurrent = row * colIni - 4 + col;

                let alpha = getPixel(rowCurrent);

                if (alpha === 0) {
                    continue;
                }

                return {
                    row,
                    col,
                    rgba: <ColorRGBA>{
                        red: getPixel(rowCurrent - 3),
                        green: getPixel(rowCurrent - 2),
                        blue: getPixel(rowCurrent - 1),
                        alpha
                    }
                };
            }
        }
    }
}
