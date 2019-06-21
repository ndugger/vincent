import Input from './core/Input';
import Texture from './core/Texture';
import Uniform from './core/Uniform';

import Program from './Program';

export default class Shader {

    public static readonly Fragment = class FragmentShader extends Shader {

        public constructor(glsl: string, upgrade = true) {
            super('fragment', glsl, upgrade);
        }
    };

    public static readonly Vertex = class VertexShader extends Shader {

        public constructor(glsl: string, upgrade = true) {
            super('vertex', glsl, upgrade);
        }
    };

    public static readonly upgrade = '    #version 300 es\n';

    private compiled: WebGLShader;
    private glsl: string;
    private unit: number;
    private upgrade: boolean;

    public readonly inputs: Map<any, Map<string, Input>>;
    public readonly type: string;
    public readonly uniforms: Map<any, Map<string, Uniform>>;

    public get webgl(): WebGLShader {
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

    public compile(program: Program): void {
        const shader = program.canvas.context.createShader(program.canvas.context[ `${ this.type.toUpperCase() }_SHADER` ]);
        const inputs = this.glsl.match(new RegExp(Input.pattern, 'g'));
        const uniforms = this.glsl.match(new RegExp(Uniform.pattern, 'g'));

        this.inputs.set(program, new Map());
        this.uniforms.set(program, new Map());

        if (this.upgrade) {
            this.glsl = `${ Shader.upgrade }${ this.glsl }`;
            this.upgrade = false;
        }

        program.canvas.context.shaderSource(shader, this.glsl);
        program.canvas.context.compileShader(shader);

        if (!program.canvas.context.getShaderParameter(shader, program.canvas.context.COMPILE_STATUS)) {
            throw new Error('Unable to compile shader: Please verify that your GLSL is valid');
        }

        if (inputs) for (const input of inputs) {
            const buffer = program.canvas.context.createBuffer();
            const [ , , definition, id ] = input.match(Input.pattern);
            const size = Number.parseInt(definition.match(/\d+/)[ 0 ], 10);
            const type = definition.match(/(.+?)\d+/)[ 1 ];

            this.inputs.get(program).set(id, new Input(buffer, id, size, type));
        }

        if (uniforms) for (const uniform of uniforms) {
            const [ , , definition, id ] = uniform.match(Uniform.pattern);
            const size = Number.parseInt(definition.match(/\d+/)[ 0 ], 10);
            const texture = definition.match(/sampler/) ? new Texture(size, program.canvas.context.createTexture(), this.unit++) : null;
            const type = definition.match(/(.+?)\d+/)[ 1 ];

            this.uniforms.get(program).set(id, new Uniform(id, size, texture, type));
        }

        this.compiled = shader;
    }
}
