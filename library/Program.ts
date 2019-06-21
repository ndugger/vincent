import Canvas from './Canvas';
import Shader from './Shader';

export default class Program {

    private program: WebGLProgram;

    public readonly canvas: Canvas;
    public readonly shaders: Shader[];

    public get webgl(): WebGLProgram {
        return this.program;
    }

    public constructor(canvas: Canvas, shaders: Shader[]) {
        this.canvas = canvas;
        this.program = null;
        this.shaders = shaders;
    }

    public compile(): void {
        this.program = this.canvas.context.createProgram();

        for (const shader of this.shaders) {
            shader.compile(this);
            this.canvas.context.attachShader(this.program, shader.webgl);
        }

        this.canvas.context.linkProgram(this.program);

        for (const shader of this.shaders) {

            for (const input of shader.inputs.get(this).values()) {
                input.locate(this);

                if (input.exists()) {
                    input.enable(this);
                }
            }

            for (const uniform of shader.uniforms.get(this).values()) {
                uniform.locate(this);
            }
        }
    }

    public use(): void {
        this.canvas.context.useProgram(this.program);
    }

    public setInput(id: string, value: any): void {

        for (const shader of this.shaders) if (shader.inputs.get(this).has(id)) {
            shader.inputs.get(this).get(id).set(this, value);
        }
    }

    public setUniform(id: string, value: any): void {

        for (const shader of this.shaders) if (shader.uniforms.get(this).has(id)) {
            shader.uniforms.get(this).get(id).set(this, value);
        }
    }
}
