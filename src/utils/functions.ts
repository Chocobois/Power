// Check if variable is Object
export function isPlainObject(obj: any) {
	return Object.prototype.toString.call(obj) === "[object Object]";
}

// Add slight randomness to avoid zero values
export function jiggle() {
	return (Math.random() - 0.5) * 1e-2;
}

// General random-ish uuid
export function uuidv4() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// Return interpolated color between two color1 and color2 at value (0-1)
export function interpolateColor(
	color1: number,
	color2: number,
	value: number
): number {
	if (value <= 0) {
		return color1;
	}
	if (value >= 1) {
		return color2;
	}
	return Phaser.Display.Color.ObjectToColor(
		Phaser.Display.Color.Interpolate.ColorWithColor(
			Phaser.Display.Color.ValueToColor(color1),
			Phaser.Display.Color.ValueToColor(color2),
			255,
			value * 255
		)
	).color;
}

// Convert hsv values to color (hex)
export function HSVToRGB(h: number, s: number, v: number): number {
	let union = Phaser.Display.Color.HSVToRGB(h, s, v);
	return (<Phaser.Display.Color>union).color;
}

// Convert hsv values to color (hex)
export function colorToGrayscale(color: number): number {
	return (
		(((((color >> 16) & 0xff) * 76 +
			((color >> 8) & 0xff) * 150 +
			(color & 0xff) * 29) >>
			8) <<
			16) |
		(((((color >> 16) & 0xff) * 76 +
			((color >> 8) & 0xff) * 150 +
			(color & 0xff) * 29) >>
			8) <<
			8) |
		((((color >> 16) & 0xff) * 76 +
			((color >> 8) & 0xff) * 150 +
			(color & 0xff) * 29) >>
			8)
	);
}

// Convert hex number color to hex string color
export function colorToString(color: number): string {
	let c = Phaser.Display.Color.ValueToColor(color);
	return Phaser.Display.Color.RGBToString(c.red, c.green, c.blue);
}

// Convert hex string color to hex number color
export function colorToNumber(color: string): number {
	return Phaser.Display.Color.HexStringToColor(color).color;
}

// Returns a safe version of a string
export function safeString(text: string): string {
	return text.replace(/[^a-zA-Z0-9]/g, "");
}

// Check availibility of localStorage
export function isLocalStorageAvailable() {
	var test = "test";
	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch (e) {
		return false;
	}
}
// Get localStorage data
export function getLocalStorage(key: string, defaultValue: any): any {
	if (isLocalStorageAvailable()) {
		return JSON.parse(localStorage.getItem(key) || defaultValue);
	}
	return defaultValue;
}

// Set localStorage data
export function setLocalStorage(key: string, value: any): void {
	if (isLocalStorageAvailable()) {
		localStorage.setItem(key, JSON.stringify(value));
	}
}
