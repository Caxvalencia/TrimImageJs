import { ColorRGBA } from '../contracts/color-rgba';
import { IReaderPosition } from '../contracts/reader-position';
import { ReaderBase } from './reader-base';

export class ReaderBottom extends ReaderBase {
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

        let rowIni = lenRow;
        let rowFin = 0;
        let colIni = lenCol;
        let colFin = 0;

        for (let row = rowIni; row >= rowFin; row--) {
            rowCurrent = row * colIni;

            for (let col = colIni; col > colFin; col -= 4) {
                let alpha = getPixel(rowCurrent - col - 1);

                if (alpha === 0) {
                    continue;
                }

                return {
                    row,
                    col,
                    rgba: <ColorRGBA>{
                        red: getPixel(rowCurrent - col),
                        green: getPixel(rowCurrent - col - 3),
                        blue: getPixel(rowCurrent - col - 2),
                        alpha
                    }
                };
            }
        }
    }
}
