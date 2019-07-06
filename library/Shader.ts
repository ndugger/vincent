import Input from './core/Input';
import Texture from './core/Texture';
import Uniform from './core/Uniform';

import Program from './Program';

export default class Shader<Inputs extends object = any, Uniforms extends object = any> {

    public static readonly Fragment = class FragmentShader<Inputs extends object = any, Uniforms extends object = any> extends Shader<Inputs, Uniforms> {

        public constructor(glsl: string, upgrade = true) {
            super('fragment', glsl, upgrade);
        }
    };

    public static readonly Vertex = class VertexShader<Inputs extends object = any, Uniforms extends object = any> extends Shader<Inputs, Uniforms> {

        public constructor(glsl: string, upgrade = true) {
            super('vertex', glsl, upgrade);
        }
    };

    public static readonly upgrade = '    #version 300 es\n';

    private compiled: WebGLShader;
    private glsl: string;
    private unit: number;
    private upgrade: boolean;

    public readonly type: string;

    public readonly inputs: {
        [ Id in keyof Inputs ]: Input<Inputs[ Id ]>;
    };

    public readonly uniforms: {
        [ Id in keyof Uniforms ]: Uniform<Uniforms[ Id ]>;
    };

    public get ptr(): WebGLShader {
        return this.compiled;
    }

    public constructor(type: string, glsl: string, upgrade = true) {
        this.compiled = null;
        this.glsl = glsl;
        this.unit = 0;
        this.upgrade = upgrade;

        this.type = type;

        this.inputs = {} as {
            [ Id in keyof Inputs ]: Input<Inputs[ Id ]>;
        };

        this.uniforms = {} as {
            [ Id in keyof Uniforms ]: Uniform<Uniforms[ Id ]>;
        };
    }

    public compile(program: Program): void {
        let shader: WebGLShader;

        if (this.type.toUpperCase() === 'FRAGMENT') {
            shader = program.gl.createShader(program.gl.FRAGMENT_SHADER);
        }
        else if (this.type.toUpperCase() === 'VERTEX') {
            shader = program.gl.createShader(program.gl.VERTEX_SHADER);
        }
        else {
            throw new Error(`Unsupported shader type: ${ this.type }`);
        }

        if (this.upgrade) {
            this.glsl = `${ Shader.upgrade }${ this.glsl }`;
            this.upgrade = false;
        }

        program.gl.shaderSource(shader, this.glsl);
        program.gl.compileShader(shader);

        if (!program.gl.getShaderParameter(shader, program.gl.COMPILE_STATUS)) {
            throw new Error('Unable to compile shader: Please verify that your GLSL is valid');
        }

        const inputs = this.glsl.match(new RegExp(Input.pattern, 'g'));
        const uniforms = this.glsl.match(new RegExp(Uniform.pattern, 'g'));

        if (inputs) for (const input of inputs) {
            const buffer = program.gl.createBuffer();
            const [ , , definition, id ] = input.match(Input.pattern);
            const size = Number.parseInt(definition.match(/\d+/)[ 0 ], 10);
            const type = definition.match(/(.+?)\d+/)[ 1 ];

            this.inputs[ id ] = new Input(buffer, id, size, type);
        }

        if (uniforms) for (const uniform of uniforms) {
            const [ , , definition, id ] = uniform.match(Uniform.pattern);
            const size = Number.parseInt(definition.match(/\d+/)[ 0 ], 10);
            const texture = definition.match(/sampler/) ? new Texture(size, program.gl.createTexture(), this.unit++) : null;
            const type = definition.match(/(.+?)\d+/)[ 1 ];

            this.uniforms[ id ] = new Uniform(id, size, texture, type);
        }

        this.compiled = shader;
    }
}
