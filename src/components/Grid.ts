import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Color } from "@/assets/colors";
import { Level } from "./levels";
import { Decoration } from "./decorations";

export class Grid extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public rows: number;
	public columns: number;
	public cellWidth: number;
	public cellHeight: number;
	public available: boolean[][];
	private cells: Phaser.GameObjects.Rectangle[][];

	// Sprites
	private outside: Phaser.GameObjects.TileSprite;
	private floor: Phaser.GameObjects.TileSprite;
	private walls: Phaser.GameObjects.NineSlice;
	private grid: Phaser.GameObjects.Grid;

	constructor(scene: GameScene, x: number, y: number, height: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.columns = 1;
		this.rows = 1;
		this.height = height;
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

		this.available = [];
		for (let y = 0; y < this.columns; y++) {
			this.available[y] = [];
			for (let x = 0; x < this.rows; x++) {
				this.available[y].push(true);
			}
		}

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

		this.cells = [];
		for (let y = 0; y < this.columns; y++) {
			this.cells[y] = [];
			for (let x = 0; x < this.rows; x++) {
				let pos = this.getPosition(x, y);
				let rect = this.scene.add.rectangle(
					pos.x - this.x,
					pos.y - this.y,
					this.cellWidth,
					this.cellHeight,
					Color.Amber800,
					0.25
				);
				this.cells[y].push(rect);
				this.add(rect);
			}
		}

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

		// let foreground = this.scene.add.image(0, 0, "room");
		// let foreground = this.scene.add.image(this.x, this.y, "room");
		// foreground.setDepth(10);
		// this.add(foreground);
	}

	update(time: number, delta: number) {}

	startLevel(level: Level) {
		this.columns = level.grid.length;
		this.rows = level.grid[0].length;
		this.width = this.height * (this.rows / this.columns) * (4 / 3);
		this.cellWidth = this.width / this.rows;
		this.cellHeight = this.height / this.columns;

		this.grid.width = this.width;
		this.grid.height = this.height;
		this.grid.cellWidth = this.cellWidth;
		this.grid.cellHeight = this.cellHeight;

		this.available = [];
		for (let y = 0; y < this.columns; y++) {
			this.available[y] = [];
			for (let x = 0; x < this.rows; x++) {
				this.available[y].push(true);
			}
		}

		this.outside.width = (this.scene.W / this.cellWidth) * 256;
		this.outside.height = (this.scene.H / this.cellHeight) * 192;
		this.outside.setScale(this.cellWidth / 256);

		this.floor.width = this.rows * 256;
		this.floor.height = this.columns * 192;
		this.floor.setScale(this.cellWidth / 256);

		this.cells.forEach((row) => row.forEach((cell) => cell.destroy()));
		this.cells = [];
		for (let y = 0; y < this.columns; y++) {
			this.cells[y] = [];
			for (let x = 0; x < this.rows; x++) {
				let pos = this.getPosition(x, y);
				let rect = this.scene.add.rectangle(
					pos.x - this.x,
					pos.y - this.y,
					this.cellWidth,
					this.cellHeight,
					Color.Amber800,
					0.25
				);
				this.cells[y].push(rect);
				this.add(rect);

				if (level.grid[y][x] == 1) {
					this.block(x, y);
				}
			}
		}

		this.walls.y = -this.cellHeight / 2;
		this.walls.width = (this.rows + 2) * 256;
		this.walls.height = (this.columns + 3) * 192;
		this.walls.setScale(this.cellWidth / 256);

		level.decoration.forEach((decor) => {
			this.addDecoration(decor.x - 1, decor.y - 1, decor.item);
		});
	}

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
		this.cells[cy][cx].fillColor = Color.Red500;
		this.cells[cy][cx].fillAlpha = 1;
	}

	addDecoration(cx: number, cy: number, decor: Decoration) {
		for (let dx = 0; dx < decor.width; dx++)
			for (let dy = 0; dy < decor.height; dy++)
				if (this.isInside(cx + dx, cy - dy)) {
					let cell = this.cells[cy - dy][cx + dx];
					console.assert(
						cell.fillAlpha == 1,
						`Decoration placed on free tile (${cx},${cy})`
					);
					cell.fillAlpha = 0;
				}

		const pos = this.getPosition(cx, cy);
		let item = this.scene.add.image(pos.x, pos.y, decor.key);
		item.setDepth(pos.y);
		item.setScale(this.cellWidth / 256);

		let ox = 1 / (2 * decor.width);
		let oy = 1 - 1 / (2 * (decor.height + 1));
		item.setOrigin(ox, oy);
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
