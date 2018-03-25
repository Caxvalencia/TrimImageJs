export abstract class CanvasHelper {
    /**
     * @static
     * @param {number} width
     * @param {number} height
     * @returns {HTMLCanvasElement}
     */
    static create(width: number, height: number): HTMLCanvasElement {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        return canvas;
    }

    /**
     * @static
     * @param {number} width
     * @param {number} height
     * @returns {CanvasRenderingContext2D}
     */
    static context(width: number, height: number): CanvasRenderingContext2D {
        return CanvasHelper.create(width, height).getContext('2d');
    }
}
