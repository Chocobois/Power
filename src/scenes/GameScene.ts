import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { DJ } from "@/components/DJ";
import { Grid } from "@/components/Grid";
import { Deck } from "@/components/Deck";
import { Rule } from "@/components/Rule";
import { Intermission, Mode } from "@/components/Intermission";
import { Color } from "@/utils/colors";
import { Level, level1, level2, levels } from "@/data/levels";

export const enum State {
	Intermission,
	Planning,
	Executing,
	GameOver,
}

export class GameScene extends BaseScene {
	public state: State;

	private background: Phaser.GameObjects.Image;
	private grid: Grid;
	private player: Player;
	private deck: Deck;
	private rule: Rule;
	private ui: UI;
	private dj: DJ;
	private intermission: Intermission;

	private levelIndex: number;

	constructor() {
		super({ key: "GameScene" });

		this.state = State.Intermission;
		this.levelIndex = 0;
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(Color.White);

		/* Managers */

		this.grid = new Grid(this);
		this.grid.on("complete", this.onLevelComplete, this);

		this.player = new Player(this);
		this.ui = new UI(this);
		this.dj = new DJ(this);
		this.rule = new Rule(this);

		this.deck = new Deck(this);
		this.deck.setDepth(2000);
		this.deck.on("startExecuting", this.startExecuting, this);
		this.deck.on("newRound", this.newRound, this);
		this.deck.on("action", this.performAction, this);

		this.intermission = new Intermission(this);
		this.intermission.setDepth(10000);
		this.intermission.on("restartLevel", () => {
			this.startLevel(levels[this.levelIndex]);
		});
		this.intermission.on("nextLevel", () => {
			this.levelIndex++;
			if (this.levelIndex < levels.length) {
				this.startLevel(levels[this.levelIndex]);
			}
		});

		this.setState(State.Intermission);
	}

	update(time: number, delta: number) {
		this.grid.update(time, delta);
		this.player.update(time, delta);
		this.deck.update(time, delta);
		this.rule.update(time, delta);
		this.dj.update(time, delta);
		this.ui.update(time, delta);
		this.intermission.update(time, delta);

		this.ui.setBatteryBlink(this.dj.barTime, this.player.power);
	}

	setState(state: State) {
		this.state = state;
		this.deck.updateState(state);
		this.dj.setMoodState(state);
	}

	startLevel(level: Level) {
		this.setState(State.Planning);
		this.intermission.fadeToGame(this.player);

		this.grid.startLevel(level);

		const cx = level.player.x - 1;
		const cy = level.player.y - 1;
		this.player.setCell(cx, cy);
		this.grid.clean(cx, cy);

		let pos = this.grid.getPosition(cx, cy);
		this.player.setPosition(pos.x, pos.y);
		this.player.setCellSize(1.1 * this.grid.cellHeight);
		this.player.angle = level.player.angle;

		this.deck.startLevel(level);

		this.rule.setRuleCard(level.rule);

		this.player.setPower(level.power);
		this.ui.setPower(this.player.power);

		this.dj.setMoodStartLevel(this.levelIndex);
		this.dj.setMoodPlanning();
		this.dj.setMoodPower(this.player.power, this.player.maxPower);
	}

	newRound() {
		if (this.state == State.GameOver) {
			return this.endLevel();
		}

		this.setState(State.Planning);

		this.player.drain();
		this.ui.setPower(this.player.power);

		this.dj.setMoodPlanning();
		this.dj.setMoodPower(this.player.power, this.player.maxPower);

		if (this.player.power <= 0) {
			this.setState(State.GameOver);

			this.addEvent(1000, () => {
				this.intermission.fadeToIntermission(this.player, Mode.RestartLevel);
			});
		}
	}

	startExecuting() {
		this.setState(State.Executing);
	}

	performAction(action: string) {
		let { dx, dy } = this.player.getFacing();

		if (this.state == State.GameOver) {
			console.warn("Unintended");
		}

		switch (action) {
			case "move_forward":
			case "move_forward_2":
			case "move_forward_3":
				let nextX = this.player.cell.x + dx;
				let nextY = this.player.cell.y + dy;
				if (this.grid.isAccessible(nextX, nextY)) {
					this.player.cell.x = nextX;
					this.player.cell.y = nextY;
					this.player.move(
						this.player.x + dx * this.grid.cellWidth,
						this.player.y + dy * this.grid.cellHeight,
						true
					);

					this.addEvent(500, () => {
						this.grid.clean(nextX, nextY);
					});
				} else {
					this.deck.failMove();
					this.player.bump(
						this.player.x + 0.25 * dx * this.grid.cellWidth,
						this.player.y + 0.25 * dy * this.grid.cellHeight,
						this.rule.getRule()
					);
					this.rule.flash();
				}
				break;

			case "move_backward":
				dx *= -1;
				dy *= -1;
				let prevX = this.player.cell.x + dx;
				let prevY = this.player.cell.y + dy;
				if (this.grid.isAccessible(prevX, prevY)) {
					this.player.cell.x = prevX;
					this.player.cell.y = prevY;
					this.player.move(
						this.player.x + dx * this.grid.cellWidth,
						this.player.y + dy * this.grid.cellHeight,
						false
					);

					this.addEvent(500, () => {
						this.grid.clean(prevX, prevY);
					});
				} else {
					this.deck.failMove();
					this.player.bump(
						this.player.x + 0.25 * dx * this.grid.cellWidth,
						this.player.y + 0.25 * dy * this.grid.cellHeight,
						this.rule.getRule()
					);
					this.rule.flash();
				}
				break;

			case "turn_left":
				this.player.rotate(-90);
				break;

			case "turn_right":
				this.player.rotate(90);
				break;

			case "turn_around":
				this.player.rotate(180);
				break;
		}

		this.dj.setMoodMovement();
	}

	onLevelComplete() {
		this.setState(State.GameOver);
		this.deck.haltExecution();

		this.addEvent(500, () => {
			this.player.dance();
			this.addEvent(1000, this.endLevel, this);
		});
	}

	endLevel() {
		this.intermission.fadeToIntermission(
			this.player,
			this.levelIndex < levels.length - 1 ? Mode.StartNextLevel : Mode.TheEnd
		);
	}
}
