import { CardData, Cards, Rules } from "./cards";
import { Decoration, Decorations } from "./decorations";

export interface Level {
	cards: number;
	deck: CardData[];
	rule: CardData;
	decoration: { x: number; y: number; item: Decoration }[];
	grid: number[][];
	player: { x: number; y: number; angle: number };
	power: number;
}

export const level1: Level = {
	cards: 4,
	grid: [
		[1, 0, 0],
		[0, 0, 0],
		[0, 0, 1],
	],
	decoration: [
		{ x: 1, y: 1, item: Decorations.Plant },
		{ x: 3, y: 3, item: Decorations.Box },
	],
	deck: [
		Cards.MoveForward,
		Cards.MoveForward,
		Cards.TurnLeft,
		Cards.TurnLeft,
		Cards.TurnRight,
		Cards.TurnRight,
		Cards.MoveForward2,
		Cards.MoveBackward,
		Cards.TurnAround,
	],
	rule: Rules.TurnLeft,
	player: {
		x: 1,
		y: 2,
		angle: 0,
	},
	power: 5,
};

export const level2: Level = {
	cards: 4,
	grid: [
		[1, 0, 0, 1, 1],
		[0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0],
		[0, 0, 0, 1, 1],
	],
	decoration: [
		{ x: 1, y: 1, item: Decorations.Box },
		{ x: 2, y: 3, item: Decorations.Plant },
		{ x: 4, y: 1, item: Decorations.Sink },
		{ x: 4, y: 4, item: Decorations.Sink },
	],
	deck: [
		Cards.MoveForward,
		Cards.MoveForward,
		Cards.TurnLeft,
		Cards.TurnLeft,
		Cards.TurnRight,
		Cards.TurnRight,
		Cards.MoveForward2,
		Cards.MoveForward3,
		Cards.MoveBackward,
		Cards.TurnAround,
	],
	rule: Rules.TurnAround,
	player: {
		x: 5,
		y: 2,
		angle: 180,
	},
	power: 9,
};

export const level3: Level = {
	cards: 5,
	grid: [
		[0, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 1],
		[1, 0, 0, 0, 1, 1],
	],
	decoration: [
		{ x: 2, y: 1, item: Decorations.Sink },
		{ x: 3, y: 3, item: Decorations.Box },
		{ x: 1, y: 4, item: Decorations.Plant },
		{ x: 5, y: 4, item: Decorations.Box },
		{ x: 6, y: 3, item: Decorations.Box },
		{ x: 6, y: 4, item: Decorations.Plant },
	],
	rule: Rules.TurnRight,
	deck: [
		Cards.MoveForward,
		Cards.MoveForward,
		Cards.TurnLeft,
		Cards.TurnLeft,
		Cards.TurnRight,
		Cards.TurnRight,
		Cards.MoveForward2,
		Cards.MoveForward3,
		Cards.MoveBackward,
		Cards.TurnAround,
	],
	player: {
		x: 4,
		y: 1,
		angle: 90,
	},
	power: 9,
};

export const levels = [level1, level2, level3];
