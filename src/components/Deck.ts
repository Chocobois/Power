import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Card } from "./Card";
import { RoundRectangle } from "./elements/RoundRectangle";
import { Color } from "@/assets/colors";

export const HAND = 5;

export const DECK = [
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
		text: "Turn 90° counter clockwise",
	},
	{
		image: "turn_left",
		text: "Turn 90° counter clockwise",
	},
	{
		image: "turn_right",
		text: "Turn 90° clockwise",
	},
	{
		image: "turn_right",
		text: "Turn 90° clockwise",
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
	private activeMultiCard: boolean;

	constructor(scene: GameScene) {
		super(scene);
		scene.add.existing(this);
		this.scene = scene;

		this.cardSlots = [];
		for (let i = 0; i < HAND; i++) {
			this.cardSlots.push({
				x: this.scene.CX + (i - (HAND - 1) / 2) * 210,
			});
		}

		this.activeCardIndex = 0;
		this.activeMultiCard = false;
		this.cards = [];

		this.button = new Button(this.scene, this.scene.CX, this.scene.H - 80);
		this.add(this.button);

		let buttonBr = new RoundRectangle(this.scene, {
			width: 200 + 10,
			height: 80 + 10,
			radius: 16 + 5,
			color: Color.White,
		});
		this.button.add(buttonBr);

		let buttonBg = new RoundRectangle(this.scene, {
			width: 200,
			height: 80,
			radius: 16,
			color: Color.Blue700,
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
				card.target.x = this.cardSlots[index].x;
			}
			let k = (card.x - this.scene.CX) / this.scene.CX;
			card.angle = k * 20;
			card.target.y = 880 - 50 * Math.cos(k * Math.PI);
			card.target.y += 4 * Math.sin(time / 1000 + card.x / 200);
			if (card.hold) {
				this.bringToTop(card);
				card.target.y -= 100;
			}

			card.update(time, delta);
		});

		this.bringToTop(this.button);
	}

	getSequence() {
		return this.cards.map((card) => card.action);
	}

	execute() {
		this.activeCardIndex = 0;
		this.activeMultiCard = false;
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
			this.activeMultiCard = true;
			card.action = "move_forward_2";
		} else if (card.action == "move_forward_2") {
			this.activeMultiCard = true;
			card.action = "move_forward";
		} else {
			this.activeMultiCard = false;
			this.activeCardIndex++;
		}

		this.emit("action", card.action);
		this.scene.addEvent(1050, () => {
			this.activateCard();
		});
	}

	failMove() {
		if (this.activeMultiCard) {
			this.activeMultiCard = false;
			this.activeCardIndex++;
		}
	}

	reset() {
		this.cards.forEach((card) => card.destroy());
		this.cards = [];
		this.button.setVisible(true);

		const count = (type: string) =>
			DECK.slice(0, HAND).filter((data) => data.image.startsWith(type)).length;

		// Shuffle deck to prevent 4+ of the same type of card
		do {
			Phaser.Math.RND.shuffle(DECK);
		} while (count("move") >= 4 || count("turn") >= 4);

		for (let i = 0; i < HAND; i++) {
			let x = this.cardSlots[i].x;
			let y = 0.8 * this.scene.H;
			let data = DECK[i];
			let card = new Card(this.scene, x, y, data.image, data.text);
			card.setScale(0.95);
			this.add(card);
			this.cards.push(card);
		}
	}
}
