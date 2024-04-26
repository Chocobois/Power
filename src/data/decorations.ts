import { CardData, Cards } from "./cards";

export interface Decoration {
	key: string;
	width: number;
	height: number;
}

export const Decorations = {
	Box: {
		key: "deco_box",
		width: 1,
		height: 1,
	},
	Plant: {
		key: "deco_plant",
		width: 1,
		height: 1,
	},
	Desk: {
		key: "deco_desk",
		width: 2,
		height: 1,
	},
	Bookshelf: {
		key: "deco_bookshelf",
		width: 2,
		height: 1,
	},
};
