import { GameScene } from "@/scenes/GameScene";

const ACCELERATION = 150;
const MAX_SPEED = 400;
const FRICTION = 0.7;
const TAPPING_TIMER = 200; // ms
console.assert(
	ACCELERATION / (1 - FRICTION) >= MAX_SPEED,
	"Max speed unreachable"
);

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// Sprites
	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;
	private tween: Phaser.Tweens.Tween;

	// Controls
	private keyboard: any;
	public isTouched: boolean;
	public isTapped: boolean;
	private tappedTimer: number;
	private inputVec: Phaser.Math.Vector2; // Just used for keyboard -> vector
	private touchPos: Phaser.Math.Vector2;
	public velocity: Phaser.Math.Vector2;
	private border: { [key: string]: number };

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		this.spriteSize = 200;
		this.sprite = this.scene.add.sprite(0, 0, "player");
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.y += this.spriteSize / 2;
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);

		/* Controls */
		if (this.scene.input.keyboard) {
			this.keyboard = this.scene.input.keyboard.addKeys({
				up1: "W",
				down1: "S",
				left1: "A",
				right1: "D",
				up2: "Up",
				down2: "Down",
				left2: "Left",
				right2: "Right",
			});
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
				.on("down", this.doABarrelRoll, this);
		}
		this.isTouched = false;
		this.isTapped = false;
		this.tappedTimer = 0;
		this.inputVec = new Phaser.Math.Vector2(0, 0);
		this.touchPos = new Phaser.Math.Vector2(0, 0);
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.border = {
			left: 100,
			right: scene.W - 100,
			top: 100,
			bottom: scene.H - 100,
		};
	}

	update(time: number, delta: number) {
		// Movement
		this.handleInput();

		this.inputVec.limit(1);
		// this.inputVec.normalize();
		this.inputVec.scale(ACCELERATION);

		if (this.isTapped) {
			this.tappedTimer -= delta;
			if (this.tappedTimer <= 0) {
				this.isTapped = false;
			}
		} else {
			this.velocity.scale(FRICTION);
			this.velocity.add(this.inputVec);
			this.velocity.limit(MAX_SPEED);
		}

		this.x += (this.velocity.x * delta) / 1000;
		this.y += (this.velocity.y * delta) / 1000;

		// Border collision
		if (this.x < this.border.left) {
			this.x = this.border.left;
		}
		if (this.x > this.border.right) {
			this.x = this.border.right;
		}
		if (this.y < this.border.top) {
			this.y = this.border.top;
		}
		if (this.y > this.border.bottom) {
			this.y = this.border.bottom;
		}

		// Animation (Change to this.sprite.setScale if needed)
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	handleInput() {
		this.inputVec.reset();

		// Keyboard input to vector
		if (!this.isTouched) {
			if (this.keyboard) {
				this.inputVec.x =
					(this.keyboard.left1.isDown || this.keyboard.left2.isDown ? -1 : 0) +
					(this.keyboard.right1.isDown || this.keyboard.right2.isDown ? 1 : 0);
				this.inputVec.y =
					(this.keyboard.up1.isDown || this.keyboard.up2.isDown ? -1 : 0) +
					(this.keyboard.down1.isDown || this.keyboard.down2.isDown ? 1 : 0);
			}
		}
		// Touch to input vector
		else {
			this.inputVec.copy(this.touchPos);
			this.inputVec.x -= this.x;
			this.inputVec.y -= this.y; // If needed, add offset so finger doesn't block, see TW.
			// if (this.inputVec.length() < 8) {
			// this.inputVec.reset();
			// }
			this.inputVec.scale(1 / 50);
		}
	}

	touchStart(x: number, y: number) {
		this.isTouched = true;
		this.isTapped = false;
		this.touchPos.x = x;
		this.touchPos.y = y;

		if (this.touchInsideBody(x, y)) {
			this.isTapped = true;
			this.tappedTimer = TAPPING_TIMER;
		}
	}

	touchDrag(x: number, y: number) {
		this.touchPos.x = x;
		this.touchPos.y = y;

		if (this.isTapped && !this.touchInsideBody(x, y)) {
			this.isTapped = false;
		}
	}

	touchEnd(x: number, y: number) {
		if (this.isTapped && this.tappedTimer > 0) {
			this.emit("action");
		}

		this.isTouched = false;
		this.isTapped = false;
	}

	touchInsideBody(x: number, y: number) {
		return (
			Phaser.Math.Distance.Between(this.x, this.y, x, y) <
			this.spriteSize
		);
	}

	doABarrelRoll() {
		if (!this.tween || !this.tween.isActive()) {
			this.tween = this.scene.tweens.add({
				targets: this.sprite,
				scaleX: {
					from: this.sprite.scaleX,
					to: -this.sprite.scaleX,
					ease: "Cubic.InOut",
				},
				duration: 300,
				yoyo: true,
			});
		}
	}
}
