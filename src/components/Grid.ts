import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Color } from "@/assets/colors";

export class Grid extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public rows: number;
	public columns: number;
	public cellSize: number;

	// Sprites
	public available: boolean[][];
	public grid: Phaser.GameObjects.Grid;
	public cells: Phaser.GameObjects.Rectangle[][];

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		height: number,
		level: number[][]
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.columns = level.length;
		this.rows = level[0].length;
		this.height = height;
		this.width = height * (this.rows / this.columns);
		this.cellSize = height / this.columns;

		this.grid = this.scene.add.grid(
			0,
			0,
			this.width,
			this.height,
			this.cellSize,
			this.cellSize,
			0xffffff,
			1.0,
			0x000000,
			1.0
		);
		this.add(this.grid);

		this.available = [];
		for (let y = 0; y < this.columns; y++) {
			this.available[y] = [];
			for (let x = 0; x < this.rows; x++) {
				this.available[y].push(true);
			}
		}

		this.cells = [];
		for (let y = 0; y < this.columns; y++) {
			this.cells[y] = [];
			for (let x = 0; x < this.rows; x++) {
				let pos = this.getPosition(x, y);
				let rect = this.scene.add.rectangle(
					pos.x - this.x,
					pos.y - this.y,
					this.cellSize - 4,
					this.cellSize - 4,
					Color.Amber800,
					0.5
				);
				this.cells[y].push(rect);
				this.add(rect);

				if (level[y][x] == 1) {
					this.block(x, y);
				}
			}
		}

		let background = this.scene.add.image(0, 0, "room");
		// let background = this.scene.add.image(this.x, this.y, "room");
		// background.setDepth(10);
		this.add(background);

		// this.block(1, 0);
		// this.block(2, 0);
		// this.block(1, 2);
		// this.block(5, 0);
		// this.block(5, 2);
		// this.block(4, 3);
		// this.block(5, 3);
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
		this.cells[cy][cx].fillColor = Color.Red500;
		this.cells[cy][cx].fillAlpha = 1.0;
	}

	clean(cx: number, cy: number) {
		this.cells[cy][cx].fillColor = 0xffffff;
	}

	isInside(cx: number, cy: number) {
		return cx >= 0 && cx < this.rows && cy >= 0 && cy < this.columns;
	}

	isAvailable(cx: number, cy: number) {
		return this.isInside(cx, cy) && this.available[cy][cx];
	}
}
