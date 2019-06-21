export default class Canvas {

    public static from(canvas: HTMLCanvasElement): Canvas {
        return new Canvas(canvas.width, canvas.height, canvas);
    }

    public readonly context: WebGL2RenderingContext;
    public readonly element: HTMLCanvasElement;

    public constructor(width: number, height: number, canvas?: HTMLCanvasElement) {

        if (!canvas) {
            canvas = window.document.createElement('canvas');
        }

        this.context = canvas.getContext('webgl2');
        this.element = canvas;

        this.resize(width, height);
    }

    public clear(red: number, green: number, blue: number, alpha: number): void {
        this.context.clearColor(red, green, blue, alpha);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }

    public drawLineLoop(first: number, count: number): void {
        this.context.drawArrays(this.context.LINE_LOOP, first, count);
    }

    public drawLineStrip(first: number, count: number): void {
        this.context.drawArrays(this.context.LINE_STRIP, first, count);
    }

    public drawLines(first: number, count: number): void {
        this.context.drawArrays(this.context.LINES, first, count);
    }

    public drawPoints(first: number, count: number): void {
        this.context.drawArrays(this.context.POINTS, first, count);
    }

    public drawTriangleFan(first: number, count: number): void {
        this.context.drawArrays(this.context.TRIANGLE_FAN, first, count);
    }

    public drawTriangleStrip(first: number, count: number): void {
        this.context.drawArrays(this.context.TRIANGLE_STRIP, first, count);
    }

    public drawTriangles(first: number, count: number): void {
        this.context.drawArrays(this.context.TRIANGLES, first, count);
    }

    public resize(width: number, height: number): void {
        this.element.width = width;
        this.element.height = height;

        this.context.viewport(0, 0, width, height);
    }
}
