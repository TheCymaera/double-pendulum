import { Vector2 } from "open-utilities/geometry";

const sin = (x: number)=>Math.sin(x);
const cos = (x: number)=>Math.cos(x);
const sq = (x: number)=>x*x;

export class DoublePendulum {
	// gravity
	gravity = 1;
	
	// mass
	mass1 = 1;
	mass2 = 1;
	
	// length
	length1 = 90;
	length2 = 90;

	// angle
	angle1 = 0;
	angle2 = 0;

	// angular velocity
	velocity1 = 0;
	velocity2 = 0;

	step() {
		const g = this.gravity;
		const m1 = this.mass1, m2 = this.mass2;
		const a1 = this.angle1 + Math.PI / 2, a2 = this.angle2 + Math.PI / 2;
		const l1 = this.length1, l2 = this.length2;
		const v1 = this.velocity1, v2 = this.velocity2;

		// calculate acceleration
		const acc1 = (
			(-g * (2 * m1 + m2) * sin(a1)) + 
			(-m2 * g * sin(a1 - 2 * a2)) + 
			(-2 * sin(a1 - a2) * m2) *
			(sq(v2) * l2 + v1 * v1 * l1 * cos(a1 - a2))
		) / (l1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2)));

		const acc2 = (2 * sin(a1 - a2)) * (
			(sq(v1) * l1 * (m1 + m2)) + 
			(g * (m1 + m2) * cos(a1)) + 
			(sq(v2) * l2 * m2 * cos(a1 - a2))
		) / (l2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2)));

		// velocity += acceleration
		this.velocity1 += acc1;
		this.velocity2 += acc2;

		// angle += velocity
		this.angle1 += this.velocity1;
		this.angle2 += this.velocity2;
	}


	line1(): Vector2 {
		return new Vector2(this.length1, 0).rotate(this.angle1);
	}

	line2(): Vector2 {
		return new Vector2(this.length2, 0).rotate(this.angle2);
	}

	point1(): Vector2 {
		return this.line1();
	}

	point2(): Vector2 {
		return this.line1().add(this.line2());
	}
}
