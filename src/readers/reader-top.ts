import { IReaderPosition } from '../contracts/reader-position';
import { ReaderBase } from './reader-base';

export class ReaderTop extends ReaderBase {
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
        let getPixel = super.getPixel(pixels);
        let interator = {
            row: 1,
            col: 4
        };

        for (let row = 0; row < lenRow; row += interator.row) {
            let rowCurrent = row * lenCol;

            for (let col = 0; col < lenCol; col += interator.col) {
                let alpha = getPixel(rowCurrent + col + 3);

                if (alpha === 0) {
                    continue;
                }

                return { row, col };
            }
        }
    }
}
