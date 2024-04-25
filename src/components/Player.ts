import { GameScene } from "@/scenes/GameScene";

enum Face {
	Forward = "robot_eyes_forward",
	Left = "robot_eyes_left",
	Right = "robot_eyes_right",
	Down = "robot_eyes_down",
	Up = "robot_eyes_up",
	Closed = "robot_eyes_closed",
	Shock = "robot_eyes_shock",
	Error = "robot_eyes_error",
	Low = "robot_eyes_low",
	Happy = "robot_eyes_happy",
}

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public maxPower: number;
	public power: number;
	public cell: Phaser.Math.Vector2;

	private size: number;
	private wheels: Phaser.GameObjects.Sprite;
	private head: Phaser.GameObjects.Container;
	private hull: Phaser.GameObjects.Sprite;
	private eyes: Phaser.GameObjects.Sprite;

	private wheelValue: number;
	private prevX: number;
	private prevY: number;
	private prevAngle: number;

	private isActive: boolean;
	private blinkTimer: Phaser.Time.TimerEvent;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		this.maxPower = 10;
		this.power = 10;
		this.cell = new Phaser.Math.Vector2();

		this.size = 256;
		this.isActive = false;

		this.wheels = this.scene.add.sprite(0, 0, "robot_wheels_1");
		this.wheels.setScale(this.size / this.wheels.width);
		// this.wheels.setAlpha(0.5);
		this.wheels.setTint(0xbbbbbb);
		this.wheels.setAngle(-90);
		this.add(this.wheels);

		this.head = this.scene.add.container();
		this.add(this.head);

		this.hull = this.scene.add.sprite(0, 0, "robot_head");
		this.hull.setScale(this.size / this.hull.width);
		this.hull.setAngle(-90);
		this.head.add(this.hull);

		this.eyes = this.scene.add.sprite(0, 0, "robot_eyes_forward");
		this.eyes.setScale(this.size / this.eyes.width);
		this.eyes.setAngle(-90);
		this.head.add(this.eyes);

		this.wheelValue = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.prevAngle = 0;

		this.blinkTimer = this.scene.time.addEvent({});
		this.blink(Face.Forward);
	}

	update(time: number, delta: number) {
		if (!this.alive) return;

		this.setDepth(this.y);

		let squish = Math.sin((4 * time) / 1000);
		// let f = this.size / this.head.width;
		// this.wheels.setScale(f - 0.01 * squish, f + 0.01 * squish);
		this.head.setScale(1 + 0.02 * squish, 1 - 0.02 * squish);

		if (this.isActive) {
			let dx = Math.abs(this.x - this.prevX);
			let dy = Math.abs(this.y - this.prevY);
			let da = Math.abs(this.angle - this.prevAngle);
			this.wheelValue += (dx + dy + da) / 15;
			this.wheels.setTexture(
				this.wheelValue % 2 < 1 ? "robot_wheels_1" : "robot_wheels_2"
			);

			this.prevX = this.x;
			this.prevY = this.y;
			this.prevAngle = this.angle;
		}
	}

	setCellSize(size: number) {
		this.size = size;
		this.wheels.setScale(this.size / this.wheels.width);
		this.hull.setScale(this.size / this.hull.width);
		this.eyes.setScale(this.size / this.eyes.width);

		this.blink(Face.Forward);
	}

	setCell(cx: number, cy: number) {
		this.cell.x = cx;
		this.cell.y = cy;
	}

	setPower(power: number) {
		this.maxPower = power;
		this.power = power;
		this.eyes.setVisible(power > 0);
	}

	move(x: number, y: number, forward: boolean) {
		this.isActive = true;

		this.scene.tweens.add({
			targets: this,
			x: { from: this.x, to: x },
			y: { from: this.y, to: y },
			duration: 1000,
			ease: Phaser.Math.Easing.Sine.InOut,
			onStart: () => {
				this.blink(forward ? Face.Down : Face.Up, 5000);
			},
		});

		this.scene.tweens.add({
			targets: [this.head],
			x: { from: 0, to: (forward ? -1 : 1) * 0.03 * this.size },
			duration: 500,
			yoyo: true,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
	}

	rotate(relAngle: number, doLook = true) {
		this.isActive = true;

		if (doLook) {
			this.blink(relAngle > 0 ? Face.Left : Face.Right, 5000);
		}

		this.scene.tweens.add({
			targets: this,
			angle: { from: this.angle, to: this.angle + relAngle },
			duration: 1000,
			ease: Phaser.Math.Easing.Sine.InOut,
		});

		this.scene.tweens.add({
			targets: [this.head],
			angle: { from: 0, to: Math.min(relAngle / 4, 90) },
			duration: 500,
			yoyo: true,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
	}

	bump(x: number, y: number, forward: boolean) {
		this.isActive = true;
		let relAngle = -90;

		this.scene.tweens.add({
			targets: this,
			x: { from: this.x, to: x },
			y: { from: this.y, to: y },
			duration: 500,
			yoyo: true,
			ease: Phaser.Math.Easing.Sine.InOut,
		});

		// this.blink(forward ? Face.Down : Face.Up, 5000);
		// this.blink(relAngle > 0 ? Face.Left : Face.Right, 5000);
		this.blink(Face.Shock, 5000);
		this.scene.addEvent(400, () => {
			this.blink(Face.Error, 5000);
		});

		this.scene.tweens.add({
			targets: this,
			angle: { from: this.angle, to: this.angle + relAngle },
			duration: 500,
			delay: 500,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
		this.scene.tweens.add({
			targets: [this.head],
			angle: { from: 0, to: relAngle / 4 },
			delay: 500,
			duration: 250,
			yoyo: true,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
	}

	blink(face?: Face, duration?: number) {
		if (this.eyes.texture.key == face && duration) {
			return;
		}

		if (!face) {
			face = Phaser.Math.RND.pick([Face.Left, Face.Right, Face.Down, Face.Up]);
		}

		if (!duration) {
			duration = Phaser.Math.RND.between(2000, 6000);
		}

		this.eyes.setTexture(Face.Closed);
		this.blinkTimer.remove();
		this.blinkTimer = this.scene.addEvent(
			100,
			() => {
				this.eyes.setTexture(face);
				this.blinkTimer = this.scene.addEvent(duration, this.blink, this);
			},
			this
		);
	}

	drain() {
		this.isActive = false;
		this.power--;

		if (this.power > 2) {
			this.blink(Face.Forward);
		} else {
			this.blink(Face.Low, 1500);
			this.scene.tweens.addCounter({
				duration: 800,
				delay: 100,
				from: 0,
				to: 6,
				onUpdate: (tween, target, key, current: number) => {
					this.eyes.setVisible(current % 2 < 1);
				},
				onComplete: () => {
					this.eyes.setVisible(this.power > 0);
				},
			});
		}
	}

	dance() {
		this.blink(Face.Happy);

		this.scene.addEvent(500, () => {
			this.rotate(360, false);
		});
		this.scene.addEvent(1500, () => {
			this.rotate(-270 - this.angle, false);
		});
	}

	getFacing() {
		return {
			dx: Math.round(Math.cos(this.angle * Phaser.Math.DEG_TO_RAD)),
			dy: Math.round(Math.sin(this.angle * Phaser.Math.DEG_TO_RAD)),
		};
	}

	get alive(): boolean {
		return this.power > 0;
	}
}
