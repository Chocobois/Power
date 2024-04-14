export interface Image {
	key: string;
	path: string;
}

export interface SpriteSheet {
	key: string;
	path: string;
	width: number;
	height: number;
}

export interface Audio {
	key: string;
	path: string;
	volume?: number;
	rate?: number;
}

const imageGlob = import.meta.glob<string>('./images/**/*.png', {query: '?url', import: 'default', eager: true});
export const image = (path: string, key: string): Image => {
	return { key, path: imageGlob[`./images/${path}.png`] };
}

export const spritesheet = (path: string, key: string, width: number, height: number): SpriteSheet => {
	return { key, width, height, path: imageGlob[`./images/${path}.png`] };
}

const musicGlob = import.meta.glob<string>('./music/**/*.mp3', {query: '?url', import: 'default', eager: true});
export const music = (path: string, key: string, volume?: number, rate?: number): Audio => {
	return { key, volume, rate, path: musicGlob[`./music/${path}.mp3`] };
}

const audioGlob = import.meta.glob<string>('./sounds/**/*.mp3', {query: '?url', import: 'default', eager: true});
export const sound = (path: string, key: string, volume?: number, rate?: number): Audio => {
	return { key, volume, rate, path: audioGlob[`./sounds/${path}.mp3`] };
}

const fontGlob = import.meta.glob<string>('./fonts/**/*.ttf', {query: '?url', import: 'default', eager: true});
export const loadFont = async (path: string, name: string) => {
	const face = new FontFace(name, `url(${fontGlob[`./fonts/${path}.ttf`]})`, {style: 'normal', weight: '400'});
	await face.load();
	document.fonts.add(face);
}

