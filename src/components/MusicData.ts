const overlap = 2;

const Data = {
	m_main_menu: {
		offset: 0.424,
		bpm: 60,
	},
	m_first: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_draw: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_end: {
		offset: 0,
		bpm: 0,
		loop: false,
	},
	m_shop: {
		offset: 41860 / 48000,
		bpm: 86,
		loop: true,
		start: 41860 / 48000 + overlap,
		end: 2854884 / 48000 + overlap,
	},
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
