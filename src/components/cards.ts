export interface CardData {
	type: string;
	image: string;
	text: string;
}

export const Cards: { [key: string]: CardData } = {
	MoveForward: {
		type: "move",
		image: "move_forward",
		text: "Move one space forward",
	},
	TurnLeft: {
		type: "turn",
		image: "turn_left",
		text: "Turn 90° counter clockwise",
	},
	TurnRight: {
		type: "turn",
		image: "turn_right",
		text: "Turn 90° clockwise",
	},
	MoveForward2: {
		type: "move",
		image: "move_forward_2",
		text: "Move 2 spaces forward",
	},
	MoveForward3: {
		type: "move",
		image: "move_forward_3",
		text: "Move 3 spaces forward",
	},
	MoveBackward: {
		type: "move",
		image: "move_backward",
		text: "Move one space backward",
	},
	TurnAround: {
		type: "turn",
		image: "turn_around",
		text: "Turn around 180°",
	},
};
