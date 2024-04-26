import { GameScene, State } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Color, ColorStr } from "@/utils/colors";
import { CardType } from "../data/cards";
import { interpolateColor } from "@/utils/functions";

export class Card extends Button {
	public scene: GameScene;
	public type: CardType;
	public action: string;
	public highlighted: boolean;

	private edges: Phaser.GameObjects.Sprite;
	private surface: Phaser.GameObjects.Sprite;
	private inner: Phaser.GameObjects.Sprite;
	private icon: Phaser.GameObjects.Sprite;
	private label: Phaser.GameObjects.Text;
	private description: Phaser.GameObjects.Text[];

	public target: Phaser.Math.Vector2;
	private dragOffset: Phaser.Math.Vector2;

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		type: CardType,
		image: string,
		lines: string[]
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.type = type;
		this.action = image;
		this.highlighted = false;

		this.surface = this.scene.add.sprite(0, 0, "card_surface");
		this.surface.setTint(this.backgroundColor);
		this.add(this.surface);

		this.inner = this.scene.add.sprite(0, 0, "card_inner");
		this.inner.setTint(Color.White);
		this.add(this.inner);

		this.edges = this.scene.add.sprite(0, 0, "card_edges");
		this.edges.setTint(this.color);
		this.add(this.edges);

		this.icon = this.scene.add.sprite(0, -82, image);
		this.icon.setScale(160 / this.icon.width);
		this.icon.setTint(this.color);
		this.add(this.icon);

		if (this.action == "turn_right") this.icon.angle += 180;
		if (this.action == "turn_left") this.icon.angle += 180;

		/* Label */

		let labelSize = 19;
		this.label = this.scene.addText({
			x: -60,
			y: -165,
			size: labelSize,
			color: ColorStr.White,
			text: type,
		});
		this.label.setLetterSpacing(5);
		this.label.setOrigin(0.5);
		this.add(this.label);

		/* Description */

		let descSize = this.type == CardType.Rule ? 28 : 36;
		let centerY = 512 / 6;
		let gapY = 1.2 * descSize;
		let topY = centerY - gapY * ((lines.length - 1) / 2);

		this.description = [];
		for (let i = 0; i < lines.length; i++) {
			let line = this.scene.addText({
				y: topY + gapY * i,
				size: descSize,
				color: ColorStr.Black,
				text: lines[i],
			});
			line.setOrigin(0.5);
			this.add(line);
			this.description.push(line);
		}

		this.dragOffset = new Phaser.Math.Vector2();
		this.target = new Phaser.Math.Vector2(this.x, this.y);

		if (this.type != CardType.Rule) {
			this.bindInteractive(this.edges, true);
		}
	}

	update(time: number, delta: number) {
		if (this.enabled) {
			let f = this.hold ? 0.5 : 0.2;
			this.x += f * (this.target.x - this.x);
			this.y += f * (this.target.y - this.y);
		}

		if (this.action == "turn_right") this.icon.angle += delta / 100;
		if (this.action == "turn_left") this.icon.angle -= delta / 100;
	}

	onDragStart() {
		this.dragOffset.set(
			this.scene.input.activePointer.x - this.x,
			this.scene.input.activePointer.y - this.y
		);
	}

	onDrag() {
		this.target.x = this.scene.input.activePointer.x - this.dragOffset.x;
		this.target.y = this.scene.input.activePointer.y - this.dragOffset.y;

		this.dragOffset.scale(0.99);
	}

	onDragEnd() {}

	setHighlight(value: boolean) {
		this.highlighted = value;
		this.setAlpha(value ? 1.0 : 0.4);
	}

	addToGame(index: number) {
		this.enabled = false;

		this.scene.tweens.add({
			targets: this,
			y: { from: this.y, to: this.target.y },
			duration: 1000,
			delay: index * 150,
			ease: "Cubic.easeInOut",
			onComplete: () => {
				this.enabled = true;
			},
		});
	}

	removeFromGame(index: number) {
		this.enabled = false;

		this.scene.tweens.add({
			targets: this,
			x: "+=1500",
			duration: 700,
			delay: index * 100,
			ease: "Cubic.easeInOut",
			onComplete: () => {
				this.destroy();
			},
		});
	}

	updateState(state: State) {
		this.enabled = state == State.Planning;
	}

	get color(): number {
		switch (this.type) {
			case CardType.Move:
				return Color.Blue800;
			case CardType.Turn:
				return Color.Emerald800;
			case CardType.Rule:
				return Color.Yellow600;
			default:
				return Color.Slate800;
		}
	}

	get backgroundColor(): number {
		switch (this.type) {
			case CardType.Move:
				return interpolateColor(Color.Blue100, Color.Gray100, 0.8);
			case CardType.Turn:
				return interpolateColor(Color.Emerald100, Color.Gray100, 0.8);
			case CardType.Rule:
				return interpolateColor(Color.Yellow100, Color.Gray100, 0.7);
			default:
				return interpolateColor(Color.Slate100, Color.Gray100, 0.8);
		}
	}
}
