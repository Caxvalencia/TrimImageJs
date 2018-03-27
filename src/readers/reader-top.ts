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

        let getAndSetForPixel = super.getPixel(pixels);

        for (let row = 0; row < lenRow; row += interator.row) {
            rowCurrent = row * lenCol;

            for (let col = 0; col < lenCol; col += interator.col) {
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
    }
}
