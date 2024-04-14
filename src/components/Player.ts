import { GameScene } from "@/scenes/GameScene";

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// Sprites
	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;

	public cell: Phaser.Math.Vector2;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.cell = new Phaser.Math.Vector2();

		this.spriteSize = 150;
		this.sprite = this.scene.add.sprite(0, 0, "robot");
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {}

	setCell(cx: number, cy: number) {
		this.cell.x = cx;
		this.cell.y = cy;
	}

	move(x: number, y: number) {
		this.scene.tweens.add({
			targets: this,
			x: { from: this.x, to: x },
			y: { from: this.y, to: y },
			duration: 1000,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
	}

	bump(x: number, y: number) {
		this.scene.tweens.add({
			targets: this,
			x: { from: this.x, to: x },
			y: { from: this.y, to: y },
			duration: 500,
			yoyo: true,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
		this.scene.tweens.add({
			targets: this,
			angle: { from: this.angle, to: this.angle - 90 },
			duration: 500,
			delay: 500,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
	}

	rotate(relAngle: number) {
		this.scene.tweens.add({
			targets: this,
			angle: { from: this.angle, to: this.angle + relAngle },
			duration: 1000,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
	}

	getFacing() {
		return {
			dx: Math.round(Math.cos(this.angle * Phaser.Math.DEG_TO_RAD)),
			dy: Math.round(Math.sin(this.angle * Phaser.Math.DEG_TO_RAD)),
		};
	}
}
