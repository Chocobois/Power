import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";

const WIDTH = 6;
const HEIGHT = 4;
const SIZE = 150;

export class Grid extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// Sprites
	public available: boolean[][];
	public grid: Phaser.GameObjects.Grid;
	public dirt: Phaser.GameObjects.Rectangle[][];

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.grid = this.scene.add.grid(
			0,
			0,
			WIDTH * SIZE,
			HEIGHT * SIZE,
			SIZE,
			SIZE,
			0x0000ff,
			0.25,
			0x000077,
			0.5
		);
		this.add(this.grid);

		this.available = [];
		for (let y = 0; y < HEIGHT; y++) {
			this.available[y] = [];
			for (let x = 0; x < WIDTH; x++) {
				this.available[y].push(true);
			}
		}

		this.dirt = [];
		for (let y = 0; y < HEIGHT; y++) {
			this.dirt[y] = [];
			for (let x = 0; x < WIDTH; x++) {
				let pos = this.getPosition(x, y);
				let rect = this.scene.add.rectangle(
					pos.x - this.x,
					pos.y - this.y,
					SIZE,
					SIZE,
					0x773300,
					0.5
				);
				this.dirt[y].push(rect);
				this.add(rect);
			}
		}

		let background = this.scene.add.image(0, 0, "room");
		this.add(background);

		this.block(1, 0);
		this.block(2, 0);
		this.block(1, 2);
		this.block(5, 0);
		this.block(5, 2);
		this.block(4, 3);
		this.block(5, 3);
	}

	update(time: number, delta: number) {}

	getPosition(x: number, y: number) {
		let corner = this.grid.getTopLeft();
		return new Phaser.Math.Vector2(
			this.x + corner.x + (x + 0.5) * this.grid.cellWidth,
			this.y + corner.y + (y + 0.5) * this.grid.cellHeight
		);
	}

	block(cx: number, cy: number) {
		this.available[cy][cx] = false;
		this.clean(cx, cy);
	}

	clean(cx: number, cy: number) {
		this.dirt[cy][cx].destroy();
	}

	isInside(cx: number, cy: number) {
		return cx >= 0 && cx < WIDTH && cy >= 0 && cy < HEIGHT;
	}

	isAvailable(cx: number, cy: number) {
		return this.isInside(cx, cy) && this.available[cy][cx];
	}
}
