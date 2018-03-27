import { ColorRGBA } from '../contracts/color-rgba';
import { ReaderBase } from './reader-base';

export class ReaderTop extends ReaderBase {
    /**
     * @static
     * @param {any} pixels
     * @param {any} lenRow
     * @param {any} lenCol
     * @param {any} funcBack
     */
    static apply(pixels, lenRow, lenCol, funcBack) {
        let rowCurrent = -1;
        let isBreak: any = false;

        let interator = {
            row: 1,
            col: 4
        };

        let getPixel = super.getPixel(pixels);

        for (let row = 0; row < lenRow; row += interator.row) {
            rowCurrent = row * lenCol;

            for (let col = 0; col < lenCol; col += interator.col) {
                isBreak = funcBack.apply(this, [
                    row,
                    col,
                    <ColorRGBA>{
                        red: getPixel(rowCurrent + col),
                        green: getPixel(rowCurrent + col + 1),
                        blue: getPixel(rowCurrent + col + 2),
                        alpha: getPixel(rowCurrent + col + 3)
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
}
