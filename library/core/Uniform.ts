import Program from '../Program';

import Texture from './Texture';

export default class Uniform {

    public static readonly pattern = /uniform (.+? )?(.+?) (.+?);/;

    private id: string;
    private location: WebGLUniformLocation;
    private size: number;
    private texture: Texture;
    private type: string;

    public constructor(id: string, size: number, texture: any, type: string) {
        this.id = id;
        this.location = null;
        this.size = size;
        this.texture = texture;
        this.type = type;
    }

    public locate(program: Program): void {
        this.location = program.canvas.context.getUniformLocation(program.webgl, this.id);
    }

    public set(program: Program, values: any): void {

        if (this.type === 'mat') switch (this.size) {
            case 2: {
                program.canvas.context.uniformMatrix2fv(this.location, false, values);
                break;
            }
            case 3: {
                program.canvas.context.uniformMatrix3fv(this.location, false, values);
                break;
            }
            case 4: {
                program.canvas.context.uniformMatrix4fv(this.location, false, values);
                break;
            }
        }
        else if (this.type === 'sampler') {
            this.texture.set(program.canvas.context, values);
            program.canvas.context.uniform1i(this.location, this.texture.unit);
        }
        else {
            const type = (this.type.match(/(.)vec/) || [ , 'f' ])[ 1 ];
            const flag = type === 'u' ? 'ui' : type;

            switch (flag) {
                case 'f': switch (this.size) {
                    case 1: {
                        program.canvas.context.uniform1f(this.location, values);
                        break;
                    }
                    case 2: {
                        program.canvas.context.uniform2f(this.location, ...values as [ number, number ]);
                        break;
                    }
                    case 3: {
                        program.canvas.context.uniform3f(this.location, ...values as [ number, number, number ]);
                        break;
                    }
                    case 4: {
                        program.canvas.context.uniform4f(this.location, ...values as [ number, number, number, number ]);
                        break;
                    }
                } break;
                case 'fv': switch (this.size) {
                    case 1: {
                        program.canvas.context.uniform1fv(this.location, values);
                        break;
                    }
                    case 2: {
                        program.canvas.context.uniform2fv(this.location, values);
                        break;
                    }
                    case 3: {
                        program.canvas.context.uniform3fv(this.location, values);
                        break;
                    }
                    case 4: {
                        program.canvas.context.uniform4fv(this.location, values);
                        break;
                    }
                } break;
                case 'i': switch (this.size) {
                    case 1: {
                        program.canvas.context.uniform1i(this.location, values);
                        break;
                    }
                    case 2: {
                        program.canvas.context.uniform2i(this.location, ...values as [ number, number ]);
                        break;
                    }
                    case 3: {
                        program.canvas.context.uniform3i(this.location, ...values as [ number, number, number ]);
                        break;
                    }
                    case 4: {
                        program.canvas.context.uniform4i(this.location, ...values as [ number, number, number, number ]);
                        break;
                    }
                } break;
                case 'iv': switch (this.size) {
                    case 1: {
                        program.canvas.context.uniform1iv(this.location, values);
                        break;
                    }
                    case 2: {
                        program.canvas.context.uniform2iv(this.location, values);
                        break;
                    }
                    case 3: {
                        program.canvas.context.uniform3iv(this.location, values);
                        break;
                    }
                    case 4: {
                        program.canvas.context.uniform4iv(this.location, values);
                        break;
                    }
                } break;
                case 'ui': switch (this.size) {
                    case 1: {
                        program.canvas.context.uniform1ui(this.location, values);
                        break;
                    }
                    case 2: {
                        program.canvas.context.uniform2ui(this.location, ...values as [ number, number ]);
                        break;
                    }
                    case 3: {
                        program.canvas.context.uniform3ui(this.location, ...values as [ number, number, number ]);
                        break;
                    }
                    case 4: {
                        program.canvas.context.uniform4ui(this.location, ...values as [ number, number, number, number ]);
                        break;
                    }
                } break;
                case 'uiv': switch (this.size) {
                    case 1: {
                        program.canvas.context.uniform1uiv(this.location, values);
                        break;
                    }
                    case 2: {
                        program.canvas.context.uniform2uiv(this.location, values);
                        break;
                    }
                    case 3: {
                        program.canvas.context.uniform3uiv(this.location, values);
                        break;
                    }
                    case 4: {
                        program.canvas.context.uniform4uiv(this.location, values);
                        break;
                    }
                } break;
            }
        }
    }
}
