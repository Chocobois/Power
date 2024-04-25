const overlap = 2;

const Data = {
	track_bass: {
		offset: 0,
		bpm: 150,
		loop: true,
		start: 576 / 44100,
		end: 3951936 / 44100,
	},
	track_battery: {
		offset: 0,
		bpm: 150,
		loop: true,
		start: 576 / 44100,
		end: 3951936 / 44100,
	},
	track_chip: {
		offset: 0,
		bpm: 150,
		loop: true,
		start: 576 / 44100,
		end: 3951936 / 44100,
	},
	track_chords: {
		offset: 0,
		bpm: 150,
		loop: true,
		start: 576 / 44100,
		end: 3951936 / 44100,
	},
	track_drums: {
		offset: 0,
		bpm: 150,
		loop: true,
		start: 576 / 44100,
		end: 3951936 / 44100,
	},
	track_melody: {
		offset: 0,
		bpm: 150,
		loop: true,
		start: 576 / 44100,
		end: 3951936 / 44100,
	},
	track_riff: {
		offset: 0,
		bpm: 150,
		loop: true,
		start: 576 / 44100,
		end: 3951936 / 44100,
	},
};

export type MusicKey = keyof typeof Data;
export type MusicDataType = {
	[K in MusicKey]: {
		offset: number;
		bpm: number;
		loop: boolean;
		start: number;
		end: number;
	};
};

export default Data as MusicDataType;
