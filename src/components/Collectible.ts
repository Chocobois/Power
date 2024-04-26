import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Color } from "@/utils/colors";
import { CardType } from "../data/cards";

export class Collectible extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private shadow: Phaser.GameObjects.Sprite;
	private bolt: Phaser.GameObjects.Sprite;

	constructor(scene: GameScene, x: number, y: number, size: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.shadow = this.scene.add.sprite(0, 0, "shadow");
		this.shadow.setScale((0.7 * size) / this.shadow.width);
		this.shadow.setOrigin(0.5, 0.2);
		this.add(this.shadow);

		this.bolt = this.scene.add.sprite(0, 0, "bolt", 0);
		this.bolt.setScale(size / this.bolt.width);
		this.bolt.setTint(Color.Amber300);
		this.add(this.bolt);
	}

	update(time: number, delta: number) {
		this.bolt.setFrame(Math.floor((5 * time) / 1000) % 3);

		let hover = Math.sin(1.5 * (time / 1000));
		this.bolt.setOrigin(0.5, 0.7 + 0.05 * hover);
		this.shadow.setAlpha(0.25 - 0.1 * hover);
	}

	removeFromGame(collected: boolean) {
		this.destroy();
	}
}
