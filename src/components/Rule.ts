import { GameScene } from "@/scenes/GameScene";
import { Card } from "./Card";
import { CardData, Rules } from "../data/cards";
import { Level } from "../data/levels";

export class Rule extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private ruleCard: Card;

	constructor(scene: GameScene) {
		super(scene);
		scene.add.existing(this);
		this.scene = scene;
	}

	update(time: number, delta: number) {
		if (this.ruleCard) {
			this.ruleCard.update(time, delta);
		}
	}

	clearRuleCard() {
		if (this.ruleCard) {
			this.ruleCard.destroy();
		}
	}

	setRuleCard(rule: CardData) {
		this.clearRuleCard();

		this.ruleCard = new Card(
			this.scene,
			230,
			330,
			rule.type,
			rule.image,
			rule.text
		);
		this.add(this.ruleCard);
	}

	getRule() {
		return this.ruleCard.action;
	}

	flash() {
		this.scene.tweens.addCounter({
			delay: 400,
			duration: 1000,
			onUpdate: (tween, target, key, x: number) => {
				// https://www.desmos.com/calculator/pxhniqzwcl
				let y = Math.pow(1 - x, 2) * Math.cos(40 * x - 20 * x * x);
				this.ruleCard.setAngle(15 * y);
			},
		});
	}
}
