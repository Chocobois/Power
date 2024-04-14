import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Grid } from "@/components/Grid";
import { Deck } from "@/components/Deck";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private grid: Grid;
	private player: Player;
	private deck: Deck;
	private ui: UI;

	private power: number;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0xffffff);

		this.power = 10;

		// this.background = this.add.image(0, 0, "background");
		// this.background.setOrigin(0);
		// this.fitToScreen(this.background);

		this.grid = new Grid(this, this.CX, 350);

		const startX = 3;
		const startY = 0;

		this.player = new Player(this, this.CX, this.CY);
		let cell = this.grid.getPosition(startX, startY);
		this.player.angle += 90;
		this.player.setPosition(cell.x, cell.y);
		this.player.setCell(startX, startY);
		this.grid.clean(startX, startY);

		this.deck = new Deck(this);
		this.deck.on("newRound", this.drainBattery, this);
		this.deck.on("action", this.performAction, this);

		this.ui = new UI(this);
		this.ui.setPower(this.power);
	}

	update(time: number, delta: number) {
		this.grid.update(time, delta);
		this.player.update(time, delta);
		this.deck.update(time, delta);
		this.ui.update(time, delta);
	}

	performAction(action: string) {
		let { dx, dy } = this.player.getFacing();
		console.log(action, this.player.cell.x, this.player.cell.y, dx, dy);

		switch (action) {
			case "move_forward":
			case "move_forward_2":
			case "move_forward_3":
				let nextX = this.player.cell.x + dx;
				let nextY = this.player.cell.y + dy;
				if (this.grid.isAvailable(nextX, nextY)) {
					this.player.cell.x = nextX;
					this.player.cell.y = nextY;
					this.player.move(
						this.player.x + dx * this.grid.grid.cellWidth,
						this.player.y + dy * this.grid.grid.cellHeight
					);

					this.addEvent(500, () => {
						this.grid.clean(nextX, nextY);
					});
				} else {
					this.player.bump(
						this.player.x + 0.25 * dx * this.grid.grid.cellWidth,
						this.player.y + 0.25 * dy * this.grid.grid.cellHeight
					);
				}
				break;

			case "move_backward":
				dx *= -1;
				dy *= -1;
				let prevX = this.player.cell.x + dx;
				let prevY = this.player.cell.y + dy;
				if (this.grid.isAvailable(prevX, prevY)) {
					this.player.cell.x = prevX;
					this.player.cell.y = prevY;
					this.player.move(
						this.player.x + dx * this.grid.grid.cellWidth,
						this.player.y + dy * this.grid.grid.cellHeight
					);

					this.addEvent(500, () => {
						this.grid.clean(prevX, prevY);
					});
				} else {
					this.player.bump(
						this.player.x + 0.25 * dx * this.grid.grid.cellWidth,
						this.player.y + 0.25 * dy * this.grid.grid.cellHeight
					);
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
	}

	drainBattery() {
		this.power--;
		this.ui.setPower(this.power);
	}
}
