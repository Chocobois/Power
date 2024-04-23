import { CardData, Cards } from "./cards";
import { Decoration, Decorations } from "./decorations";

export interface Level {
	cards: number;
	deck: CardData[];
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
		{ x: 0, y: 0, item: Decorations.Box },
		{ x: 1, y: 0, item: Decorations.Plant },
		{ x: 2, y: 0, item: Decorations.Sink },
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
	player: {
		x: 1,
		y: 0,
		angle: 90,
	},
	power: 5,
};

export const level2: Level = {
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
		x: 3,
		y: 0,
		angle: 90,
	},
	power: 9,
};
