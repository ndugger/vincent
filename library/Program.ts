import Shader from './Shader';

type KeyOfParameters<Program extends any, Parameters extends string> =
    keyof Program[ 'shaders' ][ 'fragment' ][ Parameters ] |
    keyof Program[ 'shaders' ][ 'vertex' ][ Parameters ];

type ValueOfParameter<Program extends any, Parameters extends string, Id extends string> =
    Id extends keyof Program[ 'shaders' ][ 'fragment' ][ Parameters ]
        ? Program[ 'shaders' ][ 'fragment' ][ Parameters ][ Id ][ 'valueType' ]
        : Id extends keyof Program[ 'shaders' ][ 'vertex' ][ Parameters ]
            ? Program[ 'shaders' ][ 'vertex' ][ Parameters ][ Id ][ 'valueType' ]
            : unknown;

export default class Program<FragmentShader extends Shader = any, VertexShader extends Shader = any> {

    private context: WebGL2RenderingContext;
    private linked: WebGLProgram;
    private shaders: {
        fragment: FragmentShader;
        vertex: VertexShader;
    };

    public get gl() {
        return this.context;
    }

    public get ptr() {
        return this.linked;
    }

    public constructor(context: WebGL2RenderingContext, shaders: { fragment: FragmentShader, vertex: VertexShader }) {
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
            shader.compile(this);
            this.gl.attachShader(this.ptr, shader.ptr);
        }

        this.gl.linkProgram(this.ptr);

        for (const input of Object.values(this.shaders.fragment.inputs)) {
            input.locate(this);

            if (input.exists()) {
                input.enable(this);
            }
        }

        for (const uniform of Object.values(this.shaders.fragment.uniforms)) {
            uniform.locate(this);
        }

        for (const input of Object.values(this.shaders.vertex.inputs)) {
            input.locate(this);

            if (input.exists()) {
                input.enable(this);
            }
        }

        for (const uniform of Object.values(this.shaders.vertex.uniforms)) {
            uniform.locate(this);
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

    public setInput<Id extends KeyOfParameters<this, 'inputs'> & string>(id: Id, value: ValueOfParameter<this, 'inputs', Id>): void {

        if (id in this.shaders.fragment.inputs) {
            this.shaders.fragment.inputs[ id ].set(this, value);
        }

        if (id in this.shaders.vertex.inputs) {
            this.shaders.vertex.inputs[ id ].set(this, value);
        }
    }

    public setUniform<Id extends KeyOfParameters<this, 'uniforms'> & string>(id: Id, value: ValueOfParameter<this, 'uniforms', Id>): void {

        if (id in this.shaders.fragment.uniforms) {
            this.shaders.fragment.uniforms[ id ].set(this, value);
        }

        if (id in this.shaders.vertex.uniforms) {
            this.shaders.vertex.uniforms[ id ].set(this, value);
        }
    }

    public setViewport(x: number, y: number, width: number, height: number): void {
        this.gl.viewport(x, y, x + width, y + height);
    }

    public use(): void {
        this.gl.useProgram(this.ptr);
    }
}
