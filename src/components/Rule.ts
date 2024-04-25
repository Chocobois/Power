import { GameScene } from "@/scenes/GameScene";
import { Card } from "./Card";
import { CardData, Rules } from "./cards";
import { Level } from "./levels";

export class Rule extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private ruleCard?: Card;

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

	setRuleCard(rule: CardData) {
		if (this.ruleCard) {
			this.ruleCard.destroy();
		}

		this.ruleCard = new Card(
			this.scene,
			180,
			330,
			rule.type,
			rule.image,
			rule.text
		);
		this.add(this.ruleCard);
	}

	getRule() {
		if (this.ruleCard) {
			return this.ruleCard.action;
		}
		return "";
	}
}
