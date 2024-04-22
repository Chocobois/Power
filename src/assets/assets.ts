import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Backgrounds
	image("backgrounds/background", "background"),

	// Characters
	image("characters/player", "player"),

	// Items
	image("items/coin", "coin"),

	// UI
	image("ui/hud", "hud"),

	// Titlescreen
	image("titlescreen/sky", "title_sky"),
	image("titlescreen/background", "title_background"),
	image("titlescreen/foreground", "title_foreground"),
	image("titlescreen/character", "title_character"),

	// Robot
	image("new/walls2", "walls"),
	image("new/outside", "outside"),
	image("new/floor", "floor"),
	image("new/box", "box"),
	image("new/plant", "plant"),

	image("room2", "room"),
	image("wheels", "wheels"),
	image("wheels_2", "wheels_2"),
	image("robot", "robot"),
	image("robot_eyes_forward", "robot_eyes_forward"),
	image("robot_eyes_left", "robot_eyes_left"),
	image("robot_eyes_right", "robot_eyes_right"),
	image("robot_eyes_down", "robot_eyes_down"),
	image("robot_eyes_up", "robot_eyes_up"),
	image("robot_eyes_closed", "robot_eyes_closed"),
	image("robot_eyes_shock", "robot_eyes_shock"),
	image("robot_eyes_error", "robot_eyes_error"),
	image("robot_eyes_low", "robot_eyes_low"),
	image("card", "card"),
	image("rule", "rule"),
	image("rule_turn_left", "rule_turn_left"),
	image("battery", "battery"),
	image("battery_power", "battery_power"),

	image("move_forward", "move_forward"),
	image("move_forward_2", "move_forward_2"),
	image("move_forward_3", "move_forward_3"),
	image("move_backward", "move_backward"),
	image("turn_left", "turn_left"),
	image("turn_right", "turn_right"),
	image("turn_around", "turn_around"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [];

/* Audios */
const audios: Audio[] = [
	music("bass_melody", "track_bass_melody"),
	music("battery", "track_battery"),
	music("chip", "track_chip"),
	music("chords", "track_chords"),
	music("drums", "track_drums"),
	music("riff", "track_riff"),

	music("title", "m_main_menu"),
	music("first", "m_first"),
	sound("tree/rustle", "t_rustle", 0.5),
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
