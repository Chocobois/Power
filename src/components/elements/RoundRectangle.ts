import { BaseScene } from "@/scenes/BaseScene";

export interface RoundRectangleProps {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	radius?: number;
	color?: number;
	alpha?: number;
	bottomRight?: boolean;
	bottomLeft?: boolean;
	topLeft?: boolean;
	topRight?: boolean;
}

export class RoundRectangle extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private context: Phaser.GameObjects.Graphics;
	private polygon: Phaser.GameObjects.Polygon;
	private radius: number;
	private color: number;
	private origin: Phaser.Math.Vector2;
	private corners: boolean[];

	constructor(
		scene: BaseScene,
		{
			x = 0,
			y = 0,
			width = 100,
			height = 100,
			radius = 16,
			color = 0xffffff,
			alpha = 1.0,
			bottomRight = true,
			bottomLeft = true,
			topLeft = true,
			topRight = true,
		}: RoundRectangleProps
	) {
		super(scene, x, y);
		scene.add.existing(this);

		this.scene = scene;
		this.radius = radius;
		this.width = Math.max(width, 2 * radius);
		this.height = Math.max(height, 2 * radius);
		this.color = color;
		this.corners = [bottomRight, bottomLeft, topLeft, topRight];
		this.origin = new Phaser.Math.Vector2(0.5, 0.5);
		this.setAlpha(alpha);

		this.context = this.scene.add.graphics({ x: 0, y: 0 });
		this.add(this.context);

		this.updatePolygon();
	}

	setWidth(value: number) {
		this.width = Math.max(value, 2 * this.radius);
		this.updatePolygon();
	}

	setHeight(value: number) {
		this.height = Math.max(value, 2 * this.radius);
		this.updatePolygon();
	}

	setRadius(value: number) {
		this.radius = value;
		this.updatePolygon();
	}

	setColor(value: number) {
		this.color = value;
		this.updatePolygon();
	}

	setOrigin(x: number, y?: number) {
		if (y === undefined) {
			y = x;
		}
		this.origin.x = x; // NOT WORKING ATM
		this.origin.y = y;
		this.updatePolygon();
	}

	updatePolygon() {
		let points: any = [],
			t = 16;
		for (let j = 0; j < 4; j++) {
			let sx = Math.sign(Math.cos((j * Math.PI) / 2 + 0.1));
			let sy = Math.sign(Math.sin((j * Math.PI) / 2 + 0.1));
			if (this.corners[j]) {
				for (let i = 0; i < t; i++) {
					let px = Math.cos((j * Math.PI) / 2 + ((i / (t - 1)) * Math.PI) / 2);
					let py = Math.sin((j * Math.PI) / 2 + ((i / (t - 1)) * Math.PI) / 2);
					points.push({
						x:
							(0.5 - this.origin.x) * this.width +
							sx * (this.width / 2 - this.radius) +
							this.radius * px,
						y:
							(0.5 - this.origin.y) * this.height +
							sy * (this.height / 2 - this.radius) +
							this.radius * py,
					});
				}
			} else {
				points.push({
					x: (0.5 - this.origin.x) * this.width + (sx * this.width) / 2,
					y: (0.5 - this.origin.y) * this.height + (sy * this.height) / 2,
				});
			}
		}

		this.context.clear();
		this.context.fillStyle(this.color, 1.0);
		this.context.fillPoints(points, true, true);
	}
}
