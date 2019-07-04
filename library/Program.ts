import Shader from './Shader';

export default class Program<
    FSInputs extends object = any,
    FSUniforms extends object = any,
    VSInputs extends object = FSInputs,
    VSUniforms extends object = FSUniforms> {

    private context: WebGL2RenderingContext;
    private linked: WebGLProgram;
    private shaders: {
        fragment: Shader<FSInputs, FSUniforms>;
        vertex: Shader<VSInputs, VSUniforms>;
    };

    public get gl() {
        return this.context;
    }

    public get ptr() {
        return this.linked;
    }

    public constructor(context: WebGL2RenderingContext, shaders: { fragment: Shader<FSInputs, FSUniforms>, vertex: Shader<VSInputs, VSUniforms> }) {
        this.context = context;
        this.shaders = shaders;
    }

    public clear(red: number, green: number, blue: number, alpha: number): void {
        this.gl.clearColor(red, green, blue, alpha);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    public compile(): void {
        this.linked = this.gl.createProgram();

        for (const shader of Object.values(this.shaders)) {
            shader.compile(this as Program);
            this.gl.attachShader(this.ptr, shader.ptr);
        }

        this.gl.linkProgram(this.ptr);

        for (const shader of Object.values(this.shaders)) {

            for (const input of shader.inputs.get(this as Program).values()) {
                input.locate(this);

                if (input.exists()) {
                    input.enable(this);
                }
            }

            for (const uniform of shader.uniforms.get(this as Program).values()) {
                uniform.locate(this);
            }
        }
    }

    public drawLineLoop(first: number, count: number): void {
        this.gl.drawArrays(this.gl.LINE_LOOP, first, count);
    }

    public drawLineStrip(first: number, count: number): void {
        this.gl.drawArrays(this.gl.LINE_STRIP, first, count);
    }

    public drawLines(first: number, count: number): void {
        this.gl.drawArrays(this.gl.LINES, first, count);
    }

    public drawPoints(first: number, count: number): void {
        this.gl.drawArrays(this.gl.POINTS, first, count);
    }

    public drawTriangleFan(first: number, count: number): void {
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, first, count);
    }

    public drawTriangleStrip(first: number, count: number): void {
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, first, count);
    }

    public drawTriangles(first: number, count: number): void {
        this.gl.drawArrays(this.gl.TRIANGLES, first, count);
    }

    public setInput<Id extends (keyof FSInputs | keyof VSInputs)>(id: Id, value: FSInputs[ Id & keyof FSInputs ] |  VSInputs[ Id & keyof VSInputs ]): void {

        for (const shader of Object.values(this.shaders)) if (shader.inputs.get(this as Program).has(id as keyof object)) {
            shader.inputs.get(this as Program).get(id as keyof object).set(this, value);
        }
    }

    public setUniform<Id extends (keyof FSUniforms | keyof VSUniforms)>(id: Id, value: FSUniforms[ Id & keyof FSUniforms ] | VSUniforms[ Id & keyof VSUniforms ]): void {

        for (const shader of Object.values(this.shaders)) if (shader.uniforms.get(this as Program).has(id as keyof object)) {
            shader.uniforms.get(this as Program).get(id as keyof object).set(this, value);
        }
    }

    public setViewport(width: number, height: number): void {
        this.gl.viewport(0, 0, width, height);
    }

    public use(): void {
        this.gl.useProgram(this.ptr);
    }
}
