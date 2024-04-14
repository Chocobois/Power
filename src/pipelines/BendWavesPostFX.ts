import Phaser from 'phaser';

const fragShader = `
#define SHADER_NAME BEND_WAVES_FS

precision mediump float;

uniform float     uTime;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main( void )
{
    vec2 uv = outTexCoord;
    uv.x += 0.02 * sin((uv.y + (uTime * 0.1)) * 30.0);
    vec4 texColor = texture2D(uMainSampler, uv);
    gl_FragColor = texColor;
}
`;

export default class BendWaves extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    private _time;

    constructor (game: Phaser.Game)
    {
        super({
            game,
            renderTarget: true,
            fragShader
        });
        this._time = 0;
    }

    onPreRender ()
    {
        this._time += 0.005;
        this.set1f('uTime', this._time);
    }
}
