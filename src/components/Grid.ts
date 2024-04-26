import { GameScene } from "@/scenes/GameScene";
import { Level } from "../data/levels";
import { Decoration, Decorations } from "../data/decorations";
import { Collectible } from "./Collectible";

interface Cell {
	accessible: boolean;
	decorated: boolean;
	collectible?: Collectible;
}

export class Grid extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public rows: number;
	public columns: number;
	public cellWidth: number;
	public cellHeight: number;

	private grid: Phaser.GameObjects.Grid;
	private cellData: Cell[][];
	private decorations: Phaser.GameObjects.Image[];

	// Sprites
	private outside: Phaser.GameObjects.TileSprite;
	private floor: Phaser.GameObjects.TileSprite;
	private walls: Phaser.GameObjects.NineSlice;

	constructor(scene: GameScene) {
		super(scene, scene.CX, 400);
		scene.add.existing(this);
		this.scene = scene;

		/* Grid */

		this.columns = 1;
		this.rows = 1;
		this.height = 480;
		this.width = this.height * (this.rows / this.columns) * (4 / 3);
		this.cellWidth = this.width / this.rows;
		this.cellHeight = this.height / this.columns;

		this.grid = this.scene.add.grid(
			0,
			0,
			this.width,
			this.height,
			this.cellWidth,
			this.cellHeight,
			0xffffff,
			1.0,
			0x000000,
			1.0
		);
		this.add(this.grid);
		this.grid.setVisible(false);

		this.cellData = [];
		for (let y = 0; y < this.columns; y++) {
			this.cellData[y] = [];
			for (let x = 0; x < this.rows; x++) {
				this.cellData[y][x] = {
					accessible: true,
					decorated: false,
				};
			}
		}

		/* Tile sprites */

		this.outside = this.scene.add.tileSprite(
			scene.CX - this.x,
			scene.CY - this.y,
			(scene.W / this.cellWidth) * 256,
			(scene.H / this.cellHeight) * 192,
			"outside"
		);
		this.outside.setScale(this.cellWidth / 256);
		this.add(this.outside);

		this.floor = this.scene.add.tileSprite(
			0,
			0,
			this.rows * 256,
			this.columns * 192,
			"floor"
		);
		this.floor.setScale(this.cellWidth / 256);
		this.add(this.floor);

		this.walls = scene.add.nineslice(
			0,
			-this.cellHeight / 2,
			"walls",
			0,
			(this.rows + 2) * 256,
			(this.columns + 3) * 192,
			2 * 256,
			2 * 256,
			3 * 192,
			2 * 192
		);
		this.walls.setScale(this.cellWidth / 256);
		this.add(this.walls);

		/* Objects */

		this.decorations = [];
	}

	update(time: number, delta: number) {
		this.cellData.forEach((row) =>
			row.forEach((cell) => {
				if (cell.collectible) {
					cell.collectible.update(time, delta);
				}
			})
		);
	}

	startLevel(level: Level) {
		this.columns = level.grid.length;
		this.rows = level.grid[0].length;
		this.height = Math.min(120 * this.columns, 480);
		this.width = this.height * (this.rows / this.columns) * (4 / 3);
		this.cellWidth = this.width / this.rows;
		this.cellHeight = this.height / this.columns;

		this.grid.width = this.width;
		this.grid.height = this.height;
		this.grid.cellWidth = this.cellWidth;
		this.grid.cellHeight = this.cellHeight;

		this.cellData.forEach((row) =>
			row.forEach((cell) => {
				if (cell.collectible) cell.collectible.removeFromGame(false);
			})
		);
		this.cellData = [];
		for (let y = 0; y < this.columns; y++) {
			this.cellData[y] = [];
			for (let x = 0; x < this.rows; x++) {
				this.cellData[y][x] = {
					accessible: true,
					decorated: false,
				};

				if (level.grid[y][x] == 1) {
					this.cellData[y][x].accessible = false;
					this.clean(x, y);
				}

				if (level.grid[y][x] == 2) {
					this.addCollectible(x, y);
				}
			}
		}

		let pos = this.getPosition(0, 0);
		this.outside.x = pos.x - this.x;
		this.outside.y = pos.y - this.y;
		this.outside.width = 256 * 29;
		this.outside.height = 192 * 29;
		this.outside.setScale(this.cellWidth / 256);

		this.floor.width = this.rows * 256;
		this.floor.height = this.columns * 192;
		this.floor.setScale(this.cellWidth / 256);

		this.walls.y = -this.cellHeight / 2;
		this.walls.width = (this.rows + 2) * 256;
		this.walls.height = (this.columns + 3) * 192;
		this.walls.setScale(this.cellWidth / 256);

		// Decorations
		this.decorations.forEach((decor) => decor.destroy());
		this.decorations = [];
		level.decoration.forEach((decor) => {
			this.addDecoration(decor.x - 1, decor.y - 1, decor.item);
		});

		// Check for blocked tiles that are not decorated
		this.cellData.forEach((row, cy) =>
			row.forEach((cell, cx) => {
				if (cell.accessible == cell.decorated) {
					this.addDecoration(cx, cy, Decorations.Box);
				}
			})
		);
	}

	getPosition(x: number, y: number) {
		let corner = this.grid.getTopLeft();
		return new Phaser.Math.Vector2(
			this.x + corner.x + (x + 0.5) * this.grid.cellWidth,
			this.y + corner.y + (y + 0.5) * this.grid.cellHeight
		);
	}

	addDecoration(cx: number, cy: number, decor: Decoration) {
		const pos = this.getPosition(cx, cy);
		let item = this.scene.add.image(pos.x, pos.y, decor.key);
		item.setDepth(pos.y);
		item.setScale(this.cellWidth / 256);

		let ox = 1 / (2 * decor.width);
		let oy = 1 - 1 / (2 * (decor.height + 1));
		item.setOrigin(ox, oy);

		this.decorations.push(item);

		for (let dx = 0; dx < decor.width; dx++)
			for (let dy = 0; dy < decor.height; dy++)
				this.cellData[cy + dy][cx + dx].decorated = true;
	}

	addCollectible(cx: number, cy: number) {
		let pos = this.getPosition(cx, cy);
		let item = new Collectible(
			this.scene,
			pos.x,
			pos.y,
			0.75 * this.cellHeight
		);
		this.cellData[cy][cx].collectible = item;
	}

	clean(cx: number, cy: number) {
		let item = this.cellData[cy][cx].collectible;
		if (item) {
			item.removeFromGame(true);
			this.cellData[cy][cx].collectible = undefined;

			let complete = this.cellData.every((row) =>
				row.every((cell) => !cell.collectible)
			);
			if (complete) {
				this.emit("complete");
			}
		}
	}

	isInside(cx: number, cy: number) {
		return cx >= 0 && cx < this.rows && cy >= 0 && cy < this.columns;
	}

	isAccessible(cx: number, cy: number) {
		return this.isInside(cx, cy) && this.cellData[cy][cx].accessible;
	}
}
