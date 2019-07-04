import Program from '../library/Program';
import Shader from '../library/Shader';

const canvas = Object.assign(document.createElement('canvas'), { height: 480, width: 640 });
const gl = canvas.getContext('webgl2');

document.body.append(canvas);

interface VertexInputs {
    i_Points: Float32Array;
    i_Sample: Float32Array;
}

interface VertexUniforms {
    u_Resolution: Float32Array;
}

interface FragmentUniforms {
    u_Texture: ImageBitmapSource;
}

const vertex = new Shader.Vertex<VertexInputs, VertexUniforms>(`
    in vec2 i_Points;
    in vec2 i_Sample;

    uniform vec2 u_Resolution;

    out vec2 o_Sample;

    void main () {
        vec2 one = i_Points / u_Resolution;
        vec2 two = one * 2.0;
        vec2 clip = two - 1.0;
        vec2 flip = vec2(1.0, -1.0);

        gl_Position = vec4(clip * flip, 0.0, 1.0);
        o_Sample = i_Sample;
    }
`);

const fragment = new Shader.Fragment<{}, FragmentUniforms>(`
    precision mediump float;

    in vec2 o_Sample;

    uniform sampler2D u_Texture;

    out vec4 o_Color;

    void main () {
        o_Color = texture(u_Texture, o_Sample);
    }
`);

const program = new Program(gl, { fragment, vertex });

program.compile();
program.use();

program.setViewport(canvas.width, canvas.height);

program.setUniform('u_Resolution', new Float32Array([
    canvas.width,
    canvas.height
]));

const image = new Image();

image.onload = () => {
    program.setUniform('u_Texture', image);

    program.setInput('i_Points', new Float32Array([
        0, 0,
        image.width, 0,
        0, image.height,
        0, image.height,
        image.width, 0,
        image.width, image.height
    ]));

    program.setInput('i_Sample', new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1
    ]));

    program.clear(0, 0, 0, 1);
    program.drawTriangles(0, 6);
};

image.src = './tests/assets/troll.png';
