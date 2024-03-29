import { Timer } from "open-utilities/web/async/mod.js";
import { Duration } from "open-utilities/core/datetime/mod.js";
import { Circle, Rect, Vector2, Path, Matrix4 } from "open-utilities/core/maths/mod.js";
import { HTMLCanvas2D } from "open-utilities/web/ui/mod.js";
import { ShapeStyle } from "open-utilities/core/ui/mod.js";
import { DoublePendulum } from "./DoublePendulum.js";
import { Appearance } from "./appearance.js";
import { render } from "solid-js/web";

import infoHTML from "./info.html?raw";
import { App } from "./ui/App.jsx";

const canvas = document.createElement("canvas");
const appearance = new Appearance(canvas);
const renderer = HTMLCanvas2D.fromCanvas(canvas);
const viewport = Rect.zero.clone();

render(()=>App({
	layers: [canvas],
	info: infoHTML,
	githubLink: "https://github.com/TheCymaera/double-pendulum",
}), document.body);

new ResizeObserver(()=>{
	const minViewportLength = 400;

	const ratio = canvas.clientHeight / canvas.clientWidth;
	const width  = minViewportLength * (ratio > 1 ? 1 : 1 / ratio);
	const height = minViewportLength * (ratio > 1 ? ratio : 1);

	renderer.setBitmapDimensions(new Vector2(canvas.clientWidth * devicePixelRatio, canvas.clientHeight * devicePixelRatio));
	viewport.copy(Rect.fromCenter(Vector2.zero, width, height));
	renderer.setTransform(Matrix4.ortho(viewport));

	draw();
}).observe(canvas);

let heldBulb: 1|2|undefined = undefined;
const origin = Vector2.zero;
const dp = new DoublePendulum;
dp.angle1 = -Math.PI/2;


function draw() {
	const drawBulb = (point: Vector2, held: boolean)=>{
		if (!held) {
			renderer.drawCircle(new Circle(point, appearance.bulbRadius), appearance.bulbStyle());
		} else {
			renderer.drawCircle(new Circle(point, appearance.bulbRadius), appearance.bulbHeldStyle());
			renderer.drawCircle(new Circle(point, appearance.bulbOutlineRadius), appearance.bulbHeldOutlineStyle());
		}
	}

	const point1 = dp.point1().add(origin);
	const point2 = dp.point2().add(origin);

	renderer.clear();
	renderer.drawPath(new Path().setOrigin(origin).lineTo(point1).lineTo(point2), new ShapeStyle({
		stroke: appearance.pathStyle()
	}));
	drawBulb(point1, heldBulb === 1);
	drawBulb(point2, heldBulb === 2);
}

Timer.periodic(new Duration({ seconds: 1/30 }), ()=>{
	const point1 = dp.point1().add(origin);

	if (heldBulb) {
		dp.velocity1 = 0;
		dp.velocity2 = 0;

		if (heldBulb === 1) dp.angle1 = origin.angleTo(mouseCoordinate);
		if (heldBulb === 2) dp.angle2 = point1.angleTo(mouseCoordinate);
	} else {
		dp.step();
	}

	draw();
});


let mouseCoordinate = Vector2.zero.clone();
const updateMouseCoordinate = (event: MouseEvent)=>{
	const clientCoord = new Vector2(event.clientX, event.clientY);
	mouseCoordinate = clientCoord.transformMatrix4(renderer.getClientInverseTransform());
}

canvas.onpointermove = updateMouseCoordinate;

canvas.onpointerdown = (event)=>{
	updateMouseCoordinate(event);

	const point1 = dp.point1().add(origin);
	const point2 = dp.point2().add(origin);

	if (point1.distanceTo(mouseCoordinate) < appearance.bulbHoldRadius) {
		heldBulb = 1;
	} else if (point2.distanceTo(mouseCoordinate) < appearance.bulbHoldRadius) {
		heldBulb = 2;
	}
}

canvas.onpointerup = ()=>{
	heldBulb = undefined;
}


console.log(`For debugging, see "app"`)
Object.defineProperty(window, "app", {
	value: {  canvas, dp, origin },
});