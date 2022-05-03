import { Timer } from "open-utilities/async";
import { Duration } from "open-utilities/core";
import { Circle, Rect, Vec2, Path } from "open-utilities/geometry";
import { Canvas2DRenderer } from "open-utilities/rendering-web";
import { DoublePendulum } from "./DoublePendulum.js";
import * as appearance from "./appearance.js";
import "./ui.js";
import "./ui.scss";

const canvas = document.querySelector("canvas")!;
const renderer = Canvas2DRenderer.fromCanvas(canvas);

new ResizeObserver(()=>{
	const canvasLength = 500;
	const ratio = canvas.clientHeight / canvas.clientWidth;
	const viewportRect = canvas.clientHeight < canvas.clientWidth ?
		Rect.fromCenter(Vec2.zero, canvasLength / ratio, canvasLength) : 
		Rect.fromCenter(Vec2.zero, canvasLength, canvasLength * ratio);
	
	renderer.setViewportRect(viewportRect);

	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	draw();
}).observe(canvas);


let heldBulb: 1|2|undefined = undefined;
const origin = Vec2.zero;
const dp = new DoublePendulum;
dp.angle1 = -Math.PI/2;

function draw() {
	const point1 = dp.point1().add(origin);
	const point2 = dp.point2().add(origin);

	const drawBulb = (point: Vec2, held: boolean)=>{
		if (!held) {
			renderer.drawCircle(new Circle(point, appearance.bulbRadius), appearance.bulbStyle);
		} else {
			renderer.drawCircle(new Circle(point, appearance.bulbRadius), appearance.bulbHeldStyle);
			renderer.drawCircle(new Circle(point, appearance.bulbOutlineRadius), appearance.bulbHeldOutlineStyle);
		}
	}

	renderer.clear();
	renderer.drawPath(new Path().setOrigin(origin).lineTo(point1).lineTo(point2), appearance.pathStyle);
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


let mouseCoordinate = Vec2.zero;
const updateMouseCoordinate = (event: MouseEvent)=>{
	const mouseClientPosition = new Vec2(event.clientX, event.clientY);
	mouseCoordinate = Rect.mapPointOnto(renderer.clientRect(), mouseClientPosition, renderer.viewportRect());
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