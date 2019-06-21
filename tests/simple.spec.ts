import Canvas from '../library/Canvas';
import Program from '../library/Program';
import Shader from '../library/Shader';

const canvas = new Canvas(640, 480);
const image = new Image();
const program = new Program(canvas, [
    new Shader.Vertex(`
        in vec2 i_Position;
        in vec2 i_Sample;
        uniform vec2 u_Resolution;

        out vec2 o_Sample;

        void main () {
            vec2 one = i_Position / u_Resolution;
            vec2 two = one * 2.0;
            vec2 clip = two - 1.0;
            vec2 flip = vec2(1.0, -1.0);

            gl_Position = vec4(clip * flip, 0.0, 1.0);
            o_Sample = i_Sample;
        }
    `),
    new Shader.Fragment(`
        precision mediump float;

        in vec2 o_Sample;
        uniform sampler2D u_Texture;

        out vec4 o_Color;

        void main () {
            o_Color = texture(u_Texture, o_Sample);
        }
    `)
]);

program.compile();
program.use();

program.setUniform('u_Resolution', new Float32Array([
    program.canvas.element.width,
    program.canvas.element.height
]));

image.onload = () => {
    program.setUniform('u_Texture', image);

    program.setInput('i_Position', new Float32Array([
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

    canvas.clear(0, 0, 0, 1);
    canvas.drawTriangles(0, 6);
};

image.src = './tests/assets/troll.png';

document.body.append(canvas.element);
