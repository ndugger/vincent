import Input from './core/Input';
import Texture from './core/Texture';
import Uniform from './core/Uniform';

import Program from './Program';

export default class Shader<Inputs extends object, Uniforms extends object> {

    public static readonly Fragment = class FragmentShader<Inputs extends object, Uniforms extends object> extends Shader<Inputs, Uniforms> {

        public constructor(glsl: string, upgrade = true) {
            super('fragment', glsl, upgrade);
        }
    };

    public static readonly Vertex = class VertexShader<Inputs extends object, Uniforms extends object> extends Shader<Inputs, Uniforms> {

        public constructor(glsl: string, upgrade = true) {
            super('vertex', glsl, upgrade);
        }
    };

    public static readonly upgrade = '    #version 300 es\n';

    private compiled: WebGLShader;
    private glsl: string;
    private unit: number;
    private upgrade: boolean;

    public readonly inputs: Map<Program<Inputs, Uniforms, Inputs, Uniforms>, Map<keyof Inputs, Input>>;
    public readonly type: string;
    public readonly uniforms: Map<Program<Inputs, Uniforms, Inputs, Uniforms>, Map<keyof Uniforms, Uniform>>;

    public get ptr(): WebGLShader {
        return this.compiled;
    }

    public constructor(type: string, glsl: string, upgrade = true) {
        this.compiled = null;
        this.glsl = glsl;
        this.inputs = new Map();
        this.type = type;
        this.uniforms = new Map();
        this.unit = 0;
        this.upgrade = upgrade;
    }

    public compile(program: Program<Inputs, Uniforms, Inputs, Uniforms>): void {
        const shader = program.gl.createShader(program.gl[ `${ this.type.toUpperCase() }_SHADER` ]);
        const inputs = this.glsl.match(new RegExp(Input.pattern, 'g'));
        const uniforms = this.glsl.match(new RegExp(Uniform.pattern, 'g'));

        this.inputs.set(program, new Map());
        this.uniforms.set(program, new Map());

        if (this.upgrade) {
            this.glsl = `${ Shader.upgrade }${ this.glsl }`;
            this.upgrade = false;
        }

        program.gl.shaderSource(shader, this.glsl);
        program.gl.compileShader(shader);

        if (!program.gl.getShaderParameter(shader, program.gl.COMPILE_STATUS)) {
            throw new Error('Unable to compile shader: Please verify that your GLSL is valid');
        }

        if (inputs) for (const input of inputs) {
            const buffer = program.gl.createBuffer();
            const [ , , definition, id ] = input.match(Input.pattern);
            const size = Number.parseInt(definition.match(/\d+/)[ 0 ], 10);
            const type = definition.match(/(.+?)\d+/)[ 1 ];

            this.inputs.get(program).set(id as keyof Inputs, new Input(buffer, id, size, type));
        }

        if (uniforms) for (const uniform of uniforms) {
            const [ , , definition, id ] = uniform.match(Uniform.pattern);
            const size = Number.parseInt(definition.match(/\d+/)[ 0 ], 10);
            const texture = definition.match(/sampler/) ? new Texture(size, program.gl.createTexture(), this.unit++) : null;
            const type = definition.match(/(.+?)\d+/)[ 1 ];

            this.uniforms.get(program).set(id as keyof Uniforms, new Uniform(id, size, texture, type));
        }

        this.compiled = shader;
    }
}
