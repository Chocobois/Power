import { BaseScene } from "@/scenes/BaseScene";

export class ScrollArea extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private area: Phaser.GameObjects.Rectangle;
	private maskGraphics: Phaser.GameObjects.Graphics;
	// private maskArea: Phaser.Display.Masks.BitmapMask;
	private maskArea: Phaser.Display.Masks.GeometryMask;

	private content: Phaser.GameObjects.Container;
	private contentHeight: number;

	private hold: boolean;
	private fadePadding: number;
	private targetY: number;
	private speedY: number;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		width: number,
		height: number,
		fadePadding: number
	) {
		super(scene, x, y);
		this.scene = scene;
		this.width = width;
		this.height = height;
		this.fadePadding = fadePadding;
		scene.add.existing(this);

		this.hold = false;
		this.targetY = 0;
		this.speedY = 0;
		this.contentHeight = height;

		/* Hitarea */

		this.area = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.001);
		this.area.setOrigin(0);
		this.add(this.area);

		let grabY = 0;
		this.area.setInteractive({ useHandCursor: true, draggable: true });
		this.area.on(
			"dragstart",
			(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
				this.hold = true;
				grabY = -this.area.y + this.content.y;
			}
		);
		this.area.on(
			"drag",
			(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
				let newTargetY = dragY + grabY;
				this.speedY = newTargetY - this.targetY;
				this.targetY = newTargetY;
			}
		);
		this.area.on(
			"dragend",
			(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
				this.hold = false;
			}
		);

		/* Content container */

		this.content = this.scene.add.container(0, 0);
		this.content.width = this.area.width;
		this.content.height = this.area.height;
		this.add(this.content);

		/* Mask gradient */

		this.maskGraphics = this.scene.make.graphics({}, false);
		// this.content.add(graphics);
		// this.maskGraphics.setAlpha(0.5);

		this.maskGraphics.fillStyle(0xffffff);
		this.maskGraphics.fillRect(0, 0, width, height);
		// this.maskGraphics.fillRect(0, 0+fadePadding, width, height-2*fadePadding);
		// this.maskGraphics.fillGradientStyle(0x000000, 0x000000, 0xFFFFFF, 0xFFFFFF, 0, 0, 1, 1);
		// this.maskGraphics.fillRect(0, 0, width, fadePadding);
		// this.maskGraphics.fillRect(0, 0+height, width, -fadePadding);

		// this.maskArea = new Phaser.Display.Masks.BitmapMask(this.scene, this.maskGraphics);
		this.maskArea = new Phaser.Display.Masks.GeometryMask(
			this.scene,
			this.maskGraphics
		);
		this.content.setMask(this.maskArea);
	}

	reset() {
		this.targetY = 0;
		this.content.y = 0;
		this.speedY = 0;
	}

	update(time: number, delta: number) {
		this.maskGraphics.x = this.getBoundsTransformMatrix().tx;
		this.maskGraphics.y = this.getBoundsTransformMatrix().ty;

		// Apply speed
		if (!this.hold) {
			this.targetY += this.speedY;
			this.speedY *= 0.9;
		}

		// Clamp at edges
		if (this.targetY > 0 * this.fadePadding) {
			this.targetY = 0 * this.fadePadding;
		}
		if (
			this.targetY <
			-this.contentHeight + this.height + 0 * this.fadePadding
		) {
			this.targetY = -this.contentHeight + this.height + 0 * this.fadePadding;
		}

		// Smooth approach
		this.content.y +=
			(this.targetY - this.content.y) *
			(1 - Math.pow(0.5, (60 * delta) / 1000));
	}

	apply(gameObject: any) {
		this.content.add(gameObject);

		// Set mask
		// gameObject.setMask(this.maskArea);

		this.contentHeight = Math.max(
			this.contentHeight,
			gameObject.y + gameObject.height
		);
	}

	updateSize() {
		// Calculate new height
		this.contentHeight = this.height;

		for (let go of this.content.list) {
			let gameObject: any = go;
			if (gameObject.visible) {
				this.contentHeight = Math.max(
					this.contentHeight,
					gameObject.y + gameObject.displayHeight
				);
			}
		}

		this.reset();
	}

	getScroll() {
		if (this.height == this.contentHeight) return { y: 0, ratio: 1 };

		return {
			y: this.content.y / (this.height - this.contentHeight),
			ratio: this.height / this.contentHeight,
		};
	}
}
