import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";
import { RoundRectangle } from "./elements/RoundRectangle";
import { Color } from "@/utils/colors";

export class TextButton extends Button {
	public scene: BaseScene;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		width: number,
		height: number,
		text: string
	) {
		super(scene, x, y);
		this.scene = scene;
		this.width = width;
		this.height = height;

		let border = new RoundRectangle(this.scene, {
			width: width + 16,
			height: height + 16,
			radius: 16 + 8,
			color: Color.White,
		});
		this.add(border);

		let background = new RoundRectangle(this.scene, {
			width: width,
			height: height,
			radius: 16,
			color: Color.Blue700,
		});
		this.add(background);

		let buttonText = this.scene.addText({
			size: height / 2,
			color: "white",
			text,
		});
		buttonText.setOrigin(0.5);
		this.add(buttonText);

		this.bindInteractive(background);
	}
}
