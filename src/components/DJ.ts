import { GameScene } from "@/scenes/GameScene";
import { RuleCard } from "./RuleCard";
import { Music } from "./Music";

export class DJ extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private volume: number;

	private drums: Music;
	private bass: Music;
	private battery: Music;
	private chip: Music;
	private chords: Music;
	private riff: Music;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		this.volume = 0.3;

		this.drums = new Music(scene, "track_drums", {});
		this.bass = new Music(scene, "track_bass_melody", {});
		this.battery = new Music(scene, "track_battery", {});
		this.chip = new Music(scene, "track_chip", {});
		this.chords = new Music(scene, "track_chords", {});
		this.riff = new Music(scene, "track_riff", {});

		this.drums.play();
		this.bass.play();
		this.battery.play();
		this.chip.play();
		this.chords.play();
		this.riff.play();

		this.drums.setVolume(this.volume);
		this.bass.setVolume(0);
		this.battery.setVolume(0);
		this.chip.setVolume(this.volume);
		this.chords.setVolume(0);
		this.riff.setVolume(0);

		// Sync loops
		this.drums.on("loop", () => {
			let seek = this.drums.seek;
			this.bass.setSeek(seek);
			this.battery.setSeek(seek);
			this.chip.setSeek(seek);
			this.chords.setSeek(seek);
			this.riff.setSeek(seek);
		});
	}

	update(time: number, delta: number) {
		this.drums.update();
		this.bass.update();
		this.battery.update();
		this.chip.update();
		this.chords.update();
		this.riff.update();
	}

	setMoodPlanning() {
		this.toggle(this.chords, false);
		this.toggle(this.chip, true);
		this.toggle(this.riff, true);
	}

	setMoodMovement() {
		this.toggle(this.chords, true);
		this.toggle(this.chip, true);
		this.toggle(this.riff, false);

		this.toggle(this.bass, true);
	}

	setMoodPower(power: number) {
		let factor = 1 - (power - 1) / 9;
		this.battery.setVolume(factor * this.volume);
	}

	toggle(track: Music, active: boolean) {
		this.scene.tweens.addCounter({
			from: track.volume,
			to: active ? this.volume : 0,
			duration: 500,
			ease: Phaser.Math.Easing.Sine.InOut,
			onUpdate: (tween, target, key, current: number) => {
				track.setVolume(current);
			},
		});
	}

	get barTime(): number {
		return this.drums.barTime;
	}
}
