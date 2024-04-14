import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Card } from "./Card";
import { RoundRectangle } from "./elements/RoundRectangle";

export const cardCount = 5;

export const cardData = [
	{
		image: "move_forward",
		text: "Move one space forward",
	},
	{
		image: "move_forward",
		text: "Move one space forward",
	},
	{
		image: "turn_left",
		text: "Turn left",
	},
	{
		image: "turn_left",
		text: "Turn left",
	},
	{
		image: "turn_right",
		text: "Turn right",
	},
	{
		image: "turn_right",
		text: "Turn right",
	},

	{
		image: "move_forward_2",
		text: "Move 2 spaces forward",
	},
	{
		image: "move_forward_3",
		text: "Move 3 spaces forward",
	},
	{
		image: "move_backward",
		text: "Move one space backward",
	},
	{
		image: "turn_around",
		text: "Turn around 180°",
	},
];

export class Deck extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// Sprites
	private cardSlots: { x: number }[];
	private cards: Card[];
	private button: Button;

	private activeCardIndex: number;

	constructor(scene: GameScene) {
		super(scene);
		scene.add.existing(this);
		this.scene = scene;

		this.cardSlots = [];
		for (let i = 0; i < cardCount; i++) {
			this.cardSlots.push({
				x: this.scene.CX + (i - (cardCount - 1) / 2) * 210,
			});
		}

		this.activeCardIndex = 0;
		this.cards = [];

		this.button = new Button(this.scene, this.scene.CX, this.scene.H - 80);
		this.add(this.button);

		let buttonBr = new RoundRectangle(this.scene, {
			width: 200 + 10,
			height: 80 + 10,
			radius: 16 + 5,
			color: 0xffffff,
		});
		this.button.add(buttonBr);

		let buttonBg = new RoundRectangle(this.scene, {
			width: 200,
			height: 80,
			radius: 16,
			color: 0x4444ff,
		});
		this.button.add(buttonBg);

		let buttonText = this.scene.addText({
			size: 40,
			color: "white",
			text: "Go!",
		});
		buttonText.setOrigin(0.5);
		this.button.add(buttonText);

		this.button.bindInteractive(buttonBg);
		this.button.on("click", this.execute, this);

		this.reset();
	}

	update(time: number, delta: number) {
		this.button.setScale(1.0 - 0.1 * this.button.holdSmooth);

		this.cards.sort((a, b) => a.x - b.x);
		this.cards.forEach((card) => this.bringToTop(card));
		this.cards.forEach((card, index) => {
			if (!card.hold) {
				card.x = this.cardSlots[index].x;
			}
			let k = (card.x - this.scene.CX) / this.scene.CX;
			card.angle = k * 20;
			card.y = 0.8 * this.scene.H - 50 * Math.cos(k * Math.PI);
			if (card.hold) {
				this.bringToTop(card);
				card.y -= 50;
			}
		});

		this.bringToTop(this.button);
	}

	getSequence() {
		return this.cards.map((card) => card.action);
	}

	execute() {
		this.activeCardIndex = 0;
		this.cards.sort((a, b) => a.x - b.x);
		this.button.setVisible(false);
		this.scene.addEvent(500, this.activateCard, this);
	}

	activateCard() {
		if (this.activeCardIndex >= this.cards.length) {
			this.emit("newRound");
			return this.reset();
		}

		this.cards.forEach((card) => card.setAlpha(0.5));

		let card = this.cards[this.activeCardIndex];
		card.setAlpha(1.0);

		if (card.action == "move_forward_3") {
			card.action = "move_forward_2";
		} else if (card.action == "move_forward_2") {
			card.action = "move_forward";
		} else {
			this.activeCardIndex++;
		}

		this.emit("action", card.action);
		this.scene.addEvent(1000, () => {
			this.activateCard();
		});
	}

	reset() {
		this.cards.forEach((card) => card.destroy());
		this.cards = [];
		this.button.setVisible(true);

		do {
			Phaser.Math.RND.shuffle(cardData);
		} while (cardData.slice(0, cardCount).filter(data => data.image.startsWith("turn")).length > 3); // Max 3 turn cards

		for (let i = 0; i < cardCount; i++) {
			let x = this.cardSlots[i].x;
			let y = 0.8 * this.scene.H;
			let data = cardData[i];
			let card = new Card(this.scene, x, y, data.image, data.text);
			card.setScale(0.95);
			this.add(card);
			this.cards.push(card);
		}
	}
}
