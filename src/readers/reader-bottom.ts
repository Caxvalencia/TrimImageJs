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
        let getAndSetForPixel = super.getPixel(pixels);

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
                        red: getAndSetForPixel(rowCurrent - col),
                        green: getAndSetForPixel(rowCurrent - col - 3),
                        blue: getAndSetForPixel(rowCurrent - col - 2),
                        alpha: getAndSetForPixel(rowCurrent - col - 1)
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