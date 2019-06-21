export default class Texture {

    public static unit(texture: Texture): number {
        return texture.unit;
    }

    public readonly size: number;
    public readonly texture: WebGLTexture;
    public readonly unit: number;

    public constructor(size: number, texture: WebGLTexture, unit: number) {
        this.size = size;
        this.texture = texture;
        this.unit = unit;
    }

    public set(gl: WebGL2RenderingContext, image: any): void {

        switch (this.unit) {
            case 0: {
                gl.activeTexture(gl.TEXTURE0);
                break;
            }
            case 1: {
                gl.activeTexture(gl.TEXTURE1);
                break;
            }
            case 2: {
                gl.activeTexture(gl.TEXTURE2);
                break;
            }
            case 3: {
                gl.activeTexture(gl.TEXTURE3);
                break;
            }
            case 4: {
                gl.activeTexture(gl.TEXTURE4);
                break;
            }
            case 5: {
                gl.activeTexture(gl.TEXTURE5);
                break;
            }
            case 6: {
                gl.activeTexture(gl.TEXTURE6);
                break;
            }
            case 7: {
                gl.activeTexture(gl.TEXTURE7);
                break;
            }
            case 8: {
                gl.activeTexture(gl.TEXTURE8);
                break;
            }
            case 9: {
                gl.activeTexture(gl.TEXTURE9);
                break;
            }
            case 10: {
                gl.activeTexture(gl.TEXTURE10);
                break;
            }
            case 11: {
                gl.activeTexture(gl.TEXTURE11);
                break;
            }
            case 12: {
                gl.activeTexture(gl.TEXTURE12);
                break;
            }
            case 13: {
                gl.activeTexture(gl.TEXTURE13);
                break;
            }
            case 14: {
                gl.activeTexture(gl.TEXTURE14);
                break;
            }
            case 15: {
                gl.activeTexture(gl.TEXTURE15);
                break;
            }
            case 16: {
                gl.activeTexture(gl.TEXTURE16);
                break;
            }
            case 17: {
                gl.activeTexture(gl.TEXTURE17);
                break;
            }
            case 18: {
                gl.activeTexture(gl.TEXTURE18);
                break;
            }
            case 19: {
                gl.activeTexture(gl.TEXTURE19);
                break;
            }
            case 20: {
                gl.activeTexture(gl.TEXTURE20);
                break;
            }
            case 21: {
                gl.activeTexture(gl.TEXTURE21);
                break;
            }
            case 22: {
                gl.activeTexture(gl.TEXTURE22);
                break;
            }
            case 23: {
                gl.activeTexture(gl.TEXTURE23);
                break;
            }
            case 24: {
                gl.activeTexture(gl.TEXTURE24);
                break;
            }
            case 25: {
                gl.activeTexture(gl.TEXTURE25);
                break;
            }
            case 26: {
                gl.activeTexture(gl.TEXTURE26);
                break;
            }
            case 27: {
                gl.activeTexture(gl.TEXTURE27);
                break;
            }
            case 28: {
                gl.activeTexture(gl.TEXTURE28);
                break;
            }
            case 29: {
                gl.activeTexture(gl.TEXTURE29);
                break;
            }
            case 30: {
                gl.activeTexture(gl.TEXTURE30);
                break;
            }
            case 31: {
                gl.activeTexture(gl.TEXTURE31);
                break;
            }
        }

        switch (this.size) {
            case 2: {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
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
