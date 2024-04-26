import { BaseScene } from "@/scenes/BaseScene";
import { RoundRectangle } from "./RoundRectangle";
import { interpolateColor } from "@/utils/functions";

export class Slider extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private _value: number;
	private _prevValue: number;
	private background: RoundRectangle;
	private button: Phaser.GameObjects.Ellipse;
	private maxV: number;
	private maxX: number;
	private minV: number;
	private minX: number;
	private targetX: number;
	private steps: number;
	private thinHeight: number;

	private _hold: boolean;
	public holdSmooth: number;
	private tween: Phaser.Tweens.Tween;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		width: number,
		height: number,
		thinHeight: number,
		steps: number = 0
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.width = width;
		this.height = height;
		this.thinHeight = thinHeight;
		this.steps = steps;

		// Slider background
		this.background = new RoundRectangle(this.scene, {
			x: 0,
			y: 0,
			width: width + thinHeight,
			height: thinHeight,
			radius: thinHeight / 2,
			color: 0xeeffdd,
		});
		this.background.setAlpha(0.5);
		this.add(this.background);

		const padding = thinHeight + height / 2;
		this.background
			.setInteractive({
				hitArea: this.background,
				useHandCursor: true,
				draggable: true,
			})
			.on("pointerdown", this.onDown, this)
			.on("pointerup", this.onUp, this)
			.on("pointerout", this.onUp, this)
			.on("drag", this.onDrag, this);
		this.background.input!.hitArea.setTo(
			-padding,
			-padding,
			this.background.width + 2 * padding,
			this.background.height + 2 * padding
		);
		// this.scene.input!.enableDebug(this.background);

		// Step notches
		if (steps > 1) {
			for (let i = 0; i < steps; i++) {
				let x = -width / 2 + (i / (steps - 1)) * width;
				let y = 0;
				let size = 0.75 * thinHeight;

				let notch = scene.add.ellipse(x, y, 0.4 * size, 0.4 * size, 0xffffff);
				notch.setAlpha(0.6);
				this.background.add(notch);
			}
		}

		// Slider button
		this.button = scene.add.ellipse(0, 0, height, height, 0xffffff);
		this.targetX = this.button.x;
		this.add(this.button);

		this.minX = -width / 2;
		this.maxX = width / 2;
		this.minV = 0;
		this.maxV = 1;
		this._value = 0.5;
		this._prevValue = 0.5;

		this._hold = false;
		this.holdSmooth = 0;
	}

	setRange(min: number, max: number) {
		this.minV = min;
		this.maxV = max;
		this.value = this._value; // Will clamp
	}

	set value(value: number) {
		value = Phaser.Math.Clamp(value, this.minV, this.maxV);
		if (this.steps > 0) {
			value = Math.round(value * (this.steps - 1)) / (this.steps - 1);
		}

		this._value = value;
		this._prevValue = value;
		this.emit("onChange", this._value);

		let fac = (value - this.minV) / (this.maxV - this.minV);
		let x = this.minX + fac * (this.maxX - this.minX);
		this.button.x = this.targetX = x;
	}

	public get value(): number {
		return this._value;
	}

	onDown(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		let x = localX - this.background.width / 2;
		this.background.input!.dragStartX = x;
		this.onDrag(pointer, x, 0);
		this.hold = true;
	}

	onUp() {
		this.hold = false;
	}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		// Clamp x-coord
		dragX = Phaser.Math.Clamp(dragX, this.minX, this.maxX);

		// If slider is segmented, find value, round it to step, and convert back to position
		if (this.steps > 0) {
			let value = (dragX - this.minX) / (this.maxX - this.minX);
			value = Math.round(value * (this.steps - 1)) / (this.steps - 1);
			dragX = this.minX + value * (this.maxX - this.minX);
		}

		this.targetX = dragX;

		// Update value based on button's x-coord
		let baseValue = (dragX - this.minX) / (this.maxX - this.minX);
		let scaledValue = this.minV + baseValue * (this.maxV - this.minV);
		this._value = scaledValue;

		if (this._prevValue != this._value) {
			this.emit("onChange", this._value);
		}
		this._prevValue = this._value;
	}

	lock() {
		this.button.removeInteractive();
		this.button.fillColor = 0x555555;
		this.background.setColor(0x555555);
	}

	update(time: number, delta: number) {
		// Approach target position gradually
		this.button.x +=
			(this.targetX - this.button.x) * (1 - Math.pow(0.5, 60 * delta));
		this.button.setScale(1.0 - 0.15 * this.holdSmooth);
		this.button.fillColor = interpolateColor(
			0xffffff,
			0xcccccc,
			this.holdSmooth
		);
		this.background.setAlpha(0.25 + 0.1 * this.holdSmooth);
		this.background.setScale(1, 1 - 0.1 * this.holdSmooth);
	}

	smoothSet(value: number) {
		let prev = this.button.x;
		this.value = value;
		this.button.x = prev;
	}

	public get hold(): boolean {
		return this._hold;
	}

	set hold(value: boolean) {
		if (value != this._hold) {
			if (this.tween) {
				this.tween.stop();
			}
			if (value) {
				this.tween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 0.0, to: 1.0 },
					ease: "Cubic.Out",
					duration: 100,
				});
			} else {
				this.tween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 1.0, to: 0.0 },
					ease: (v: number) => {
						return Phaser.Math.Easing.Elastic.Out(v, 1.5, 0.5);
					},
					duration: 500,
				});
			}
		}

		this._hold = value;
	}
}
