import { GameScene } from "@/scenes/GameScene";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private battery: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		const panelHeight = 200;

		this.panel = this.scene.add.container(0, 0);
		this.add(this.panel);

		this.background = this.scene.add.image(1700, 330, "battery");
		this.add(this.background);

		this.battery = this.scene.add.image(1700, 330, "battery_power");
		this.add(this.battery);
	}

	setPower(power: number) {
		let slots: { [key: number]: number } = {
			10: 0,
			9: 100,
			8: 140,
			7: 180,
			6: 223,
			5: 267,
			4: 309,
			3: 352,
			2: 394,
			1: 435,
		};
		let cropY = slots[power] ?? 512;
		this.battery.setCrop(0, cropY, 256, 512);
	}

	setBatteryBlink(barTime: number, power: number) {
		let factor = 1 - 0.5 * (barTime % 2);
		let fade = (1 - power / 10) * factor;
		this.battery.setAlpha(1 - fade);
	}
}
