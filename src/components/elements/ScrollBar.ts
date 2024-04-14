import { BaseScene } from "@/scenes/BaseScene";
import { RoundRectangle } from "./RoundRectangle";

export class ScrollBar extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private bg: RoundRectangle;
	private fg: RoundRectangle;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		super(scene, x, y);
		this.scene = scene;
		this.width = width;
		this.height = height;
		scene.add.existing(this);

		this.bg = new RoundRectangle(scene, {
			x: 0,
			y: 0,
			width: this.width,
			height: this.height,
			radius: Math.min(this.width / 2, this.height / 2),
			color: 0x777777,
			alpha: 0.5,
		});
		this.add(this.bg);

		this.fg = new RoundRectangle(scene, {
			x: 0,
			y: 0,
			width: this.width,
			height: this.height,
			radius: Math.min(this.width / 2, this.height / 2),
			color: 0xffffff,
			alpha: 0.5,
		});
		this.add(this.fg);
	}

	set(scroll: any) {
		let h = this.height * scroll.ratio;
		this.fg.setHeight(h);
		let th = this.height - h;
		this.fg.y = -th / 2 + th * scroll.y;

		this.setVisible(scroll.ratio < 1);
	}
}
