import { ColorRGBA } from '../contracts/color-rgba';
import { ReaderBase } from './reader-base';

export class ReaderLeft extends ReaderBase {
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
        let getPixel = super.getPixel(pixels);

        let rowInit = 0;
        let rowEnd = lenRow;
        let colInit = 0;
        let colEnd = lenCol;

        for (let col = colInit; col < colEnd; col += 4) {
            for (let row = rowInit; row < rowEnd; row++) {
                rowCurrent = row * colEnd;

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
