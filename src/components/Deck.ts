import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Card } from "./Card";
import { RoundRectangle } from "./elements/RoundRectangle";
import { Color } from "@/assets/colors";
import { Level } from "./levels";
import { CardData } from "./cards";

export class Deck extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private handSize: number;
	private deck: CardData[];

	private cardSlots: { x: number }[];
	private cards: Card[];
	private button: Button;

	private activeCardIndex: number;
	private activeMultiCard: boolean;

	constructor(scene: GameScene) {
		super(scene);
		scene.add.existing(this);
		this.scene = scene;

		this.handSize = 0;
		this.deck = [];

		this.cardSlots = [];

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

		this.button.setVisible(false);
		this.button.bindInteractive(buttonBg);
		this.button.on("click", this.execute, this);
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
			card.angle -= 1 * Math.sin(time / 1000 + card.x / 300);
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

	startLevel(level: Level) {
		this.handSize = level.cards;
		this.deck = level.deck;

		for (let i = 0; i < level.cards; i++) {
			this.cardSlots.push({
				x: this.scene.CX + (i - (level.cards - 1) / 2) * 210,
			});
		}

		this.newRound();
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
			return this.newRound();
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

	newRound() {
		this.cards.forEach((card) => card.destroy());
		this.cards = [];
		this.button.setVisible(true);

		const count = (type: string) =>
			this.deck.slice(0, this.handSize).filter((data) => data.type == type)
				.length;

		// Shuffle deck until there are 2+ turn and move
		do {
			Phaser.Math.RND.shuffle(this.deck);
		} while (count("move") < 2 || count("turn") < 2);

		for (let i = 0; i < this.handSize; i++) {
			let x = this.cardSlots[i].x;
			let y = 0.8 * this.scene.H;
			let data = this.deck[i];
			let card = new Card(this.scene, x, y, data.image, data.text);
			card.setScale(0.95);
			this.add(card);
			this.cards.push(card);
		}
	}
}
