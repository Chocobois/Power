import { CardData, Cards, Rules } from "./cards";
import { Decoration, Decorations } from "./decorations";

export interface Level {
	cards: number;
	deck: CardData[];
	minMove: number;
	minTurn: number;
	rule: CardData;
	decoration: { x: number; y: number; item: Decoration }[];
	grid: number[][];
	player: { x: number; y: number; angle: number };
	power: number;
}

export const level1: Level = {
	cards: 4,
	grid: [
		[1, 0, 1],
		[2, 0, 0],
		[1, 0, 2],
	],
	decoration: [
		{ x: 3, y: 1, item: Decorations.Plant },
		{ x: 1, y: 3, item: Decorations.Plant },
	],
	deck: [
		Cards.MoveForward,
		Cards.MoveForward,
		Cards.TurnLeft,
		Cards.TurnLeft,
		Cards.TurnRight,
		Cards.TurnRight,
		Cards.MoveForward2,
	],
	minMove: 2,
	minTurn: 1,
	rule: Rules.TurnLeft,
	player: {
		x: 2,
		y: 1,
		angle: 90,
	},
	power: 5,
};

export const level2: Level = {
	cards: 5,
	grid: [
		[1, 2, 1, 1],
		[0, 0, 0, 2],
		[1, 2, 2, 1],
	],
	decoration: [
		{ x: 1, y: 3, item: Decorations.Plant },
		{ x: 3, y: 1, item: Decorations.Desk },
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
	],
	minMove: 2,
	minTurn: 2,
	rule: Rules.TurnAround,
	player: {
		x: 1,
		y: 2,
		angle: 0,
	},
	power: 6,
};

export const level3: Level = {
	cards: 5,
	grid: [
		[2, 2, 0, 1, 1],
		[2, 1, 0, 0, 0],
		[0, 0, 0, 2, 0],
		[1, 2, 2, 1, 1],
	],
	decoration: [
		{ x: 2, y: 2, item: Decorations.Plant },
		{ x: 4, y: 1, item: Decorations.Bookshelf },
		{ x: 4, y: 4, item: Decorations.Desk },
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
	minMove: 3,
	minTurn: 2,
	rule: Rules.TurnLeft,
	player: {
		x: 5,
		y: 2,
		angle: 180,
	},
	power: 7,
};

export const level4: Level = {
	cards: 5,
	grid: [
		[2, 1, 1, 0, 0, 2],
		[0, 0, 2, 0, 0, 0],
		[2, 0, 1, 0, 2, 1],
		[1, 0, 2, 0, 1, 1],
	],
	decoration: [
		{ x: 2, y: 1, item: Decorations.Bookshelf },
		{ x: 1, y: 4, item: Decorations.Plant },
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
	minMove: 2,
	minTurn: 2,
	player: {
		x: 4,
		y: 1,
		angle: 90,
	},
	power: 8,
};

export const level5: Level = {
	cards: 5,
	grid: [
		[1, 0, 2, 2, 1, 1],
		[2, 0, 1, 0, 0, 1],
		[2, 1, 1, 0, 0, 1],
		[0, 0, 2, 2, 0, 0],
		[2, 0, 1, 1, 0, 2],
	],
	decoration: [
		{ x: 3, y: 2, item: Decorations.Plant },
		{ x: 6, y: 3, item: Decorations.Plant },
		{ x: 5, y: 1, item: Decorations.Bookshelf },
		{ x: 2, y: 3, item: Decorations.Desk },
		{ x: 3, y: 5, item: Decorations.Desk },
	],
	rule: Rules.TurnLeft,
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
	minMove: 3,
	minTurn: 2,
	player: {
		x: 5,
		y: 2,
		angle: 180,
	},
	power: 8,
};

export const levels = [level1, level2, level3, level4, level5];
