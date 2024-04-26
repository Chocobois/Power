import { Image, SpriteSheet, Audio, spritesheet } from "./assetUtils";
import { image, sound, music, loadFont } from "./assetUtils";

/* Images */
const images: Image[] = [
	// Titlescreen
	image("titlescreen/sky", "title_sky"),
	image("titlescreen/background", "title_background"),
	image("titlescreen/foreground", "title_foreground"),
	image("titlescreen/character", "title_character"),

	// Robot
	image("robot/eyes_shock", "robot_eyes_shock"),
	image("robot/eyes_up", "robot_eyes_up"),
	image("robot/eyes_right", "robot_eyes_right"),
	image("robot/eyes_closed", "robot_eyes_closed"),
	image("robot/eyes_forward", "robot_eyes_forward"),
	image("robot/eyes_left", "robot_eyes_left"),
	image("robot/eyes_error", "robot_eyes_error"),
	image("robot/eyes_low", "robot_eyes_low"),
	image("robot/eyes_down", "robot_eyes_down"),
	image("robot/eyes_happy", "robot_eyes_happy"),

	// Room
	image("room/outside", "outside"),
	image("room/floor", "floor"),
	image("room/walls", "walls"),
	image("room/decoration/sink", "deco_sink"),
	image("room/decoration/plant", "deco_plant"),
	image("room/decoration/box", "deco_box"),
	image("room/collectibles/shadow", "shadow"),

	// Cards
	image("cards/card_edges", "card_edges"),
	image("cards/card_surface", "card_surface"),
	image("cards/card_inner", "card_inner"),
	image("cards/move_forward", "move_forward"),
	image("cards/turn_around", "turn_around"),
	image("cards/turn_left", "turn_left"),
	image("cards/move_forward_2", "move_forward_2"),
	image("cards/turn_right", "turn_right"),
	image("cards/move_forward_3", "move_forward_3"),
	image("cards/move_backward", "move_backward"),
	image("cards/rule_turn_left", "rule_turn_left"),
	image("cards/rule_turn_right", "rule_turn_right"),
	image("cards/rule_turn_around", "rule_turn_around"),

	// UI
	image("ui/battery", "battery"),
	image("ui/gear", "gear"),

	// Backgrounds
	image("backgrounds/tile", "tile"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("ui/music", "music", 256, 256),
	spritesheet("ui/audio", "audio", 256, 256),
	spritesheet("room/collectibles/bolt", "bolt", 128, 128),
	spritesheet("robot/head", "robot_head", 128, 128),
	spritesheet("robot/wheels", "robot_wheels", 128, 128),
];

/* Audios */
const audios: Audio[] = [
	music("bass", "track_bass"),
	music("battery", "track_battery"),
	music("chip", "track_chip"),
	music("chords", "track_chords"),
	music("drums", "track_drums"),
	music("melody", "track_melody"),
	music("riff", "track_riff"),

	// sound("tree/rustle", "t_rustle", 0.5),
];

/* Fonts */
await loadFont("LexendDeca", "Game Font");

export { images, spritesheets, audios };
