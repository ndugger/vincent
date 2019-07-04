import Program from '../Program';

export default class Input {

    public static readonly pattern = /in (.+? )?(.+?) (.+?);/;

    private buffer: WebGLBuffer;
    private id: string;
    private location: number;
    private size: number;
    private type: string;

    public constructor(buffer: WebGLBuffer, id: string, size: number, type: string) {
        this.buffer = buffer;
        this.id = id;
        this.location = null;
        this.size = size;
        this.type = type;
    }

    public enable(program: Program): void {
        program.gl.enableVertexAttribArray(this.location);
    }

    public exists(): boolean {
        return this.location > -1;
    }

    public locate(program: Program): void {
        this.location = program.gl.getAttribLocation(program.ptr, this.id)
    }

    public set(program: Program, values: unknown): void {
        program.gl.bindBuffer(program.gl.ARRAY_BUFFER, this.buffer);
        program.gl.bufferData(
            program.gl.ARRAY_BUFFER,
            values as ArrayBufferView,
            program.gl.STATIC_DRAW
        );

        switch (true) {
            case values instanceof Int8Array: {
                program.gl.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.gl.BYTE,
                    false,
                    0,
                    0
                );
                break;
            }
            case values instanceof Int16Array: {
                program.gl.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.gl.SHORT,
                    false,
                    0,
                    0
                );
                break;
            }
            case values instanceof Uint8Array: {
                program.gl.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.gl.UNSIGNED_BYTE,
                    false,
                    0,
                    0
                );
            }
            case values instanceof Uint16Array: {
                program.gl.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.gl.UNSIGNED_SHORT,
                    false,
                    0,
                    0
                );
                break;
            }
            case values instanceof Float32Array: {
                program.gl.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.gl.FLOAT,
                    false,
                    0,
                    0
                );
                break;
            }
        }
    }
}
