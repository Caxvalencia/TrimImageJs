import { IReaderPosition } from '../contracts/reader-position';
import { ReaderBase } from './reader-base';

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
        let getPixel = super.createGetPixel(pixels);

        let rowInit = lenRow - 1;
        let rowEnd = 1;
        let colInit = lenCol;
        let colEnd = 0;

        for (let col = colInit; col > colEnd; col -= 4) {
            for (let row = rowInit; row > rowEnd; row--) {
                rowCurrent = row * colInit - 4 + col;

                let alpha = getPixel(rowCurrent);

                if (alpha === 0) {
                    continue;
                }

                return { row, col };
            }
        }
    }
}
