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
        this.location = program.gl.getUniformLocation(program.ptr, this.id);
    }

    public set(program: Program, values: any): void {

        if (this.type === 'mat') switch (this.size) {
            case 2: {
                program.gl.uniformMatrix2fv(this.location, false, values);
                break;
            }
            case 3: {
                program.gl.uniformMatrix3fv(this.location, false, values);
                break;
            }
            case 4: {
                program.gl.uniformMatrix4fv(this.location, false, values);
                break;
            }
        }
        else if (this.type === 'sampler') {
            this.texture.set(program.gl, values);
            program.gl.uniform1i(this.location, this.texture.unit);
        }
        else {
            const type = (this.type.match(/(.)vec/) || [ , 'f' ])[ 1 ];
            const flag = type === 'u' ? 'ui' : type;

            switch (flag) {
                case 'f': switch (this.size) {
                    case 1: {
                        program.gl.uniform1f(this.location, values);
                        break;
                    }
                    case 2: {
                        program.gl.uniform2f(this.location, ...values as [ number, number ]);
                        break;
                    }
                    case 3: {
                        program.gl.uniform3f(this.location, ...values as [ number, number, number ]);
                        break;
                    }
                    case 4: {
                        program.gl.uniform4f(this.location, ...values as [ number, number, number, number ]);
                        break;
                    }
                } break;
                case 'fv': switch (this.size) {
                    case 1: {
                        program.gl.uniform1fv(this.location, values);
                        break;
                    }
                    case 2: {
                        program.gl.uniform2fv(this.location, values);
                        break;
                    }
                    case 3: {
                        program.gl.uniform3fv(this.location, values);
                        break;
                    }
                    case 4: {
                        program.gl.uniform4fv(this.location, values);
                        break;
                    }
                } break;
                case 'i': switch (this.size) {
                    case 1: {
                        program.gl.uniform1i(this.location, values);
                        break;
                    }
                    case 2: {
                        program.gl.uniform2i(this.location, ...values as [ number, number ]);
                        break;
                    }
                    case 3: {
                        program.gl.uniform3i(this.location, ...values as [ number, number, number ]);
                        break;
                    }
                    case 4: {
                        program.gl.uniform4i(this.location, ...values as [ number, number, number, number ]);
                        break;
                    }
                } break;
                case 'iv': switch (this.size) {
                    case 1: {
                        program.gl.uniform1iv(this.location, values);
                        break;
                    }
                    case 2: {
                        program.gl.uniform2iv(this.location, values);
                        break;
                    }
                    case 3: {
                        program.gl.uniform3iv(this.location, values);
                        break;
                    }
                    case 4: {
                        program.gl.uniform4iv(this.location, values);
                        break;
                    }
                } break;
                case 'ui': switch (this.size) {
                    case 1: {
                        program.gl.uniform1ui(this.location, values);
                        break;
                    }
                    case 2: {
                        program.gl.uniform2ui(this.location, ...values as [ number, number ]);
                        break;
                    }
                    case 3: {
                        program.gl.uniform3ui(this.location, ...values as [ number, number, number ]);
                        break;
                    }
                    case 4: {
                        program.gl.uniform4ui(this.location, ...values as [ number, number, number, number ]);
                        break;
                    }
                } break;
                case 'uiv': switch (this.size) {
                    case 1: {
                        program.gl.uniform1uiv(this.location, values);
                        break;
                    }
                    case 2: {
                        program.gl.uniform2uiv(this.location, values);
                        break;
                    }
                    case 3: {
                        program.gl.uniform3uiv(this.location, values);
                        break;
                    }
                    case 4: {
                        program.gl.uniform4uiv(this.location, values);
                        break;
                    }
                } break;
            }
        }
    }
}
