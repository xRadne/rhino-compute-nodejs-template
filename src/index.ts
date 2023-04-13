import Rhino3dm, { ArcCurve } from 'rhino3dm';
// @ts-ignore Could not find a declaration file for module 'compute-rhino3d'.
import RhinoCompute from 'compute-rhino3d';

console.log('Hello Rhino3dm!');
RhinoCompute.url = 'http://localhost:8081/';


class Point3d extends Array<number> {
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }
  get x() { return this[0]; }
  get y() { return this[1]; }
  get z() { return this[2]; }

  set x(value: number) { this[0] = value; }
  set y(value: number) { this[1] = value; }
  set z(value: number) { this[2] = value; }

  static fromArray(array: number[]) {
    return new Point3d(array[0], array[1], array[2]);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  static fromObject(obj: any) {
    return new Point3d(obj.X, obj.Y, obj.Z);
  }

  toObject() {
    return { X: this.x, Y: this.y, Z: this.z };
  }

  static fromJSON(json: string) {
    return Point3d.fromObject(JSON.parse(json));
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }
}

class Vector3d extends Array<number> {
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }
  get x() { return this[0]; }
  get y() { return this[1]; }
  get z() { return this[2]; }

  set x(value: number) { this[0] = value; }
  set y(value: number) { this[1] = value; }
  set z(value: number) { this[2] = value; }

  static fromArray(array: number[]) {
    return new Vector3d(array[0], array[1], array[2]);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  static fromObject(obj: any) {
    return new Vector3d(obj.X, obj.Y, obj.Z);
  }

  toObject() {
    return { X: this.x, Y: this.y, Z: this.z };
  }

  static fromJSON(json: string) {
    return Vector3d.fromObject(JSON.parse(json));
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  static fromPoint3d(point: Point3d) {
    return new Vector3d(point.x, point.y, point.z);
  }

  toPoint3d() {
    return new Point3d(this.x, this.y, this.z);
  }

  cross(other: Vector3d) {
    return new Vector3d(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }
}

async function main() {
  const rhino = await Rhino3dm();

  // Create a world xy plane
  // const plane = {
  //   "Origin": { "X": 0.0, "Y": 0.0, "Z": 0.0 },
  //   "XAxis": { "X": 1.0, "Y": 0.0, "Z": 0.0 },
  //   "YAxis": { "X": 0.0, "Y": 1.0, "Z": 0.0 },
  //   "ZAxis": { "X": 0.0, "Y": 0.0, "Z": 1.0 },
  //   "Normal": { "X": 0.0, "Y": 0.0, "Z": 1.0 }
  // }

  const origin = new Point3d(0, 0, 0)
  const xAxis = new Vector3d(1, 0, 0)
  const yAxis = new Vector3d(0, 1, 0)
  const zAxis = xAxis.cross(yAxis)

  const planeObject = { Origin: origin.toObject(), XAxis: xAxis.toObject(), YAxis: yAxis.toObject(), ZAxis: zAxis.toObject(), Normal: zAxis.toObject() }
  console.log(planeObject)

  // Create a sphere at the origin and convert to brep
  const brep = new rhino.Sphere([0, 0, 0], 5).toBrep()

  // Call compute to intersect the sphere with the xy plane
  let result: any
  try {
    result = await RhinoCompute.Intersection.brepPlane(brep, planeObject, 0.001)
  } catch (err) {
    console.error(err)
  }
  const [success, intersection] = result

  if (!success) {
    console.error('Failed to intersect')
    return
  }

  // @ts-ignore
  const decoded = rhino.CommonObject.decode(intersection[0]) as ArcCurve

  console.log(decoded)
  console.log(decoded.radius)
}

main();