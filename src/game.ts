import Phaser from "phaser";
import { PreloadScene } from "@/scenes/PreloadScene";
import { TitleScene } from "@/scenes/TitleScene";
import { GameScene } from "@/scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 1920,
	height: 1080,
	mipmapFilter: "LINEAR_MIPMAP_LINEAR",
	roundPixels: false,
	scale: {
		mode: Phaser.Scale.FIT,
	},
	scene: [PreloadScene, TitleScene, GameScene],
};

const game = new Phaser.Game(config);
