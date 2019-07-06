export default class Texture {

    public static unit(texture: Texture): number {
        return texture.unit;
    }

    public readonly bound: WebGLTexture;
    public readonly size: number;
    public readonly unit: number;

    public constructor(size: number, bound: WebGLTexture, unit: number) {
        this.bound = bound;
        this.size = size;
        this.unit = unit;
    }

    public set(gl: WebGL2RenderingContext, image: any): void {
        gl.activeTexture(gl.TEXTURE0 + this.unit);

        switch (this.size) {
            case 2: {
                gl.bindTexture(gl.TEXTURE_2D, this.bound);
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    image.width,
                    image.height,
                    0,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    image
                );
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                break;
            }
            case 3: {
                // TODO
            }
        }
    }
}
