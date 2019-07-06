import Program from '../Program';

export default class Input<Value> {

    public static readonly pattern = /in (.+? )?(.+?) (.+?);/;

    private buffer: WebGLBuffer;
    private id: string;
    private location: number;
    private size: number;
    private type: string;

    public readonly valueType: Value;

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

    public set(program: Program, value: Value): void {
        program.gl.bindBuffer(program.gl.ARRAY_BUFFER, this.buffer);
        program.gl.bufferData(
            program.gl.ARRAY_BUFFER,
            value as any,
            program.gl.STATIC_DRAW
        );

        switch (true) {
            case value instanceof Int8Array: {
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
            case value instanceof Int16Array: {
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
            case value instanceof Uint8Array: {
                program.gl.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.gl.UNSIGNED_BYTE,
                    false,
                    0,
                    0
                );
            }
            case value instanceof Uint16Array: {
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
            case value instanceof Float32Array: {
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
