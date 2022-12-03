import { HTMLCanvas2D } from "open-utilities/ui";
import { PathStyle, ShapeStyle } from "open-utilities/ui";

const canvas = document.querySelector("canvas")!;

const pendulumColor = ()=> HTMLCanvas2D.sampleCSSColor(getComputedStyle(canvas).color);
const pendulumHeldColor = ()=> HTMLCanvas2D.sampleCSSColor(getComputedStyle(canvas).accentColor);

export const bulbRadius = 10;
export const bulbOutlineRadius = 13;
export const bulbHoldRadius = 30;

export const pathStyle = ()=>new PathStyle({ 
	color: pendulumColor(), 
	width: 3, 
	cap: PathStyle.Cap.Round 
});

export const bulbStyle = ()=>new ShapeStyle({ fill: pendulumColor() });
export const bulbHeldStyle = ()=>new ShapeStyle({ fill: pendulumHeldColor() });
export const bulbHeldOutlineStyle = ()=>new ShapeStyle({ 
	stroke: new PathStyle({ 
		color: pendulumHeldColor(), 
		width: 3
	})
});