import { GameScene, State } from "@/scenes/GameScene";
import { TextButton } from "./TextButton";
import { Card } from "./Card";
import { Level } from "../data/levels";
import { CardData, CardType } from "../data/cards";

export class Deck extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private handSize: number;
	private deck: CardData[];
	private minMoveCount: number;
	private minTurnCount: number;

	private cardSlots: { x: number }[];
	private cards: Card[];
	private button: TextButton;

	private activeCardIndex: number;
	private activeMultiCard: boolean;

	private executeTimer: Phaser.Time.TimerEvent;

	constructor(scene: GameScene) {
		super(scene);
		scene.add.existing(this);
		this.scene = scene;

		this.handSize = 0;
		this.deck = [];
		this.minMoveCount = 1;
		this.minTurnCount = 1;

		this.cardSlots = [];

		this.activeCardIndex = -1;
		this.activeMultiCard = false;
		this.cards = [];

		this.executeTimer = scene.addEvent(0, () => {});

		let bx = this.scene.W - 230;
		let by = this.scene.H - 110;
		this.button = new TextButton(this.scene, bx, by, 260, 100, "Go!");
		this.add(this.button);
		this.button.setAlpha(0);
		this.button.enabled = false;
		this.button.on("click", this.execute, this);
	}

	update(time: number, delta: number) {
		let buttonAlpha = this.button.enabled ? 1 : 0;
		this.button.alpha += 0.1 * (buttonAlpha - this.button.alpha);
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
			if (card.hold || card.highlighted) {
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
		this.minMoveCount = level.minMove;
		this.minTurnCount = level.minTurn;

		this.clearHand(true);

		this.cardSlots = [];
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
		this.emit("startExecuting");
		this.activeCardIndex = 0;
		this.activeMultiCard = false;
		this.cards.sort((a, b) => a.x - b.x);
		this.button.enabled = false;

		this.executeTimer.destroy();
		this.executeTimer = this.scene.addEvent(500, this.activateCard, this);
	}

	activateCard() {
		if (this.activeCardIndex >= this.cards.length) {
			this.clearHand();
			return this.emit("requestNewRound");
		}

		this.cards.forEach((card) => card.setHighlight(false));

		let card = this.cards[this.activeCardIndex];
		card.setHighlight(true);

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
		this.executeTimer.destroy();
		this.executeTimer = this.scene.addEvent(1050, () => {
			this.activateCard();
		});
	}

	failMove() {
		if (this.activeMultiCard) {
			this.activeMultiCard = false;
			this.activeCardIndex++;
		}
	}

	haltExecution() {
		this.executeTimer.destroy();

		this.scene.addEvent(500, () => {
			this.cards.forEach((card) => card.setHighlight(false));
		});
	}

	clearHand(immediate = false) {
		this.cards.forEach((card, index) => {
			card.removeFromGame(this.handSize - index, immediate);
		});
		this.cards = [];
	}

	newRound() {
		this.clearHand();
		this.activeCardIndex = -1;

		const countType = (type: string) =>
			this.hand.filter((card) => card.type == type).length;
		const isBadShuffle = () =>
			countType(CardType.Move) < this.minMoveCount ||
			countType(CardType.Turn) < this.minTurnCount;

		// Shuffle deck until there are 2+ turn and move
		let limit = 999;
		do Phaser.Math.RND.shuffle(this.deck);
		while (isBadShuffle() && limit--);
		console.assert(limit > 0, "Infinite loop");

		for (let i = 0; i < this.handSize; i++) {
			let x = this.cardSlots[i].x;
			let y = 1.5 * this.scene.H; // Spawn outside
			let data = this.deck[i];
			let card = new Card(this.scene, x, y, data.type, data.image, data.text);
			card.setScale(1.1);
			this.add(card);
			this.cards.push(card);

			card.addToGame(i);
		}

		this.scene.addEvent(2200, () => {
			this.button.enabled = true;
		});
	}

	updateState(state: State) {
		this.cards.forEach((card) => card.updateState(state));
	}

	get hand(): CardData[] {
		return this.deck.slice(0, this.handSize);
	}
}
