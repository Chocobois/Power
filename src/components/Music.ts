import MusicData, { MusicKey } from "@/components/MusicData";

export class Music extends Phaser.Sound.WebAudioSound {
	public _prevBarTime: number;
	public bpm: number;
	public end: number;
	public myKey: MusicKey;
	public myLoop: boolean;
	public maxBar: number;
	public offset: number;
	public speed: number;
	public start: number;
	public loopSum: number;

	constructor(scene: any, myKey: MusicKey, config = {}) {
		super(scene.sound, myKey, config);
		scene.sound.sounds.push(this);
		this.myKey = myKey;

		if (!MusicData[myKey]) {
			throw "Music data missing for: " + myKey;
		}
		let custom = MusicData[myKey] || {};

		this.offset = custom.offset;
		this.bpm = custom.bpm;
		this.myLoop = custom.loop || false;

		if (this.myLoop) {
			this.start = custom.start;
			this.end = custom.end;
			this.setLoop(true);
		} else {
			this.start = this.offset;
			this.end = this.duration;
			this.setLoop(false);
		}

		this.speed = 60 / this.bpm;
		this.maxBar = Math.round((this.end - this.start) / this.speed);
		this.loopSum = 0;
	}

	update() {
		super.update();

		if (this.isPlaying) {
			if (this.myLoop) {
				if (this.currentTime > this.end) {
					this.setSeek(this.currentTime - (this.end - this.start));
					this.loopSum += this.end - this.start;
					this.emit("loop");
				}
			}

			let barTime = this.getBarTime();
			if (barTime >= 0) {
				if (Math.floor(barTime) != Math.floor(this._prevBarTime)) {
					this.emit("bar", Math.floor(barTime));
				}
			}
			this._prevBarTime = barTime;
		}
	}

	getBarTime() {
		let time = this.currentTime - this.offset;
		return time / this.speed;
	}

	getBar() {
		return Math.floor(this.getBarTime());
	}

	get currentTime() {
		return this.seek;
	}

	get totalTime() {
		return this.seek + this.loopSum;
	}

	get barTime() {
		return (this.totalTime - this.offset) / this.speed;
	}
}
