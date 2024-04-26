import { BaseScene } from "@/scenes/BaseScene";
import { Color, ColorStr } from "@/utils/colors";
import { Button } from "./elements/Button";
import { TextButton } from "./TextButton";
import { Player } from "./Player";

export const enum Mode {
	Instructions,
	RestartLevel,
	StartNextLevel,
	TheEnd,
}

export class Intermission extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public mode: Mode;

	private graphics: Phaser.GameObjects.Graphics;

	private rect: Phaser.GameObjects.Rectangle;
	private tiles: Phaser.GameObjects.TileSprite;
	private title: Phaser.GameObjects.Text;
	private description: Phaser.GameObjects.Text;

	private button: Button;

	constructor(scene: BaseScene) {
		super(scene);
		this.scene = scene;
		scene.add.existing(this);

		/* Masking */

		this.graphics = this.scene.make.graphics();
		this.graphics.fillStyle(Color.White);

		let mask = this.graphics.createGeometryMask();
		mask.setInvertAlpha(true);
		this.setMask(mask);

		// this.redrawMask(scene.CX, scene.CY, scene.W);

		/* Background */

		this.rect = scene.add.rectangle(
			scene.CX,
			scene.CY,
			scene.W,
			scene.H,
			Color.Blue700
		);
		this.rect.setInteractive();
		this.add(this.rect);

		this.tiles = scene.add.tileSprite(0, 0, 1920 + 256, 1080 + 256, "tile");
		this.tiles.setOrigin(0);
		this.tiles.setAlpha(0.15);
		this.add(this.tiles);

		/* Content */

		this.title = scene.addText({
			x: scene.CX,
			y: scene.CY,
			size: 128,
			color: ColorStr.White,
			text: "Title",
		});
		this.title.setOrigin(0.5);
		this.title.setPadding(10);
		this.add(this.title);

		this.description = scene.addText({
			x: scene.CX,
			y: scene.CY - 100,
			size: 64,
			color: ColorStr.White,
			text: "Description",
		});
		this.description.setOrigin(0.5);
		this.description.setPadding(10);
		this.description.setWordWrapWidth(0.7 * scene.W);
		this.add(this.description);

		/* Button */

		this.button = new TextButton(
			scene,
			scene.CX,
			scene.H - 120,
			300,
			120,
			"Go!"
		);
		this.add(this.button);
		this.button.on("click", () => {
			this.emit("restartLevel");
		});

		/* Init */

		this.setMode(Mode.Instructions);
	}

	update(time: number, delta: number) {
		this.button.setScale(1.0 - 0.1 * this.button.holdSmooth);

		this.tiles.x = ((time / 50) % 256) - 256;
		this.tiles.y = ((time / 50) % 256) - 256;
	}

	setMode(mode: Mode) {
		this.mode = mode;

		this.button.setVisible(mode == Mode.Instructions);
		this.title.setVisible(mode == Mode.TheEnd);
		this.description.setVisible(mode == Mode.Instructions);

		if (mode == Mode.Instructions) {
			this.description.setText(
				"Welcome!\n\nHelp the robot clean all squares.\n\nDrag and drop the movement cards to plan your route."
			);
		}
		if (mode == Mode.TheEnd) {
			this.title.setText("Thanks for playing!");
		}
	}

	fadeToGame(focus: Player) {
		this.hideContent();

		// Open small circle around player
		this.scene.tweens.addCounter({
			duration: 500,
			delay: 500,
			from: 0,
			to: 1,
			ease: Phaser.Math.Easing.Cubic.Out,
			onUpdate: (tween, target, key, current: number) => {
				let radius = current * 200;
				this.redrawMask(focus.x, focus.y, radius);
			},
		});

		// Reveal full screen
		this.scene.tweens.addCounter({
			duration: 1000,
			delay: 1000,
			from: 0,
			to: 1,
			ease: Phaser.Math.Easing.Quintic.InOut,
			onUpdate: (tween, target, key, current: number) => {
				let radius = 200 + current * 0.8 * this.scene.W;
				this.redrawMask(focus.x, focus.y, radius);
			},
			onComplete: () => {
				this.setVisible(false);
			},
		});
	}

	fadeToIntermission(focus: Player, mode: Mode) {
		this.setMode(mode);
		this.setVisible(true);

		this.scene.tweens.addCounter({
			duration: 1500,
			from: 1,
			to: 0,
			ease: Phaser.Math.Easing.Cubic.InOut,
			onUpdate: (tween, target, key, current: number) => {
				let radius = 200 + current * 0.8 * this.scene.W;
				this.redrawMask(focus.x, focus.y, radius);
			},
		});

		this.scene.tweens.addCounter({
			duration: 500,
			delay: 1500,
			from: 1,
			to: 0,
			ease: Phaser.Math.Easing.Quintic.InOut,
			onUpdate: (tween, target, key, current: number) => {
				let radius = 200 * current;
				this.redrawMask(focus.x, focus.y, radius);
			},
			onStart: () => {
				this.showContent();
			},
			onComplete: () => {
				if (mode == Mode.RestartLevel) {
					this.emit("restartLevel");
				}
				if (mode == Mode.StartNextLevel) {
					this.emit("nextLevel");
				}
			},
		});
	}

	redrawMask(x: number, y: number, radius: number) {
		this.graphics.clear();
		this.graphics.fillCircle(x, y, radius);
	}

	showContent() {
		this.scene.tweens.add({
			targets: [this.button, this.title, this.description],
			alpha: { from: 0, to: 1 },
			duration: 500,
			ease: Phaser.Math.Easing.Cubic.Out,
			onComplete: () => {
				this.button.enabled = true;
			},
		});
	}

	hideContent() {
		this.button.enabled = false;

		this.scene.tweens.add({
			targets: [this.button, this.title, this.description],
			alpha: { from: 1, to: 0 },
			duration: 500,
			ease: Phaser.Math.Easing.Cubic.Out,
		});
	}
}
