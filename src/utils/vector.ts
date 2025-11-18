import { Vector2D } from '../types/simulation';

export class Vec2 {
  static create(x: number, y: number): Vector2D {
    return { x, y };
  }

  static add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  static subtract(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  static multiply(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x * scalar, y: v.y * scalar };
  }

  static divide(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x / scalar, y: v.y / scalar };
  }

  static magnitude(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static normalize(v: Vector2D): Vector2D {
    const mag = Vec2.magnitude(v);
    if (mag === 0) return { x: 0, y: 0 };
    return Vec2.divide(v, mag);
  }

  static distance(a: Vector2D, b: Vector2D): number {
    return Vec2.magnitude(Vec2.subtract(b, a));
  }

  static dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  static cross(a: Vector2D, b: Vector2D): number {
    return a.x * b.y - a.y * b.x;
  }

  static limit(v: Vector2D, max: number): Vector2D {
    const mag = Vec2.magnitude(v);
    if (mag > max) {
      return Vec2.multiply(Vec2.normalize(v), max);
    }
    return v;
  }

  static rotate(v: Vector2D, angle: number): Vector2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos
    };
  }

  static angle(v: Vector2D): number {
    return Math.atan2(v.y, v.x);
  }

  static angleBetween(a: Vector2D, b: Vector2D): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  static lerp(a: Vector2D, b: Vector2D, t: number): Vector2D {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t
    };
  }

  static clone(v: Vector2D): Vector2D {
    return { x: v.x, y: v.y };
  }

  static zero(): Vector2D {
    return { x: 0, y: 0 };
  }

  static random(min: number = 0, max: number = 1): Vector2D {
    return {
      x: min + Math.random() * (max - min),
      y: min + Math.random() * (max - min)
    };
  }

  static randomUnit(): Vector2D {
    const angle = Math.random() * Math.PI * 2;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  static perpendicular(v: Vector2D): Vector2D {
    return { x: -v.y, y: v.x };
  }

  static project(a: Vector2D, b: Vector2D): Vector2D {
    const dot = Vec2.dot(a, b);
    const magSq = Vec2.dot(b, b);
    if (magSq === 0) return Vec2.zero();
    return Vec2.multiply(b, dot / magSq);
  }
}
