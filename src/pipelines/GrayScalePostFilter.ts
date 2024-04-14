export class GrayScalePostFilter extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
	constructor (game: Phaser.Game) {
		super({
			game,
			name: 'GrayScalePostFilter'
		});
	}

	onPreRender () {
		this.colorMatrix.blackWhite();
	}

	onDraw (renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
		this.drawFrame(renderTarget, this.fullFrame1);
		this.bindAndDraw(this.fullFrame1);
	}
}