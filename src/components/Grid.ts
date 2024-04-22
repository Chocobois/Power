import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Color } from "@/assets/colors";

export class Grid extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public rows: number;
	public columns: number;
	public cellWidth: number;
	public cellHeight: number;

	// Sprites
	public available: boolean[][];
	public walls: Phaser.GameObjects.NineSlice;
	public grid: Phaser.GameObjects.Grid;
	public floor: Phaser.GameObjects.TileSprite;
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
		this.width = height * (this.rows / this.columns) * (4 / 3);
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

		let outside = this.scene.add.tileSprite(
			scene.CX - this.x,
			scene.CY - this.y,
			(scene.W / this.cellWidth) * 256,
			(scene.H / this.cellHeight) * 192,
			"outside"
		);
		outside.setScale(this.cellWidth / 256);
		this.add(outside);

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

				if (level[y][x] == 1) {
					this.block(x, y);
				}
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

		// let background = this.scene.add.image(0, 0, "room");
		// let background = this.scene.add.image(this.x, this.y, "room");
		// background.setDepth(10);
		// this.add(background);
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
		// this.cells[cy][cx].fillColor = Color.Red500;
		// this.cells[cy][cx].fillAlpha = 1.0;

        const pos = this.getPosition(cx, cy);
        const key = Phaser.Math.RND.pick(["box", "plant"]);
        let item = this.scene.add.image(pos.x, pos.y, key);
        item.setOrigin(0.5, 0.75);
        item.setScale(this.cellWidth / 256);
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
