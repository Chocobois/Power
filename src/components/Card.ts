import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";

export class Card extends Button {
	public scene: GameScene;
	public action: string;

	private card: Phaser.GameObjects.Sprite;
	private icon: Phaser.GameObjects.Sprite;
	private text: Phaser.GameObjects.Text;

	public target: Phaser.Math.Vector2;
	private dragOffset: Phaser.Math.Vector2;

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		image: string,
		text: string
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.action = image;

		this.card = this.scene.add.sprite(0, 0, "card");
		this.add(this.card);

		this.icon = this.scene.add.sprite(0, -this.card.displayHeight / 6, image);
		this.add(this.icon);

		this.text = this.scene.addText({
			y: this.card.displayHeight / 6,
			size: 32,
			color: "black",
			text,
		});
		this.text.setWordWrapWidth(0.8 * this.card.displayWidth);
		this.text.setOrigin(0.5);
		this.add(this.text);

		this.dragOffset = new Phaser.Math.Vector2();
		this.target = new Phaser.Math.Vector2();

		this.bindInteractive(this.card, true);
	}

	update(time: number, delta: number) {
		this.x += 0.5 * (this.target.x - this.x);
		this.y += 0.5 * (this.target.y - this.y);
	}

	onDragStart() {
		this.dragOffset.set(
			this.scene.input.activePointer.x - this.x,
			this.scene.input.activePointer.y - this.y
		);
	}

	onDrag() {
		this.target.x = this.scene.input.activePointer.x - this.dragOffset.x;
		// this.y = this.scene.input.activePointer.y - this.dragOffset.y;
	}

	onDragEnd() {}
}
