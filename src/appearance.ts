import { Canvas2DRenderer } from "open-utilities/rendering-web";
import { PathStyle, ShapeStyle } from "open-utilities/ui";

await new Promise(resolve=>window.addEventListener("load", resolve));

const pendulumColor = Canvas2DRenderer.sampleCSSColor(getComputedStyle(document.body).color);
const pendulumHeldColor = Canvas2DRenderer.sampleCSSColor(getComputedStyle(document.body).getPropertyValue("--accent-color"));

export const bulbRadius = 10;
export const bulbOutlineRadius = 13;
export const bulbHoldRadius = 30;

export const pathStyle = new PathStyle({ 
	color: pendulumColor, 
	width: 3, 
	cap: PathStyle.Cap.Round 
});

export const bulbStyle = new ShapeStyle({ fillColor: pendulumColor });
export const bulbHeldStyle = new ShapeStyle({ fillColor: pendulumHeldColor });
export const bulbHeldOutlineStyle = new ShapeStyle({ 
	stroke: new PathStyle({ 
		color: pendulumHeldColor, 
		width: 3
	})
});