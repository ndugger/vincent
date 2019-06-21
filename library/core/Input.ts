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
        program.canvas.context.enableVertexAttribArray(this.location);
    }

    public exists(): boolean {
        return this.location > -1;
    }

    public locate(program: Program): void {
        this.location = program.canvas.context.getAttribLocation(program.webgl, this.id)
    }

    public set(program: Program, values: any): void {
        program.canvas.context.bindBuffer(program.canvas.context.ARRAY_BUFFER, this.buffer);
        program.canvas.context.bufferData(
            program.canvas.context.ARRAY_BUFFER,
            values,
            program.canvas.context.STATIC_DRAW
        );

        switch (true) {
            case values instanceof Int8Array: {
                program.canvas.context.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.canvas.context.BYTE,
                    false,
                    0,
                    0
                );
                break;
            }
            case values instanceof Int16Array: {
                program.canvas.context.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.canvas.context.SHORT,
                    false,
                    0,
                    0
                );
                break;
            }
            case values instanceof Uint8Array: {
                program.canvas.context.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.canvas.context.UNSIGNED_BYTE,
                    false,
                    0,
                    0
                );
            }
            case values instanceof Uint16Array: {
                program.canvas.context.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.canvas.context.UNSIGNED_SHORT,
                    false,
                    0,
                    0
                );
                break;
            }
            case values instanceof Float32Array: {
                program.canvas.context.vertexAttribPointer(
                    this.location,
                    this.size,
                    program.canvas.context.FLOAT,
                    false,
                    0,
                    0
                );
                break;
            }
        }
    }
}
