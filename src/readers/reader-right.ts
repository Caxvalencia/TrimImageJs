import { ColorRGBA } from '../contracts/color-rgba';
import { ReaderBase } from './reader-base';

export class ReaderRight extends ReaderBase {
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

        let rowIni = lenRow - 1;
        let rowFin = 1;
        let colIni = lenCol;
        let colFin = 0;

        for (let col = colIni; col > colFin; col -= 4) {
            for (let row = rowIni; row > rowFin; row--) {
                rowCurrent = row * colIni - 4 + col;

                isBreak = funcBack.apply(this, [
                    row,
                    col,
                    <ColorRGBA>{
                        red: getPixel(rowCurrent - 3),
                        green: getPixel(rowCurrent - 2),
                        blue: getPixel(rowCurrent - 1),
                        alpha: getPixel(rowCurrent)
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
