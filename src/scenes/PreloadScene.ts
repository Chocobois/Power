import { BaseScene } from "./BaseScene";
import { images, spritesheets, audios } from "@/assets/assets";
import { GrayScalePostFilter } from "@/pipelines/GrayScalePostFilter";
import { BlurPostFilter } from "@/pipelines/BlurPostFilter";
import BendWaves from "@/pipelines/BendWavesPostFX";
import BendWaves2 from "@/pipelines/BendWavesPostFX2";
import { title, version } from "@/version.json";

export class PreloadScene extends BaseScene {
	constructor() {
		super({ key: "PreloadScene" });
	}

	init() {
		// Load pipelines
		let renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
		if (renderer.pipelines) {
			renderer.pipelines.addPostPipeline(
				"GrayScalePostFilter",
				GrayScalePostFilter
			);
			renderer.pipelines.addPostPipeline("BlurPostFilter", BlurPostFilter);
			renderer.pipelines.addPostPipeline("BendWaves", BendWaves);
			renderer.pipelines.addPostPipeline("BendWaves2", BendWaves2);
		}
	}

	preload() {
		this.cameras.main.setBackgroundColor(0x000000);

		// Loading bar
		let width = 0.5 * this.W;
		let x = this.CX - width / 2;
		let y = this.CY;
		let bg = this.add.rectangle(x, y, width, 4, 0x666666).setOrigin(0, 0.5);
		let bar = this.add.rectangle(x, y, 1, 8, 0xdddddd).setOrigin(0, 0.5);

		// Loading text
		this.addText({
			x,
			y,
			size: 30,
			color: "#DDDDDD",
			text: "Loading...",
		}).setOrigin(0, 1.5);
		this.addText({
			x: this.W,
			y: this.H,
			size: 30,
			color: "#DDDDDD",
			text: `${title} ${version}`,
		}).setOrigin(1, 1);

		// Listener
		this.load.on("progress", (progress: number) => {
			bar.width = progress * width;
		});

		// Load assets
		for (let image of images) {
			this.load.image(image.key, image.path);
		}

		for (let image of spritesheets) {
			this.load.spritesheet(image.key, image.path, {
				frameWidth: image.width,
				frameHeight: image.height,
			});
		}

		for (let audio of audios) {
			this.load.audio(audio.key, audio.path);
		}
	}

	create() {
		this.fade(true, 100, 0x000000);
		this.addEvent(100, () => {
			this.scene.start("GameScene");
		});
	}
}
