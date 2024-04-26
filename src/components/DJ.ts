import { GameScene, State } from "@/scenes/GameScene";
import { Music } from "../utils/Music";

export class DJ extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private volume: number;

	private drums: Music;
	private bass: Music;
	private battery: Music;
	private chip: Music;
	private chords: Music;
	private riff: Music;
	private melody: Music;

	private allTracks: Music[];

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		this.volume = 0.0;

		this.drums = new Music(scene, "track_drums", { volume: 0 });
		this.bass = new Music(scene, "track_bass", { volume: 0 });
		this.battery = new Music(scene, "track_battery", { volume: 0 });
		this.chip = new Music(scene, "track_chip", { volume: 0 });
		this.chords = new Music(scene, "track_chords", { volume: 0 });
		this.riff = new Music(scene, "track_riff", { volume: 0 });
		this.melody = new Music(scene, "track_melody", { volume: 0 });

		this.allTracks = [
			this.drums,
			this.bass,
			this.battery,
			this.chip,
			this.chords,
			this.riff,
			this.melody,
		];
		this.allTracks.forEach((track) => track.play());

		this.drums.setVolume(this.volume);
		this.drums.active = true;

		// Sync loops
		this.drums.on("loop", this.sync, this);
		// this.scene.addEvent(1000, this.sync, this);
	}

	update(time: number, delta: number) {
		this.allTracks.forEach((track) => track.update());
	}

	setMoodState(state: State) {
		if (state == State.Intermission) {
			this.toggle(this.drums, true);
			this.toggle(this.bass, false);
			this.toggle(this.battery, false);
			this.toggle(this.chip, false);
			this.toggle(this.chords, false);
			this.toggle(this.riff, false);
			this.toggle(this.melody, false);
		}
	}

	setMoodStartLevel(level: number) {
		this.toggle(this.chip, true);
		this.toggle(this.bass, level > 0);
		this.toggle(this.melody, level > 1);
		this.setMoodPlanning();
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
	}

	setMoodPower(power: number, maxPower: number) {
		if (power > 0) {
			let factor = 1 - (power - 1) / (maxPower - 1);
			this.battery.setVolume(factor * this.volume);
		} else {
			this.battery.setVolume(0);
		}
		this.toggle(this.drums, power > 0);
	}

	toggle(track: Music, active: boolean) {
		track.active = active;

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

	sync() {
		let seek = this.drums.seek;
		this.bass.setSeek(seek);
		this.battery.setSeek(seek);
		this.chip.setSeek(seek);
		this.chords.setSeek(seek);
		this.riff.setSeek(seek);
		this.melody.setSeek(seek);
	}

	setVolume(value: number) {
		this.volume = value;

		this.allTracks.forEach((track) => {
			if (track.active) {
				track.setVolume(this.volume);
			}
		});
	}

	get barTime(): number {
		return this.drums.barTime;
	}
}
