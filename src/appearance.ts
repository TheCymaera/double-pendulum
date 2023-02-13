import { HTMLCanvas2D } from "open-utilities/web/ui/mod.js";
import { PathStyle, ShapeStyle } from "open-utilities/core/ui/mod.js";


export class Appearance {
	constructor(readonly element: HTMLElement) { }

	readonly #pendulumColor = ()=> HTMLCanvas2D.sampleCSSColor(getComputedStyle(this.element).color);
	readonly #pendulumHeldColor = ()=> HTMLCanvas2D.sampleCSSColor(getComputedStyle(this.element).accentColor);

	readonly bulbRadius = 10;
	readonly bulbOutlineRadius = 13;
	readonly bulbHoldRadius = 30;

	readonly pathStyle = ()=>new PathStyle({ 
		color: this.#pendulumColor(), 
		width: 3, 
		cap: PathStyle.Cap.Round 
	});

	readonly bulbStyle = ()=>new ShapeStyle({ fill: this.#pendulumColor() });
	readonly bulbHeldStyle = ()=>new ShapeStyle({ fill: this.#pendulumHeldColor() });
	readonly bulbHeldOutlineStyle = ()=>new ShapeStyle({ 
		stroke: new PathStyle({ 
			color: this.#pendulumHeldColor(), 
			width: 3
		})
	});
}