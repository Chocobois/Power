export enum CardType {
	Move = "Move",
	Turn = "Turn",
	Rule = "Rule",
}

export interface CardData {
	type: CardType;
	image: string;
	text: string[];
}

export const Cards: { [key: string]: CardData } = {
	MoveForward: {
		type: CardType.Move,
		image: "move_forward",
		text: ["Move one", "space", "forward"],
	},
	TurnLeft: {
		type: CardType.Turn,
		image: "turn_left",
		text: ["Turn 90°", "counter", "clockwise"],
	},
	TurnRight: {
		type: CardType.Turn,
		image: "turn_right",
		text: ["Turn 90°", "clockwise"],
	},
	MoveForward2: {
		type: CardType.Move,
		image: "move_forward_2",
		text: ["Move 2", "spaces", "forward"],
	},
	MoveForward3: {
		type: CardType.Move,
		image: "move_forward_3",
		text: ["Move 3", "spaces", "forward"],
	},
	MoveBackward: {
		type: CardType.Move,
		image: "move_backward",
		text: ["Move one", "space", "backward"],
	},
	TurnAround: {
		type: CardType.Turn,
		image: "turn_around",
		text: ["Turn", "around", "180°"],
	},
};
