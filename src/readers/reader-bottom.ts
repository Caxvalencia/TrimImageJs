import { ColorRGBA } from '../contracts/color-rgba';
import { ReaderBase } from './reader-base';

export class ReaderBottom extends ReaderBase {
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

        let rowIni = lenRow;
        let rowFin = 0;
        let colIni = lenCol;
        let colFin = 0;

        for (let row = rowIni; row >= rowFin; row--) {
            rowCurrent = row * colIni;

            for (let col = colIni; col > colFin; col -= 4) {
                isBreak = funcBack.apply(this, [
                    row,
                    col,
                    <ColorRGBA>{
                        red: getPixel(rowCurrent - col),
                        green: getPixel(rowCurrent - col - 3),
                        blue: getPixel(rowCurrent - col - 2),
                        alpha: getPixel(rowCurrent - col - 1)
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