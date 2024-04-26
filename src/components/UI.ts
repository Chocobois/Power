import { GameScene } from "@/scenes/GameScene";
import { Color } from "@/utils/colors";
import { RoundRectangle } from "./elements/RoundRectangle";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private gap: number;
	private box: Phaser.GameObjects.Container;
	private battery: Phaser.GameObjects.NineSlice;
	private bars: RoundRectangle[];

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		this.gap = 10;

		this.box = scene.add.container(1700, 330);
		this.box.width = 134 - this.gap;
		this.box.height = 150 + 256 - this.gap;
		this.add(this.box);

		this.battery = scene.add.nineslice(
			0,
			0,
			"battery",
			0,
			256,
			512,
			128,
			128,
			128,
			128
		);
		this.box.add(this.battery);

		this.bars = [];
		for (let i = 0; i < 10; i++) {
			let bar = new RoundRectangle(scene, {
				width: this.box.width - this.gap,
				radius: 8,
			});
			bar.setVisible(false);

			this.bars.push(bar);
			this.box.add(bar);
		}
	}

	setMaxPower(power: number) {
		this.bars.forEach((bar) => bar.setVisible(false));

		let barHeight = this.box.height / power;

		for (let i = 0; i < power; i++) {
			let bar = this.bars[i];
			let color =
				i / power < 0.3
					? Color.Red600
					: i / power <= 0.6
					? Color.Amber500
					: Color.Green600;

			bar.setVisible(true);
			bar.setAlpha(1.0);
			bar.setHeight(barHeight - this.gap);
			bar.setColor(color);
			bar.y = this.box.height / 2 - barHeight / 2 - barHeight * i;
		}
	}

	setPower(power: number) {
		this.bars.forEach((bar, index) => {
			if (index + 1 > power) {
				bar.setColor(Color.Black);
				bar.setAlpha(0.2);
			}
		});
	}

	setBatteryBlink(barTime: number, power: number) {
		let factor = 1 - 0.5 * (barTime % 2);
		let fade = (1 - power / this.bars.length / 2) * factor;

		if (power > 0) {
			this.bars[power - 1].setAlpha(1 - fade);
		}
	}
}
