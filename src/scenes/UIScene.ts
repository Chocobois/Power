import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "@/components/elements/Button";
import { Slider } from "@/components/elements/Slider";
import { RoundRectangle } from "@/components/elements/RoundRectangle";
import { Color } from "@/utils/colors";

export class UIScene extends BaseScene {
	private box: Phaser.GameObjects.Container;

	private background: RoundRectangle;
	private audioSlider: Slider;
	private audioImage: Phaser.GameObjects.Image;

	private optionsOpen: boolean;
	private optionsTimer: number;

	private gearButton: Button;
	private gearRect: RoundRectangle;
	private gearImage: Phaser.GameObjects.Image;

	constructor() {
		super({ key: "UIScene" });

		this.optionsOpen = false;
		this.optionsTimer = 0;
	}

	create(): void {
		const margin = 30;
		const gap = 20;
		const iconSize = 60;
		const sliderWidth = 200;
		const sliderHeight = 40;

		let iconX = this.W - iconSize / 2 - margin;
		let sliderX = iconX - iconSize / 2 - sliderWidth / 2 - gap;
		let audioY = margin + iconSize / 2;

		let totalWidth = sliderWidth + gap + iconSize;
		let totalHeight = iconSize;

		/* Elements */

		this.background = new RoundRectangle(this, {
			x: this.W - margin - totalWidth / 2 - sliderHeight / 6,
			y: margin + totalHeight / 2,
			width: totalWidth + 50,
			height: totalHeight + 30,
			radius: 10,
			color: Color.Black,
			alpha: 0.85,
			topLeft: false,
			bottomLeft: false,
		});

		this.audioImage = this.add.image(iconX, audioY, "audio", 0);
		this.audioImage.setScale(iconSize / this.audioImage.width);

		this.audioSlider = new Slider(
			this,
			sliderX,
			audioY,
			sliderWidth,
			sliderHeight,
			sliderHeight / 3
		);

		let gearX = this.background.x - this.background.width / 2 - 45 - 20;
		this.gearButton = new Button(this, gearX, audioY);
		this.gearRect = new RoundRectangle(this, {
			x: 10,
			width: 90 + 20,
			height: 90,
			radius: 45,
			color: Color.Black,
			alpha: 0.85,
			topRight: false,
			bottomRight: false,
		});
		this.gearButton.add(this.gearRect);
		this.gearImage = this.add.image(0, 0, "gear");
		this.gearImage.setScale(iconSize / this.gearImage.width);
		this.gearButton.add(this.gearImage);
		this.gearButton.bindInteractive(this.gearImage);
		this.gearButton.on("click", this.toggleOptions, this);

		this.box = this.add.container();
		this.box.add(this.background);
		this.box.add(this.audioImage);
		this.box.add(this.audioSlider);
		this.box.add(this.gearButton);
		this.box.width = this.background.width + 20;
		this.box.height = this.background.height;
		this.box.x += this.box.width;

		/* Logic */

		this.audioSlider.on("onChange", this.onAudioChange, this);
	}

	update(time: number, delta: number) {
		this.gearButton.update(time, delta);
		this.audioSlider.update(time, delta);

		let targetX = this.optionsOpen ? 0 : this.box.width;
		this.box.x += 0.2 * (targetX - this.box.x);

		this.optionsTimer -= delta;
		if (this.optionsOpen && this.optionsTimer < 0) {
			this.optionsOpen = false;
		}
	}

	toggleOptions() {
		this.optionsOpen = !this.optionsOpen;
		if (this.optionsOpen) {
			this.optionsTimer = 3000;
		}
	}

	onAudioChange(value: number) {
		this.events.emit("volume", value);
		this.audioImage.setFrame(value > 0 ? 0 : 1);
		this.optionsTimer = 3000;
	}
}
